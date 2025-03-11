import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonModule } from 'primeng/button'; // Si usas botones de PrimeNG

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonModule], // Añadido ButtonModule si usas PrimeNG
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Aquí puedes agregar cualquier lógica si es necesario
}


