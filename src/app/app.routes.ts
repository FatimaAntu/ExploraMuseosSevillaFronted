import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MuseosComponent } from './pages/museos/museos.component';
import { ExposicionesComponent } from './components/exposiciones/exposiciones.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; 
import { RegisterComponent } from './auth/register/register.component';
import { ExposicionAdminComponent } from './pages/exposicion-admin/exposicion-admin.component';
import { ComprarEntradaComponent } from './pages/comprar-entrada/comprar-entrada.component'; 


export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'museos', component: MuseosComponent },
  { path: 'exposiciones/:id', component: ExposicionesComponent },
  { path: 'home', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard], // Protege la ruta con un guard
    data: { roles: ['ADMIN'] } // Solo los administradores pueden acceder
  },
  { path: 'comprar-entrada/:id', component: ComprarEntradaComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },

  
  {
    path: 'admin/exposiciones', 
    component: ExposicionAdminComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
