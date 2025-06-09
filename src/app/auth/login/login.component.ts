import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterComponent } from '../register/register.component';
import { Router, ActivatedRoute } from '@angular/router';
/**
 * Componente LoginComponent
 * 
 * Componente para la gestión del inicio de sesión de usuarios.
 * Permite autenticarse con email y contraseña, mostrar mensajes de error o éxito,
 * y redirigir a la página correspondiente tras el login.
 * También ofrece la opción de mostrar/ocultar el formulario de registro.
 * 
 * @standalone
 * @selector app-login
 * @imports FormsModule, CommonModule, ReactiveFormsModule, RegisterComponent
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** Formulario reactivo para login con validaciones */
  loginForm: FormGroup;
  /** Control para mostrar u ocultar el formulario de registro */
  mostrarRegistro = false;
  /** Mensaje para mostrar errores de login */
  mensajeError: string | null = null;
  /** Mensaje para mostrar confirmación de login correcto */
  mensajeExito: string | null = null;
  /** Mensaje de bienvenida personalizado */
  welcomeMessage: string = '';

  /**
 * Constructor del componente
 * 
 * @param fb FormBuilder para crear el formulario reactivo
 * @param authService Servicio de autenticación para login/logout
 * @param router Router para navegación programada
 * @param route ActivatedRoute para obtener query params (returnUrl)
 */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // Para acceder al query param 'returnUrl'
  ) {
    // Inicializa el formulario con controles y validaciones
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  /**
  * Método para realizar login con los datos del formulario.
  * Gestiona la respuesta del backend, muestra mensajes y redirige según rol y estado.
  */

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
        // Verifica si hay una entrada pendiente de compra y que el usuario no sea admin
        const entradaPendiente = localStorage.getItem('entradaPendiente');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';

        if (entradaPendiente && res.rol !== 'ADMIN') {
          localStorage.removeItem('entradaPendiente');
          this.router.navigate(['/comprar-entrada', entradaPendiente]);
        } else {
          if (res.rol === 'ADMIN') {
            // Redirige a la página de admin (puedes cambiarla si quieres)
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate([returnUrl]);
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
  /**
 * Alterna la visibilidad del formulario de registro.
 * 
 * @param event Evento click para evitar el comportamiento por defecto
 */

  toggleRegistro(event: Event) {
    event.preventDefault(); // Evita la recarga de la página
    this.mostrarRegistro = !this.mostrarRegistro;
  }
  /**
  * Cierra sesión y redirige a la página principal.
  */

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
