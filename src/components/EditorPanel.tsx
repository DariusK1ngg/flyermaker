import React, { useState } from 'react';
import { 
  ShoppingBag, Palette, Type, Clock, Plus, Trash2, Edit2, 
  ArrowUp, ArrowDown, Star, Upload 
} from 'lucide-react';
import type { Product, FlyerConfig } from '../types';
import { THEMES } from '../data/themes';

interface EditorPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  config: FlyerConfig;
  setConfig: React.Dispatch<React.SetStateAction<FlyerConfig>>;
  onOpenCatalog: () => void;
  onOpenCustomModal: (product?: Product) => void;
}

type TabType = 'products' | 'style' | 'text' | 'duration';

export const EditorPanel: React.FC<EditorPanelProps> = ({
  products,
  setProducts,
  config,
  setConfig,
  onOpenCatalog,
  onOpenCustomModal
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('products');

  // Remove a product from the current flyer
  const handleRemoveProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Toggle yellow highlight on card
  const handleToggleHighlight = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) return { ...p, isHighlighted: !p.isHighlighted };
      return p;
    }));
  };

  // Move product up/down in array
  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === products.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setProducts(updated);
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, storeLogoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="editor-sidebar" style={{
      backgroundColor: 'var(--bg-panel)',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Navigation Tabs */}
      <div className="editor-tabs-header">
        <button
          onClick={() => setActiveTab('products')}
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          <ShoppingBag size={18} />
          <span>Productos</span>
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
        >
          <Palette size={18} />
          <span>Diseño</span>
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
        >
          <Type size={18} />
          <span>Textos</span>
        </button>
        <button
          onClick={() => setActiveTab('duration')}
          className={`tab-btn ${activeTab === 'duration' ? 'active' : ''}`}
        >
          <Clock size={18} />
          <span>Validez</span>
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
        
        {/* TAB 1: PRODUCTOS */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛒 Productos de la Oferta ({products.length})
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Selecciona del catálogo preestablecido o crea los tuyos con precio y descuento.
              </p>
            </div>

            {/* Quick Add Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={onOpenCatalog}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
              >
                <ShoppingBag size={18} /> + Abrir Catálogo de Productos
              </button>
              <button
                onClick={() => onOpenCustomModal()}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Plus size={18} /> + Cargar Producto Personalizado
              </button>
            </div>

            {/* Active Flyer Products List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                En el Flyer Actualmente:
              </span>

              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>No hay productos en el flyer.</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Haz clic en "Abrir Catálogo" para agregar banano, tomate, aguacate, etc.</p>
                </div>
              ) : (
                products.map((p, idx) => (
                  <div
                    key={p.id}
                    className="glass-card"
                    style={{
                      padding: '0.85rem',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: p.isHighlighted ? '4px solid #ffd740' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: p.isHighlighted ? 'rgba(255, 215, 64, 0.08)' : 'rgba(255,255,255,0.04)'
                    }}
                  >
                    {/* Thumbnail & Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                      <img src={p.image} alt={p.name} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px' }} />
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </h4>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                          {p.price} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{p.unit}</span>
                          {p.discount > 0 && <span style={{ color: '#ff3d47', fontSize: '0.75rem', marginLeft: '6px', fontWeight: 800 }}>(-{p.discount}%)</span>}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {/* Highlight yellow toggle */}
                      <button
                        onClick={() => handleToggleHighlight(p.id)}
                        title={p.isHighlighted ? "Quitar fondo amarillo" : "Destacar con fondo amarillo como en foto"}
                        style={{
                          background: p.isHighlighted ? '#ffd740' : 'rgba(255,255,255,0.08)',
                          color: p.isHighlighted ? '#0f172a' : '#94a3b8',
                          border: 'none',
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Star size={14} fill={p.isHighlighted ? '#0f172a' : 'none'} />
                      </button>

                      {/* Move UP */}
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: idx === 0 ? '#475569' : '#f8fafc', width: '26px', height: '26px', borderRadius: '6px', cursor: idx === 0 ? 'default' : 'pointer' }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      {/* Move DOWN */}
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === products.length - 1}
                        style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: idx === products.length - 1 ? '#475569' : '#f8fafc', width: '26px', height: '26px', borderRadius: '6px', cursor: idx === products.length - 1 ? 'default' : 'pointer' }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onOpenCustomModal(p)}
                        style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Edit2 size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleRemoveProduct(p.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#ef4444', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ESTILO & DISEÑO */}
        {activeTab === 'style' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🎨 Tema de Color y Textura
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                El estilo original "Verde Mercado" recrea exactamente la imagen que enviaste.
              </p>
            </div>

            {/* Custom Theme Switch & Controls */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1rem',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 700 }}>
                <span style={{ fontSize: '0.9rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🎨 Usar Colores Personalizados
                </span>
                <input 
                  type="checkbox"
                  checked={config.isCustomTheme}
                  onChange={(e) => setConfig(prev => ({ ...prev, isCustomTheme: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
                />
              </label>
              
              {config.isCustomTheme && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Fondo Base</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={config.customBgColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, customBgColor: e.target.value }))}
                        style={{ width: '42px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
                      />
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{config.customBgColor}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Banner Superior</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={config.customAccentColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, customAccentColor: e.target.value }))}
                        style={{ width: '42px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
                      />
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{config.customAccentColor}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Themes Palette Grid */}
            {!config.isCustomTheme && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span className="form-label" style={{ marginBottom: 0 }}>Temas Prediseñados:</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem' }}>
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setConfig(prev => ({ ...prev, themeId: t.id }))}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '16px',
                        border: config.themeId === t.id ? '2px solid #ffd740' : '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: t.bgGradient,
                          border: '2px solid rgba(255,255,255,0.3)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                        }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{t.name}</span>
                      </div>
                      {config.themeId === t.id && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#ffd740', color: '#0f172a', padding: '2px 8px', borderRadius: '12px' }}>
                          Activo
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TEXTOS Y LOGO */}
        {activeTab === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✍️ Textos del Encabezado y Logo
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Personaliza los títulos y el banner amarillo superior derecho.
              </p>
            </div>

            {/* Store Name in Top Right Badge */}
            <div>
              <label className="form-label">Texto del Banner Amarillo Superior ("TU LOGO AQUÍ")</label>
              <input
                type="text"
                value={config.storeName}
                onChange={(e) => setConfig(prev => ({ ...prev, storeName: e.target.value.toUpperCase() }))}
                placeholder="TU LOGO AQUÍ / MERCADO SAN JOSÉ"
                className="form-input"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="form-label">Subir Logo o Icono de la Tienda</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <label className="btn-secondary" style={{ cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                  <Upload size={16} /> Seleccionar Archivo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
                {config.storeLogoUrl && (
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, storeLogoUrl: undefined }))}
                    className="btn-secondary"
                    style={{ padding: '0.65rem', color: '#ef4444' }}
                    title="Quitar logo subido"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Top Title Solid */}
            <div>
              <label className="form-label">Título Principal (Línea 1 Sólida)</label>
              <input
                type="text"
                value={config.titleTop}
                onChange={(e) => setConfig(prev => ({ ...prev, titleTop: e.target.value.toUpperCase() }))}
                placeholder="OFERTA"
                className="form-input"
              />
            </div>

            {/* Outlined Title */}
            <div>
              <label className="form-label">Título Secundario (Línea 2 con Contorno Hueco)</label>
              <input
                type="text"
                value={config.titleOutline}
                onChange={(e) => setConfig(prev => ({ ...prev, titleOutline: e.target.value.toUpperCase() }))}
                placeholder="ESPECIAL"
                className="form-input"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="form-label">Subtítulo Descriptivo</label>
              <textarea
                rows={2}
                value={config.subtitle}
                onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value.toUpperCase() }))}
                placeholder="ENCUENTRA LOS MEJORES DESCUENTOS EN TU MERCADO DE CONFIANZA"
                className="form-input"
                style={{ resize: 'none' }}
              />
            </div>

            {/* Social Handle Footer */}
            <div>
              <label className="form-label">Texto o Red Social en Pie de Página</label>
              <input
                type="text"
                value={config.footerHandle}
                onChange={(e) => setConfig(prev => ({ ...prev, footerHandle: e.target.value }))}
                placeholder="@sitioincreible / www.tumercado.com"
                className="form-input"
              />
            </div>

            {/* Typography Size Customization */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📏 Tamaño de los Textos
              </h4>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.75rem' }}>Título Principal</label>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>{config.titleFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={config.titleFontSize}
                  onChange={(e) => setConfig(prev => ({ ...prev, titleFontSize: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.75rem' }}>Título Contorno</label>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>{config.outlineFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={config.outlineFontSize}
                  onChange={(e) => setConfig(prev => ({ ...prev, outlineFontSize: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.75rem' }}>Subtítulo</label>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>{config.subtitleFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  value={config.subtitleFontSize}
                  onChange={(e) => setConfig(prev => ({ ...prev, subtitleFontSize: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.75rem' }}>Tarjetas (Nombre/Precio)</label>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>{config.cardFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  value={config.cardFontSize}
                  onChange={(e) => setConfig(prev => ({ ...prev, cardFontSize: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.75rem' }}>% Descuento (Globo)</label>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>{config.discountFontSize || 20}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={config.discountFontSize || 20}
                  onChange={(e) => setConfig(prev => ({ ...prev, discountFontSize: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.75rem' }}>Texto de Duración</label>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>{config.durationFontSize || 12}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={config.durationFontSize || 12}
                  onChange={(e) => setConfig(prev => ({ ...prev, durationFontSize: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.75rem' }}>Escala de Imágenes</label>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>{Math.round((config.imageScale || 1.0) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={config.imageScale || 1.0}
                  onChange={(e) => setConfig(prev => ({ ...prev, imageScale: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DURACIÓN Y VALIDEZ */}
        {activeTab === 'duration' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⏳ Duración de la Oferta
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Define cuánto tiempo va a durar la promoción: hasta agotar stock o por tiempo limitado.
              </p>
            </div>

            {/* Duration Types */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              {/* Option 0: No mostrar distintivo (Ocultar) */}
              <label style={{
                padding: '1rem',
                borderRadius: '16px',
                border: config.durationType === 'none' ? '2px solid #ffd740' : '1px solid rgba(255,255,255,0.1)',
                background: config.durationType === 'none' ? 'rgba(255, 215, 64, 0.1)' : 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <input
                  type="radio"
                  name="duration"
                  checked={config.durationType === 'none'}
                  onChange={() => setConfig(prev => ({ ...prev, durationType: 'none' }))}
                  style={{ width: '18px', height: '18px', accentColor: '#ffd740', marginTop: '2px' }}
                />
                <div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', display: 'block' }}>
                    🙈 Ocultar Distintivo de Validez
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginTop: '2px' }}>
                    No se mostrará ninguna etiqueta de validez o stock en el pie del flyer, igual que en el diseño de referencia.
                  </span>
                </div>
              </label>

              {/* Option 1: Hasta Agotar Stock */}
              <label style={{
                padding: '1rem',
                borderRadius: '16px',
                border: config.durationType === 'stock' ? '2px solid #ffd740' : '1px solid rgba(255,255,255,0.1)',
                background: config.durationType === 'stock' ? 'rgba(255, 215, 64, 0.1)' : 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <input
                  type="radio"
                  name="duration"
                  checked={config.durationType === 'stock'}
                  onChange={() => setConfig(prev => ({ ...prev, durationType: 'stock' }))}
                  style={{ width: '18px', height: '18px', accentColor: '#ffd740', marginTop: '2px' }}
                />
                <div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', display: 'block' }}>
                    ⏰ Hasta Agotar Stock
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginTop: '2px' }}>
                    Muestra el distintivo clásico "HASTA AGOTAR STOCK" al pie del flyer.
                  </span>
                </div>
              </label>

              {/* Option 2: Por Tiempo Limitado */}
              <label style={{
                padding: '1rem',
                borderRadius: '16px',
                border: config.durationType === 'limited' ? '2px solid #ffd740' : '1px solid rgba(255,255,255,0.1)',
                background: config.durationType === 'limited' ? 'rgba(255, 215, 64, 0.1)' : 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <input
                  type="radio"
                  name="duration"
                  checked={config.durationType === 'limited'}
                  onChange={() => setConfig(prev => ({ ...prev, durationType: 'limited' }))}
                  style={{ width: '18px', height: '18px', accentColor: '#ffd740', marginTop: '2px' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', display: 'block' }}>
                    📅 Por Tiempo Limitado (Con Fechas)
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginTop: '2px' }}>
                    Indica una fecha límite para generar sentido de urgencia.
                  </span>
                  {config.durationType === 'limited' && (
                    <div style={{ marginTop: '0.85rem' }}>
                      <input
                        type="text"
                        value={config.validUntilDate || ''}
                        onChange={(e) => setConfig(prev => ({ ...prev, validUntilDate: e.target.value }))}
                        placeholder="Ej: DOMINGO 15 DE JULIO / FIN DE SEMANA"
                        className="form-input"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: Custom Text */}
              <label style={{
                padding: '1rem',
                borderRadius: '16px',
                border: config.durationType === 'custom' ? '2px solid #ffd740' : '1px solid rgba(255,255,255,0.1)',
                background: config.durationType === 'custom' ? 'rgba(255, 215, 64, 0.1)' : 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <input
                  type="radio"
                  name="duration"
                  checked={config.durationType === 'custom'}
                  onChange={() => setConfig(prev => ({ ...prev, durationType: 'custom' }))}
                  style={{ width: '18px', height: '18px', accentColor: '#ffd740', marginTop: '2px' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', display: 'block' }}>
                    ✨ Mensaje Personalizado
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginTop: '2px' }}>
                    Escribe tu propio anuncio de duración o condición de oferta.
                  </span>
                  {config.durationType === 'custom' && (
                    <div style={{ marginTop: '0.85rem' }}>
                      <input
                        type="text"
                        value={config.durationText}
                        onChange={(e) => setConfig(prev => ({ ...prev, durationText: e.target.value.toUpperCase() }))}
                        placeholder="Ej: SOLO POR ESTE JUEVES DE QUINCENA!"
                        className="form-input"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
