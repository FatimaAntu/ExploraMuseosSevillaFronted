import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MuseosComponent } from './pages/museos/museos.component';
import { ExposicionesComponent } from './exposiciones/exposiciones.component';

// Exporta las rutas
export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'museos', component: MuseosComponent },
  { path: 'exposiciones/:id', component: ExposicionesComponent },
  { path: '**', redirectTo: '' }
];



