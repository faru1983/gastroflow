import type { User, Product, Category, Allergen, Reservation, Visit, Benefit } from './types';

export const mockUser: User = {
  id: '1',
  nombre: 'Ana',
  apellidos: 'Pérez',
  fechaNacimiento: '1995-05-20',
  comuna: 'Providencia',
  instagram: '@anaperez',
  email: 'ana.perez@example.com',
  celular: '+56912345678',
  promociones: true,
};

export const mockAdminUser: User = {
  id: '2',
  nombre: 'Admin',
  apellidos: 'GastroFlow',
  fechaNacimiento: '1990-01-01',
  comuna: 'Santiago',
  instagram: '@gastroflow',
  email: 'admin@admin.com',
  celular: '+56987654321',
  promociones: false,
};

export const allergens: Allergen[] = [
  { id: 'gluten', name: 'Gluten' },
  { id: 'lacteos', name: 'Lácteos' },
  { id: 'frutos-secos', name: 'Frutos Secos' },
  { id: 'soja', name: 'Soja' },
  { id: 'mariscos', name: 'Mariscos' },
];

export const categories: Category[] = [
  { id: 'entradas', name: 'Entradas' },
  { id: 'platos-principales', name: 'Platos Principales' },
  { id: 'postres', name: 'Postres' },
  { id: 'bebidas', name: 'Bebidas' },
];

export const products: Product[] = [
  // Entradas
  {
    id: '1',
    name: 'Ceviche Clásico',
    description: 'Trozos de pescado fresco marinados en jugo de limón, cilantro, y ají.',
    price: 12500,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'ceviche food',
    categoryId: 'entradas',
    allergens: ['mariscos'],
  },
  {
    id: '2',
    name: 'Empanadas de Pino',
    description: 'Clásicas empanadas chilenas rellenas de carne, cebolla, huevo y aceitunas.',
    price: 8500,
    offerPrice: 7500,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'empanadas food',
    categoryId: 'entradas',
    allergens: ['gluten', 'lacteos'],
  },
  {
    id: '8',
    name: 'Pulpo al Olivo',
    description: 'Finas láminas de pulpo bañadas en una cremosa salsa de aceitunas de botija.',
    price: 13800,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'octopus appetizer',
    categoryId: 'entradas',
    allergens: ['mariscos'],
  },
  {
    id: '9',
    name: 'Provoleta al Orégano',
    description: 'Queso provolone derretido a la plancha con un toque de orégano y aceite de oliva.',
    price: 9900,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'melted cheese',
    categoryId: 'entradas',
    allergens: ['lacteos'],
  },
  // Platos Principales
  {
    id: '3',
    name: 'Lomo Saltado',
    description: 'Trozos de lomo de res salteados con cebolla, tomate y papas fritas, acompañado de arroz.',
    price: 15900,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'lomo saltado',
    categoryId: 'platos-principales',
    allergens: ['soja'],
  },
  {
    id: '4',
    name: 'Salmón a la Plancha',
    description: 'Filete de salmón fresco a la plancha con un toque de finas hierbas, servido con puré rústico.',
    price: 17200,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'salmon dish',
    categoryId: 'platos-principales',
    allergens: [],
  },
  {
    id: '10',
    name: 'Risotto de Champiñones',
    description: 'Cremoso risotto preparado con una variedad de champiñones frescos y queso parmesano.',
    price: 14500,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'mushroom risotto',
    categoryId: 'platos-principales',
    allergens: ['lacteos'],
  },
  {
    id: '11',
    name: 'Costillar de Cerdo BBQ',
    description: 'Tierno costillar de cerdo cocido lentamente y bañado en nuestra salsa BBQ casera.',
    price: 18500,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'pork ribs',
    categoryId: 'platos-principales',
    allergens: [],
  },
  // Postres
  {
    id: '5',
    name: 'Tiramisú',
    description: 'Postre italiano clásico con capas de bizcocho, café, mascarpone y cacao.',
    price: 6500,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'tiramisu dessert',
    categoryId: 'postres',
    allergens: ['gluten', 'lacteos'],
  },
  {
    id: '12',
    name: 'Cheesecake de Maracuyá',
    description: 'Suave cheesecake sobre una base de galleta, cubierto con una salsa de maracuyá.',
    price: 7200,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'passionfruit cheesecake',
    categoryId: 'postres',
    allergens: ['gluten', 'lacteos'],
  },
  {
    id: '13',
    name: 'Volcán de Chocolate',
    description: 'Queque tibio con centro de chocolate líquido, acompañado de helado de vainilla.',
    price: 7500,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'chocolate lava',
    categoryId: 'postres',
    allergens: ['gluten', 'lacteos'],
  },
  // Bebidas
  {
    id: '6',
    name: 'Mote con Huesillo',
    description: 'Bebida tradicional chilena con duraznos secos y trigo mote.',
    price: 4500,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'mote con huesillo',
    categoryId: 'bebidas',
    allergens: ['gluten'],
  },
  {
    id: '7',
    name: 'Pisco Sour',
    description: 'Cóctel emblemático preparado con pisco, jugo de limón y clara de huevo.',
    price: 5500,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'pisco sour',
    categoryId: 'bebidas',
    allergens: [],
  },
  {
    id: '14',
    name: 'Jugo Natural',
    description: 'Refrescante jugo de fruta de la estación (consultar por sabores disponibles).',
    price: 3800,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'fresh juice',
    categoryId: 'bebidas',
    allergens: [],
  },
  {
    id: '15',
    name: 'Copa de Vino Reserva',
    description: 'Selección de vinos reserva de viñas chilenas (Cabernet, Carmenere, Sauvignon Blanc).',
    price: 6000,
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'glass wine',
    categoryId: 'bebidas',
    allergens: [],
  },
];

export const mockReservations: Reservation[] = [
  {
    id: 'res1',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    time: '20:00',
    people: 2,
    preference: 'Terraza',
    reason: 'Cita',
    status: 'confirmada',
    user: { nombre: 'Ana', apellidos: 'Pérez', email: 'ana.perez@example.com', celular: '+56912345678' }
  },
  {
    id: 'res2',
    date: new Date(new Date().setDate(new Date().getDate() - 10)),
    time: '21:00',
    people: 4,
    preference: 'Interior',
    reason: 'Celebración',
    status: 'cancelada',
    user: { nombre: 'Ana', apellidos: 'Pérez', email: 'ana.perez@example.com', celular: '+56912345678' }
  }
];

export const mockVisits: Visit[] = [
  { id: 'v1', date: new Date('2024-07-10T20:30:00'), reason: 'Cena con amigos' },
  { id: 'v2', date: new Date('2024-06-15T13:00:00'), reason: 'Almuerzo de negocios' },
  { id: 'v3', date: new Date('2024-05-20T21:00:00'), reason: 'Cumpleaños' },
  { id: 'v4', date: new Date('2024-04-01T19:00:00'), reason: 'Cita' },
];

export const activeBenefits: Benefit[] = [
  { 
    id: 'b1', 
    name: '40% de Descuento', 
    description: '¡Felicidades! Has acumulado 5 visitas. Disfruta de un 40% de descuento en tu próxima cuenta (tope $50.000).', 
    qrCode: 'https://placehold.co/300x300.png'
  }
];

export const usedBenefits: Benefit[] = [
    { 
    id: 'b2', 
    name: 'Postre Gratis', 
    description: 'Beneficio de 3 visitas, utilizado el 15/06/2024.', 
    qrCode: ''
  }
]
