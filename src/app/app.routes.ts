import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MuseosComponent } from './pages/museos/museos.component';
import { ExposicionesComponent } from './components/exposiciones/exposiciones.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component'; 
import { DashboardComponent } from './pages/dashboard/dashboard.component'; // Importa el componente del Dashboard




// Exporta las rutas
export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'museos', component: MuseosComponent },
  { path: 'exposiciones/:id', component: ExposicionesComponent },
  { path: 'home', component: InicioComponent}, 
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard], // Protege la ruta con un guard
  data: { roles: ['ADMIN'] } // Solo los administradores pueden acceder
},
{ path: 'dashboard', component: DashboardComponent },    // Ruta para el Dashboard
{ path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule {}


