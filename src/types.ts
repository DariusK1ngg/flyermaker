export interface Product {
  id: string;
  name: string;
  price: string;
  unit: string;
  discount: number;
  image: string;
  isHighlighted?: boolean;
  category: 'frutas' | 'verduras' | 'carnes' | 'lacteos' | 'panaderia' | 'bebidas' | 'despensa' | 'snacks';
}

export type DurationType = 'stock' | 'limited' | 'custom' | 'none';

export interface FlyerConfig {
  titleTop: string;
  titleOutline: string;
  subtitle: string;
  storeName: string;
  storeLogoUrl?: string;
  footerHandle: string;
  durationType: DurationType;
  durationText: string;
  validUntilDate?: string;
  themeId: string;
  format: 'story' | 'post';
  gridColumns: 2 | 3;
  
  // Custom Typography sizes
  titleFontSize: number;
  outlineFontSize: number;
  subtitleFontSize: number;
  cardFontSize: number;
  discountFontSize: number;
  durationFontSize?: number;
  imageScale?: number;

  // Custom Colors
  isCustomTheme: boolean;
  customBgColor: string;
  customAccentColor: string;
}

export interface ThemeColor {
  id: string;
  name: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  highlightCardBg: string;
  normalCardBg: string;
  patternType: 'mesh' | 'dots' | 'waves' | 'grid';
}
