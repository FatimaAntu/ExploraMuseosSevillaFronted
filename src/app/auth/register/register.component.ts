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
   * 
   * @param fb FormBuilder para crear el formulario
   * @param http HttpClient para hacer peticiones al backend
   * @param router Router para navegación programada
   * @param authService Servicio para manejar autenticación y estado del usuario
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    // Inicializa el formulario con controles y validaciones
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Método que envía los datos del formulario para registrar un usuario.
   * Valida el formulario antes de enviar.
   * Muestra mensajes y redirige tras éxito.
   * Captura errores y los muestra al usuario.
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

        // Iniciar sesión automáticamente con el usuario registrado
        this.authService.setCurrentUser(user);

        // Comprobar si hay compra pendiente almacenada localmente
        const pendiente = localStorage.getItem('entradaPendiente');

        // Esperar 2 segundos para mostrar el mensaje antes de redirigir
        setTimeout(() => {
          if (pendiente) {
            localStorage.removeItem('entradaPendiente');
            this.router.navigate(['/comprar-entrada', pendiente]);
          } else {
            this.router.navigate(['/comprar-entrada']);
          }
        }, 2000);
      },
      error: (err) => {
        // Mostrar mensaje de error recibido del backend o uno genérico
        this.error = err.error?.message || 'Error al registrar usuario';
        this.mensaje = null;
      }
    });
  }
}
