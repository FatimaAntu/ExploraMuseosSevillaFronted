import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MuseosComponent } from '../museos/museos.component';
import { ExposicionesComponent } from '../../components/exposiciones/exposiciones.component';
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,  // Componente principal del dashboard del admin
    children: [
      { path: 'museos', component: MuseosComponent },  // Ruta para gestionar museos
      { path: 'exposiciones', component: ExposicionesComponent },  // Ruta para gestionar exposiciones
      { path: '', redirectTo: 'museos', pathMatch: 'full' }  // Ruta por defecto al entrar en el panel de admin
    ]
  }
];
