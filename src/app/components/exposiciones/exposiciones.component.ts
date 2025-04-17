import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';
import { ExposicionesService } from 'app/services/exposiciones.service';
import { Exposicion } from 'app/services/exposiciones.service';

@Component({
  selector: 'app-exposiciones',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './exposiciones.component.html',
  styleUrls: ['./exposiciones.component.css']
  
})
export class ExposicionesComponent implements OnInit {
  museoId: number = 0;
  exposiciones: Exposicion[] = [];

  constructor(
    private route: ActivatedRoute,
    private exposicionesService: ExposicionesService
  ) {}

  ngOnInit(): void {
    // Obtén el ID del museo desde la URL
    this.museoId = Number(this.route.snapshot.paramMap.get('id'));
    //console.log('Museo ID recibido:', this.museoId); // Verifica si se recibe correctamente el ID
    this.cargarExposiciones(this.museoId);
  }

  cargarExposiciones(museoId: number): void {
    this.exposicionesService.getExposicionesPorMuseo(museoId).subscribe({
      next: expos => {
        this.exposiciones = expos;
        console.log('Exposiciones cargadas:', expos);
      },
      error: err => console.error(err.message)
    });
  }
}

