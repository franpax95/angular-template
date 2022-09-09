/**
 * Interfaz con las opciones a la hora de realizar peticiones desde los servicios.
 * 
 *  @force - boolean    En caso de tener funcionalidad de persistencia de datos, fuerza la petición para traer nuevos datos.
 * 
 *  @loading - boolean  Muestra el spinner de carga de la aplicación mientras dura la llamada. 
 *                      Útil para el manejo manual desde la aplicación, por ejemplo, cuando quieres realizar varias llamadas 
 *                      seguidas y usar un único spinner común.
 */
export interface IRequestOptions {

    // En caso de tener funcionalidad de persistencia de datos (según la lógica)
    force?: boolean;      

    // Muestra el spinner principal de la aplicación el tiempo que dura la llamada
    loading?: boolean;

}
