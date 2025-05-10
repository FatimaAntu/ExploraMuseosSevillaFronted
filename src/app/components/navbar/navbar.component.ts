import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service'; 
import { Usuario } from '../../models/usuario.model'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(user => {
      this.usuario = user;
    });
  }

  logout(): void {
    this.authService.logout(); 
    this.usuario = null;
    this.router.navigate(['/']);
  }

  // Función que primero lleva al inicio y luego a la gestión de exposiciones
  navigateToAdminDashboard(): void {
    this.router.navigate(['/home']);  // Redirige al inicio
    setTimeout(() => {
      this.router.navigate(['/admin/exposiciones']);  // Después de un pequeño delay, lleva a la gestión de exposiciones
    }, 300);
  }
}
