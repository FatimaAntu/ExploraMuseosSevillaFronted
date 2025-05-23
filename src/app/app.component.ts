import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';  
import { MuseoService } from './services/museo.service';
import { NavbarComponent } from "./components/navbar/navbar.component"; 
import { TableModule } from 'primeng/table';

// Definimos la estructura de los museos sin `MuseosDTO`
interface Museo {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, TableModule],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  museos: Museo[] = []; // Ahora usamos la interfaz `Museo`

  constructor(private museoService: MuseoService) {}

  ngOnInit(): void {
    this.getMuseos();
  }

  getMuseos(): void {
    this.museoService.getMuseos().subscribe(
      (data: Museo[]) => {  // Aquí también usamos `Museo[]`
        this.museos = data;
        console.log('Museos obtenidos:', this.museos);
      },
      (error) => {
        console.error('Error al obtener museos:', error);
      }
    );
  }
}
