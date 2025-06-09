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
  exposicionId: string | null = null;
  exposicion: any;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;
  cantidad: number = 1;
  mostrarPaypal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private exposicionesService: ExposicionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.exposicionId = this.route.snapshot.paramMap.get('id');
    if (this.exposicionId) {
      this.obtenerExposicion();
    }
  }

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

  comprarEntrada(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const usuarioId = this.authService.getUsuarioId();

    if (usuarioId === null) {
      this.mensajeError = 'Error: No se pudo obtener el ID del usuario.';
      return;
    }

    if (this.cantidad < 1) {
      this.mensajeError = 'Debes seleccionar al menos una entrada.';
      return;
    }

    this.mensajeError = null;
    this.mostrarPaypal = true;

    setTimeout(() => {
      paypal.Buttons({
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (this.cantidad * this.exposicion.precio).toFixed(2)
              }
            }]
          });
        },
        onApprove: (_data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            this.mensajeExito = `🎉 ¡Gracias por tu compra, ${details.payer.name.given_name}! Revisa tu email.`;
            this.mostrarPaypal = false;

            const compra = {
              usuarioId: usuarioId,
              exposicionId: this.exposicion.id,
              cantidad: this.cantidad,
              totalPagado: this.cantidad * this.exposicion.precio
            };

            this.exposicionesService.guardarCompra(compra).subscribe({
              next: () => {
                console.log('Compra guardada con éxito');
              },
              error: (error) => {
                console.error('Error al guardar compra', error);
              }
            });

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
