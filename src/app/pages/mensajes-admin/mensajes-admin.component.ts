import { Component, OnInit } from '@angular/core';
import { ContactoService, MensajeContacto } from '../../services/contacto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MensajeConRespuestaTemporal extends MensajeContacto {
  respuesta?: string;
  respuestaTemporal: string;
  errorRespuesta?: string;  // Para mostrar error si no escribe nada
}

@Component({
  selector: 'app-mensajes-admin',
  templateUrl: './mensajes-admin.component.html',
  styleUrls: ['./mensajes-admin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MensajesAdminComponent implements OnInit {
  mensajes: MensajeConRespuestaTemporal[] = [];
  cargando = true;

  constructor(private contactoService: ContactoService) {}

  ngOnInit(): void {
    this.contactoService.obtenerMensajes().subscribe({
      next: (data) => {
        this.mensajes = data
          .sort((a, b) => b.id - a.id)
          .map(m => ({ ...m, respuestaTemporal: '' }));
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener mensajes', error);
        this.cargando = false;
      }
    });
  }

  enviarRespuesta(msg: MensajeConRespuestaTemporal): void {
    msg.errorRespuesta = undefined;  // Reset error
     

    if (!msg.respuestaTemporal.trim()) {
      msg.errorRespuesta = 'Por favor escribe una respuesta antes de enviar.';
      return;
    }

    // Simulamos guardar la respuesta
    msg.respuesta = msg.respuestaTemporal.trim();
    msg.respuestaTemporal = '';
  }
}
