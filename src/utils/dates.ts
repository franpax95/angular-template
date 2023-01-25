/**
 * Formatea una fecha recibida en formato 'DD-MM-YYYY' a formato 'DD/MM/YYYY'
 */
export const beautifyDate = (d: string, delimiter: string = '-'): string => {
    if (!isDate(d)) {
        return d;
    }

    if (d.includes("T")) {
        const [ddmmyyyy, hhmmss] = d.split("T");
        const [DD, MM, YYYY] = ddmmyyyy.split(delimiter);
        const [hh, mm, ss] = hhmmss.split(":");
        return `${DD}/${MM}/${YYYY} ${hh}:${mm}:${ss}`;
    } else {
        const [DD, MM, YYYY] = d.split(delimiter);
        return `${DD}/${MM}/${YYYY}`;
    }
}

/**
 * Devuelve la fecha actual formateada según se guarda en bbdd, en formato 'YYYYMMDD'
 */
export const getCurrentFormattedDate = (): string => {
    const current = new Date();
    const dd = `${current.getDate()}`.padStart(2, '0');
    const mm = `${current.getMonth() + 1}`.padStart(2, '0');
    const yyyy = `${current.getFullYear()}`.padStart(4, '0');
    return `${yyyy}${mm}${dd}`;
}

/**
 * Devuelve true si el string pasado por parámetro tiene formato 'dd-mm-yyyy' o 'dd-mm-yyyyThh:mn:ss'
 */
export const isDate = (date: string, delimiter: string = '-'): boolean => {
    const regexpWithTZ = new RegExp(/^(\d{2}-\d{2}-\d{4}T\d{2}:\d{2}:\d{2})$/g);
    const regexpWithoutTZ = new RegExp(/^(\d{2}-\d{2}-\d{4})$/g);
    const result: string = date.split(delimiter).join('-');
    return regexpWithTZ.test(result) || regexpWithoutTZ.test(result);
}

/**
 * Devuelve true si el string recibido por parámetro coincide con el formato 'yyyy-mm-ddThh:mm:ss.000+00:00' de fechas de Base de Datos.
 */
export const isDateFromDDBB = (date: string): boolean => {
    const regexp = new RegExp(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}).\d{3}\+\d{2}:\d{2}$/g);
    return regexp.test(date);
}

/**
 * Recibe una fecha en formato 'yyyy-mm-ddThh:mm:ss.000+00:00' y la convierte a formato 'dd-mm-yyyy'.
 * Recibe por parámetro el delimitador ('-', '/', etc.) y si debe añadir timezone.
 */
export const parseDateFromDDBB = (date: string, delimiter: string = '-', tz: boolean = false): string => {
    const regexp = new RegExp(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}).\d{3}\+\d{2}:\d{2}$/g);
    if (!regexp.test(date)) {
        return date;
    }

    const splitted1: Array<string> = date.split('.');
    const splitted2: Array<string> = splitted1[0].split('T');
    const [yyyy, mm, dd] = splitted2[0].split('-');
    const [hh, mn, ss] = splitted2[1].split(':');

    if (tz) {
        return `${dd}${delimiter}${mm}${delimiter}${yyyy}T${hh}:${mn}:${ss}`;
    }

    return `${dd}${delimiter}${mm}${delimiter}${yyyy}`;
}

/**
 * Parsea un string en formato 'dd-mm-yyyy', con o sin timezone, a formato 'yyyy-mm-ddThh:mm:ss.000+00:00'
 */
export const parseDateToDDBB = (date: string, delimiter: string = '-'): string => {
    const regexpWithTZ = new RegExp(/^(\d{2}-\d{2}-\d{4}T\d{2}:\d{2}:\d{2})$/g);
    const regexpWithoutTZ = new RegExp(/^(\d{2}-\d{2}-\d{4})$/g);
    const result: string = date.split(delimiter).join('-');

    if (regexpWithTZ.test(result)) {
        const splitted: Array<string> = result.split('T');
        const [dd, mm, yyyy] = splitted[0].split('-');
        const [hh, mn, ss] = splitted[1].split(':');
        return `${yyyy}-${mm}-${dd}T${hh}:${mn}:${ss}.000+00:00`;
    }

    if (regexpWithoutTZ.test(result)) {
        const [dd, mm, yyyy] = result.split('-');
        return `${yyyy}-${mm}-${dd}T00:00:00.000+00:00`;
    }

    return '';
}
