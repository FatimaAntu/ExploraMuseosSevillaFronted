import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExposicionesService {

  private apiUrl = 'https://api.example.com/exposiciones'; // Aquí iría tu URL de backend

  constructor(private http: HttpClient) { }

  // Método para obtener las exposiciones por museoId
  getExposicionesPorMuseo(museoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?museoId=${museoId}`);
  }
}
