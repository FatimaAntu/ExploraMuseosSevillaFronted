
import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';



export const routes: Routes = [
  { path: '', component: InicioComponent },
  //{ path: 'talleres', component: TalleresComponent },
 // { path: 'inscripciones', component: InscripcionesComponent },
  { path: '**', redirectTo: '' } 
];