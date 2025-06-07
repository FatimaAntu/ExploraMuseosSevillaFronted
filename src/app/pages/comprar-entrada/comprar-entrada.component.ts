import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ExposicionesService } from 'app/services/exposiciones.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var paypal: any;

@Component({
  selector: 'app-comprar-entrada',
  standalone: true,
  templateUrl: './comprar-entrada.component.html',
  styleUrls: ['./comprar-entrada.component.css'],
  imports: [CardModule, ButtonModule, MessageModule, CommonModule, FormsModule]
})
export class ComprarEntradaComponent implements OnInit {
  /**
   * ID de la exposición obtenida de la URL
   */
  exposicionId: string | null = null;

  /**
   * Datos de la exposición cargada desde el backend
   */
  exposicion: any;

  /**
   * Mensaje de error para mostrar al usuario
   */
  mensajeError: string | null = null;

  /**
   * Mensaje de éxito para mostrar al usuario tras la compra
   */
  mensajeExito: string | null = null;

  /**
   * Cantidad de entradas que desea comprar el usuario
   */
  cantidad: number = 1;

  /**
   * Indica si se debe mostrar el botón de PayPal
   */
  mostrarPaypal: boolean = false;

  /**
   * Constructor del componente
   * @param route Servicio para acceder a parámetros de la ruta activa
   * @param authService Servicio de autenticación para validar usuario
   * @param exposicionesService Servicio para obtener datos de exposiciones
   * @param router Servicio para navegación entre rutas
   */
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private exposicionesService: ExposicionesService,
    private router: Router
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Obtiene el ID de la exposición y carga sus datos.
   */
  ngOnInit(): void {
    this.exposicionId = this.route.snapshot.paramMap.get('id');
    if (this.exposicionId) {
      this.obtenerExposicion();
    }
  }

  /**
   * Solicita al backend los datos de la exposición por su ID.
   * Muestra mensaje de error si el ID es inválido o falla la petición.
   */
  obtenerExposicion(): void {
    const idNumber = Number(this.exposicionId);
    if (!isNaN(idNumber)) {
      this.exposicionesService.getExposicionById(idNumber).subscribe({
        next: (res) => {
          this.exposicion = res;
        },
        error: () => {
          this.mensajeError = 'No se pudo obtener la exposición';
        }
      });
    } else {
      this.mensajeError = 'ID de exposición no válido';
    }
  }

  /**
   * Inicia el proceso de compra de entradas.
   * Valida que el usuario esté autenticado y la cantidad sea correcta.
   * Muestra el botón de PayPal para proceder con el pago.
   */
  comprarEntrada(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.cantidad < 1) {
      this.mensajeError = 'Debes seleccionar al menos una entrada.';
      return;
    }

    this.mensajeError = null;
    this.mostrarPaypal = true;

    // Renderiza el botón PayPal tras pequeño retraso para asegurar que el div esté en el DOM
    setTimeout(() => {
      paypal.Buttons({
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (this.cantidad * this.exposicion.precio).toFixed(2) // Precio total
              }
            }]
          });
        },
        onApprove: (_data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            this.mensajeExito = `🎉 ¡Gracias por tu compra, ${details.payer.name.given_name}! Revisa tu email.`;
            this.mostrarPaypal = false;

            // Aquí se podría llamar al backend para guardar la compra

            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 4000);
          });
        },
        onError: (err: any) => {
          console.error('Error en el pago', err);
          this.mensajeError = 'Error al procesar el pago con PayPal.';
          this.mostrarPaypal = false;
        }
      }).render('#paypal-button-container');
    }, 100);
  }
  getImagenUrl(imagen?: string): string {
    if (!imagen) return 'assets/placeholder.jpg';
    return `http://localhost:8080/uploads/${imagen}`;
  }
}


