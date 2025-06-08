import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interface para representar un mensaje de contacto recibido.
 */
export interface MensajeContacto {
  id: number;
  nombre: string;
  email: string;
  mensaje: string;
  fechaEnvio: string;
  respondido?: boolean; // añadido aquí correctamente
  respuesta?: string; // añadido aquí correctamente
}

/**
 * Interface para enviar un nuevo mensaje de contacto.
 */
export interface NuevoMensajeContacto {
  nombre: string;
  email: string;
  mensaje: string;
}

/**
 * Servicio para gestionar mensajes de contacto con el backend.
 */
@Injectable({ providedIn: 'root' })
export class ContactoService {
  private apiUrl = 'http://localhost:8080/api/contacto';

  constructor(private http: HttpClient) {}

  enviarMensaje(mensaje: NuevoMensajeContacto): Observable<any> {
    return this.http.post(this.apiUrl, mensaje);
  }

  obtenerMensajes(): Observable<MensajeContacto[]> {
    return this.http.get<MensajeContacto[]>(this.apiUrl);
  }

  responderMensaje(id: number, respuesta: string): Observable<MensajeContacto> {
  return this.http.put<MensajeContacto>(`${this.apiUrl}/responder/${id}`, { respuesta });
}

  
}