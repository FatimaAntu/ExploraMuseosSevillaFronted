import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExposicionesService } from '../../services/exposiciones.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MuseoService } from 'app/services/museo.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';


/**
 * Componente para la administración de exposiciones.
 * Permite crear, editar, eliminar exposiciones y gestionar su imagen asociada.
 */
@Component({
  selector: 'app-exposicion-admin',
  templateUrl: './exposicion-admin.component.html',
  styleUrls: ['./exposicion-admin.component.css'],
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DividerModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule
  ]
})
export class ExposicionAdminComponent implements OnInit {

  /** Lista de exposiciones para mostrar en la vista */
  exposiciones: any[] = [];

  /** Formulario reactivo para crear o editar una exposición */
  exposicionForm: FormGroup;

  /** Objeto de exposición que se está editando actualmente */
  exposicionEditada: any = null;

  /** Lista de museos para seleccionar en el formulario */
  museos: any[] = [];

  /** Archivo de imagen seleccionado para la exposición */
  imagenFile: File | null = null;

  /** Mensaje de error relacionado con la imagen (tipo o tamaño) */
  imagenError: string | null = null;

  /** URL para vista previa de la imagen seleccionada */
  imagenPreview: string | null = null;

  /** ID del museo seleccionado para filtrar las exposiciones */
museoFiltro: number | null = null;



  /**
   * Constructor que inyecta servicios necesarios y configura el formulario reactivo.
   * @param exposicionService Servicio para operaciones CRUD con exposiciones
   * @param fb FormBuilder para crear el formulario reactivo
   * @param messageService Servicio para mostrar mensajes toast
   * @param museoService Servicio para obtener la lista de museos
   * @param confirmationService Servicio para diálogos de confirmación
   */
  constructor(
    private exposicionService: ExposicionesService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private museoService: MuseoService,
    private confirmationService: ConfirmationService
  ) {
    this.exposicionForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', [Validators.required, this.fechaNoPasadaValidator]],
      fechaFin: ['', Validators.required],
      museoId: [null, Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
    }, { validators: this.rangoFechasValidator });
  }


  /**
   * Inicializa el componente, cargando exposiciones y museos.
   */
  ngOnInit(): void {
    this.getExposiciones();
    this.obtenerMuseos();
  }


  /**
   * Obtiene la lista de museos desde el backend para llenar el dropdown del formulario.
   */
  obtenerMuseos(): void {
    this.museoService.getMuseos().subscribe({
      next: (data: any[]) => this.museos = data,
      error: (error) => {
        console.error('Error al obtener museos', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los museos',
          life: 3000
        });
      }
    });
  }


  /**
   * Validador personalizado para asegurar que la fecha no sea pasada.
   * @param control Control del formulario con la fecha a validar
   * @returns Error si la fecha es anterior a hoy, o null si es válida
   */
 fechaNoPasadaValidator = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  const fechaSeleccionada = new Date(control.value);
  const hoy = new Date();
  fechaSeleccionada.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);
  return fechaSeleccionada < hoy ? { fechaPasada: true } : null;
}



  /**
   * Validador personalizado para el rango de fechas: la fechaFin debe ser igual o posterior a la fechaInicio.
   * @param group Grupo de controles del formulario que contiene fechaInicio y fechaFin
   * @returns Error si fechaFin es anterior a fechaInicio, o null si es válido
   */
  rangoFechasValidator(group: AbstractControl): ValidationErrors | null {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFin')?.value;
    if (!inicio || !fin) return null;
    return new Date(fin) >= new Date(inicio) ? null : { fechaFinInvalida: true };
  }


  /**
   * Obtiene todas las exposiciones para mostrarlas en la lista.
   */
  getExposiciones() {
    this.exposicionService.getExposiciones().subscribe(data => {
      this.exposiciones = data;
    });
  }


  /**
   * Maneja el evento de envío del formulario para crear o actualizar una exposición.
   * Se envía la información junto con la imagen en un FormData.
   */
  onSubmit() {
    if (this.exposicionForm.invalid) {
      this.exposicionForm.markAllAsTouched();
      return;
    }

    const exposicionData = {
      ...this.exposicionForm.value,
      museo: { id: this.exposicionForm.value.museoId }
    };

    const formData = new FormData();
    formData.append('exposicion', new Blob([JSON.stringify(exposicionData)], { type: 'application/json' }));

    if (this.imagenFile) {
      formData.append('file', this.imagenFile);
    }

    const request$ = this.exposicionEditada
      ? this.exposicionService.updateExposicion(exposicionData.id, formData)
      : this.exposicionService.createExposicion(formData);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.exposicionEditada ? 'Exposición actualizada' : 'Exposición creada',
          life: 3000
        });
        this.getExposiciones();
        this.resetFormulario();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar la exposición',
          life: 3000
        });
        console.error(error);
      }
    });
  }


  /**
   * Carga una exposición en el formulario para editarla.
   * @param exposicion Objeto exposición a editar
   */
  editarExposicion(exposicion: any) {
    this.exposicionEditada = exposicion;
    this.imagenFile = null;
    this.imagenError = null;

    this.exposicionForm.patchValue({
      id: exposicion.id,
      nombre: exposicion.nombre,
      descripcion: exposicion.descripcion,
      fechaInicio: exposicion.fechaInicio,
      fechaFin: exposicion.fechaFin,
      museoId: exposicion.museo?.id,
      precio: exposicion.precio
    });

    // Mostrar imagen previa si existe
    if (exposicion.imagen) {
      this.imagenPreview = `http://localhost:8080/uploads/${exposicion.imagen}`;
    } else {
      this.imagenPreview = null;
    }
  }


  /**
   * Elimina una exposición tras confirmación del usuario.
   * @param id ID de la exposición a eliminar
   */
  eliminarExposicion(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta exposición?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.exposicionService.deleteExposicion(id).subscribe(() => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Eliminada',
            detail: 'Exposición eliminada',
            life: 3000
          });
          this.getExposiciones();
        });
      }
    });
  }


  /**
   * Resetea el formulario y limpia los datos temporales (imagen, edición).
   */
  resetFormulario() {
    this.exposicionForm.reset();
    this.imagenFile = null;
    this.imagenError = null;
    this.imagenPreview = null;
    this.exposicionEditada = null;
  }


  /**
   * Verifica si un campo del formulario es inválido y ha sido tocado o modificado.
   * @param campo Nombre del campo a evaluar
   * @returns true si el campo es inválido y ha sido tocado o modificado
   */
  isInvalid(campo: string): boolean {
    const control = this.exposicionForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }


  /**
   * Maneja el cambio en el input de archivo para subir la imagen.
   * Valida tipo y tamaño del archivo, y genera vista previa.
   * @param event Evento del input file
   */
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo (imagen)
      if (!file.type.startsWith('image/')) {
        this.imagenError = 'El archivo debe ser una imagen';
        this.imagenFile = null;
        this.imagenPreview = null;
        return;
      }

      // Validar tamaño máximo (2 MB)
      const maxSizeMB = 2;
      if (file.size > maxSizeMB * 1024 * 1024) {
        this.imagenError = `La imagen no puede superar los ${maxSizeMB} MB`;
        this.imagenFile = null;
        this.imagenPreview = null;
        return;
      }

      this.imagenFile = file;
      this.imagenError = null;

      // Generar vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => this.imagenPreview = reader.result as string;
      reader.readAsDataURL(file);
    } else {
      this.imagenFile = null;
      this.imagenError = null;
      this.imagenPreview = null;
    }
  }
  get exposicionesFiltradas(): any[] {
  if (!this.museoFiltro) {
    return this.exposiciones;
  }
  return this.exposiciones.filter(e => e.museo?.id === this.museoFiltro);
}

}