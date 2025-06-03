import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guarda de ruta para proteger rutas que requieren autenticación.
 * Valida si el usuario está logueado y si su rol está autorizado para acceder a la ruta.
 * En caso contrario, redirige a la página de login o home según corresponda.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.getCurrentUser();  // Verifica si el usuario está logueado
    console.log('AuthGuard user:', user);  // <-- Añade aquí
    if (user) {
      const expectedRoles = route.data['roles']; // Obtiene los roles requeridos para la ruta

      if (expectedRoles && !expectedRoles.includes(user.rol)) {
        // Si el rol del usuario no es el esperado, redirige a home
        this.router.navigate(['/home']);
        return false;
      }

      return true;
    }

    // Si no hay usuario logueado, redirige al login
    this.router.navigate(['/login']);
    return false;
  }
}
