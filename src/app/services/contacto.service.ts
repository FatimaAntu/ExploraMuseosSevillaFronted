import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interface para representar un mensaje de contacto recibido,
 * incluye el ID asignado por el backend.
 * 
 * @export
 * @interface MensajeContacto
 */
export interface MensajeContacto {
  /** Identificador único del mensaje */
  id: number;
  /** Nombre de la persona que envía el mensaje */
  nombre: string;
  /** Correo electrónico del remitente */
  email: string;
  /** Contenido del mensaje */
  mensaje: string;
  /** Fecha en que se envió el mensaje, formato ISO string */
  fechaEnvio: string;
}

/**
 * Interface para enviar un nuevo mensaje de contacto,
 * no incluye el ID porque lo genera el backend.
 * 
 * @export
 * @interface NuevoMensajeContacto
 */
export interface NuevoMensajeContacto {
  /** Nombre de la persona que envía el mensaje */
  nombre: string;
  /** Correo electrónico del remitente */
  email: string;
  /** Contenido del mensaje */
  mensaje: string;
}

/**
 * Servicio para gestionar mensajes de contacto con el backend.
 * Permite enviar nuevos mensajes y obtener los mensajes recibidos.
 * 
 * @export
 * @class ContactoService
 */
@Injectable({ providedIn: 'root' })
export class ContactoService {
  /** URL base de la API de mensajes de contacto */
  private apiUrl = 'http://localhost:8080/api/contacto';

  /**
   * Crea una instancia de ContactoService.
   * 
   * @param {HttpClient} http Cliente HTTP para realizar peticiones REST
   * @memberof ContactoService
   */
  constructor(private http: HttpClient) {}

  /**
   * Envía un nuevo mensaje de contacto al backend.
   * 
   * @param {NuevoMensajeContacto} mensaje Objeto con nombre, email y mensaje
   * @returns {Observable<any>} Observable con la respuesta del servidor
   * @memberof ContactoService
   */
  enviarMensaje(mensaje: NuevoMensajeContacto): Observable<any> {
    return this.http.post(this.apiUrl, mensaje);
  }

  /**
   * Obtiene la lista de mensajes de contacto recibidos.
   * 
   * @returns {Observable<MensajeContacto[]>} Observable con el array de mensajes
   * @memberof ContactoService
   */
  obtenerMensajes(): Observable<MensajeContacto[]> {
    return this.http.get<MensajeContacto[]>(this.apiUrl);
  }
}
