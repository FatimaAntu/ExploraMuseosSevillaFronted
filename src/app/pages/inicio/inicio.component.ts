import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ExposicionesService } from '../../services/exposiciones.service';

/**
 * Componente que representa la página de inicio de la aplicación.
 * Muestra un carrusel con museos destacados y una selección filtrada
 * de exposiciones actuales, con opciones para comprar entradas o ver detalles.
 * 
 * Utiliza servicios para autenticación y obtención de exposiciones.
 * Incluye lógica para mostrar botones de compra solo si el usuario está autenticado.
 */
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  /**
   * Lista estática de museos destacados con nombre, descripción e imagen.
   */
  museos = [
    { id: 1, nombre: 'Museo de Bellas Artes', descripcion: 'Colección de arte moderno.', imagen: 'museoBellasArtes.jpg' },
    { id: 2, nombre: 'Centro Andaluz de Arte Contemporáneo CAAC', descripcion: 'Colección de pintura renacentista.', imagen: 'caac.jpeg' },
    { id: 3, nombre: 'Casa Pilatos', descripcion: 'Historia antigua de Sevilla.', imagen: 'casaPilatos.jpg' },
    { id: 4, nombre: 'Museo Arqueológico', descripcion: 'Historia antigua y arqueología.', imagen: 'museoArqueologico.jpg' },
    { id: 5, nombre: 'Museo de Artes y Costumbres Populares', descripcion: 'Cultura y tradiciones.', imagen: 'museoArtesCostumbres.jpeg' },
    { id: 6, nombre: 'Archivo de Indias', descripcion: 'Documentos históricos de América.', imagen: 'archivoIndias.jpg' }
  ];

  /**
   * Opciones responsivas para el carrusel, definiendo visibilidad y scroll según ancho de pantalla.
   */
  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 }
  ];

  /**
   * Array dinámico que almacena las exposiciones obtenidas del backend.
   */
  exposiciones: any[] = [];

  /**
   * Constructor con inyección de dependencias para Router, servicios de autenticación y exposiciones.
   * @param router Servicio para navegación entre rutas
   * @param authService Servicio para gestión de autenticación y estado del usuario
   * @param exposicionesService Servicio para obtener datos de exposiciones desde backend
   */
  constructor(
    private router: Router,
    public authService: AuthService,
    private exposicionesService: ExposicionesService
  ) {}

  /**
   * Método del ciclo de vida OnInit que carga las exposiciones al iniciar el componente.
   */
  ngOnInit() {
    this.cargarExposiciones();
  }

  /**
   * Solicita al servicio las exposiciones y las almacena en la propiedad local.
   */
  cargarExposiciones() {
    this.exposicionesService.getExposiciones().subscribe(exposiciones => {
      this.exposiciones = exposiciones;
    });
  }

  /**
   * Obtiene las exposiciones filtradas para mostrar solo las que están activas
   * dentro de un rango de fecha desde hoy hasta 20 días adelante.
   * Devuelve un máximo de 4 exposiciones para mostrar.
   */
  get exposicionesFiltradas() {
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + 20);

    return this.exposiciones
      .filter(exp =>
        (new Date(exp.fechaInicio) >= hoy && new Date(exp.fechaInicio) <= fechaLimite) ||
        (new Date(exp.fechaFin) >= hoy && new Date(exp.fechaFin) <= fechaLimite)
      )
      .slice(0, 4);
  }

  /**
   * Método para comprobar si el usuario está autenticado.
   * @returns true si el usuario está logueado, false en caso contrario.
   */
  estaLogueado(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Navega a la ruta de compra de entrada para la exposición dada.
   * Si el usuario no está autenticado, lo redirige al registro y guarda la compra pendiente.
   * @param exposicionId Identificador de la exposición para la compra
   */
  comprarEntrada(exposicionId: number) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/comprar-entrada', exposicionId]);
    } else {
      localStorage.setItem('entradaPendiente', exposicionId.toString());
      this.router.navigate(['/register']);
    }
  }

  /**
   * Navega a la página con las exposiciones de un museo específico.
   * @param museoId Identificador del museo
   */
  verExposiciones(museoId: number): void {
    this.router.navigate([`/exposiciones/${museoId}`]);
  }

  /**
   * Abre una nueva pestaña con la búsqueda del museo en Google Maps.
   * @param nombreMuseo Nombre del museo para búsqueda en Maps
   */
  abrirEnGoogleMaps(nombreMuseo: string): void {
    const query = encodeURIComponent(nombreMuseo + ' Sevilla');
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  }

  /**
   * Obtiene la URL completa de la imagen del museo o un placeholder si no existe.
   * @param imagen Nombre del archivo de imagen
   * @returns URL absoluta de la imagen para mostrar en la interfaz
   */
  getImagenUrl(imagen?: string): string {
    if (!imagen) return 'assets/placeholder.jpg';
    return `http://localhost:8080/uploads/${imagen}`;
  }
}
