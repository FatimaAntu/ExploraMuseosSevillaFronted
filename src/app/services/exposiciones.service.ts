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
  imagen?: string;
  esTemporal: boolean;
  museo: {
    id: number;
    nombre: string;
  };
  precio: number; 
}

@Injectable({
  providedIn: 'root',
})
export class ExposicionesService {
  private apiUrl = 'http://localhost:8080/api/exposiciones';

  constructor(private http: HttpClient) {}

  getExposiciones(): Observable<Exposicion[]> {
    return this.http.get<Exposicion[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener exposiciones:', error);
        return throwError(() => new Error('Error al obtener exposiciones'));
      })
    );
  }

  getExposicionesPorMuseo(museoId: number): Observable<Exposicion[]> {
    return this.http.get<Exposicion[]>(`${this.apiUrl}/museo/${museoId}`).pipe(
      catchError(error => {
        console.error('Error al obtener exposiciones del museo:', error);
        return throwError(() => new Error('Error al obtener exposiciones por museo'));
      })
    );
  }

 createExposicion(exposicionFormData: FormData): Observable<any> {
  // No se establece Content-Type para que el navegador maneje multipart/form-data
  return this.http.post(this.apiUrl, exposicionFormData).pipe(
    catchError(error => {
      console.error('Error al crear exposición:', error);
      return throwError(() => new Error('Error al crear exposición'));
    })
  );
}

updateExposicion(id: number, exposicionFormData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, exposicionFormData).pipe(
    catchError(error => {
      console.error('Error al actualizar exposición:', error);
      return throwError(() => new Error('Error al actualizar exposición'));
    })
  );
}

  deleteExposicion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al eliminar exposición con ID ${id}:`, error);
        return throwError(() => new Error('Error al eliminar exposición'));
      })
    );
  }
  getExposicionById(id: number): Observable<Exposicion> {
    return this.http.get<Exposicion>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener la exposición:', error);
        return throwError(() => new Error('Error al obtener la exposición'));
      })
    );
  }
  
 
  selectedImage: File | null = null;

onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImage = file;
  }
}

  
  
}