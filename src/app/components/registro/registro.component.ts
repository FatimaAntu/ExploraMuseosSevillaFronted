import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensaje: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  registrar() {
    if (this.registroForm.invalid) {
      return;
    }

    const { nombre, email, password } = this.registroForm.value;

    this.authService.register(nombre, email, password).subscribe({
      next: () => {
        this.mensaje = 'Usuario registrado con éxito. Ahora puedes iniciar sesión.';
        this.error = null;
        this.registroForm.reset();
      },
      error: (err) => {
        this.error = err.error || 'Error al registrar usuario';
        this.mensaje = null;
      }
    });
  }
}

