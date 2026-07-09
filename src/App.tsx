import { useState, useEffect, useRef } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import type { Product, FlyerConfig } from './types';
import { PREDEFINED_PRODUCTS } from './data/predefinedProducts';
import { Navbar } from './components/Navbar';
import { EditorPanel } from './components/EditorPanel';
import { FlyerPreview } from './components/FlyerPreview';
import { PredefinedCatalogModal } from './components/PredefinedCatalogModal';
import { ProductModal } from './components/ProductModal';

export function App() {
  // Start with the exact 4 products from reference photo
  const [products, setProducts] = useState<Product[]>(() => {
    return PREDEFINED_PRODUCTS.slice(0, 4);
  });

  // Neon DB custom products state
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  const [config, setConfig] = useState<FlyerConfig>({
    titleTop: 'OFERTA',
    titleOutline: 'ESPECIAL',
    subtitle: 'ENCUENTRA LOS MEJORES DESCUENTOS EN TU MERCADO DE CONFIANZA',
    storeName: 'TU LOGO AQUÍ',
    footerHandle: '@sitioincreible',
    durationType: 'none',
    durationText: 'HASTA AGOTAR STOCK',
    validUntilDate: 'DOMINGO 15 DE JULIO',
    themeId: 'verde-mercado',
    format: 'story',
    gridColumns: 2,

    // Typography default sizes (px)
    titleFontSize: 60,
    outlineFontSize: 60,
    subtitleFontSize: 16,
    cardFontSize: 16,
    discountFontSize: 20,
    durationFontSize: 12,
    imageScale: 1.0,

    // Custom Color Theme defaults
    isCustomTheme: false,
    customBgColor: '#1a7a3b',
    customAccentColor: '#ffd740'
  });

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadStep, setDownloadStep] = useState<string>('');
  
  // Custom Toast State
  const [toast, setToast] = useState<{ title: string; message: string; type: 'info' | 'warning' | 'error' | 'success' } | null>(null);

  const showToast = (title: string, message: string, type: 'info' | 'warning' | 'error' | 'success' = 'warning') => {
    setToast({ title, message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const flyerDomRef = useRef<HTMLDivElement>(null);

  // Fetch saved products from Neon DB on component mount
  const fetchDbProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDbProducts(data);
        }
      }
    } catch (err) {
      console.error('Failed to load custom products from Neon DB:', err);
    }
  };

  useEffect(() => {
    fetchDbProducts();
  }, []);

  // Handle saving custom or edited product
  const handleSaveProduct = async (newProduct: Product): Promise<boolean> => {
    const isEdit = products.some(p => p.id === newProduct.id);
    const isFull = !isEdit && products.length >= 4;

    if (isFull) {
      showToast(
        'Producto guardado en catálogo',
        'El producto se guardó en tu catálogo, pero no se pudo agregar al flyer actual porque ya tiene el límite máximo de 4 productos.',
        'warning'
      );
    } else {
      // 1. Update active flyer grid state
      setProducts(prev => {
        if (isEdit) {
          return prev.map(p => p.id === newProduct.id ? newProduct : p);
        } else {
          return [...prev, newProduct];
        }
      });
    }

    // 2. Save/Update custom product in Neon DB
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        fetchDbProducts();
      }
    } catch (err) {
      console.error('Error saving product to Neon DB:', err);
    }

    return true;
  };

  // Handle selecting product from catalog modal
  const handleSelectFromCatalog = (product: Product) => {
    const exists = products.some(p => p.id === product.id);
    if (exists) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      if (products.length >= 4) {
        showToast(
          'Límite de Productos',
          'Para mantener un diseño armónico y legible, el flyer está limitado a un máximo de 4 productos destacados.',
          'warning'
        );
        return;
      }
      setProducts(prev => [...prev, product]);
    }
  };

  // Delete custom product from Neon DB
  const handleDeleteProductFromDb = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        // Also remove from active flyer if selected
        setProducts(prev => prev.filter(p => p.id !== id));
        fetchDbProducts();
      }
    } catch (err) {
      console.error('Error deleting product from Neon DB:', err);
    }
  };

  // Open edit modal for specific product
  const handleOpenEditModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct(null);
    }
    setIsCustomModalOpen(true);
  };

  // Download flyer as PNG or JPG
  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!flyerDomRef.current) return;
    setIsGenerating(true);
    setDownloadStep('Iniciando exportación de flyer...');

    try {
      // Small delays to visually guide user through the processing steps
      await new Promise(resolve => setTimeout(resolve, 500));
      setDownloadStep('Procesando productos e imágenes...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setDownloadStep('Renderizando lienzo en alta definición (2.5x)...');
      
      const options = {
        quality: 0.98,
        pixelRatio: 2.5, // High resolution for crystal clear print & social media sharing
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      };

      let dataUrl: string;
      if (format === 'png') {
        dataUrl = await toPng(flyerDomRef.current, options);
      } else {
        const themeBg = config.isCustomTheme ? config.customBgColor : '#1fa24b';
        dataUrl = await toJpeg(flyerDomRef.current, { ...options, backgroundColor: themeBg });
      }

      setDownloadStep('Generando archivo final...');
      await new Promise(resolve => setTimeout(resolve, 400));

      const link = document.createElement('a');
      link.download = `oferta-flyer-${config.format}-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();

      setDownloadStep('¡Flyer descargado con éxito!');
      await new Promise(resolve => setTimeout(resolve, 600));
    } catch (err) {
      console.error('Error al generar la imagen del flyer:', err);
      showToast(
        'Error al Exportar',
        'Hubo un problema al generar la imagen del flyer. Por favor, intenta de nuevo.',
        'error'
      );
    } finally {
      setIsGenerating(false);
      setDownloadStep('');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        config={config}
        setConfig={setConfig}
        onDownload={handleDownload}
        isGenerating={isGenerating}
      />

      {/* Main Content: Left Editor + Right Real-time Preview */}
      <main className="main-content">
        <EditorPanel
          products={products}
          setProducts={setProducts}
          config={config}
          setConfig={setConfig}
          onOpenCatalog={() => setIsCatalogOpen(true)}
          onOpenCustomModal={handleOpenEditModal}
        />

        <FlyerPreview
          ref={flyerDomRef}
          products={products}
          config={config}
        />
      </main>

      {/* Modals */}
      <PredefinedCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectProduct={handleSelectFromCatalog}
        currentProductIds={products.map(p => p.id)}
        dbProducts={dbProducts}
        onDeleteProduct={handleDeleteProductFromDb}
        onEditProduct={handleOpenEditModal}
      />

      <ProductModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {isGenerating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(7, 9, 14, 0.85)',
          backdropFilter: 'blur(16px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          userSelect: 'none'
        }}>
          {/* Animated Spinner container */}
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Spinning custom border class (added in index.css) */}
            <div className="animate-spin-custom" style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '3px solid rgba(16, 185, 129, 0.1)',
              borderTopColor: '#10b981'
            }} />
            
            {/* Download Icon in center */}
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#10b981" strokeWidth="2.5" className="animate-bounce" style={{ animationDuration: '1.5s' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            color: '#10b981',
            textShadow: '0 0 20px rgba(16,185,129,0.3)'
          }}>
            Exportando Flyer
          </h3>
          <p style={{
            fontFamily: 'var(--font-main)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#cbd5e1'
          }}>
            {downloadStep}
          </p>
        </div>
      )}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          animation: 'slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          pointerEvents: 'none'
        }}>
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)',
            borderLeft: `4px solid ${
              toast.type === 'error' ? 'var(--accent-red)' :
              toast.type === 'success' ? 'var(--accent-emerald)' :
              toast.type === 'info' ? 'var(--text-secondary)' :
              'var(--accent-gold)'
            }`,
            background: 'rgba(19, 25, 41, 0.95)',
            backdropFilter: 'blur(12px)',
            maxWidth: '420px',
            width: 'calc(100vw - 32px)',
            pointerEvents: 'auto'
          }}>
            <span style={{ fontSize: '1.25rem' }}>
              {toast.type === 'error' ? '❌' :
               toast.type === 'success' ? '✅' :
               toast.type === 'info' ? 'ℹ️' :
               '⚠️'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
              <strong style={{ 
                fontFamily: 'var(--font-display)', 
                color: toast.type === 'error' ? 'var(--accent-red)' :
                       toast.type === 'success' ? 'var(--accent-emerald)' :
                       toast.type === 'info' ? 'var(--text-secondary)' :
                       'var(--accent-gold)', 
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {toast.title}
              </strong>
              <span style={{ 
                fontFamily: 'var(--font-main)', 
                color: 'var(--text-primary)', 
                fontSize: '0.85rem', 
                lineHeight: '1.4' 
              }}>
                {toast.message}
              </span>
            </div>
            <button 
              onClick={() => setToast(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
                marginLeft: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
