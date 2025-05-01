import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';

export interface Exposicion {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  imagen: string;
  esTemporal: boolean;
  museo: {
    id: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ExposicionesService {
  private apiUrl = 'http://localhost:8080/api/exposiciones';  // Asegúrate de que esta URL es correcta

  constructor(private http: HttpClient) {}

   // Obtener todas las exposiciones
  getExposiciones(): Observable<Exposicion[]> {
    return this.http.get<Exposicion[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener exposiciones:', error);
        return throwError(() => new Error('Error al obtener exposiciones. Inténtalo nuevamente.'));
      })
    );
  }

  // Obtener exposiciones por museo
  getExposicionesPorMuseo(museoId: number): Observable<Exposicion[]> {
    return this.http.get<Exposicion[]>(`${this.apiUrl}/museo/${museoId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener exposiciones del museo:', error);
        return throwError(() => new Error('Error al obtener exposiciones por museo.'));
      })
    );
  }
   // Crear una nueva exposición
   createExposicion(exposicion: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/exposiciones', exposicion);
  }

  // Actualizar una exposición
  updateExposicion(exposicion: any): Observable<any> {
    
    return this.http.post('http://localhost:8080/api/exposiciones', exposicion);
  }

  deleteExposicion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error al eliminar la exposición con ID ${id}:`, error);
        return throwError(() => new Error('Error al eliminar la exposición.'));
      })
    );
  }
}
