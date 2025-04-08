import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.getCurrentUser(); // Método que obtienes del servicio para verificar si hay un usuario logueado.
    
    /*if (user) {
      // Verifica el rol del usuario y accede solo si es Admin o User según corresponda
      if (route.data['role'] && route.data['role'] !== user.rol) {
        this.router.navigate(['/home']); // Si el rol no coincide, redirige al home
        return false;
      }
      return true; // Si todo es correcto, permite el acceso
    }

    // Si no está logueado, redirige al login
    this.router.navigate(['/login']);
    return false;
  }*/
    if (user && user.rol === 'ADMIN') {
      return true; // El usuario tiene el rol adecuado
    } else {
      this.router.navigate(['/login']); // Si no es admin, redirigir al login
      return false;
    }
  }
}

