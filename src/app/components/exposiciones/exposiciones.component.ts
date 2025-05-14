import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';
import { ExposicionesService } from 'app/services/exposiciones.service';
import { Exposicion } from 'app/services/exposiciones.service';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { MuseoService } from 'app/services/museo.service';
import { Museo } from 'app/services/museo.service';

@Component({
  selector: 'app-exposiciones',
  standalone: true, 
  imports: [CommonModule, RouterModule, CardModule, ImageModule], 
  templateUrl: './exposiciones.component.html',
  styleUrls: ['./exposiciones.component.css']
  
  
})
export class ExposicionesComponent implements OnInit {
  museoId: number = 0;
  exposiciones: Exposicion[] = [];
   nombreMuseo: string = '';

  constructor(
    private route: ActivatedRoute,
    private exposicionesService: ExposicionesService,
      private museoService: MuseoService 
  ) {}

  ngOnInit(): void {
    // Obtén el ID del museo desde la URL
    this.museoId = Number(this.route.snapshot.paramMap.get('id'));
     // Cargar el nombre del museo
    this.cargarMuseo(this.museoId);
   
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
  
   cargarMuseo(museoId: number): void {
    this.museoService.getMuseoById(museoId).subscribe({
      next: museo => {
        this.nombreMuseo = museo.nombre; // Asignamos el nombre del museo
        console.log('Museo cargado:', museo);
      },
      error: err => console.error(err.message)
    });
  }
}

