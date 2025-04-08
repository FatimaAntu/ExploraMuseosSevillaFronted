/*import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {



}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor y otras directivas básicas de Angular

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule], // Solo importa CommonModule
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  museos = [
    { id: 1, nombre: 'Museo de Bellas Artes', descripcion: 'Colección de arte moderno.', imagen: 'museoBellasArtes.jpg' },
    { id: 2, nombre: 'Centro Andaluz de Arte Contemporáneo CAAC', descripcion: 'Colección de pintura renacentista.', imagen: 'caac.jpeg' },
    { id: 3, nombre: 'Casa Pilatos', descripcion: 'Historia antigua de Sevilla.', imagen: 'casaPilatos.jpg' },
    { id: 4, nombre: 'Museo Arqueológico', descripcion: 'Historia antigua y arqueología.', imagen: 'museoArqueologico.jpg' },
    { id: 5, nombre: 'Museo de Artes y Costumbres Populares', descripcion: 'Cultura y tradiciones.', imagen: 'museoArtesCostumbres.jpeg' },
    { id: 6, nombre: 'Archivo de Indias', descripcion: 'Documentos históricos de América.', imagen: 'archivoIndias.jpg' }
  ];

  constructor(private router: Router) {}

  verExposiciones(museoId: number) {
    this.router.navigate(['/exposiciones', museoId]);
  }
}*/

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  museos = [
    { id: 1, nombre: 'Museo de Bellas Artes', descripcion: 'Colección de arte moderno.', imagen: 'museoBellasArtes.jpg' },
    { id: 2, nombre: 'Centro Andaluz de Arte Contemporáneo CAAC', descripcion: 'Colección de pintura renacentista.', imagen: 'caac.jpeg' },
    { id: 3, nombre: 'Casa Pilatos', descripcion: 'Historia antigua de Sevilla.', imagen: 'casaPilatos.jpg' },
    { id: 4, nombre: 'Museo Arqueológico', descripcion: 'Historia antigua y arqueología.', imagen: 'museoArqueologico.jpg' },
    { id: 5, nombre: 'Museo de Artes y Costumbres Populares', descripcion: 'Cultura y tradiciones.', imagen: 'museoArtesCostumbres.jpeg' },
    { id: 6, nombre: 'Archivo de Indias', descripcion: 'Documentos históricos de América.', imagen: 'archivoIndias.jpg' }
  ];

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 }
  ];

  constructor(private router: Router) {}

  verExposiciones(museoId: number) {
    console.log('Navegando a las exposiciones del museo con ID:', museoId); // Verificación en la consola
    this.router.navigate(['/exposiciones', museoId]); // Redirige a las exposiciones con el ID
  }

  exposiciones = [
    {
      id: 1,
      titulo: 'Exposición de Pintura Moderna',
      museo: 'Museo de Bellas Artes',
      imagen: 'public/exposiciones/museoBellasArtes/baile por bulerias.jpg',
      fechaInicio: new Date('2025-04-01'),
      fechaFin: new Date('2025-04-30'),
    },
    {
      id: 2,
      titulo: 'Arte Contemporáneo Internacional',
      museo: 'Centro Andaluz de Arte Contemporáneo',
      imagen: 'exposicion2.jpg',
      fechaInicio: new Date('2025-04-01'),
      fechaFin: new Date('2025-05-15'),
    },
    {
      id: 3,
      titulo: 'Escultura y Modernidad',
      museo: 'Museo Arqueológico',
      imagen: 'exposicion3.jpg',
      fechaInicio: new Date('2025-05-01'),
      fechaFin: new Date('2025-06-30'),
    }
  ];
  
  get exposicionesFiltradas() {
    const hoy = new Date();
    return this.exposiciones.filter(exp => hoy >= exp.fechaInicio && hoy <= exp.fechaFin);
  }
  
  comprarEntrada(id: number) {
    console.log('Comprar entrada para exposición ID:', id);
    // Aquí podrías redirigir o abrir un modal, etc.
  }
  
  verMas(id: number) {
    this.router.navigate(['/exposicion', id]);
  }
  
}


