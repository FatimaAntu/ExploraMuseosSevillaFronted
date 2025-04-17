import { Museo } from './museo.model';

export interface Exposicion {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;  // o Date si lo prefieres
  fechaFin: string;     // o Date
  imagen: string;
  museo: Museo;         // Relación con el museo al que pertenece
  esTemporal?: boolean; // Indica si es una exposición temporal o permanente
}

  