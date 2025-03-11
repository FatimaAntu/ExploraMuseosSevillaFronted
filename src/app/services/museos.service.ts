import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MuseosDTO } from '../models/museos.dto';

@Injectable({
  providedIn: 'root'
})
export class MuseosService {

  // URL del backend 
  private apiUrl = 'http://localhost:8080/api/museos';  

  constructor(private http: HttpClient) { }

  // Obtener todos los museos
  getMuseos(): Observable<MuseosDTO[]> {
    return this.http.get<MuseosDTO[]>(`${this.apiUrl}`);
  }

  // Obtener un museo por su ID
  getMuseoById(id: number): Observable<MuseosDTO> {
    return this.http.get<MuseosDTO>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo museo
  createMuseo(museo: MuseosDTO): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}`, museo);
  }

  // Actualizar un museo existente
  updateMuseo(id: number, museo: MuseosDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, museo);
  }

  // Eliminar un museo por su ID
  deleteMuseo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

