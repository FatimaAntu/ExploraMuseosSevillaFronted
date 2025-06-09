
export interface Entrada {
  id: number;
  cantidad: number;
  totalPagado: number;
  fechaCompra: string; // o Date si haces conversión
  exposicion: {
    id: number;
    nombre: string;
  };
  usuario?: {
    id: number;
    nombre?: string;
  };
}
