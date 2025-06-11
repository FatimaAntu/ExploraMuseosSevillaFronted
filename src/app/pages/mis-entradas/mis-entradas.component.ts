import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../../services/entrada.service';
import { Entrada } from '../../models/entrada.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Servicio para obtener info del usuario logueado

/**
 * Componente que muestra las entradas compradas por el usuario actualmente autenticado.
 */
@Component({
  selector: 'app-mis-entradas',
  templateUrl: './mis-entradas.component.html',
  styleUrls: ['./mis-entradas.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MisEntradasComponent implements OnInit {

  /** Array que almacena las entradas del usuario */
  entradas: Entrada[] = [];

  /** ID del usuario actualmente autenticado */
  usuarioId: number | null = null;

  /**
   * Constructor con inyección de servicios necesarios.
   * @param entradasService Servicio para obtener las entradas
   * @param authService Servicio para obtener info del usuario logueado
   */
  constructor(
    private entradasService: EntradasService,
    private authService: AuthService
  ) { }

  /**
   * Método del ciclo de vida Angular.
   * Obtiene el ID del usuario autenticado y carga sus entradas.
   */
  ngOnInit(): void {
    // Obtener ID del usuario logueado
    this.usuarioId = this.authService.getUsuarioId();

    if (this.usuarioId) {
      // Consultar las entradas del usuario desde el backend
      this.entradasService.getEntradasPorUsuario(this.usuarioId).subscribe({
        next: (entrada) => this.entradas = entrada,
        error: (err) => console.error('Error al cargar entradas:', err)
      });
    } else {
      console.warn('Usuario no logueado');
    }
  }
}
