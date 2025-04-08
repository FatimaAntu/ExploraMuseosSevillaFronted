// dashboard.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Aquí puedes agregar lógica para mostrar datos, estadísticas o cualquier funcionalidad para el Dashboard
  titulo: string = 'Bienvenido al Dashboard';

  constructor() { }

}

