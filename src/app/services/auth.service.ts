import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private currentUser: any = null; // Para almacenar el usuario logueado

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const payload: LoginPayload = { email, password };
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  register(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, {
      nombre,
      email,
      password
    });
  }
  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }

}
