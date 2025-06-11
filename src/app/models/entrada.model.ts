
export interface Entrada {
  id: number;
  cantidad: number;
  totalPagado: number;
  fechaCompra: string; 
  exposicion: {
    id: number;
    nombre: string;
  };
  usuario?: {
    id: number;
    nombre?: string;
  };
}
