import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar ngModel

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = '';
  password = '';
  nombre = '';

  constructor(private http: HttpClient) {}

  registrar() {
    const body = {
      email: this.email,
      password: this.password,
      nombre: this.nombre
    };

    this.http.post('http://localhost:8080/api/auth/register', body).subscribe({
      next: res => {
        alert('Usuario registrado correctamente 🎉');
      },
      error: err => {
        alert('Error al registrar usuario');
        console.error(err);
      }
    });
  }
}
