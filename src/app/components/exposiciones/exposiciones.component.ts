import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';
import { ExposicionesService, Exposicion } from 'app/services/exposiciones.service';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { MuseoService, Museo } from 'app/services/museo.service';

/**
 * Componente ExposicionesComponent
 * 
 * Muestra la lista de exposiciones de un museo específico.
 * Obtiene el ID del museo desde la URL y carga sus exposiciones.
 * También carga y muestra el nombre del museo.
 * Utiliza PrimeNG para mostrar las exposiciones en tarjetas con imágenes.
 * 
 * @standalone
 * @selector app-exposiciones
 * @imports CommonModule, RouterModule, CardModule, ImageModule
 */
@Component({
  selector: 'app-exposiciones',
  standalone: true, 
  imports: [CommonModule, RouterModule, CardModule, ImageModule], 
  templateUrl: './exposiciones.component.html',
  styleUrls: ['./exposiciones.component.css']
})
export class ExposicionesComponent implements OnInit {
  /** ID del museo obtenido de la URL */
  museoId: number = 0;

  /** Lista de exposiciones del museo */
  exposiciones: Exposicion[] = [];

  /** Nombre del museo para mostrar en la interfaz */
  nombreMuseo: string = '';

  /**
   * Constructor del componente
   * 
   * @param route Para acceder a parámetros de la ruta activa (museoId)
   * @param exposicionesService Servicio para obtener datos de exposiciones
   * @param museoService Servicio para obtener datos de museos
   */
  constructor(
    private route: ActivatedRoute,
    private exposicionesService: ExposicionesService,
    private museoService: MuseoService 
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente
   * Obtiene el ID del museo de la URL, carga las exposiciones y el nombre del museo
   */
  ngOnInit(): void {
    this.museoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarMuseo(this.museoId);
    this.cargarExposiciones(this.museoId);
  }

  /**
   * Carga las exposiciones del museo mediante el servicio de exposiciones
   * @param museoId ID del museo para filtrar las exposiciones
   */
  cargarExposiciones(museoId: number): void {
    this.exposicionesService.getExposicionesPorMuseo(museoId).subscribe({
      next: expos => {
        this.exposiciones = expos;
        console.log('Exposiciones cargadas:', expos);
      },
      error: err => console.error(err.message)
    });
  }
  
  /**
   * Carga el museo por ID para obtener su nombre mediante el servicio de museos
   * @param museoId ID del museo a cargar
   */
  cargarMuseo(museoId: number): void {
    this.museoService.getMuseoById(museoId).subscribe({
      next: museo => {
        this.nombreMuseo = museo.nombre;
        console.log('Museo cargado:', museo);
      },
      error: err => console.error(err.message)
    });
  }
}
