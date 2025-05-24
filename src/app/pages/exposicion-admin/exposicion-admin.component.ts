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
  exposiciones: any[] = [];
  exposicionForm: FormGroup;
  exposicionEditada: any = null;
  museos: any[] = [];
  imagenFile: File | null = null;
  imagenError: string | null = null;
  imagenPreview: string | null = null;

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

  ngOnInit(): void {
    this.getExposiciones();
    this.obtenerMuseos();
  }

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

  fechaNoPasadaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    fechaSeleccionada.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada < hoy ? { fechaPasada: true } : null;
  }

  rangoFechasValidator(group: AbstractControl): ValidationErrors | null {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFin')?.value;
    if (!inicio || !fin) return null;
    return new Date(fin) >= new Date(inicio) ? null : { fechaFinInvalida: true };
  }

  getExposiciones() {
    this.exposicionService.getExposiciones().subscribe(data => {
      this.exposiciones = data;
    });
  }



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

  editarExposicion(exposicion: any) {
    this.exposicionEditada = exposicion;
    this.imagenFile = null;
    this.imagenError = null;
    //rellenamos el formulario con los datos de la exposición
    this.exposicionForm.patchValue({
      id: exposicion.id,
      nombre: exposicion.nombre,
      descripcion: exposicion.descripcion,
      fechaInicio: exposicion.fechaInicio,
      fechaFin: exposicion.fechaFin,
      museoId: exposicion.museo?.id,
      precio: exposicion.precio
    });

    // Mostrar la imagen actual como vista previa si existe
    if (exposicion.imagen) {
      this.imagenPreview = `http://localhost:8080/uploads/${exposicion.imagen}`;
    } else {
      this.imagenPreview = null;
    }
  }

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

  resetFormulario() {
    this.exposicionForm.reset();
    this.imagenFile = null;
    this.imagenError = null;
    this.imagenPreview = null;
    this.exposicionEditada = null;
  }

  isInvalid(campo: string): boolean {
    const control = this.exposicionForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.imagenError = 'El archivo debe ser una imagen';
        this.imagenFile = null;
        this.imagenPreview = null;
        return;
      }
      this.imagenFile = file;
      this.imagenError = null;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }

    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.imagenError = `La imagen no puede superar los ${maxSizeMB} MB`;
      this.imagenFile = null;
      return;
    }

    this.imagenError = null;
    this.imagenFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagenPreview = reader.result as string;
    reader.readAsDataURL(file);
  }
}

