// src/utils/format.js
// Formateo de fechas compartido por las pantallas.

const pad = (n) => String(n).padStart(2, '0');

/** "YYYY-MM-DD" */
export function formatYMD(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "HH:mm" */
export function formatHM(d) {
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "05 octubre · 18:30" (tarjetas) */
export function formatEventShort(iso) {
    try {
        const d = new Date(iso);
        const mon = d.toLocaleString(undefined, { month: 'long' });
        const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        return `${pad(d.getDate())} ${mon} · ${time}`;
    } catch {
        return iso;
    }
}

/** "dom, 5 de octubre de 2026 · 18:30" (detalle) */
export function formatEventLong(iso) {
    try {
        const d = new Date(iso);
        const date = d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
        const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        return `${date} · ${time}`;
    } catch {
        return iso;
    }
}

/** "Hace 5 min" */
export function timeAgo(d) {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    const sec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (sec < 60) return 'Ahora mismo';
    const min = Math.floor(sec / 60);
    if (min < 60) return `Hace ${min} min`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `Hace ${hr} h`;
    return `Hace ${Math.floor(hr / 24)} d`;
}
