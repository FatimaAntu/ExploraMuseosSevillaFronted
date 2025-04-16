import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterComponent } from '../register/register.component';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //email = '';
  //password = '';
  loginForm: FormGroup;
  mostrarRegistro = false;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;
  welcomeMessage: string = ''; // Mensaje de bienvenida

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    
    });
  }

  login() {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.authService.setCurrentUser(res);  // Guardamos el usuario logueado
        this.mensajeExito = `Bienvenido ${res.email}`;  // Ajusta según lo que recibas del backend
        this.mensajeError = null;
        this.loginForm.reset();

        // Redirigimos según el rol del usuario
        if (res.rol === 'ADMIN') {
          this.router.navigate(['/admin']);  // Si es admin, va al panel de admin
        } else {
          this.router.navigate(['/home']);  // Si es usuario, va al dashboard
        }
      },
      error: (err) => {
        this.mensajeError = 'Credenciales incorrectas';
        this.mensajeExito = null;
        this.loginForm.reset();
      }
    });
  }

  toggleRegistro(event: Event) {
    event.preventDefault(); // Evita la recarga de la página
    this.mostrarRegistro = !this.mostrarRegistro;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
  
  
}
  /*constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        alert('Login correcto');
        console.log(res);
        // Puedes guardar el token o navegar a otra página aquí si lo deseas
      },
      error: (err) => {
        alert('Login fallido');
        console.error(err);
      }
    });
  }
}*/
