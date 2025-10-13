import { supabase } from '../lib/supabase';

export async function createGroup({ name, description }) {
    const { data: { user }, error: eUser } = await supabase.auth.getUser();
    if (eUser || !user) throw new Error('No auth user');

    const { data, error } = await supabase
        .from('groups')
        .insert({ name, description: description || '', owner_id: user.id })
        .select('id, name')
        .single();

    if (error) throw error;

    // El trigger en DB ya mete al OWNER en group_members, si no lo tienes:
    // await supabase.from('group_members').insert({ group_id: data.id, user_id: user.id, role: 'OWNER' });

    return data; // { id, name }
}

export async function listGroupsByName(q = '') {
    const { data, error } = await supabase
        .from('groups')
        .select('id, name, description')
        .order('created_at', { ascending: false });

    if (error) throw error;

    const ql = q.trim().toLowerCase();
    return ql ? data.filter(g => g.name.toLowerCase().includes(ql)) : data;
}

// src/data/groups.supabase.js
export async function setSelectedGroup(groupId) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').upsert({ id: user.id, selected_group_id: groupId }, { onConflict: 'id' });
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
