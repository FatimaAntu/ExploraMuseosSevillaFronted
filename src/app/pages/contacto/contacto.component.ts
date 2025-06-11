import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactoService, NuevoMensajeContacto } from '../../services/contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ContactoComponent {
  /**
   * Nombre del usuario que completa el formulario de contacto
   */
  nombre = '';

  /**
   * Email del usuario que completa el formulario de contacto
   */
  email = '';

  /**
   * Mensaje que el usuario quiere enviar a través del formulario de contacto
   */
  mensaje = '';

  /**
   * Indica si el mensaje fue enviado correctamente y se debe mostrar confirmación
   */
  mensajeEnviado = false;

  /**
   * Indica si se está procesando el envío del formulario
   */
  enviando = false;

  /**
   * Indica si se ha intentado enviar el formulario (usado para mostrar validaciones)
   */
  formSubmitAttempt = false;

  /**
   * Indica si ocurrió un error al intentar enviar el mensaje
   */
  errorEnvio = false;

  /**
   * Constructor que inyecta el servicio ContactoService para enviar mensajes
   * @param contactoService Servicio para enviar mensajes de contacto al backend
   */
  constructor(private contactoService: ContactoService) {}

  /**
   * Método que se ejecuta al enviar el formulario de contacto.
   * Valida el formulario, y si es válido, envía el mensaje al backend.
   * @param form Referencia al formulario NgForm para validación y reset
   */
  enviarMensaje(form: NgForm) {
    this.formSubmitAttempt = true; // Marcamos que hubo intento de envío
    this.errorEnvio = false;       // Reiniciamos el error

    if (form.valid) {
      this.enviando = true; // Indicamos que el envío está en curso

      // Construimos el objeto con los datos del mensaje
      const nuevoMensaje: NuevoMensajeContacto = {
        nombre: this.nombre,
        email: this.email,
        mensaje: this.mensaje,
      };

      // Llamamos al servicio para enviar el mensaje
      this.contactoService.enviarMensaje(nuevoMensaje).subscribe({
        next: () => {
          this.mensajeEnviado = true; // Mensaje enviado con éxito
          this.enviando = false;      // Terminó el proceso de envío

          // Limpiamos los campos del formulario
          this.nombre = '';
          this.email = '';
          this.mensaje = '';

          // Reseteamos el formulario y estado de intento
          form.resetForm();
          this.formSubmitAttempt = false;

          // Ocultamos el mensaje de éxito después de 3 segundos
          setTimeout(() => (this.mensajeEnviado = false), 3000);
        },
        error: () => {
          this.errorEnvio = true;  // Hubo un error en el envío
          this.enviando = false;   // Terminó el intento de envío
        }
      });
    }
  }
}
