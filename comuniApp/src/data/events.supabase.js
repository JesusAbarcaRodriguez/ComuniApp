import { supabase } from '../lib/supabase';


// Convierte "YYYY-MM-DD", "HH:mm" a ISO usando la zona del dispositivo (no UTC forzado)
function toLocalISO(dateStr, timeStr) {
    // Si te interesa forzar UTC, puedes añadir 'Z' y new Date(`${dateStr}T${timeStr}:00Z`)
    const [y, m, d] = dateStr.split('-').map(Number);
    const [H, M] = timeStr.split(':').map(Number);
    const dt = new Date(y, (m - 1), d, H, M, 0, 0);
    return dt.toISOString();
}

export async function createEvent({ groupId, title, startDate, startTime, endDate, endTime, locationName, status = 'PENDING' }) {
    // 1) Usuario actual
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) throw new Error('No auth user');

    // 2) Resolver groupId si no vino
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
    if (!gid) throw new Error('Falta grupo: selecciona un grupo antes de crear el evento');

    // 3) Validaciones básicas
    if (!title?.trim()) throw new Error('Título es obligatorio');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate || '')) throw new Error('Fecha inválida. Usa formato YYYY-MM-DD');
    if (!/^\d{2}:\d{2}$/.test(startTime || '')) throw new Error('Hora inválida. Usa formato HH:mm');

    const start_at = toLocalISO(startDate, startTime);
    let end_at = null;
    if (endDate && endTime) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) throw new Error('Fecha fin inválida (YYYY-MM-DD)');
        if (!/^\d{2}:\d{2}$/.test(endTime)) throw new Error('Hora fin inválida (HH:mm)');
        end_at = toLocalISO(endDate, endTime);
    }

    // 4) Insert
    const { data, error } = await supabase
        .from('events')
        .insert({
            group_id: gid,
            title: title.trim(),
            description: '',
            start_at,
            end_at,
            location_name: locationName?.trim() || null,
            visibility: 'GROUP',
            status,
            created_by: authData.user.id
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

export async function getEventById(eventId) {
    // Trae el evento y el nombre del grupo (join implícito)
    const { data: event, error } = await supabase
        .from('events')
        .select(`
        id, title, description, start_at, end_at, location_name, status, group_id,
        groups ( name )
`)
        .eq('id', eventId)
        .single();

    if (error) throw error;

    // Conteo de asistentes "GOING"
    const { count: goingCount, error: eCount } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'GOING');

    if (eCount) throw eCount;

    return { event, goingCount: goingCount ?? 0 };
}
