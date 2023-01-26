import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from 'src/config';
import { IRequestOptions } from '../interfaces/IRequestOptions';
import { SettingsService } from './settings.service';
import HTTP_STATUS_CODE from 'src/app/states/http.code';

export interface IHttpRequestConfig {
    headers: { [key: string]: string | number; };
    body: any;
    timeout: number | null;
    errorModal?: boolean;
}

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Comprueba que el tipo recibido en la respuesta sea el mismo tipo enviado en la petición
    const requestHeaders = response.config.headers;
    const responseHeaders = response.headers;

    if (requestHeaders['Accept'] !== responseHeaders['content-type']) {
        response.status = 406;
        return Promise.reject(response);
    }

    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    /** Base URL importada desde el archivo de configuración */
    public readonly baseUrl: string = config.baseUrl;
    /** Tiempo (en ms) por defecto para que una request expire */
    public readonly DEFAULT_TIMEOUT: number | null = null;

    constructor(private settings: SettingsService) { }

    /**
     * Manejador de peticiones GET
     */
    public async get(url: string, config: IHttpRequestConfig = this.defaultHttpRequestConfig()): Promise<any> {
        const { headers, body, timeout, errorModal } = config;

        // Preparamos la URL mediante un método de ayuda
        const completeUrl: string = this.getCompleteUrl(url, body);

        // Preparamos la configuración como objeto tipo AxiosRequestConfig
        const reqConfig: AxiosRequestConfig = { headers };

        // Preparamos la cancelación de llamada por TIMEOUT, según el pasado por configuración
        const source = axios.CancelToken.source();
        let timer = setTimeout(() => {}, 0);

        if (timeout !== null) {
            timer = setTimeout(() => {
                source.cancel(`HTTP_REQUEST_TIMEOUT: ${timeout}ms`);
            }, timeout);
        }

        // Devolvemos la llamada
        return axios.get(completeUrl, { ...reqConfig, cancelToken: source.token })
            .then(res => {
                if (timeout !== null) {
                    clearTimeout(timer);
                }

                return res;
            })
            .catch(error => {
                console.error(error);

                if (errorModal) {
                    this.settings.openModal({
                        title: 'Error',
                        content: ['Están habiendo problemas para obtener la información. Por favor, inténtelo de nuevo más tarde.'],
                    });
                }

                return Promise.reject(error);
            });
    }

    /**
     * Manejador de peticiones POST
     */
    public async post(url: string, config: IHttpRequestConfig = this.defaultHttpRequestConfig()): Promise<any> {
        const { headers, body, timeout, errorModal } = config;

        // Preparamos la URL mediante un método de ayuda
        const completeUrl: string = this.getCompleteUrl(url, null, 'POST');

        // Preparamos la configuración como objeto tipo AxiosRequestConfig
        const reqConfig: AxiosRequestConfig = { headers };

        // Preparamos la cancelación de llamada por TIMEOUT, según el pasado por configuración
        const source = axios.CancelToken.source();
        let timer = setTimeout(() => {}, 0);

        if (timeout !== null) {
            timer = setTimeout(() => {
                source.cancel(`HTTP_REQUEST_TIMEOUT: ${timeout}ms`);
            }, timeout);
        }

        // Devolvemos la llamada
        return axios.post(completeUrl, body, { ...reqConfig, cancelToken: source.token })
            .then(res => {
                if (timeout !== null) {
                    clearTimeout(timer);
                }

                return res;
            })
            .catch(error => {
                console.error(error);

                if (errorModal) {
                    this.settings.openModal({
                        title: 'Error',
                        content: ['Están habiendo problemas para obtener la información. Por favor, inténtelo de nuevo más tarde.'],
                    });
                }

                return Promise.reject(error);
            });
    }

    /**
     * Manejador de peticiones PUT
     */
    public async put(url: string, config: IHttpRequestConfig = this.defaultHttpRequestConfig()): Promise<any> {
        const { headers, body, timeout, errorModal } = config;

        // Preparamos la URL mediante un método de ayuda
        const completeUrl: string = this.getCompleteUrl(url, null, 'PUT');

        // Preparamos la configuración como objeto tipo AxiosRequestConfig
        const reqConfig: AxiosRequestConfig = { headers };

        // Preparamos la cancelación de llamada por TIMEOUT, según el pasado por configuración
        const source = axios.CancelToken.source();
        let timer = setTimeout(() => {}, 0);

        if (timeout !== null) {
            timer = setTimeout(() => {
                source.cancel(`HTTP_REQUEST_TIMEOUT: ${timeout}ms`);
            }, timeout);
        }

        // Devolvemos la llamada
        return axios.put(completeUrl, body, { ...reqConfig, cancelToken: source.token })
            .then(res => {
                if (timeout !== null) {
                    clearTimeout(timer);
                }

                return res;
            })
            .catch(error => {
                console.error(error);

                if (errorModal) {
                    this.settings.openModal({
                        title: 'Error',
                        content: ['Están habiendo problemas para obtener la información. Por favor, inténtelo de nuevo más tarde.'],
                    });
                }

                return Promise.reject(error);
            });
    }


    /****************************************************************************************************************************/


    /**
     * Devuelve una configuración HTTP por defecto válida.
     */
    public defaultHttpRequestConfig(): IHttpRequestConfig {
        return ({
            headers: this.getHttpRequestHeaders(),
            body: {},
            timeout: this.DEFAULT_TIMEOUT,
            errorModal: true
        });
    }

    /**
     * Helper que devuelve las opciones para las peticiones por defecto
     */
    public defaultRequestOptions(): IRequestOptions {
        return ({
            loading: true,
            force: false
        });
    }

    /**
     * Devuelve el header para las peticiones con autenticación
     */
    public getHttpRequestHeaders(token: string = ''): { [key: string]: string | number; } {
        let headers: { [key: string]: string | number; } = {
            "Content-Type": "application/json", 
            "Accept": "application/json"
        };

        if (token !== '') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Helper para obtener la url completa
     */
    public getCompleteUrl(url: string, params?: any, method?: string): string {
        const httpMethod = method ? method.toUpperCase() : 'GET';

        switch (httpMethod) {
            case 'POST':
            case 'PUT':
                return `${this.baseUrl}${url}`;
            default:
                const body: string = params !== undefined && params !== null ? `?${this.stringifyUrlParams(params)}` : "";
                return `${this.baseUrl}${url}${body}`;
        }
    }

    /**
     * Helper que devuelve las opciones para las peticiones por defecto
     */
    public getDefaultRequestOptions(): IRequestOptions {
        return ({
            loading: true,
            force: false
        });
    }

    /**
     * Manejador de errores general para las llamadas realizadas.
     * 
     * @param error     Objeto con el error
     */
    public handleStatusError(error: any): void {
        const { status, message } = error;

        // Comprobamos primero si ha habido un error de red (Offline)
        if (!status && message === "Network Error") {
            this.settings.openModal({
                title: 'Error de red',
                content: ['Te encuentras actualmente sin conexión.'],
            });
            return ;
        }

        // Comprobamos el resto de códigos de estado relevantes
        switch (status) {
            case HTTP_STATUS_CODE.UNAUTHORIZED:
                this.settings.openModal({
                    title: 'Error de red',
                    content: ['Te encuentras actualmente sin conexión.'],
                });
                break;

            case HTTP_STATUS_CODE.NOT_FOUND:
                this.settings.openModal({
                    title: 'Error de aplicación',
                    content: [
                        'Ha habido un error de aplicación en la conexión con el servidor.',
                        'Por favor, vuelve a intentarlo de nuevo más tarde.'
                    ],
                });
                break;

            case HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR:
                this.settings.openModal({
                    title: 'Error en el servidor',
                    content: [
                        'Ha habido un problema con la comunicación con el servidor. Es posible que actualmente esté en mantenimiento o temporalmente inactivo.',
                        'Por favor, vuelve a intentarlo de nuevo más tarde.'
                    ],
                });
                break;
        }

        this.printConsoleError(error);
    }

    /**
     * Devuelve una respuesta al timeout manual
     */
    private getTimeoutResponse(reqConfig: AxiosRequestConfig = {}): AxiosResponse {
        const res: AxiosResponse = {
            // `data` is the response that was provided by the server
            data: {},

            // `status` is the HTTP status code from the server response
            status: 408,

            // `statusText` is the HTTP status message from the server response
            // As of HTTP/2 status text is blank or unsupported.
            // (HTTP/2 RFC: https://www.rfc-editor.org/rfc/rfc7540#section-8.1.2.4)
            statusText: 'ERR_CONNECTION_TIMED_OUT',

            // `headers` the HTTP headers that the server responded with
            // All header names are lower cased and can be accessed using the bracket notation.
            // Example: `response.headers['content-type']`
            headers: {
                "Content-Type": "application/json", 
                "Accept": "application/json",
            },

            // `config` is the config that was provided to `axios` for the request
            config: reqConfig,

            // `request` is the request that generated this response
            // It is the last ClientRequest instance in node.js (in redirects)
            // and an XMLHttpRequest instance in the browser
            request: {}
        };

        return res;
    }

    /**
     * Función para visualizarla errores de red por consola
     */
    private printConsoleError(msg: string): void {
        console.error();
        console.error("=========================================================");
        console.error(msg);
        console.error("=========================================================");
        console.error();
    }

    /**
     * Devuelve los parámetros de un objeto de primer nivel dado en formato SOAP: ...?key=value&key=value...
     * 
     * @param data  Objeto con los parámetros. La profundidad del objeto debe ser de 1.
     * @returns     String con la cadena formateada
     */
    private stringifyUrlParams(data: any): string {
        if (typeof data === 'object') {
            const entries: Array<Array<any>> = Object.entries(data);
            const params: string = entries
                .filter((entry: Array<any>) => (entry[1] !== '' && entry[1] !== null && entry[1] !== -1))
                .map((entry: Array<any>) => {
                    const [key, value] = entry;

                    if (typeof value === 'string') {
                        return `${key}=${value.replace(/\s/g, '%20')}`;
                    } else if (typeof value === "number" || typeof value === 'boolean') {
                        return `${key}=${value}`;
                    }

                    return '';
                })
                .filter((str: string) => str !== '')
                .join('&');

            return params;
        }

        return '';
    }
}
