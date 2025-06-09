import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../services/entrada.service';
import { Entrada } from '../models/entrada.model';
import { CommonModule } from '@angular/common';

import { AuthService } from '../services/auth.service'; // o donde tengas la lógica del usuario

@Component({
  selector: 'app-mis-entradas',
  templateUrl: './mis-entradas.component.html',
  styleUrls: ['./mis-entradas.component.css'],
  standalone: true,
  imports: [CommonModule] 
})
export class MisEntradasComponent implements OnInit {
  entradas: Entrada[] = [];
  usuarioId: number | null = null;

  constructor(
    private entradasService: EntradasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.usuarioId = this.authService.getUsuarioId(); // método para obtener ID del usuario logueado

    if (this.usuarioId) {
      this.entradasService.getEntradasPorUsuario(this.usuarioId).subscribe({
        next: (entrada) => this.entradas = entrada,
        error: (err) => console.error('Error al cargar entradas:', err)
      });
    } else {
      console.warn('Usuario no logueado');
    }
  }
}
