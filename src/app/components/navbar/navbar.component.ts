import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service'; // Ajusta según tu estructura
import { Usuario } from '../../models/usuario.model'; // Ajusta si tienes una interfaz

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
    this.authService.logout(); // Llama a tu lógica de logout
    this.usuario = null;
    this.router.navigate(['/']);
  }
}
