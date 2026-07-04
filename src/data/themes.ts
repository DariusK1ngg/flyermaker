import type { ThemeColor } from '../types';

export const THEMES: ThemeColor[] = [
  {
    id: 'verde-mercado',
    name: 'Verde Mercado (Estilo Original)',
    bgGradient: 'linear-gradient(135deg, #1fa24b 0%, #157e38 50%, #0e632a 100%)',
    textColor: '#ffffff',
    accentColor: '#ffd740', // Yellow top badge
    badgeBg: '#ff3d47', // Red hanging discount badge
    badgeText: '#ffffff',
    highlightCardBg: '#ffe566', // Aguacate yellow card in photo
    normalCardBg: '#ffffff',
    patternType: 'mesh'
  },
  {
    id: 'rojo-oferta',
    name: 'Rojo Descuento Explosivo',
    bgGradient: 'linear-gradient(135deg, #e52d27 0%, #b31217 50%, #800a0e 100%)',
    textColor: '#ffffff',
    accentColor: '#ffeb3b',
    badgeBg: '#111111',
    badgeText: '#ffffff',
    highlightCardBg: '#fff385',
    normalCardBg: '#ffffff',
    patternType: 'dots'
  },
  {
    id: 'azul-confianza',
    name: 'Azul Supermercado Premium',
    bgGradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #172852 100%)',
    textColor: '#ffffff',
    accentColor: '#00e676',
    badgeBg: '#ff1744',
    badgeText: '#ffffff',
    highlightCardBg: '#b9f6ca',
    normalCardBg: '#ffffff',
    patternType: 'grid'
  },
  {
    id: 'naranja-express',
    name: 'Naranja Fresco & Express',
    bgGradient: 'linear-gradient(135deg, #f857a6 0%, #ff5858 50%, #e03232 100%)',
    textColor: '#ffffff',
    accentColor: '#fff9c4',
    badgeBg: '#311b92',
    badgeText: '#ffffff',
    highlightCardBg: '#ffecb3',
    normalCardBg: '#ffffff',
    patternType: 'waves'
  },
  {
    id: 'morado-mega',
    name: 'Morado Mega Sale Fino',
    bgGradient: 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
    textColor: '#ffffff',
    accentColor: '#00e5ff',
    badgeBg: '#ff007f',
    badgeText: '#ffffff',
    highlightCardBg: '#e0f7fa',
    normalCardBg: '#ffffff',
    patternType: 'mesh'
  },
  {
    id: 'oscuro-gourmet',
    name: 'Oscuro Gourmet Elegante',
    bgGradient: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)',
    textColor: '#ffffff',
    accentColor: '#d4af37',
    badgeBg: '#e50914',
    badgeText: '#ffffff',
    highlightCardBg: '#fff8e7',
    normalCardBg: '#f8f9fa',
    patternType: 'grid'
  }
];
