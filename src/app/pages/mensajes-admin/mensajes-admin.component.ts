import { Component, OnInit } from '@angular/core';
import { ContactoService, MensajeContacto } from '../../services/contacto.service';
import { CommonModule } from '@angular/common';

/**
 * Componente para la administración y visualización de mensajes de contacto recibidos.
 * Permite listar los mensajes recibidos y responderlos abriendo Gmail con plantilla
 * y guardando la respuesta en la base de datos.
 */
@Component({
  selector: 'app-mensajes-admin',
  templateUrl: './mensajes-admin.component.html',
  styleUrls: ['./mensajes-admin.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MensajesAdminComponent implements OnInit {

  /** Array que almacena los mensajes recibidos */
  mensajes: MensajeContacto[] = [];

  /** Indicador de carga para mostrar un spinner o mensaje mientras se cargan los mensajes */
  cargando = true;

  /**
   * Constructor que inyecta el servicio para manejar mensajes de contacto
   * @param contactoService Servicio para obtener y responder mensajes
   */
  constructor(private contactoService: ContactoService) {}

  /**
   * Método del ciclo de vida Angular.
   * Se ejecuta al inicializar el componente y obtiene los mensajes
   * desde el backend, ordenándolos de más reciente a más antiguo.
   */
  ngOnInit(): void {
    this.contactoService.obtenerMensajes().subscribe({
      next: (data) => {
        // Ordena los mensajes por id descendente (los más recientes primero)
        this.mensajes = data.sort((a, b) => b.id - a.id);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener mensajes', error);
        this.cargando = false;
      }
    });
  }

  /**
   * Abre el cliente de correo Gmail con una plantilla para responder un mensaje de contacto.
   * También guarda la respuesta en la base de datos asociada al mensaje.
   * 
   * @param email Email del remitente al que se responde
   * @param nombre Nombre del remitente para personalizar el asunto y cuerpo
   * @param mensajeOriginal Texto del mensaje original recibido
   * @param msg Objeto MensajeContacto completo, usado para guardar la respuesta
   */
  abrirClienteCorreo(email: string, nombre: string, mensajeOriginal: string, msg: MensajeContacto) {
    const subject = encodeURIComponent(`Respuesta a tu mensaje, ${nombre}`);
    const cuerpo = `Hola ${nombre},\n\nHe leído tu mensaje:\n"${mensajeOriginal}"\n\nrespuesta:\n` +
                   `Quedo atenta/o a cualquier duda.\n\nUn saludo,\nAdministrador de la web ExploraMuseosSevilla`;
    const body = encodeURIComponent(cuerpo);

    // URL para abrir Gmail con el correo prellenado
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');

    // Guarda la respuesta en la base de datos mediante el servicio
    this.contactoService.responderMensaje(msg.id, cuerpo).subscribe({
      next: (mensajeActualizado) => {
        // Actualiza localmente el mensaje con la respuesta guardada
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
