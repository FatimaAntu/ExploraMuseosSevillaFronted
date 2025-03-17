import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  role: string;
  token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,  // Esto lo hace un componente independiente
  imports: [CommonModule, FormsModule],  // Importamos módulos necesarios para el funcionamiento
})
export class LoginComponent {
  loginRequest: LoginRequest = { username: '', password: '' };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post<LoginResponse>('/login', this.loginRequest).subscribe(
      (response) => {
        // Si el login es exitoso, guarda el token y redirige según el rol
        localStorage.setItem('token', response.token);
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error('Error de login:', error);
      }
    );
  }
}



