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

  /** ID del museo obtenido desde la ruta */
  museoId: number = 0;

  /** Lista de exposiciones del museo */
  exposiciones: Exposicion[] = [];

  /** Nombre del museo */
  nombreMuseo: string = '';

  /** Controla la visibilidad del cuadro de diálogo para autenticación */
  displayAuthPrompt: boolean = false;

  /** Guarda la exposición seleccionada si el usuario no está autenticado */
  pendingExpoId: number | null = null;
 
  /**
   * Constructor del componente.
   * 
   * @param route Servicio para acceder a los parámetros de la ruta.
   * @param exposicionesService Servicio para obtener exposiciones del museo.
   * @param museoService Servicio para obtener los datos del museo.
   * @param router Servicio para navegación programática.
   * @param authService Servicio de autenticación.
   */
  constructor(
    private route: ActivatedRoute,
    private exposicionesService: ExposicionesService,
    private museoService: MuseoService,
    private router: Router,
    private authService: AuthService ,
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Obtiene el ID del museo de la ruta y carga sus datos.
   */
  ngOnInit(): void {
    this.museoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarMuseo(this.museoId);
    this.cargarExposiciones(this.museoId);
  }

  /**
   * Carga las exposiciones asociadas al museo.
   * 
   * @param museoId ID del museo
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
   * Carga la información del museo.
   * 
   * @param museoId ID del museo
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

  /**
   * Comprueba si el usuario está logueado.
   * 
   * @returns true si está autenticado, false si no.
   */
  estaLogueado(): boolean {
    return this.authService.isAuthenticated(); 
  }

  /**
   * Gestiona el flujo de compra de entradas.
   * Si el usuario está autenticado, navega a la página de compra.
   * Si no está autenticado, abre el cuadro de diálogo de autenticación.
   * 
   * @param exposicionId ID de la exposición seleccionada.
   */
  comprarEntrada(exposicionId: number) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/comprar-entrada', exposicionId]);
    } else {
      this.pendingExpoId = exposicionId;
      this.displayAuthPrompt = true;
    }
  }

  /**
   * Redirige al formulario de registro.
   * Guarda la exposición pendiente para después de registrarse.
   */
  irRegistro() {
    if (this.pendingExpoId !== null) {
      this.authService.setRedirectExposicionId(this.pendingExpoId);
    }
    this.displayAuthPrompt = false;
    this.router.navigate(['/register']);
  }

  /**
   * Redirige al formulario de login.
   * Guarda la exposición pendiente para después de loguearse.
   */
  irLogin() {
    if (this.pendingExpoId !== null) {
      this.authService.setRedirectExposicionId(this.pendingExpoId);
    }
    this.displayAuthPrompt = false;
    this.router.navigate(['/login']);
  }

  /**
   * Cierra el cuadro de diálogo de autenticación.
   */
  handleDialogClose(): void {
    this.displayAuthPrompt = false;
  }
}
