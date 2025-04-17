import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExposicionesService } from '../../services/exposiciones.service';

@Component({
  selector: 'app-exposicion-admin',
  templateUrl: './exposicion-admin.component.html',
  styleUrls: ['./exposicion-admin.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule]
})
export class ExposicionAdminComponent implements OnInit {
  exposiciones: any[] = [];
  nuevaExposicion = { nombre: '', descripcion: '', fechaInicio: '', fechaFin: '' };
  exposicionEditada: any = null;

  constructor(private exposicionService: ExposicionesService) {}

  ngOnInit(): void {
    this.getExposiciones();
  }

  // Obtener todas las exposiciones
  getExposiciones() {
    this.exposicionService.getExposiciones().subscribe(data => {
      this.exposiciones = data;
    });
  }

  // Crear una nueva exposición
  onSubmit() {
    if (this.exposicionEditada) {
      // Si estamos editando, actualizamos la exposición
      this.exposicionService.updateExposicion(this.exposicionEditada.id, this.nuevaExposicion).subscribe({
        next: () => {
          console.log('Exposición actualizada');
          this.getExposiciones();  // Refrescar la lista
          this.resetFormulario();  // Limpiar el formulario
        },
        error: (err) => {
          console.error('Error al actualizar exposición', err);
        }
      });
    } else {
      // Si no estamos editando, creamos una nueva exposición
      this.exposicionService.createExposicion(this.nuevaExposicion).subscribe({
        next: () => {
          console.log('Exposición creada');
          this.getExposiciones();  // Refrescar la lista
          this.resetFormulario();  // Limpiar el formulario
        },
        error: (err) => {
          console.error('Error al agregar exposición', err);
        }
      });
    }
  }

  // Editar una exposición
  editarExposicion(exposicion: any) {
    this.exposicionEditada = exposicion;
    this.nuevaExposicion = { ...exposicion };  // Cargar los datos de la exposición en el formulario
  }

  // Eliminar una exposición
  eliminarExposicion(id: number) {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta exposición?');
    if (confirmar) {
      this.exposicionService.deleteExposicion(id).subscribe(() => {
        this.getExposiciones();  // Refrescar la lista después de la eliminación
      });
    }
  }

  // Resetear el formulario
  resetFormulario() {
    this.nuevaExposicion = { nombre: '', descripcion: '', fechaInicio: '', fechaFin: '' };
    this.exposicionEditada = null;
  }
}
