import { supabase } from '../lib/supabase';

/**
 * Crea un grupo con el usuario actual como owner.
 * Requiere policy de insert: owner_id = auth.uid()
 */
export async function createGroup({ name, description }) {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) throw aerr || new Error('No auth user');

    // 1) Crea el grupo
    const { data: g, error } = await supabase
        .from('groups')
        .insert({
            name,
            description: description || null,
            owner_id: user.id,
            privacy: 'PUBLIC',     // ajusta si quieres otro default
            status: 'APPROVED',    // o 'PENDING' si lo aprueba un admin global
        })
        .select('id, name')
        .single();

    if (error) throw error;

    // 2) Inserta membresía OWNER para el creador
    const { error: mErr } = await supabase
        .from('group_members')
        .insert({
            group_id: g.id,
            user_id: user.id,
            role: 'OWNER',
        });

    // Si ya existiera por algún motivo, puedes ignorar duplicados (23505)
    if (mErr && mErr.code !== '23505') throw mErr;

    return g; // { id, name }
}

export async function listGroupsByName(q = '') {
    let query = supabase
        .from('groups')
        .select('id, name, privacy, status')
        .eq('privacy', 'PUBLIC')
        .eq('status', 'APPROVED')
        .order('name', { ascending: true });

    if (q) query = query.ilike('name', `%${q}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export async function setSelectedGroup(groupId) {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) throw aerr || new Error('No auth user');

    const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, selected_group_id: groupId }, { onConflict: 'id' });

    if (error) throw error;
    return true;
}

export async function getSelectedGroup() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('profiles')
        .select('selected_group_id')
        .eq('id', user.id)
        .single();
    if (error) throw error;
    return data?.selected_group_id || null;
}

export async function getGroupName(groupId) {
    if (!groupId) return null;
    const { data, error } = await supabase
        .from('groups')
        .select('name')
        .eq('id', groupId).single();
    if (error) throw error;
    return data?.name || null;
}

export async function requestJoinGroup(groupId) {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) throw aerr || new Error('No authenticated user');

    // ¿Ya existe solicitud?
    const { data: existing, error: e1 } = await supabase
        .from('group_join_requests')
        .select('id, status')
        .eq('group_id', groupId)
        .eq('user_id', user.id)   // <-- usa user_id
        .maybeSingle();

    if (e1) throw e1;
    if (existing && String(existing.status).toUpperCase() === 'PENDING') {
        return { already: true };
    }

    // Crear solicitud
    const { data, error } = await supabase
        .from('group_join_requests')
        .insert({ group_id: groupId, user_id: user.id, status: 'PENDING' }) // <-- usa user_id
        .select('id')
        .single();

    if (error) throw error;
    return { id: data.id, already: false };
}

export async function listMyMemberships() {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) throw aerr || new Error('No auth user');

    const { data, error } = await supabase
        .from('group_members')
        .select('group_id, role')
        .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
}

export async function listMyJoinRequestsPending() {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) return [];

    const { data, error } = await supabase
        .from('group_join_requests')
        .select('group_id, status')
        .eq('user_id', user.id);  // <-- usa user_id

    if (error) {
        console.warn('listMyJoinRequestsPending error:', error);
        return [];
    }

    return (data || [])
        .filter(r => String(r.status).toUpperCase() === 'PENDING')
        .map(r => r.group_id);
}

/** Verifica si el usuario actual es owner del grupo */
export async function isGroupOwner(groupId) {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) return false;

    const { data: group, error } = await supabase
        .from('groups')
        .select('owner_id')
        .eq('id', groupId)
        .single();

    if (error) return false;
    return group?.owner_id === user.id;
}

/** Elimina un grupo (solo si el usuario es owner) */
export async function deleteGroup(groupId) {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) throw new Error('Usuario no autenticado');

    // Verificar que es owner
    const isOwner = await isGroupOwner(groupId);
    if (!isOwner) throw new Error('Solo el owner puede eliminar el grupo');

    // Eliminar el grupo (las relaciones se eliminan por CASCADE)
    const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

    if (error) {
        console.error('Error al eliminar grupo:', error);
        // Si es un error de políticas RLS
        if (error.code === '42501' || error.message.includes('policy')) {
            throw new Error('Error de permisos en Supabase. Ejecuta el script SQL: supabase_delete_policies.sql');
        }
        throw new Error(error.message || 'Error al eliminar el grupo');
    }
    return true;
}