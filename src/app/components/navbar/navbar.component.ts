import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule para los enlaces
import { ButtonModule } from 'primeng/button'; // Solo si usas botones de PrimeNG


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
toggleMenu() {
throw new Error('Method not implemented.');
}
  // Puedes agregar lógica aquí en el futuro
}


