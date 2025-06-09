import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interfaz que representa una exposición.
 * 
 * @export
 * @interface Exposicion
 */
export interface Exposicion {
  /** Identificador único de la exposición */
  id: number;
  /** Nombre de la exposición */
  nombre: string;
  /** Descripción detallada de la exposición */
  descripcion: string;
  /** Fecha de inicio en formato ISO string */
  fechaInicio: string;
  /** Fecha de fin en formato ISO string */
  fechaFin: string;
  /** URL o path de la imagen destacada (opcional) */
  imagen?: string;
  /** Indica si la exposición es temporal (true) o permanente (false) */
  esTemporal: boolean;
  /** Museo al que pertenece la exposición */
  museo: {
    /** ID del museo */
    id: number;
    /** Nombre del museo */
    nombre: string;
  };
  /** Precio de la entrada para la exposición */
  precio: number;
}

/**
 * Servicio para gestionar exposiciones mediante llamadas HTTP al backend.
 * Proporciona métodos para CRUD y consultas específicas.
 * 
 * @export
 * @class ExposicionesService
 */
@Injectable({
  providedIn: 'root',
})
export class ExposicionesService {
  /** URL base de la API de exposiciones */
  private apiUrl = 'http://localhost:8080/api/exposiciones';

  /**
   * Crea una instancia de ExposicionesService.
   * 
   * @param {HttpClient} http Cliente HTTP para realizar peticiones REST
   * @memberof ExposicionesService
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las exposiciones disponibles.
   * 
   * @returns {Observable<Exposicion[]>} Observable con un array de exposiciones
   * @memberof ExposicionesService
   */
  getExposiciones(): Observable<Exposicion[]> {
    return this.http.get<Exposicion[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener exposiciones:', error);
        return throwError(() => new Error('Error al obtener exposiciones'));
      })
    );
  }

  /**
   * Obtiene las exposiciones filtradas por el ID del museo.
   * 
   * @param {number} museoId Identificador del museo para filtrar exposiciones
   * @returns {Observable<Exposicion[]>} Observable con las exposiciones del museo
   * @memberof ExposicionesService
   */
  getExposicionesPorMuseo(museoId: number): Observable<Exposicion[]> {
    return this.http.get<Exposicion[]>(`${this.apiUrl}/museo/${museoId}`).pipe(
      catchError(error => {
        console.error('Error al obtener exposiciones del museo:', error);
        return throwError(() => new Error('Error al obtener exposiciones por museo'));
      })
    );
  }

  /**
   * Crea una nueva exposición enviando un FormData,
   * que puede incluir imagen y demás campos.
   * No se especifica Content-Type para que el navegador lo maneje.
   * 
   * @param {FormData} exposicionFormData Datos de la exposición a crear
   * @returns {Observable<any>} Observable con la respuesta del backend
   * @memberof ExposicionesService
   */
  createExposicion(exposicionFormData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, exposicionFormData).pipe(
      catchError(error => {
        console.error('Error al crear exposición:', error);
        return throwError(() => new Error('Error al crear exposición'));
      })
    );
  }

  /**
   * Actualiza una exposición existente por su ID, enviando FormData.
   * 
   * @param {number} id Identificador de la exposición a actualizar
   * @param {FormData} exposicionFormData Datos actualizados de la exposición
   * @returns {Observable<any>} Observable con la respuesta del backend
   * @memberof ExposicionesService
   */
  updateExposicion(id: number, exposicionFormData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, exposicionFormData).pipe(
      catchError(error => {
        console.error('Error al actualizar exposición:', error);
        return throwError(() => new Error('Error al actualizar exposición'));
      })
    );
  }

  /**
   * Elimina una exposición por su ID.
   * 
   * @param {number} id Identificador de la exposición a eliminar
   * @returns {Observable<void>} Observable que completa la operación
   * @memberof ExposicionesService
   */
  deleteExposicion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al eliminar exposición con ID ${id}:`, error);
        return throwError(() => new Error('Error al eliminar exposición'));
      })
    );
  }

  /**
   * Obtiene una exposición específica por su ID.
   * 
   * @param {number} id Identificador de la exposición
   * @returns {Observable<Exposicion>} Observable con la exposición solicitada
   * @memberof ExposicionesService
   */
  getExposicionById(id: number): Observable<Exposicion> {
    return this.http.get<Exposicion>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener la exposición:', error);
        return throwError(() => new Error('Error al obtener la exposición'));
      })
    );
  }

  /**
   * Archivo de imagen seleccionado para subir en el formulario.
   * 
   * @type {(File | null)}
   * @memberof ExposicionesService
   */
  selectedImage: File | null = null;

  /**
   * Controlador para el evento de cambio de archivo,
   * guarda el archivo seleccionado en `selectedImage`.
   * 
   * @param {*} event Evento del input file
   * @memberof ExposicionesService
   */
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

   guardarCompra(compra: { usuarioId: number, exposicionId: number, cantidad: number, totalPagado: number }): Observable<any> {
    // Cambia esta URL al endpoint real de tu backend para guardar compras
    return this.http.post('http://localhost:8080/api/entradas/comprar', compra);
  }
}