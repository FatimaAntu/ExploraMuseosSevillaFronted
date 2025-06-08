import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';  
import { MuseoService } from './services/museo.service';
import { NavbarComponent } from "./components/navbar/navbar.component"; 
import { TableModule } from 'primeng/table';
import { FooterComponent } from './footer/footer.component';


/**
 * Interfaz que representa un museo.
 * 
 * @interface Museo
 */
interface Museo {
  /** Identificador único del museo */
  id: number;
  /** Nombre del museo */
  nombre: string;
  /** Descripción del museo */
  descripcion: string;
  /** URL o ruta de la imagen del museo */
  imagen: string;
}

/**
 * Componente principal de la aplicación.
 * 
 * @export
 * @class AppComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, TableModule, FooterComponent],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /** Array que contiene los museos obtenidos */
  museos: Museo[] = [];

  /**
   * Crea una instancia del componente.
   * 
   * @param {MuseoService} museoService Servicio para obtener museos
   * @memberof AppComponent
   */
  constructor(private museoService: MuseoService) {}

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Llama a la función para obtener los museos.
   * 
   * @memberof AppComponent
   */
  ngOnInit(): void {
    this.getMuseos();
  }

  /**
   * Obtiene la lista de museos desde el servicio y la asigna a la propiedad `museos`.
   * Maneja el éxito y error de la suscripción.
   * 
   * @memberof AppComponent
   */
  getMuseos(): void {
    this.museoService.getMuseos().subscribe(
      (data: Museo[]) => {
        this.museos = data;
        console.log('Museos obtenidos:', this.museos);
      },
      (error) => {
        console.error('Error al obtener museos:', error);
      }
    );
  }
}
