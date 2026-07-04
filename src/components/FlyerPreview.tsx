import { forwardRef, useState, useEffect, useRef } from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import type { Product, FlyerConfig, ThemeColor } from '../types';
import { THEMES } from '../data/themes';

interface FlyerPreviewProps {
  products: Product[];
  config: FlyerConfig;
}

// Utility to darken a hex color for smooth custom gradients
const darkenHexColor = (hex: string, percent: number) => {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  const amt = Math.round(2.55 * percent);
  let R = (num >> 16) - amt;
  let G = (num >> 8 & 0x00FF) - amt;
  let B = (num & 0x0000FF) - amt;

  R = Math.max(0, Math.min(255, R));
  G = Math.max(0, Math.min(255, G));
  B = Math.max(0, Math.min(255, B));

  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

export const FlyerPreview = forwardRef<HTMLDivElement, FlyerPreviewProps>(({ products, config }, ref) => {
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const touchStartRef = useRef({
    distance: 0,
    zoom: 1,
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
    isPinching: false,
    isPanning: false
  });

  const baseWidth = 540;
  const baseHeight = config.format === 'story' ? 960 : 540;
  const isPost = config.format === 'post';

  const scaledWidth = baseWidth * scale * zoom;
  const scaledHeight = baseHeight * scale * zoom;

  // Zoom control handlers
  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 2.0));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.4));
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      touchStartRef.current = {
        ...touchStartRef.current,
        distance,
        zoom,
        isPinching: true,
        isPanning: false
      };
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        ...touchStartRef.current,
        x: touch.clientX,
        y: touch.clientY,
        panX: pan.x,
        panY: pan.y,
        isPinching: false,
        isPanning: true
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchStartRef.current.isPinching) {
      if (e.cancelable) e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = distance / touchStartRef.current.distance;
      setZoom(Math.max(0.4, Math.min(touchStartRef.current.zoom * ratio, 3.0)));
    } else if (e.touches.length === 1 && touchStartRef.current.isPanning) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      setPan({
        x: touchStartRef.current.panX + dx,
        y: touchStartRef.current.panY + dy
      });
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current.isPinching = false;
    touchStartRef.current.isPanning = false;
  };

  // Determine active theme color setup
  let theme: ThemeColor;
  if (config.isCustomTheme) {
    theme = {
      id: 'custom',
      name: 'Custom',
      bgGradient: `linear-gradient(135deg, ${config.customBgColor} 0%, ${darkenHexColor(config.customBgColor, 25)} 100%)`,
      textColor: '#ffffff',
      accentColor: config.customAccentColor,
      badgeBg: '#f43f5e',
      badgeText: '#ffffff',
      highlightCardBg: '#ffe566',
      normalCardBg: '#ffffff',
      patternType: 'mesh'
    };
  } else {
    theme = THEMES.find(t => t.id === config.themeId) || THEMES[0];
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const scaleX = (width - 32) / baseWidth;
        const scaleY = (height - 32) / baseHeight;
        setScale(Math.min(scaleX, scaleY));
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [config.format, baseWidth, baseHeight]);

  // Auto-sizing metrics based on number of products (Max 4) and custom image scale multiplier
  const scaleMultiplier = config.imageScale || 1.0;
  const imgMaxHeight = products.length <= 2 
    ? `${(isPost ? 90 : 190) * scaleMultiplier}px` 
    : `${(isPost ? 62 : 130) * scaleMultiplier}px`;

  return (
    <div 
      ref={containerRef} 
      className="flyer-preview-wrapper"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Floating Zoom Controls (Premium Obsidian styling) */}
      <div className="zoom-controls">
        <button 
          onClick={zoomOut} 
          style={{ padding: '4px 8px', fontSize: '0.9rem', border: 'none', background: 'transparent', height: '24px', display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#cbd5e1' }}
          title="Zoom Out"
        >
          -
        </button>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white', minWidth: '42px', textAlign: 'center', fontFamily: 'monospace' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={zoomIn} 
          style={{ padding: '4px 8px', fontSize: '0.9rem', border: 'none', background: 'transparent', height: '24px', display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#cbd5e1' }}
          title="Zoom In"
        >
          +
        </button>
        <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
        <button 
          onClick={resetZoom} 
          style={{ padding: '2px 8px', fontSize: '0.75rem', border: 'none', color: '#10b981', background: 'transparent', fontWeight: 700, cursor: 'pointer' }}
          title="Reset Zoom to 100%"
        >
          Ajustar
        </button>
      </div>

      <div style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        margin: 'auto'
      }}>
        <div style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale * zoom})`,
          transformOrigin: 'center center',
          transition: touchStartRef.current.isPinching || touchStartRef.current.isPanning ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
        <div
          ref={ref}
          className={`flyer-canvas format-${config.format} pattern-${theme.patternType}`}
          style={{
            background: theme.bgGradient,
            color: theme.textColor,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: isPost ? '1rem 1.25rem' : '2.5rem 2rem 1.75rem 2rem',
            position: 'relative'
          }}
        >
          {/* Hanging Store Logo Badge (Top Right) */}
          <div 
            className="hanging-logo-badge"
            style={{
              backgroundColor: theme.accentColor,
              color: '#d32f2f',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              transform: isPost ? 'scale(0.8)' : 'none',
              transformOrigin: 'top right'
            }}
          >
            {config.storeLogoUrl ? (
              <img 
                src={config.storeLogoUrl} 
                alt="Logo" 
                style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: '4px' }} 
              />
            ) : (
              <svg viewBox="0 0 24 24" width="30" height="30" fill="#e53935" style={{ marginBottom: '4px' }}>
                <path d="M20 4H4v2h16V4zm1 4l-1-3H4L3 8v2c0 .55.45 1 1 1h1a1.99 1.99 0 0 0 1.8-1.18c.28.69.96 1.18 1.7 1.18.74 0 1.42-.49 1.7-1.18.28.69.96 1.18 1.7 1.18.74 0 1.42-.49 1.7-1.18A1.99 1.99 0 0 0 17 11h1c.55 0 1-.45 1-1V8zm-1 5v7H4v-7h16zm-3 5H7v-3h10v3z" />
              </svg>
            )}
            <span style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem', 
              fontWeight: 900, 
              letterSpacing: '0.5px', 
              textTransform: 'uppercase',
              textAlign: 'center',
              color: '#c62828'
            }}>
              {config.storeName || 'TU LOGO AQUÍ'}
            </span>
          </div>

          {/* TOP HEADER SECTION */}
          <div style={{ 
            textAlign: 'left', 
            marginTop: products.length <= 2 
              ? (isPost ? '1rem' : '5.5rem') 
              : (isPost ? '0.15rem' : '0.5rem'), 
            marginBottom: isPost ? '0.5rem' : '1.25rem', 
            zIndex: 5, 
            paddingRight: isPost ? '100px' : '120px' 
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: `${config.titleFontSize * (isPost ? 0.68 : 1.0)}px`,
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: '-1.5px',
              textTransform: 'uppercase',
              color: '#ffffff',
              textShadow: '0 4px 12px rgba(0,0,0,0.2)',
              margin: 0
            }}>
              {config.titleTop || 'OFERTA'}
            </h2>
            <h2 className="text-outline-white" style={{
              fontFamily: '"Arial Black", Impact, sans-serif',
              fontSize: `${config.outlineFontSize * (isPost ? 0.68 : 1.0)}px`,
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: '-1.5px',
              textTransform: 'uppercase',
              margin: isPost ? '1px 0 6px 0' : '2px 0 14px 0'
            }}>
              {config.titleOutline || 'ESPECIAL'}
            </h2>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: `${config.subtitleFontSize * (isPost ? 0.82 : 1.0)}px`,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: '#ffffff',
              opacity: 0.95,
              maxWidth: '100%',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {config.subtitle || 'ENCUENTRA LOS MEJORES DESCUENTOS EN TU MERCADO DE CONFIANZA'}
            </p>
          </div>

          {/* PRODUCTS LIST (Dynamic vertical flexbox layout to auto-grow/size correctly without blank spaces) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: products.length === 1 
              ? '1fr' 
              : 'repeat(2, 1fr)',
            gap: isPost ? '0.75rem' : '1.5rem',
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: products.length === 1 ? '380px' : '440px', // Center cluster horizontally
            margin: isPost ? '0.2rem auto' : '0.5rem auto', // Centered
            zIndex: 5
          }}>
            {products.slice(0, 4).map((product) => {
              const isYellow = product.isHighlighted;
              const cardBg = isYellow ? theme.highlightCardBg : theme.normalCardBg;
              const badgeBgColor = isYellow ? '#ffffff' : theme.badgeBg;
              const badgeTextColor = isYellow ? '#14532d' : theme.badgeText;
              const titleColor = '#14532d'; // Dark forest green
              const priceColor = '#14532d'; // Dark forest green

              const isCenteredThird = products.length === 3 && products.indexOf(product) === 2;

              return (
                <div
                  key={product.id}
                  className="product-card-flyer"
                  style={{
                    backgroundColor: cardBg,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: isPost
                      ? '0.75rem 0.6rem 0.6rem 0.6rem'
                      : (products.length <= 2 ? '1.75rem 1.25rem 1.25rem 1.25rem' : '1.25rem 1rem 1rem 1rem'),
                    gridColumn: isCenteredThird ? '1 / span 2' : 'span 1',
                    justifySelf: 'center',
                    maxWidth: products.length === 1 
                      ? '380px' 
                      : isCenteredThird 
                        ? 'calc(50% - 0.75rem)' // Matches single column width assuming 1.5rem gap
                        : '100%',
                    height: '100%',
                    minHeight: products.length <= 2 
                      ? (isPost ? '135px' : '300px') 
                      : (isPost ? '95px' : '220px')
                  }}
                >
                  {/* Hanging discount ribbon */}
                  {product.discount > 0 && (
                    <div className="hanging-sale-badge" style={{
                      backgroundColor: badgeBgColor,
                      color: badgeTextColor,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                      padding: isPost ? '6px 6px 8px 6px' : '8px 8px 10px 8px',
                      borderBottomLeftRadius: '12px',
                      borderBottomRightRadius: '12px',
                      top: 0,
                      right: isPost ? '8px' : '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: `${(config.discountFontSize || 20) * (isPost ? 0.8 : 1.0) * 2.1}px`
                    }}>
                      <span style={{ 
                        fontFamily: 'var(--font-display)',
                        fontSize: `${(config.discountFontSize || 20) * (isPost ? 0.8 : 1.0)}px`, 
                        fontWeight: 900, 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        lineHeight: 1
                      }}>
                        {product.discount}
                        <span style={{ fontSize: `${(config.discountFontSize || 20) * (isPost ? 0.8 : 1.0) * 0.6}px`, fontWeight: 800, marginTop: '1px', marginLeft: '0.5px' }}>%</span>
                      </span>
                    </div>
                  )}

                  {/* Centered Product Image */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: products.length <= 2 ? '12px 0' : '4px 0',
                    minHeight: 0
                  }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      crossOrigin="anonymous"
                      style={{
                        maxHeight: imgMaxHeight,
                        maxWidth: '85%',
                        objectFit: 'contain',
                        mixBlendMode: 'multiply'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  {/* Bottom Product Info */}
                  <div style={{ textAlign: 'center', width: '100%', zIndex: 2, marginTop: isPost ? '2px' : '8px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: `${config.cardFontSize * (isPost ? 0.82 : 1.0)}px`,
                      fontWeight: 800,
                      color: titleColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: '0',
                      lineHeight: 1.1,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.name}
                    </h3>
                    
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: `${config.cardFontSize * 1.3 * (isPost ? 0.82 : 1.0)}px`,
                      fontWeight: 900,
                      color: priceColor,
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'center',
                      gap: '4px',
                      marginTop: '1px',
                      whiteSpace: 'nowrap'
                    }}>
                      <span>{product.price}</span>
                      {product.unit && (
                        <span style={{ fontSize: `${config.cardFontSize * 0.9 * (isPost ? 0.82 : 1.0)}px`, fontWeight: 800, textTransform: 'lowercase' }}>
                          {product.unit.replace(/^\s*[\/\-]\s*/, '')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}          </div>
 
          {/* FOOTER & DURATION BANNER */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isPost ? '0.3rem' : '0.6rem',
            marginTop: isPost ? '0.5rem' : '1.25rem',
            zIndex: 5
          }}>
            {/* Duration Badge */}
            {config.durationType !== 'none' && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(8px)',
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                {config.durationType === 'stock' ? (
                  <>
                    <Clock size={15} style={{ color: '#ffd740' }} className="animate-pulse-subtle" />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: `${config.durationFontSize || 12}px`, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#ffffff' }}>
                      HASTA AGOTAR STOCK
                    </span>
                  </>
                ) : config.durationType === 'limited' ? (
                  <>
                    <Calendar size={15} style={{ color: '#ffd740' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: `${config.durationFontSize || 12}px`, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#ffffff' }}>
                      {config.validUntilDate ? `VÁLIDO HASTA: ${config.validUntilDate}` : 'POR TIEMPO LIMITADO'}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} style={{ color: '#ffd740' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: `${config.durationFontSize || 12}px`, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#ffffff' }}>
                      {config.durationText || 'OFERTA ESPECIAL DEL MES'}
                    </span>
                  </>
                )}
              </div>
            )}
 
            {/* Social Handle Footer */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              fontWeight: 800,
              letterSpacing: '1px',
              color: '#ffffff',
              opacity: 0.95,
              textShadow: '0 2px 4px rgba(0,0,0,0.4)'
            }}>
              {config.footerHandle || '@sitioincreible'}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
});

FlyerPreview.displayName = 'FlyerPreview';
