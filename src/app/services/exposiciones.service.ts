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
}

@Injectable({
  providedIn: 'root'
})
export class ExposicionService {
  private apiUrl = 'http://localhost:8080/api/exposiciones';  // Asegúrate de que esta URL es correcta

  constructor(private http: HttpClient) {}

  getExposiciones(): Observable<Exposicion[]> {
    return this.http.get<Exposicion[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener exposiciones:', error);
        return throwError(() => new Error('Error al obtener exposiciones. Inténtalo nuevamente.'));
      })
    );
  }

  deleteExposicion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al eliminar la exposición con ID ${id}:`, error);
        return throwError(() => new Error('Error al eliminar la exposición.'));
      })
    );
  }
}
