import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service'; 
import { Usuario } from '../../models/usuario.model'; 

/**
 * Componente NavbarComponent
 * 
 * Barra de navegación principal de la aplicación.
 * Muestra el estado de autenticación del usuario (logueado o no).
 * Permite cerrar sesión y navegar a la gestión administrativa.
 * 
 * @standalone
 * @selector app-navbar
 * @imports CommonModule, RouterModule, ButtonModule
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  /** Usuario actualmente autenticado o null si no hay sesión */
  usuario: Usuario | null = null;

  /**
   * Constructor del componente
   * 
   * @param authService Servicio para manejar autenticación y sesión
   * @param router Servicio para navegación entre rutas
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Inicializa el componente suscribiéndose al observable de usuario
   * para actualizar la variable local cada vez que cambie la sesión.
   */
  ngOnInit(): void {
    this.authService.usuario$.subscribe(user => {
      this.usuario = user;
    });
  }

  /**
   * Cierra la sesión del usuario y navega a la página principal.
   * Además, limpia la variable local que guarda el usuario.
   */
  logout(): void {
    this.authService.logout(); 
    this.usuario = null;
    this.router.navigate(['/']);
  }

  /**
   * Función que primero navega a la página de inicio y luego, tras un
   * pequeño retraso, redirige a la gestión de exposiciones (panel admin).
   * Esto permite que la navegación funcione correctamente en la SPA.
   */
  navigateToAdminDashboard(): void {
    this.router.navigate(['/home']);  // Redirige al inicio
    setTimeout(() => {
      this.router.navigate(['/admin/exposiciones']);  // Luego redirige a admin
    }, 300);
  }
}