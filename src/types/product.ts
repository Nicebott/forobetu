import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
  usuario: string;
  usuarioNombre: string;
  whatsapp: string;
  creadoEn: Timestamp;
}

export interface ProductFormData {
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: File | null;
  whatsapp: string;
}