import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
/**
 * Componente que muestra un listado estático de museos de Sevilla,
 * con su nombre, descripción, dirección, horario e imagen representativa.
 */
@Component({
  selector: 'app-museos',
  templateUrl: './museos.component.html',
  styleUrls: ['./museos.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MuseosComponent {
  /**
 * Array con la información básica de los museos a mostrar.
 */
  museos = [
    {
      nombre: 'Museo de Bellas Artes de Sevilla',
      descripcion: 'Una de las pinacotecas más importantes de España, con obras del Barroco sevillano.',
      direccion: 'Plaza del Museo, 9, 41001 Sevilla',
      horario: 'De martes a sábado, de 9:00 a 20:30',
      imagen: '/museos/bellasArtes.jpg'
    },
    {
      nombre: 'Centro Andaluz de Arte Contemporáneo',
      descripcion: 'Ubicado en el Monasterio de la Cartuja, alberga arte moderno y contemporáneo.',
      direccion: 'Av. Américo Vespucio, 2, 41092 Sevilla',
      horario: 'Martes a viernes de 10:00 a 20:00',
      imagen: 'caac.jpeg'
    },
    {
      nombre: 'Museo Arqueológico de Sevilla',
      descripcion: 'Destaca por su colección de piezas romanas de Itálica.',
      direccion: 'Plaza de América, s/n, 41013 Sevilla',
      horario: 'De martes a domingo, de 9:00 a 15:30',
      imagen: 'museoArqueologico.jpg'
    },
    {
      nombre: 'Museo de Artes y Costumbres Populares',
      descripcion: 'Muestra la vida cotidiana y las tradiciones de Andalucía.',
      direccion: 'Plaza de América, s/n, 41013 Sevilla',
      horario: 'De martes a domingo, de 9:00 a 15:30',
      imagen: 'museoArtesCostumbres.jpeg'
    },
    {
      nombre: 'Casa Pilatos',
      descripcion: 'Un palacio sevillano del siglo XV,combina estilos renacentista italiano y mudéjar español,',
      direccion: ' Pl. de Pilatos, 1, Casco Antiguo, 41003 Sevilla',
      horario: 'De lunes a domingo, de 9:00 a 18:00',
      imagen: 'casaPilatos.jpg'
    },
    {
      nombre: 'Archivo General de Indias',
      descripcion: 'Patrimonio de la Humanidad, alberga documentos sobre la historia colonial española.',
      direccion: 'Av. de la Constitución, s/n, 41004 Sevilla',
      horario: 'De martes a sábado, de 9:30 a 16:30 y domingos de 10:30 a 13:30',
      imagen: 'archivoIndias.jpg'
    }


  ];
}
