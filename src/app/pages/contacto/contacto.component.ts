import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ContactoComponent {
  /** Nombre del usuario que envía el mensaje */
  nombre = '';

  /** Email del usuario que envía el mensaje */
  email = '';

  /** Mensaje escrito por el usuario */
  mensaje = '';

  /** Indica si el mensaje fue enviado correctamente */
  mensajeEnviado = false;

  /** Indica si el mensaje se está enviando (loading) */
  enviando = false;

  /** Indica si se ha intentado enviar el formulario (para mostrar validaciones) */
  formSubmitAttempt = false;

  /** Referencia al formulario para control y reseteo */
  @ViewChild('form') form!: NgForm;

  /**
   * Constructor que inyecta el servicio para enviar mensajes
   * @param contactoService Servicio para enviar mensajes de contacto
   */
  constructor(private contactoService: ContactoService) {}

  /**
   * Método que se ejecuta al enviar el formulario
   * Valida los campos, envía el mensaje al backend y maneja la respuesta
   */
  enviarMensaje() {
    this.formSubmitAttempt = true;

    if (this.nombre && this.email && this.mensaje && this.validarEmail(this.email)) {
      this.enviando = true;

      const nuevoMensajeContacto = {
        nombre: this.nombre,
        email: this.email,
        mensaje: this.mensaje
      };

      this.contactoService.enviarMensaje(nuevoMensajeContacto).subscribe({
        next: () => {
          this.mensajeEnviado = true;

          // Limpiar campos
          this.nombre = '';
          this.email = '';
          this.mensaje = '';

          // Resetear formulario y validaciones
          this.form.resetForm();
          this.formSubmitAttempt = false;
        },
        error: (error) => {
          console.error('Error al enviar mensaje:', error);
        },
        complete: () => {
          this.enviando = false;

          // Ocultar mensaje de éxito después de 3 segundos
          setTimeout(() => {
            this.mensajeEnviado = false;
          }, 3000);
        }
      });
    }
  }

  /**
   * Valida que el formato del email sea correcto mediante expresión regular
   * @param email Email a validar
   * @returns true si el email es válido, false si no
   */
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
