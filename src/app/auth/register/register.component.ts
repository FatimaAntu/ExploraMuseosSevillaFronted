import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';

/**
 * Componente RegisterComponent
 * 
 * Gestiona el formulario de registro de nuevos usuarios.
 * Valida los campos de nombre, email y contraseña.
 * Envía los datos al backend para crear el usuario.
 * Tras registro exitoso, inicia sesión automáticamente y redirige.
 * Muestra mensajes de éxito o error.
 * 
 * @standalone
 * @selector app-register
 * @imports ReactiveFormsModule, CommonModule
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  /** Formulario reactivo para el registro de usuario */
  registroForm: FormGroup;

  /** Mensaje para mostrar confirmación o información al usuario */
  mensaje: string | null = null;

  /** Mensaje para mostrar errores en el proceso de registro */
  error: string | null = null;

  /**
   * Constructor del componente
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Registra al usuario y redirige dependiendo del estado anterior
   */
  registrar() {
    if (this.registroForm.invalid) return;

    const { nombre, email, password } = this.registroForm.value;
    const body = { nombre, email, password };

    this.http.post('http://localhost:8080/api/auth/register', body).subscribe({
      next: (user: any) => {
        this.mensaje = '🎉 Usuario registrado con éxito. Redirigiendo...';
        this.error = null;
        this.registroForm.reset();

        // Inicia sesión automática tras el registro
        this.authService.setCurrentUser(user);

        // Esperar 2 segundos para mostrar mensaje y redirigir
        setTimeout(() => {
          const redirectId = this.authService.getRedirectExposicionId();

          if (redirectId !== null) {
            this.authService.clearRedirectExposicionId();
            this.router.navigate(['/comprar-entrada', redirectId]);
          } else {
            this.router.navigate(['/']);
          }
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar usuario';
        this.mensaje = null;
      }
    });
  }
  mostrarPassword: boolean = false;

togglePassword() {
  this.mostrarPassword = !this.mostrarPassword;
}

}
