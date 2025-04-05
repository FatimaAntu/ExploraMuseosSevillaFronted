import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definir la estructura del museo directamente en este archivo
export interface Museo {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
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
    return this.http.get<Museo[]>(this.apiUrl);
  }

  // Obtener un museo por su ID
  getMuseoById(id: number): Observable<Museo> {
    return this.http.get<Museo>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo museo
  createMuseo(museo: Museo): Observable<number> {
    return this.http.post<number>(this.apiUrl, museo);
  }

  // Actualizar un museo existente
  updateMuseo(id: number, museo: Museo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, museo);
  }

  // Eliminar un museo por su ID
  deleteMuseo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

