import { supabase } from '../lib/supabase';

export async function createEvent({ groupId, title, startAtISO, endAtISO, locationName }) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('events')
        .insert({
            group_id: groupId,
            title,
            description: '',
            start_at: startAtISO,
            end_at: endAtISO || null,
            location_name: locationName || null,
            visibility: 'GROUP',
            status: 'PENDING',
            created_by: user.id
        })
        .select('id')
        .single();

    if (error) throw error;
    return data; // { id }
}

export async function listUpcomingEventsByGroup(groupId) {
    const { data, error } = await supabase
        .from('events')
        .select('id, title, start_at, location_name, status')
        .eq('group_id', groupId)
        .in('status', ['APPROVED'])           // si tu seed dejó el evento en APPROVED
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true });

    if (error) throw error;
    return data || [];
}
