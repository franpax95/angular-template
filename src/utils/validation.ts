/**
 * Indica si un email es válido
 */
export const validateEmail = (email: string): boolean => {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(email);
}

/**
 * Indica si una matrícula (de coche) es válida
 */
export const validateMatricula = (matricula: string): boolean => {
    let regexp = new RegExp(/^[0-9]{1,4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}/);
    return regexp.test(matricula);
}
