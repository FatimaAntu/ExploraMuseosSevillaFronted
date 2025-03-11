// src/app/museos/museos.component.ts
import { Component, inject } from '@angular/core';
import { MuseosService } from '../services/museos.service';
import { MuseosDTO } from '../models/museos.dto';


@Component({
  selector: 'app-museos',
  standalone: true,
  templateUrl: './museos.component.html',
  styleUrls: ['./museos.component.css']
})
export class MuseosComponent {

  museos: MuseosDTO[] = [];
  private museosService = inject(MuseosService);

  constructor() {
    this.loadMuseos();
  }

  // Cargar los museos desde el servicio
  loadMuseos() {
    this.museosService.getMuseos().subscribe({
      next: (data) => {
        this.museos = data;
      },
      error: (err) => {
        console.error('Error al cargar los museos', err);
      }
    });
  }

}

