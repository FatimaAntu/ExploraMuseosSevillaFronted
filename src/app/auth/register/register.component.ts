import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    private router: Router
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
      next: () => {
        this.mensaje = '🎉 Usuario registrado con éxito. Ahora puedes iniciar sesión.';
        this.error = null;
        this.registroForm.reset();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar usuario';
        this.mensaje = null;
      }
    });
  }
}
