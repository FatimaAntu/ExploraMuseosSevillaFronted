import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExposicionesService } from '../../services/exposiciones.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MuseoService } from 'app/services/museo.service';
import { Museo } from 'app/models/museo.model';

@Component({
  selector: 'app-exposicion-admin',
  templateUrl: './exposicion-admin.component.html',
  styleUrls: ['./exposicion-admin.component.css'],
  standalone: true,
  providers: [MessageService],
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
    ToastModule
  ]
})
export class ExposicionAdminComponent implements OnInit {
  exposiciones: any[] = [];
  exposicionForm: FormGroup;
  exposicionEditada: any = null;

  museos: any[] = [];

  constructor(
    private exposicionService: ExposicionesService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private museoService: MuseoService
  ) {
    this.exposicionForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      museoId: [null, Validators.required]
    });
  }

  
  ngOnInit(): void {
    this.getExposiciones();
    this.obtenerMuseos();
  }

  obtenerMuseos(): void {
    this.museoService.getMuseos().subscribe(
      (data: any[]) => {
        this.museos = data;
      },
      (error) => {
        console.error('Error al obtener museos', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los museos' });
      }
    );}

  getExposiciones() {
    this.exposicionService.getExposiciones().subscribe(data => {
      this.exposiciones = data;
    });
  }

  onSubmit() {
    console.log(this.exposicionEditada);
    
    if (this.exposicionForm.invalid) return;

    const exposicionFormValue = this.exposicionForm.value;
    const exposicion = {
      nombre: exposicionFormValue.nombre,
      descripcion: exposicionFormValue.descripcion,
      fechaInicio: exposicionFormValue.fechaInicio,
      fechaFin: exposicionFormValue.fechaFin,
      museo: {
        id: exposicionFormValue.museoId
      }
    };
    const id = exposicionFormValue.id;

    if (this.exposicionEditada) {
      this.exposicionService.createExposicion(exposicion).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Exposición actualizada con éxito' });
          this.getExposiciones();
          this.resetFormulario();
        },
        error: (err) => {
          console.error('Error al actualizar exposición', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' });
        }
      });
    } else {
      this.exposicionService.createExposicion(exposicion).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Creada', detail: 'Exposición agregada correctamente' });
          this.getExposiciones();
          this.resetFormulario();
        },
        error: (err) => {
          console.error('Error al agregar exposición', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar' });
        }
      });
    }
  }

  editarExposicion(exposicion: any) {
    this.exposicionEditada = exposicion;
    this.exposicionForm.patchValue({
      id: exposicion.id,
      nombre: exposicion.nombre,
      descripcion: exposicion.descripcion,
      fechaInicio: exposicion.fechaInicio,
      fechaFin: exposicion.fechaFin,
      museoId: exposicion.museo?.id
    });
  }

  eliminarExposicion(id: number) {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta exposición?');
    if (confirmar) {
      this.exposicionService.deleteExposicion(id).subscribe(() => {
        this.messageService.add({ severity: 'warn', summary: 'Eliminada', detail: 'Exposición eliminada' });
        this.getExposiciones();
      });
    }
  }

  resetFormulario() {
    this.exposicionForm.reset();
    this.exposicionEditada = null;
  }

  isInvalid(campo: string): boolean {
    const control = this.exposicionForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }


}
