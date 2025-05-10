import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registroForm: FormGroup;
  mensaje: string | null = null;
  error: string | null = null;

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

  registrar() {
    if (this.registroForm.invalid) return;

    const { nombre, email, password } = this.registroForm.value;
    const body = { nombre, email, password };

    this.http.post('http://localhost:8080/api/auth/register', body).subscribe({
      next: (user: any) => {
        this.mensaje = '🎉 Usuario registrado con éxito. Redirigiendo...';
        this.error = null;
        this.registroForm.reset();

         // Abrimos sesión del usuario
         this.authService.setCurrentUser(user);  

        // Verificar si había un intento de compra pendiente
        const pendiente = localStorage.getItem('entradaPendiente');
        if (pendiente) {
          localStorage.removeItem('entradaPendiente');
          this.router.navigate(['/comprar-entrada', pendiente]);  // Redirige a la página de compra de entradas
        } else {
          this.router.navigate(['/comprar-entrada']);  // O cualquier otra página por defecto
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar usuario';
        this.mensaje = null;
      }
    });
  }
}
