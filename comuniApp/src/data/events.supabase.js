import { supabase } from '../lib/supabase';

// Convierte "YYYY-MM-DD", "HH:mm" a ISO usando la zona del dispositivo
function toLocalISO(dateStr, timeStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [H, M] = timeStr.split(':').map(Number);
    const dt = new Date(y, (m - 1), d, H, M, 0, 0);
    return dt.toISOString();
}

export async function createEvent({
    groupId, title, description, startDate, startTime, endDate, endTime, locationName, status = 'PENDING'
}) {
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) throw new Error('No auth user');

    let gid = groupId;
    if (!gid) {
        const { data: prof, error: profErr } = await supabase
            .from('profiles')
            .select('selected_group_id')
            .eq('id', authData.user.id)
            .single();
        if (profErr) throw profErr;
        gid = prof?.selected_group_id;
    }
    if (!gid) throw new Error('Falta grupo');

    if (!title?.trim()) throw new Error('Título es obligatorio');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate || '')) throw new Error('Fecha inválida');
    if (!/^\d{2}:\d{2}$/.test(startTime || '')) throw new Error('Hora inválida');

    const start_at = toLocalISO(startDate, startTime);
    let end_at = null;
    if (endDate && endTime) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) throw new Error('Fecha fin inválida');
        if (!/^\d{2}:\d{2}$/.test(endTime)) throw new Error('Hora fin inválida');
        end_at = toLocalISO(endDate, endTime);
    }

    const { data, error } = await supabase
        .from('events')
        .insert({
            group_id: gid,
            title: title.trim(),
            description,
            start_at,
            end_at,
            location_name: locationName?.trim() || null,
            visibility: 'GROUP',
            status,
            created_by: authData.user.id,
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
        .in('status', ['APPROVED'])
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function getEventById(eventId) {
    const { data: event, error } = await supabase
        .from('events')
        .select(`
      id, title, description, start_at, end_at, location_name, status, group_id,
      groups ( name )
    `)
        .eq('id', eventId)
        .single();
    if (error) throw error;

    const { count: goingCount, error: eCount } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'GOING');
    if (eCount) throw eCount;

    return { event, goingCount: goingCount ?? 0 };
}

/** Devuelve el status de asistencia del usuario actual (null | 'PENDING' | 'GOING' | 'REJECTED') */
export async function getMyEventStatus(eventId) {
    const { data: authData, error: aerr } = await supabase.auth.getUser();
    if (aerr || !authData?.user) return null;

    const { data, error } = await supabase
        .from('event_attendees')
        .select('status')
        .eq('event_id', eventId)
        .eq('user_id', authData.user.id)
        .maybeSingle();
    if (error) throw error;

    return data?.status || null;
}

/** Solicita unirse al evento: inserta en event_attendees con status='PENDING' */
export async function joinEvent(eventId) {
    const { data: authData, error: aerr } = await supabase.auth.getUser();
    if (aerr || !authData?.user) throw new Error('Usuario no autenticado');
    const userId = authData.user.id;

    // ¿ya tengo registro?
    const { data: existing, error: exErr } = await supabase
        .from('event_attendees')
        .select('status')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();
    if (exErr) throw exErr;

    if (existing) {
        if (existing.status === 'PENDING') throw new Error('Tu solicitud ya está pendiente.');
        if (existing.status === 'GOING') throw new Error('Ya estás inscrito en este evento.');
        // Si estuvo REJECTED, permitimos re-solicitar cambiando a PENDING:
        const { error: updErr } = await supabase
            .from('event_attendees')
            .update({ status: 'PENDING', updated_at: new Date().toISOString() })
            .eq('event_id', eventId)
            .eq('user_id', userId);
        if (updErr) throw updErr;
        return { pending: true };
    }

    // insertar nueva solicitud
    const { error } = await supabase
        .from('event_attendees')
        .insert({ event_id: eventId, user_id: userId, status: 'PENDING' });
    if (error) throw error;

    return { pending: true };
}
