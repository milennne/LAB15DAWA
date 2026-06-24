export interface Product {
  id: number;
  nombre: string;
  precio: number | string;
  descripcion: string;
  imageUrl?: string;
  CategoryId?: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}