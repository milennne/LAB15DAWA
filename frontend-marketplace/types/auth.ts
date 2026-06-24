export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'CUSTOMER' | 'ADMIN';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  rol?: 'CUSTOMER' | 'ADMIN';
}