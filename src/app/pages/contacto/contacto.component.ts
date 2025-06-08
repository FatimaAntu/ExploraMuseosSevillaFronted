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
  nombre = '';
  email = '';
  mensaje = '';

  mensajeEnviado = false;
  enviando = false;
  formSubmitAttempt = false;
  errorEnvio = false; // Para mostrar error en envío

  constructor(private contactoService: ContactoService) {}

  enviarMensaje(form: NgForm) {
    this.formSubmitAttempt = true;
    this.errorEnvio = false;

    if (form.valid) {
      this.enviando = true;

      const nuevoMensaje: NuevoMensajeContacto = {
        nombre: this.nombre,
        email: this.email,
        mensaje: this.mensaje,
      };

      this.contactoService.enviarMensaje(nuevoMensaje).subscribe({
        next: () => {
          this.mensajeEnviado = true;
          this.enviando = false;

          this.nombre = '';
          this.email = '';
          this.mensaje = '';

          form.resetForm();
          this.formSubmitAttempt = false;

          setTimeout(() => (this.mensajeEnviado = false), 3000);
        },
        error: () => {
          this.errorEnvio = true;
          this.enviando = false;
        }
      });
    }
  }
}
