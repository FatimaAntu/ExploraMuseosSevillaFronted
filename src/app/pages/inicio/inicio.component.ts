import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ExposicionesService } from '../../services/exposiciones.service'; // Asegúrate de importar tu servicio de exposiciones

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

  exposiciones: any[] = []; // Aquí llegarán tus exposiciones reales

  constructor(
    private router: Router,
    public authService: AuthService,
    private exposicionesService: ExposicionesService // Servicio para cargar exposiciones
  ) {}

  ngOnInit() {
    this.cargarExposiciones(); // Cargar las exposiciones desde el backend
  }

  cargarExposiciones() {
    this.exposicionesService.getExposiciones().subscribe(exposiciones => {
      this.exposiciones = exposiciones;
    });
  }

  get exposicionesFiltradas() {
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + 20);

    return this.exposiciones
      .filter(exp =>
        (new Date(exp.fechaInicio) >= hoy && new Date(exp.fechaInicio) <= fechaLimite) ||
        (new Date(exp.fechaFin) >= hoy && new Date(exp.fechaFin) <= fechaLimite)
      )
      .slice(0, 4); // Mostrar solo las primeras 4
  }

  estaLogueado(): boolean {
    return this.authService.isAuthenticated(); // Verifica si el usuario está autenticado
  }

  comprarEntrada(id: number) {
    if (this.estaLogueado()) {
      this.router.navigate(['/comprar', id]); // Navegar al formulario de compra de entradas
    }
  }

  // Método para ver las exposiciones de un museo
  verExposiciones(museoId: number): void {
    this.router.navigate([`/exposiciones/${museoId}`]); // Navegar a la página de exposiciones del museo
  }
}
