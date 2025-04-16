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
    const user = this.authService.getCurrentUser();  // Verifica si el usuario está logueado

    if (user) {
      const expectedRoles = route.data['roles']; 
  
      if (expectedRoles && !expectedRoles.includes(user.rol)) {
        this.router.navigate(['/home']);
        return false;
      }
  
      return true;
    }
  
    this.router.navigate(['/login']);
    return false;
  }
}
