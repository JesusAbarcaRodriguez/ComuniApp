import { supabase } from '../lib/supabase';

/** Devuelve los group_ids donde el usuario actual es OWNER o ADMIN */
async function myAdminGroupIds() {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) throw aerr || new Error('No auth user');

    // dueños por groups.owner_id
    const { data: owned, error: e1 } = await supabase
        .from('groups')
        .select('id')
        .eq('owner_id', user.id);
    if (e1) throw e1;

    // admins por group_members
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

/* -------------------- JOIN REQUESTS (unirse a grupo) -------------------- */

export async function listGroupJoinRequestsForAdmin() {
    const adminGroupIds = await myAdminGroupIds();
    if (adminGroupIds.length === 0) return [];

    const { data, error } = await supabase
        .from('group_join_requests')
        .select(`
      id, status, created_at,
      group_id,
      groups ( name ),
      requester_id,
      requester:profiles!group_join_requests_requester_id_fkey ( display_name )
    `)
        .in('group_id', adminGroupIds)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });

    if (error) throw error;

    // normaliza
    return (data || []).map(r => ({
        id: r.id,
        groupId: r.group_id,
        groupName: r.groups?.name || 'Group',
        requesterId: r.requester_id,
        requesterName: r.requester?.display_name || 'User',
        time: new Date(r.created_at),
    }));
}

export async function approveGroupJoinRequest(reqId) {
    // 1) obtener request
    const { data: req, error: e1 } = await supabase
        .from('group_join_requests')
        .select('id, group_id, requester_id, status')
        .eq('id', reqId)
        .single();
    if (e1) throw e1;

    // 2) insertar membresía como MEMBER
    const { error: e2 } = await supabase
        .from('group_members')
        .insert({ group_id: req.group_id, user_id: req.requester_id, role: 'MEMBER' });
    if (e2) throw e2;

    // 3) actualizar estado de la solicitud
    const { error: e3 } = await supabase
        .from('group_join_requests')
        .update({ status: 'APPROVED' })
        .eq('id', reqId);
    if (e3) throw e3;

    return true;
}

export async function rejectGroupJoinRequest(reqId) {
    const { error } = await supabase
        .from('group_join_requests')
        .update({ status: 'REJECTED' })
        .eq('id', reqId);
    if (error) throw error;
    return true;
}

/* -------------------- EVENT REQUESTS (aprobar eventos) -------------------- */

export async function listPendingEventsForAdmin() {
    const adminGroupIds = await myAdminGroupIds();
    if (adminGroupIds.length === 0) return [];

    const { data, error } = await supabase
        .from('events')
        .select(`
        id, title, status, group_id, start_at,
        groups ( name )
      `) // <- quitamos el join a profiles/creator por si RLS lo bloquea
        .in('group_id', adminGroupIds)
        .eq('status', 'PENDING')
        .order('start_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(e => ({
        id: e.id,
        title: e.title,
        groupName: e.groups?.name || 'Group',
        time: e.start_at ? new Date(e.start_at) : new Date(), // fallback para ordenar
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




export async function listPendingGroupsForOwner() {
    // Owner ve sus grupos 'PENDING'
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) throw aerr || new Error('No auth user');

    const { data, error } = await supabase
        .from('groups')
        .select('id, name, created_at, owner_id')
        .eq('owner_id', user.id)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(g => ({
        id: g.id,
        name: g.name,
        time: new Date(g.created_at),
    }));
}

export async function approveGroup(groupId) {
    const { error } = await supabase
        .from('groups')
        .update({ status: 'APPROVED' })
        .eq('id', groupId);
    if (error) throw error;
    return true;
}

export async function rejectGroup(groupId) {
    const { error } = await supabase
        .from('groups')
        .update({ status: 'REJECTED' })
        .eq('id', groupId);
    if (error) throw error;
    return true;
}

/* --------- FEED combinado (ahora incluye GROUP) --------- */
export async function listAdminNotifications() {
    const [joins, events, groups] = await Promise.all([
        listGroupJoinRequestsForAdmin(), // JOIN
        listPendingEventsForAdmin(),     // EVENT
        listPendingGroupsForOwner(),     // GROUP
    ]);

    const feed = [
        ...groups.map(g => ({ type: 'GROUP', id: g.id, name: g.name, time: g.time })),
        ...joins.map(j => ({ type: 'JOIN', ...j })),
        ...events.map(e => ({ type: 'EVENT', ...e })),
    ];

    return feed.sort((a, b) => (b.time?.getTime?.() || 0) - (a.time?.getTime?.() || 0));
}
