import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';
import { ExposicionesService, Exposicion } from 'app/services/exposiciones.service';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { MuseoService } from 'app/services/museo.service';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from 'app/services/auth.service'; 

@Component({
  selector: 'app-exposiciones',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ImageModule, DialogModule],
  templateUrl: './exposiciones.component.html',
  styleUrls: ['./exposiciones.component.css'],
  
})
export class ExposicionesComponent implements OnInit {
  museoId: number = 0;
  exposiciones: Exposicion[] = [];
  nombreMuseo: string = '';
  displayAuthPrompt: boolean = false;
  pendingExpoId: number | null = null;
 
  constructor(
    private route: ActivatedRoute,
    private exposicionesService: ExposicionesService,
    private museoService: MuseoService,
    private router: Router,
    private authService: AuthService ,
  ) {}

  ngOnInit(): void {
    this.museoId = Number(this.route.snapshot.paramMap.get('id'));
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
        this.nombreMuseo = museo.nombre;
        console.log('Museo cargado:', museo);
      },
      error: err => console.error(err.message)
    });
  }

  estaLogueado(): boolean {
    return this.authService.isAuthenticated(); 
  }

  comprarEntrada(exposicionId: number) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/comprar-entrada', exposicionId]);
    } else {
      this.pendingExpoId = exposicionId;
      this.displayAuthPrompt = true;
    }
  }
irRegistro() {
  if (this.pendingExpoId !== null) {
    this.authService.setRedirectExposicionId(this.pendingExpoId);
  }
  this.displayAuthPrompt = false;
  this.router.navigate(['/register']);
}

irLogin() {
  if (this.pendingExpoId !== null) {
    this.authService.setRedirectExposicionId(this.pendingExpoId);
  }
  this.displayAuthPrompt = false;
  this.router.navigate(['/login']);
}
    handleDialogClose(): void {
  this.displayAuthPrompt = false;
}
}
