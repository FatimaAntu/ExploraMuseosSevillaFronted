import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { MuseosComponent } from './components/museos/museos.component';
import { ExposicionesComponent } from './components/exposiciones/exposiciones.component';
import { DetalleMuseoComponent } from './components/detalle-museo/detalle-museo.component';
import { LoginComponent } from './auth/login/login.component';





export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'museos', component: MuseosComponent },
  { path: 'exposiciones', component: ExposicionesComponent },
  { path: 'museos/:id', component: DetalleMuseoComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
