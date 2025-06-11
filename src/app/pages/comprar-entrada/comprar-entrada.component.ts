import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ExposicionesService } from 'app/services/exposiciones.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

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
                this.generarPDFEntrada(); // Generar PDF tras guardar compra
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


  async convertirLogoABase64(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = path;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('No se pudo obtener el contexto');
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => reject(err);
  });
}

async generarPDFEntrada(): Promise<void> {
  const doc = new jsPDF();

  try {
    const logoBase64 = await this.convertirLogoABase64('logo.png'); // Cambia la ruta si es necesario
    doc.addImage(logoBase64, 'PNG', 20, 10, 40, 40);
  } catch (error) {
    console.error('No se pudo cargar el logo:', error);
    // Puedes decidir no hacer nada y continuar sin logo
  }

  // Título principal con fuente más grande y negrita
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Entrada ExploraMuseos Sevilla', 20, 60);

  // Línea separadora
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 65, 190, 65);

  // Datos de la entrada con fuente normal y tamaño medio
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // Datos en columnas para mejor lectura
  let posY = 80;
  const lineHeight = 8;

  doc.text(`Museo: ${this.exposicion.museo?.nombre}`, 20, posY);
  posY += lineHeight;
  doc.text(`Exposición: ${this.exposicion.nombre}`, 20, posY);
  posY += lineHeight;
  doc.text(`Fecha: ${this.exposicion.fechaInicio} - ${this.exposicion.fechaFin}`, 20, posY);
  posY += lineHeight;
  doc.text(`Cantidad: ${this.cantidad}`, 20, posY);
  posY += lineHeight;
  doc.text(`Precio Total: ${(this.exposicion.precio * this.cantidad).toFixed(2)} €`, 20, posY);
  posY += lineHeight;
  doc.text(`Fecha de compra: ${new Date().toLocaleDateString()}`, 20, posY);

  // Texto en color verde de confirmación
  doc.setTextColor(0, 128, 0);
  posY += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('¡Gracias por tu compra!', 20, posY);

  // Restaurar color negro para texto normal
  doc.setTextColor(0, 0, 0);

  // Guardar PDF
  doc.save(`entrada_${this.exposicion.nombre}.pdf`);
}
}
