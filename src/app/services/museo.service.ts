import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs'; // Para manejar errores

/**
 * Interfaz que representa un museo.
 * 
 * @export
 * @interface Museo
 */
export interface Museo {
  /** Identificador único del museo */
  id: number;
  /** Nombre del museo */
  nombre: string;
  /** Descripción del museo */
  descripcion: string;
  /** URL o ruta de la imagen representativa del museo */
  imagen: string;
}

/**
 * Servicio para gestionar museos mediante peticiones HTTP al backend.
 * Proporciona métodos CRUD para museos.
 * 
 * @export
 * @class MuseoService
 */
@Injectable({
  providedIn: 'root'
})
export class MuseoService {

  /** URL base de la API para museos */
  private apiUrl = 'http://localhost:8080/api/museos';  

  /**
   * Crea una instancia del servicio MuseoService.
   * 
   * @param {HttpClient} http Cliente HTTP para realizar las peticiones
   * @memberof MuseoService
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los museos disponibles.
   * 
   * @returns {Observable<Museo[]>} Observable con un array de museos
   * @memberof MuseoService
   */
  getMuseos(): Observable<Museo[]> {
    return this.http.get<Museo[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener museos:', error);
        return throwError(() => new Error('Error al obtener museos. Inténtalo nuevamente.'));
      })
    );
  }

  /**
   * Obtiene un museo por su ID.
   * 
   * @param {number} id Identificador del museo
   * @returns {Observable<Museo>} Observable con el museo solicitado
   * @memberof MuseoService
   */
  getMuseoById(id: number): Observable<Museo> {
    return this.http.get<Museo>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al obtener el museo con ID ${id}:`, error);
        return throwError(() => new Error('Error al obtener el museo. Inténtalo nuevamente.'));
      })
    );
  }

  /**
   * Crea un nuevo museo.
   * 
   * @param {Museo} museo Objeto museo a crear
   * @returns {Observable<number>} Observable con el ID generado del museo
   * @memberof MuseoService
   */
  createMuseo(museo: Museo): Observable<number> {
    return this.http.post<number>(this.apiUrl, museo).pipe(
      catchError(error => {
        console.error('Error al crear el museo:', error);
        return throwError(() => new Error('Error al crear el museo. Inténtalo nuevamente.'));
      })
    );
  }

  /**
   * Actualiza un museo existente por su ID.
   * 
   * @param {number} id ID del museo a actualizar
   * @param {Museo} museo Datos actualizados del museo
   * @returns {Observable<void>} Observable que completa la operación
   * @memberof MuseoService
   */
  updateMuseo(id: number, museo: Museo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, museo).pipe(
      catchError(error => {
        console.error(`Error al actualizar el museo con ID ${id}:`, error);
        return throwError(() => new Error('Error al actualizar el museo. Inténtalo nuevamente.'));
      })
    );
  }

  /**
   * Elimina un museo por su ID.
   * 
   * @param {number} id ID del museo a eliminar
   * @returns {Observable<void>} Observable que completa la operación
   * @memberof MuseoService
   */
  deleteMuseo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al eliminar el museo con ID ${id}:`, error);
        return throwError(() => new Error('Error al eliminar el museo. Inténtalo nuevamente.'));
      })
    );
  }
}
