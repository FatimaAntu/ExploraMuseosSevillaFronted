import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guarda de ruta para proteger rutas accesibles solo por usuarios con rol ADMIN.
 * Verifica si el usuario actual está autenticado y tiene el rol de administrador.
 * Si no cumple, redirige a la página de login.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    
    if (user && user.rol === 'ADMIN') {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirigir si no es admin
      return false;
    }
  }
}
