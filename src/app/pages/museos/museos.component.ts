import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-museos',
  templateUrl: './museos.component.html',
  styleUrls: ['./museos.component.css'],
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para usar *ngFor y otras directivas comunes
})
export class MuseosComponent {
  museos = [
    { nombre: 'Museo 1', descripcion: 'Descripción del museo 1', direccion: 'Dirección del museo 1' },
    { nombre: 'Museo 2', descripcion: 'Descripción del museo 2', direccion: 'Dirección del museo 2' },
    { nombre: 'Museo 3', descripcion: 'Descripción del museo 3', direccion: 'Dirección del museo 3' },
  ];
}

