import { supabase } from '../lib/supabase';

/**
 * Crea un grupo con el usuario actual como owner.
 * Requiere policy de insert: owner_id = auth.uid()
 */
export async function createGroup({ name, description = '' }) {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) throw aerr || new Error('No auth user');

    // IMPORTANTE: enviar owner_id para cumplir NOT NULL y la RLS de insert
    const { data, error } = await supabase
        .from('groups')
        .insert({
            name: name.trim(),
            description: description.trim() || null,
            owner_id: user.id,            // <<-- clave
            privacy: 'PUBLIC',            // opcional si tienes default
        })
        .select('id, name')
        .single();

    if (error) {
        // imprime detalles útiles en consola para depurar
        console.log('createGroup error:', error);
        throw error;
    }
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
