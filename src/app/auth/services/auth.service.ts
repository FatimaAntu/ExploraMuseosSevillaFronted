import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/login';  // Cambia esto por tu URL de backend

  constructor(private http: HttpClient) {}

  login(username: string, password: string, role: string): Observable<any> {
    const loginData = { username, password, role };
    return this.http.post<any>(this.apiUrl, loginData);
  }

  // Puedes agregar métodos para comprobar si el usuario está logueado o obtener el rol
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Ejemplo, usa el token si es necesario
  }
}
