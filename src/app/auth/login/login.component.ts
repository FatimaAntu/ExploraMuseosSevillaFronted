import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterComponent } from '../register/register.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarRegistro = false;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;
  welcomeMessage: string = ''; // Mensaje de bienvenida

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // Para acceder al query param 'returnUrl'
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log(res);  // Muestra la respuesta del backend en la consola
        this.authService.setCurrentUser(res);  // Guardamos el usuario logueado
        this.mensajeExito = `Bienvenido ${res.email}`;  // Ajusta según lo que recibas del backend
        this.mensajeError = null;
        this.loginForm.reset();

        // Verifica si hay una entrada pendiente de compra
        const entradaPendiente = localStorage.getItem('entradaPendiente');
        if (entradaPendiente) {
          localStorage.removeItem('entradaPendiente');
          this.router.navigate(['/comprar-entrada', entradaPendiente]);  // Redirige al proceso de compra de entradas
        } else {
          // Obtiene la URL original a la que el usuario quería acceder (si existe)
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
          
          // Redirige según el rol del usuario
          if (res.rol === 'ADMIN') {
            this.router.navigate([returnUrl]);  // Si es admin, redirige a la URL original o a '/admin/exposiciones'
          } else {
            this.router.navigate([returnUrl]);  // Si es usuario, redirige a la URL original o a '/home'
          }
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
