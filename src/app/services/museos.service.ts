import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs'; // Para manejar errores

// Definir la estructura del museo directamente en este archivo
export interface Museo {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;  // La imagen puede ser una URL o un string con la ruta
}

@Injectable({
  providedIn: 'root'
})
export class MuseosService {

  // URL del backend 
  private apiUrl = 'http://localhost:8080/api/museos';  

  constructor(private http: HttpClient) { }

  // Obtener todos los museos
  getMuseos(): Observable<Museo[]> {
    return this.http.get<Museo[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener museos:', error);
        return throwError(() => new Error('Error al obtener museos. Inténtalo nuevamente.'));
      })
    );
  }

  // Obtener un museo por su ID
  getMuseoById(id: number): Observable<Museo> {
    return this.http.get<Museo>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al obtener el museo con ID ${id}:`, error);
        return throwError(() => new Error('Error al obtener el museo. Inténtalo nuevamente.'));
      })
    );
  }

  // Crear un nuevo museo
  createMuseo(museo: Museo): Observable<number> {
    return this.http.post<number>(this.apiUrl, museo).pipe(
      catchError(error => {
        console.error('Error al crear el museo:', error);
        return throwError(() => new Error('Error al crear el museo. Inténtalo nuevamente.'));
      })
    );
  }

  // Actualizar un museo existente
  updateMuseo(id: number, museo: Museo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, museo).pipe(
      catchError(error => {
        console.error(`Error al actualizar el museo con ID ${id}:`, error);
        return throwError(() => new Error('Error al actualizar el museo. Inténtalo nuevamente.'));
      })
    );
  }

  // Eliminar un museo por su ID
  deleteMuseo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al eliminar el museo con ID ${id}:`, error);
        return throwError(() => new Error('Error al eliminar el museo. Inténtalo nuevamente.'));
      })
    );
  }
}

