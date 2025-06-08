import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MuseosComponent } from './pages/museos/museos.component';
import { ExposicionesComponent } from './components/exposiciones/exposiciones.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { RegisterComponent } from './auth/register/register.component';
import { ComprarEntradaComponent } from './pages/comprar-entrada/comprar-entrada.component'; 
import { MensajesAdminComponent } from './pages/mensajes-admin/mensajes-admin.component';
import { ExposicionAdminComponent } from './pages/exposicion-admin/exposicion-admin.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'museos', component: MuseosComponent },
  { path: 'exposiciones/:id', component: ExposicionesComponent },
  { path: 'home', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'comprar-entrada/:id', 
    component: ComprarEntradaComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto.component').then(m => m.ContactoComponent)
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: 'exposiciones',
        component: ExposicionAdminComponent
      },
      {
        path: 'mensajes',
        component: MensajesAdminComponent
      },
      {
        path: '',
        redirectTo: 'exposiciones',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }