import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  // Observable reactivo del usuario actual
  private usuarioSubject = new BehaviorSubject<any | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Método para login
  login(email: string, password: string): Observable<any> {
    const payload: LoginPayload = { email, password };
    return this.http.post(`${this.baseUrl}/login`, payload).pipe(
      tap(user => {
        this.setCurrentUser(user);
      })
    );
  }

  // Método para registro de usuarios
  register(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { nombre, email, password });
  }

  // Guardar el usuario logueado y notificar a los observadores
  setCurrentUser(user: any) {
    this.usuarioSubject.next(user);
  }

  // Obtener el usuario actual directamente (no observable)
  getCurrentUser() {
    return this.usuarioSubject.value;
  }

  // Método para logout
  logout() {
    this.usuarioSubject.next(null);
  }
}
