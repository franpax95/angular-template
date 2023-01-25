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
 * Callback para comparar strings a la hora de ordenar arrays.
 * Elimina las tildes y las ñs a la hora de ordenar. 
 * Por defecto, devuelve la lista en orden descendente, a no ser que se especifique la variable 'asc' a true.
 */
export const compareStringArray = (a: string, b: string, asc?: boolean): number => {
    const valueA: string = deleteAccents(a.replace(/ñ/g, "nZ").replace(/Ñ/g, "NZ")).toLowerCase();
    const valueB: string = deleteAccents(b.replace(/ñ/g, "nZ").replace(/Ñ/g, "NZ")).toLowerCase();

    if (valueA > valueB) {
        return asc ? -1 : 1;
    }

    if (valueB > valueA) {
        return asc ? 1 : -1;
    }

    return 0;
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
 * Elimina los elementos duplicados de un array.
 * Sólo funciona con valores primitivos.
 */
export const deleteDuplicateArrayElements = (arr: Array<any>): Array<any> => {
    return Array.from(new Set(arr));
}

/**
 * Devuelve una promesa para transformar un File en un string base64
 * @param file 
 * @returns 
 */
export const fileToBase64 = (file: File) => (new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function() {
        resolve(reader.result);
    }

    reader.onerror = function(error) {
        reject(error);
    }
}));

/**
 * Devuelve el comienzo del base64 para su display.
 * REVISAR PARA SVG.
 */
export const getBase64Format = (b64: string): string => {
    if (b64.slice(0, 4) === '/9j/') {
        // JPEG...
        return 'data:image/jpeg;base64,';
    } else if (b64.slice(0, 5) === 'iVBOR') {
        // PNG...
        return 'data:image/png;base64,'
    } else if (b64.slice(0, 9) === 'JVBERi0xL') {
        // PDF...
        return 'data:application/pdf;base64,';
    } else if (b64.slice(0, 7) === 'PD94bWw') {
        // SVG...
        return 'data:image/svg+xml;base64,';
    }

    return '';
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

/**
 * Ordena una colección según el attr
 */
export const sortDataCollection = (data: Array<any>, attr: string, asc?: boolean): Array<any> => {
    return data.sort((a: any, b: any) => {
        const signaturedA: { [key: string]: string | number | boolean | null } = a;
        const signaturedB: { [key: string]: string | number | boolean | null } = b;

        if (typeof signaturedA[attr] === 'string') {
            return compareStringArray(`${signaturedA[attr]}`, `${signaturedB[attr]}`, asc);
        } else if (signaturedA[attr] !== null) {
            if (Number(signaturedA[attr]) > Number(signaturedB[attr])) {
                return asc ? -1 : 1;
            }
        
            if (Number(signaturedB[attr]) > Number(signaturedA[attr])) {
                return asc ? 1 : -1;
            }

            return 0;
        }

        return 0;
    });
}
