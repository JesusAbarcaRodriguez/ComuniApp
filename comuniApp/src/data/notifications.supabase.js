// src/data/notifications.supabase.js
import { supabase } from '../lib/supabase';

export async function listMyNotifications({ unreadOnly = false } = {}) {
    const q = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
    if (unreadOnly) q.eq('read', false);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
}

export async function markNotificationRead(id) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
    if (error) throw error;
}

export async function markAllRead() {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);
    if (error) throw error;
}
