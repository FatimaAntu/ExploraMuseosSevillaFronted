import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Servicio para la autenticación y gestión del usuario en sesión.
 * 
 * Proporciona métodos para login, registro, logout y gestión del estado
 * del usuario autenticado usando un BehaviorSubject para emitir cambios
 * reactivos.
 * 
 * @export
 * @class AuthService
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** URL base para las peticiones de autenticación */
  private baseUrl = 'http://localhost:8080/api/auth';

  /**
   * BehaviorSubject que mantiene el estado del usuario actual.
   * Se inicializa en `null` si no hay usuario autenticado.
   */
  private usuarioSubject = new BehaviorSubject<any | null>(null);

  /** Observable público para suscribirse a cambios en el usuario autenticado */
  public usuario$ = this.usuarioSubject.asObservable();

  /**
   * Crea una instancia de AuthService.
   * Intenta cargar el usuario almacenado en localStorage para mantener sesión.
   * 
   * @param {HttpClient} http Cliente HTTP para realizar peticiones al backend
   * @memberof AuthService
   */
  constructor(private http: HttpClient) {
    const user = localStorage.getItem('usuario');
    if (user) {
      this.usuarioSubject.next(JSON.parse(user));
    }
  }

  /**
   * Envía las credenciales al backend para iniciar sesión.
   * Si la autenticación es correcta, guarda el usuario y actualiza el estado.
   * 
   * @param {string} email Correo electrónico del usuario
   * @param {string} password Contraseña del usuario
   * @returns {Observable<any>} Observable con la respuesta del backend
   * @memberof AuthService
   */
  login(email: string, password: string): Observable<any> {
    const payload: LoginPayload = { email, password };
    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap(user => {
        this.setCurrentUser(user);
        localStorage.setItem('usuario', JSON.stringify(user));
      })
    );
  }

  /**
   * Envía los datos para registrar un nuevo usuario en el sistema.
   * 
   * @param {string} nombre Nombre completo del usuario
   * @param {string} email Correo electrónico del usuario
   * @param {string} password Contraseña para la cuenta
   * @returns {Observable<any>} Observable con la respuesta del backend
   * @memberof AuthService
   */
  register(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { nombre, email, password });
  }

  /**
   * Actualiza el usuario actual y emite el nuevo estado a los observadores.
   * 
   * @param {*} user Objeto usuario recibido desde el backend
   * @memberof AuthService
   */
  setCurrentUser(user: any) {
    this.usuarioSubject.next(user);
  }

  /**
   * Retorna el usuario autenticado actual (sin observables).
   * 
   * @returns {*} Usuario actual o null si no hay sesión iniciada
   * @memberof AuthService
   */
  getCurrentUser() {
    return this.usuarioSubject.value;
  }

  /**
   * Cierra la sesión del usuario y limpia el estado local.
   * 
   * @memberof AuthService
   */
  logout() {
    this.usuarioSubject.next(null);
    localStorage.removeItem('usuario');
  }

  /**
   * Indica si hay un usuario autenticado en el sistema.
   * 
   * @returns {boolean} true si existe un usuario autenticado, false si no
   * @memberof AuthService
   */
  isAuthenticated(): boolean {
    return this.usuarioSubject.value !== null;
  }
}
