export type Rol = 'USER' | 'ADMIN';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}
