/**
 * Cálculo de fecha estimada de entrega.
 *
 * Regla acordada: el rango SIEMPRE es hoy+2 a hoy+3 días corridos (no hábiles),
 * sin importar el día de la semana. Ej: si hoy es 1 de mayo → llega entre el 3 y el 4.
 *
 * Si más adelante se quiere saltar sábados/domingos, modificar `buildDeliveryRange()`
 * para avanzar al próximo día hábil en lugar de usar días corridos.
 */

const WEEKDAYS = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
] as const;

const WEEKDAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'] as const;

const MONTHS = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
] as const;

const MONTHS_SHORT = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
] as const;

const MIN_DELIVERY_DAYS = 2;
const MAX_DELIVERY_DAYS = 3;

export interface DeliveryRange {
    start: Date;
    end: Date;
}

/** Devuelve el rango de fechas estimado basado en la fecha actual. */
export function buildDeliveryRange(from: Date = new Date()): DeliveryRange {
    const start = new Date(from);
    start.setDate(from.getDate() + MIN_DELIVERY_DAYS);
    const end = new Date(from);
    end.setDate(from.getDate() + MAX_DELIVERY_DAYS);
    return { start, end };
}

/**
 * Formato LARGO para la página de producto.
 * Ej: "sábado 26 y domingo 27 de abril"
 *     "miércoles 30 de abril y jueves 1 de mayo" (si cruza de mes)
 */
export function formatDeliveryRangeLong(range: DeliveryRange): string {
    const { start, end } = range;
    const sameMonth = start.getMonth() === end.getMonth();

    const startStr = sameMonth
        ? `${WEEKDAYS[start.getDay()]} ${start.getDate()}`
        : `${WEEKDAYS[start.getDay()]} ${start.getDate()} de ${MONTHS[start.getMonth()]}`;

    const endStr = `${WEEKDAYS[end.getDay()]} ${end.getDate()} de ${MONTHS[end.getMonth()]}`;

    return `${startStr} y ${endStr}`;
}

/**
 * Formato CORTO para el drawer del carrito (espacio reducido).
 * Ej: "sáb 26 – dom 27 abr"
 *     "mié 30 abr – jue 1 may" (si cruza de mes)
 */
export function formatDeliveryRangeShort(range: DeliveryRange): string {
    const { start, end } = range;
    const sameMonth = start.getMonth() === end.getMonth();

    const startStr = sameMonth
        ? `${WEEKDAYS_SHORT[start.getDay()]} ${start.getDate()}`
        : `${WEEKDAYS_SHORT[start.getDay()]} ${start.getDate()} ${MONTHS_SHORT[start.getMonth()]}`;

    const endStr = `${WEEKDAYS_SHORT[end.getDay()]} ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]}`;

    return `${startStr} – ${endStr}`;
}
