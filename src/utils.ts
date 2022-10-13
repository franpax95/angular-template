/**
 * Formatea una fecha recibida en formato 'YYYYMMDD' a formato 'DD/MM/YYYY'
 */
export const beautifyDate = (d: string) => {
    if (d.length !== 8) {
        return d;
    }

    const yyyy: string = d.substring(0, 4);
    const mm: string = d.substring(4, 6);
    const dd: string = d.substring(6, 8);
    return `${dd}/${mm}/${yyyy}`;
}

/**
 * Crea una copia de un objeto
 * 
 * @param obj   objeto a copiar
 * @returns     copia del objeto
 */
export const clone = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Elimina los acentos de un texto
 */
export const deleteAccents = (text: string): string => text
    .slice()
    .normalize('NFD')
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
    .normalize();

/**
 * Devuelve una copia del array pasado por parámetro sin la posición indicada
 */
export const deleteArrayElement = (arr: Array<any>, i: number): Array<any> => {
    let array = arr.slice();
    array.splice(i, 1);
    return array;
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
 * Devuelve una promesa sencilla. Ésta puede ser utilizada para forzar
 * esperas asíncronas o testear llamadas.
 * 
 * @returns array con la promesa, la función para resolver la promesa y la función para hacerla fallar, respectivamente
 */
export const getPromise = (): Array<any> => {
    let promiseResolve: Function = () => {};
    let promiseReject: Function = () => {};
    
    const prom = new Promise((resolve, reject) => {
        promiseResolve = resolve;
        promiseReject = reject;
    });

    return [prom, promiseResolve, promiseReject];
}

/**
 * Devuelve un array de promesas y de sus respectivos resolves y rejects. Esto es útil para resolver concurrentemente
 * varias llamadas asíncronas.
 * 
 * @param length    Número de promesas a devolver
 * @returns         Array de 3 posiciones: en la primera posición un array de las promesas, en la segunda sus resolves, en la tercera sus rejects
 */
export const getMultiPromises = (length: number): Array<Array<any>> => {
    let entries = [];
    for (let i = 0; i < length; i++) {
        entries.push(getPromise());
    }
    
    const promises = entries.map((entry) => (entry[0]));
    const resolves = entries.map((entry) => (entry[1]));
    const rejects = entries.map((entry) => (entry[2]));

    return [promises, resolves, rejects];
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min: number, max: number): number => {
    const _min = Math.ceil(min);
    const _max = Math.ceil(max);
    return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}

/**
 * Devuelve un array con el elemento pasado por parámetro insertado en la posición especificada, desplazando el resto.
 * 
 * @param arr       array donde insertar
 * @param index     índice del array donde insertar el elemento
 * @param element   elemento a insertar
 * @returns         array con el elemento insertado en la posición especificada
 */
export const insertArrayElement = (arr: Array<any>, index: number, element: any) => {
    const _arr = clone(arr);

    return index <= _arr.length 
        ? [
            ..._arr.slice(0, index),
            element,
            ..._arr.slice(index, arr.length)
        ] 
        : _arr;
}
