import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaz que representa un usuario.
 * 
 * @export
 * @interface Usuario
 */
export interface Usuario {
  /** Identificador único del usuario */
  id: number;
  /** Nombre completo del usuario */
  nombre: string;
  /** Email del usuario */
  email: string;
}

/**
 * Servicio para gestionar usuarios mediante peticiones HTTP al backend.
 * Proporciona métodos CRUD para usuarios.
 * 
 * @export
 * @class UsuariosService
 */
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  /** URL base de la API para usuarios */
  private apiUrl = 'http://localhost:8080/api/usuarios';

  /**
   * Crea una instancia del servicio UsuariosService.
   * 
   * @param {HttpClient} http Cliente HTTP para realizar las peticiones
   * @memberof UsuariosService
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los usuarios.
   * 
   * @returns {Observable<Usuario[]>} Observable con un array de usuarios
   * @memberof UsuariosService
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /**
   * Crea un nuevo usuario.
   * 
   * @param {Usuario} usuario Objeto usuario a crear
   * @returns {Observable<number>} Observable con el ID generado del usuario
   * @memberof UsuariosService
   */
  createUsuario(usuario: Usuario): Observable<number> {
    return this.http.post<number>(this.apiUrl, usuario);
  }

  /**
   * Actualiza un usuario existente por su ID.
   * 
   * @param {number} id ID del usuario a actualizar
   * @param {Usuario} usuario Datos actualizados del usuario
   * @returns {Observable<void>} Observable que completa la operación
   * @memberof UsuariosService
   */
  updateUsuario(id: number, usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, usuario);
  }

  /**
   * Elimina un usuario por su ID.
   * 
   * @param {number} id ID del usuario a eliminar
   * @returns {Observable<void>} Observable que completa la operación
   * @memberof UsuariosService
   */
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
