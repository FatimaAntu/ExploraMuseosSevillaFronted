import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EntradaCompra {
  usuarioId: number;
  exposicionId: number;
  cantidad: number;
  totalPagado: number;
}

export interface Entrada {
  id: number;
  usuario: {
    id: number;
    nombre: string;
    // otros campos si los necesitas
  };
  exposicion: {
    id: number;
    nombre: string;
    // otros campos si los necesitas
  };
  cantidad: number;
  fechaCompra: string; // ISO string
  totalPagado: number;
}

@Injectable({
  providedIn: 'root'
})
export class EntradasService {

  private baseUrl = 'http://localhost:8080/api/entradas';

  constructor(private http: HttpClient) { }

  /**
   * Guarda la compra de entradas en el backend
   * @param compra objeto con usuarioId, exposicionId, cantidad y totalPagado
   */
  guardarCompra(compra: EntradaCompra): Observable<Entrada> {
    return this.http.post<Entrada>(`${this.baseUrl}/comprar`, compra);
  }

  /**
   * Obtiene todas las entradas compradas por un usuario
   * @param usuarioId id del usuario
   */
  getEntradasPorUsuario(usuarioId: number): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }

}
