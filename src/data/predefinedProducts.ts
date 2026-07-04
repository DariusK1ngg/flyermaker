import type { Product } from '../types';

export const PREDEFINED_PRODUCTS: Product[] = [
  // 4 Originales de la foto de referencia
  {
    id: 'banano-1',
    name: 'BANANO',
    price: '20.000 Gs.',
    unit: 'kg',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80&transparent=1',
    isHighlighted: false,
    category: 'frutas'
  },
  {
    id: 'tomate-1',
    name: 'TOMATE',
    price: '10.000 Gs.',
    unit: 'kg',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd46f?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'verduras'
  },
  {
    id: 'aguacate-1',
    name: 'AGUACATE',
    price: '5.000 Gs.',
    unit: 'kg',
    discount: 50,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
    isHighlighted: true,
    category: 'verduras'
  },
  {
    id: 'sandia-1',
    name: 'SANDIA',
    price: '12.000 Gs.',
    unit: 'kg',
    discount: 25,
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'frutas'
  },

  // Más Frutas y Verduras
  {
    id: 'manzana-roja',
    name: 'MANZANA ROJA',
    price: '8.500 Gs.',
    unit: 'kg',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'frutas'
  },
  {
    id: 'naranja-valencia',
    name: 'NARANJA DULCE',
    price: '6.000 Gs.',
    unit: 'kg',
    discount: 35,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'frutas'
  },
  {
    id: 'fresa-fresca',
    name: 'FRESAS DULCES',
    price: '15.000 Gs.',
    unit: 'gr',
    discount: 40,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
    isHighlighted: true,
    category: 'frutas'
  },
  {
    id: 'piña-oro',
    name: 'PIÑA ORO MIEL',
    price: '7.000 Gs.',
    unit: 'uni',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'frutas'
  },
  {
    id: 'cebolla-cabezona',
    name: 'CEBOLLA ROJA',
    price: '4.500 Gs.',
    unit: 'kg',
    discount: 10,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'verduras'
  },
  {
    id: 'zanahoria-fresca',
    name: 'ZANAHORIA',
    price: '3.500 Gs.',
    unit: 'kg',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'verduras'
  },
  {
    id: 'papa-pastusa',
    name: 'PAPA LAVADA',
    price: '5.500 Gs.',
    unit: 'kg',
    discount: 25,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'verduras'
  },
  {
    id: 'limon-tahiti',
    name: 'LIMÓN TAHITÍ',
    price: '6.500 Gs.',
    unit: 'kg',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'verduras'
  },

  // Carnes y Embutidos
  {
    id: 'carne-res',
    name: 'LOMO DE RES',
    price: '32.000 Gs.',
    unit: 'kg',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80',
    isHighlighted: true,
    category: 'carnes'
  },
  {
    id: 'pechuga-pollo',
    name: 'PECHUGA DE POLLO',
    price: '18.500 Gs.',
    unit: 'kg',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'carnes'
  },
  {
    id: 'chuleta-cerdo',
    name: 'CHULETA DE CERDO',
    price: '22.000 Gs.',
    unit: 'kg',
    discount: 25,
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'carnes'
  },

  // Lácteos y Huevos
  {
    id: 'leche-entera',
    name: 'LECHE ENTERA',
    price: '4.200 Gs.',
    unit: 'lts',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'lacteos'
  },
  {
    id: 'queso-doblema',
    name: 'QUESO CAMPESINO',
    price: '16.000 Gs.',
    unit: '500g',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80',
    isHighlighted: true,
    category: 'lacteos'
  },
  {
    id: 'huevos-a',
    name: 'HUEVOS ROJOS AA',
    price: '19.500 Gs.',
    unit: 'panal 30u',
    discount: 10,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'lacteos'
  },

  // Despensa
  {
    id: 'arroz-blanco',
    name: 'ARROZ PREMIUM',
    price: '5.500 Gs.',
    unit: 'kg',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'despensa'
  },
  {
    id: 'aceite-girasol',
    name: 'ACEITE GIRASOL',
    price: '14.000 Gs.',
    unit: '900ml',
    discount: 25,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    isHighlighted: true,
    category: 'despensa'
  },
  {
    id: 'cafe-colombiano',
    name: 'CAFÉ GOURMET',
    price: '24.000 Gs.',
    unit: '500g',
    discount: 35,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'despensa'
  },

  // Panadería y Snacks
  {
    id: 'pan-tajado',
    name: 'PAN ARTESANAL',
    price: '7.500 Gs.',
    unit: 'uni',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'panaderia'
  },
  {
    id: 'galletas-chocolate',
    name: 'GALLETAS CHIPS',
    price: '8.000 Gs.',
    unit: 'pack',
    discount: 40,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
    isHighlighted: true,
    category: 'snacks'
  },

  // Bebidas
  {
    id: 'jugo-naranja',
    name: 'JUGO NATURAL',
    price: '9.000 Gs.',
    unit: '1.5 lts',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80',
    isHighlighted: false,
    category: 'bebidas'
  },
  {
    id: 'cerveza-pack',
    name: 'CERVEZA PREMIUM',
    price: '28.000 Gs.',
    unit: '6 pack',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1608270196042-a8690097e277?w=600&auto=format&fit=crop&q=80',
    isHighlighted: true,
    category: 'bebidas'
  }
];
