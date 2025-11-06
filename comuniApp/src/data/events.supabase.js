import { supabase } from '../lib/supabase';

// Convierte "YYYY-MM-DD", "HH:mm" a ISO usando la zona del dispositivo
function toLocalISO(dateStr, timeStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [H, M] = timeStr.split(':').map(Number);
    const dt = new Date(y, (m - 1), d, H, M, 0, 0);
    return dt.toISOString();
}

export async function createEvent({
    groupId, title, description, startDate, startTime, endDate, endTime, locationName, status
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
    // desde el inicio de HOY (zona local)
    const now = new Date();
    const startOfTodayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const { data, error } = await supabase
        .from('events')
        .select('id, title, start_at, location_name, status')
        .eq('group_id', groupId)
        .eq('status', 'APPROVED')
        .gte('start_at', startOfTodayLocal.toISOString()) // 👈 incluye todo lo de hoy
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

/** Verifica si el usuario actual es admin/owner del grupo del evento */
export async function isEventAdmin(eventId) {
    const { data: { user }, error: aerr } = await supabase.auth.getUser();
    if (aerr || !user) return false;

    // Obtener el grupo del evento
    const { data: event, error: evErr } = await supabase
        .from('events')
        .select('group_id')
        .eq('id', eventId)
        .single();
    if (evErr || !event) return false;

    // Verificar si es owner del grupo
    const { data: group, error: gErr } = await supabase
        .from('groups')
        .select('owner_id')
        .eq('id', event.group_id)
        .single();
    if (!gErr && group?.owner_id === user.id) return true;

    // Verificar si es ADMIN o OWNER en group_members
    const { data: member, error: mErr } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', event.group_id)
        .eq('user_id', user.id)
        .maybeSingle();

    return !mErr && member && ['OWNER', 'ADMIN'].includes(member.role);
}

/** Lista solicitudes de asistencia pendientes para un evento */
export async function listEventAttendanceRequests(eventId) {
    // Traer solicitudes pendientes
    const { data: requests, error } = await supabase
        .from('event_attendees')
        .select('user_id')
        .eq('event_id', eventId)
        .eq('status', 'PENDING');

    if (error) throw error;
    if (!requests?.length) return [];

    // Traer nombres desde profiles
    const userIds = requests.map(r => r.user_id);
    const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);
    if (pErr) throw pErr;

    const pmap = new Map((profiles || []).map(p => [p.id, p.display_name || '']));

    return requests.map(r => ({
        userId: r.user_id,
        userName: pmap.get(r.user_id) || r.user_id.slice(0, 8),
    }));
}

/** Aprueba una solicitud de asistencia */
export async function approveAttendanceRequest(eventId, userId) {
    const { error } = await supabase
        .from('event_attendees')
        .update({ status: 'GOING', updated_at: new Date().toISOString() })
        .eq('event_id', eventId)
        .eq('user_id', userId);

    if (error) throw error;
    return true;
}

/** Rechaza una solicitud de asistencia */
export async function rejectAttendanceRequest(eventId, userId) {
    const { error } = await supabase
        .from('event_attendees')
        .update({ status: 'REJECTED', updated_at: new Date().toISOString() })
        .eq('event_id', eventId)
        .eq('user_id', userId);

    if (error) throw error;
    return true;
}

/** Cuenta solicitudes de asistencia pendientes para un evento */
export async function getPendingAttendanceCount(eventId) {
    const { count, error } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'PENDING');

    if (error) throw error;
    return count ?? 0;
}
