import { Component, OnInit } from '@angular/core';
import { ContactoService, MensajeContacto } from '../../services/contacto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mensajes-admin',
  templateUrl: './mensajes-admin.component.html',
  styleUrls: ['./mensajes-admin.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MensajesAdminComponent implements OnInit {
  mensajes: MensajeContacto[] = [];
  cargando = true;

  constructor(private contactoService: ContactoService) {}

  ngOnInit(): void {
    this.contactoService.obtenerMensajes().subscribe({
      next: (data) => {
        this.mensajes = data.sort((a, b) => b.id - a.id);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener mensajes', error);
        this.cargando = false;
      }
    });
  }

  abrirClienteCorreo(email: string, nombre: string, mensajeOriginal: string, msg: MensajeContacto) {
  const subject = encodeURIComponent(`Respuesta a tu mensaje, ${nombre}`);
  const cuerpo = `Hola ${nombre},\n\nHe leído tu mensaje:\n"${mensajeOriginal}"\n\nrespuesta:\n` +
                 `Quedo atenta/o a cualquier duda.\n\nUn saludo,\nAdministrador de la web ExploraMuseosSevilla`;
  const body = encodeURIComponent(cuerpo);

  // Abrir Gmail
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  window.open(gmailUrl, '_blank');

  // Guardar la respuesta en la BBDD
 this.contactoService.responderMensaje(msg.id, cuerpo).subscribe({
  next: (mensajeActualizado) => {
    this.mensajes = this.mensajes.map(m =>
      m.id === mensajeActualizado.id ? { ...mensajeActualizado } : m
    );
    console.log('Respuesta guardada correctamente');
  },
  error: (error) => {
    console.error('Error al guardar la respuesta', error);
  }
});

  }

  }

