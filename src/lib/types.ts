export interface User {
  id: string;
  nombre?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  comuna?: string;
  instagram?: string;
  email: string;
  celular?: string;
  promociones: boolean;
}

export interface Allergen {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  image: string;
  'data-ai-hint': string;
  categoryId: string;
  allergens: string[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Reservation {
  id: string;
  date: Date;
  time: string;
  people: number;
  preference: 'Interior' | 'Terraza' | 'Barra';
  reason: 'General' | 'Celebración' | 'Cumpleaños' | 'Cita' | 'Negocios';
  comments?: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
  user: {
    nombre: string;
    apellidos: string;
    email: string;
    celular: string;
  }
}

export interface Visit {
  id: string;
  date: Date;
  reason: string;
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
  qrCode: string;
}
