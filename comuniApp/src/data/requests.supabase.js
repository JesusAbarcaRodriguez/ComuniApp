import { supabase } from '../lib/supabase';

async function myAdminGroupIds() {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) throw aerr || new Error('No auth user');

    const { data: owned, error: e1 } = await supabase.from('groups').select('id').eq('owner_id', user.id);
    if (e1) throw e1;

    const { data: admined, error: e2 } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .in('role', ['OWNER', 'ADMIN']);
    if (e2) throw e2;

    const ids = new Set();
    (owned || []).forEach(g => ids.add(g.id));
    (admined || []).forEach(gm => ids.add(gm.group_id));
    return Array.from(ids);
}

export async function listGroupJoinRequestsForAdmin() {
    const adminGroupIds = await myAdminGroupIds();
    if (adminGroupIds.length === 0) return [];

    // 1) Traer solicitudes (embebemos groups, eso sí existe por FK)
    const { data: reqs, error } = await supabase
        .from('group_join_requests')
        .select(`
        id, status, created_at, group_id, user_id,
        groups ( name )
      `)
        .in('group_id', adminGroupIds)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });

    if (error) throw error;

    if (!reqs?.length) return [];

    // 2) Traer nombres desde profiles por user_id
    const userIds = [...new Set(reqs.map(r => r.user_id))];
    const { data: profs, error: pErr } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);
    if (pErr) throw pErr;

    const pmap = new Map((profs || []).map(p => [p.id, p.display_name || '']));

    // 3) Unir
    return reqs.map(r => ({
        id: r.id,
        groupId: r.group_id,
        groupName: r.groups?.name || 'Grupo',
        requesterId: r.user_id,
        requesterName: pmap.get(r.user_id) || r.user_id?.slice(0, 8) || 'Usuario',
        time: new Date(r.created_at),
    }));
}

export async function approveGroupJoinRequest(requestId) {
    // lee solicitud
    const { data: req, error: rErr } = await supabase
        .from('group_join_requests')
        .select('id, group_id, user_id, status')
        .eq('id', requestId)
        .single();
    if (rErr) throw rErr;
    if (!req) throw new Error('Solicitud no encontrada');
    // marca como aprobada
    const { error: uErr } = await supabase
        .from('group_join_requests')
        .update({ status: 'APPROVED', decided_at: new Date().toISOString() })
        .eq('id', requestId);
    if (uErr) throw uErr;
    // inserta miembro (ignora duplicado)
    const { error: mErr } = await supabase
        .from('group_members')
        .insert({ group_id: req.group_id, user_id: req.user_id, role: 'MEMBER' });
    if (mErr && mErr.code !== '23505') throw mErr;

    return true;
}

export async function rejectGroupJoinRequest(requestId) {
    const { error } = await supabase
        .from('group_join_requests')
        .update({ status: 'REJECTED', decided_at: new Date().toISOString() })
        .eq('id', requestId);
    if (error) throw error;
    return true;
}

/* -------------------- EVENTS PENDING (propuestos) -------------------- */

export async function listPendingEventsForAdmin() {
    const adminGroupIds = await myAdminGroupIds();
    if (adminGroupIds.length === 0) return [];

    // 1) columnas planas (sin embed)
    const { data: evs, error } = await supabase
        .from('events')
        .select('id, title, group_id, status, created_at, start_at')
        .in('group_id', adminGroupIds)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });
    if (error) throw error;

    if (!evs?.length) return [];

    // 2) resolver nombres de grupos
    const groupIds = [...new Set(evs.map(e => e.group_id))];
    const { data: groups, error: gErr } = await supabase
        .from('groups')
        .select('id, name')
        .in('id', groupIds);
    if (gErr) throw gErr;

    const gmap = new Map((groups || []).map(g => [g.id, g.name]));

    return evs.map(e => ({
        id: e.id,
        type: 'EVENT',
        groupId: e.group_id,
        groupName: gmap.get(e.group_id) || 'Grupo',
        title: e.title,
        time: new Date(e.created_at || e.start_at || Date.now()),
    }));
}

export async function approveEvent(eventId) {
    const { error } = await supabase
        .from('events')
        .update({ status: 'APPROVED' })
        .eq('id', eventId);
    if (error) throw error;
    return true;
}

export async function rejectEvent(eventId) {
    const { error } = await supabase
        .from('events')
        .update({ status: 'REJECTED' })
        .eq('id', eventId);
    if (error) throw error;
    return true;
}

/* -------------------- Feed combinado para la pantalla -------------------- */

export async function listAdminNotifications() {
    const adminGroupIds = await myAdminGroupIds();
    if (!adminGroupIds.length) return [];

    // 1) JOIN requests
    const gjrRes = await supabase
        .from('group_join_requests')
        .select('id, group_id, user_id, created_at')
        .eq('status', 'PENDING')
        .in('group_id', adminGroupIds)
        .order('created_at', { ascending: false });

    if (gjrRes.error) throw gjrRes.error;
    const gjr = gjrRes.data || [];

    // 2) Eventos PENDING
    const evRes = await supabase
        .from('events')
        .select('id, group_id, title, created_at')
        .eq('status', 'PENDING')
        .in('group_id', adminGroupIds)
        .order('created_at', { ascending: false });

    if (evRes.error) throw evRes.error;
    const evs = evRes.data || [];

    // 3) Diccionarios para nombres (grupos y perfiles de solicitantes)
    const groupIds = [...new Set([...gjr.map(r => r.group_id), ...evs.map(e => e.group_id)])];
    const userIds = [...new Set(gjr.map(r => r.user_id))];

    const [groupsRes, profsRes] = await Promise.all([
        groupIds.length
            ? supabase.from('groups').select('id, name').in('id', groupIds)
            : { data: [], error: null },
        userIds.length
            ? supabase.from('profiles').select('id, display_name').in('id', userIds)
            : { data: [], error: null },
    ]);
    if (groupsRes.error) throw groupsRes.error;
    if (profsRes.error) throw profsRes.error;

    const gmap = new Map((groupsRes.data || []).map(g => [g.id, g.name]));
    const pmap = new Map((profsRes.data || []).map(p => [p.id, p.display_name || '']));

    // 4) Normaliza a feed
    const joinItems = gjr.map(r => ({
        id: r.id,
        type: 'JOIN',
        groupId: r.group_id,
        groupName: gmap.get(r.group_id) || 'Grupo',
        requesterId: r.user_id,
        requesterName: pmap.get(r.user_id) || r.user_id.slice(0, 8),
        time: new Date(r.created_at),
    }));

    const eventItems = evs.map(e => ({
        id: e.id,
        type: 'EVENT',
        groupId: e.group_id,
        groupName: gmap.get(e.group_id) || 'Grupo',
        title: e.title,
        time: new Date(e.created_at),
    }));

    return [...joinItems, ...eventItems].sort((a, b) => b.time - a.time);
}