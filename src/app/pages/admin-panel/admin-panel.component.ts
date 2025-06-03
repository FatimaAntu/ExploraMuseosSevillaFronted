import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class AdminPanelComponent implements OnInit {
  /**
   * Indica si el usuario actual tiene rol de administrador
   */
  isAdmin: boolean = false;

  /**
   * Constructor del componente AdminPanelComponent
   * @param authService Servicio de autenticación para obtener datos del usuario actual
   */
  constructor(private authService: AuthService) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Verifica si el usuario autenticado tiene rol de administrador.
   */
  ngOnInit() {
    // Verifica si el usuario tiene rol ADMIN
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser && currentUser.rol === 'ADMIN';
  }
   scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
}
