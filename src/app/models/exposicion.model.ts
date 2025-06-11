import { Museo } from './museo.model';

export interface Exposicion {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;  
  fechaFin: string;     
  imagen: string;
  museo: {
    id: number;
    nombre?: string;
  };
}

  