import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  enviarMensaje(form: NgForm) {
    this.formSubmitAttempt = true;

    if (form.valid) {
      this.enviando = true;

      // Simular envío
      setTimeout(() => {
        this.mensajeEnviado = true;
        this.enviando = false;

        this.nombre = '';
        this.email = '';
        this.mensaje = '';

        form.resetForm();
        this.formSubmitAttempt = false;

        setTimeout(() => (this.mensajeEnviado = false), 3000);
      }, 1500);
    }
  }
}
