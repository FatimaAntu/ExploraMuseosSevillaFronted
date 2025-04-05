import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exposiciones',
  templateUrl: './exposiciones.component.html',
  styleUrls: ['./exposiciones.component.css']
})
export class ExposicionesComponent implements OnInit {
  museoId: number = 0;
  exposiciones: any[] = [
    { id: 1, nombre: 'Exposición Permanente 1', tipo: 'Permanente' },
    { id: 2, nombre: 'Exposición Temporal 1', tipo: 'Temporal' },
    // Aquí puedes cargar las exposiciones reales desde un servicio.
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtén el ID del museo desde la URL
    this.museoId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Museo ID recibido:', this.museoId); // Verifica si se recibe correctamente el ID
    this.cargarExposiciones(this.museoId);
  }

  cargarExposiciones(museoId: number) {
    // Aquí puedes hacer una llamada HTTP para obtener las exposiciones desde tu backend.
    // Por ejemplo: this.exposiciones = this.museoService.getExposicionesPorMuseo(museoId);
    console.log(`Cargando exposiciones para el museo con ID: ${museoId}`);
  }
}

