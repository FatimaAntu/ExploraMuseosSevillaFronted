import { Component, Input, OnInit } from '@angular/core';
import { ExposicionesService } from '../../services/exposiciones.service';
import { Exposicion } from '../../models/exposicion.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exposiciones-por-museo',
  templateUrl: './exposiciones-por-museo.component.html',
  styleUrls: ['./exposiciones-por-museo.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ExposicionesPorMuseoComponent implements OnInit {
  @Input() museoId!: number;  // ID del museo recibido como input
  exposiciones: Exposicion[] = [];  // Lista vacía inicialmente

  constructor(private exposicionesService: ExposicionesService) {}

  ngOnInit(): void {
    // Verificar que se ha recibido un museoId válido
    if (this.museoId) {
      // Llamamos al servicio para obtener las exposiciones de este museo
      this.exposicionesService.getExposicionesPorMuseo(this.museoId).subscribe({
        next: (data: Exposicion[]) => {
          this.exposiciones = data;  // Asignamos la respuesta a la variable exposiciones
        },
        error: (err) => {
          console.error('Error al cargar las exposiciones por museo', err);  // Manejo de errores
        },
      });
    }
  }
}
