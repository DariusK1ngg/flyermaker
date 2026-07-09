import React, { useState } from 'react';
import { X, Search, Plus, Check, ShoppingBag, Trash2, Edit2 } from 'lucide-react';
import type { Product } from '../types';
import { PREDEFINED_PRODUCTS } from '../data/predefinedProducts';

interface PredefinedCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  currentProductIds: string[];
  dbProducts: Product[];
  onDeleteProduct: (id: string) => Promise<void>;
  onEditProduct: (product: Product) => void;
}

export const PredefinedCatalogModal: React.FC<PredefinedCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  currentProductIds,
  dbProducts,
  onDeleteProduct,
  onEditProduct
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deleted_catalog_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  // Deduplicate and combine predefined list and custom Neon DB products
  const dbProductIds = new Set(dbProducts.map(p => p.id));
  const filteredPredefined = PREDEFINED_PRODUCTS.filter(p => !dbProductIds.has(p.id));
  const allProducts = [...dbProducts, ...filteredPredefined].filter(p => !deletedProductIds.includes(p.id));

  const filteredProducts = allProducts.filter(p => {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '95%',
        maxWidth: '850px',
        maxHeight: '90vh',
        borderRadius: '28px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag className="text-accent" /> Catálogo de Productos
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Haz clic en cualquier producto para agregarlo automáticamente a tu flyer de ofertas (Máximo 4)
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {deletedProductIds.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Deseas restablecer todos los productos eliminados del catálogo?')) {
                    setDeletedProductIds([]);
                    localStorage.removeItem('deleted_catalog_products');
                  }
                }}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '10px', whiteSpace: 'nowrap' }}
              >
                Restablecer Catálogo
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#f8fafc',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Buscar por nombre (ej: Banano, Tomate, Aguacate...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="catalog-products-grid" style={{
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'grid',
          gap: '1rem',
          flex: 1
        }}>
          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No se encontraron productos</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: '#64748b' }}>
                Prueba buscando otro término o crea un producto personalizado desde la barra lateral.
              </p>
            </div>
          ) : (
            filteredProducts.map(product => {
              const isAdded = currentProductIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="glass-card"
                  onClick={() => onSelectProduct(product)}
                  style={{
                    borderRadius: '16px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    position: 'relative',
                    border: isAdded ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: product.isHighlighted ? 'rgba(255, 225, 105, 0.12)' : 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Delete Button for any product */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const confirmDelete = window.confirm(
                        `¿Estás seguro de que deseas eliminar "${product.name}" de tu catálogo?`
                      );
                      if (confirmDelete) {
                        const updated = [...deletedProductIds, product.id];
                        setDeletedProductIds(updated);
                        localStorage.setItem('deleted_catalog_products', JSON.stringify(updated));
                        onDeleteProduct(product.id);
                      }
                    }}
                    title="Eliminar de catálogo"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: 'none',
                      color: '#f43f5e',
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.35)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Edit Button for any product */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct(product);
                    }}
                    title="Editar producto"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '38px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#cbd5e1',
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
                  >
                    <Edit2 size={13} />
                  </button>

                  {/* Discount Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#ff3d47',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '8px'
                  }}>
                    -{product.discount}%
                  </div>

                  {product.isHighlighted && (
                    <div style={{
                      position: 'absolute',
                      top: '40px',
                      left: '8px',
                      backgroundColor: '#ffd740',
                      color: '#0f172a',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      ★ Destacado
                    </div>
                  )}

                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ height: '80px', objectFit: 'contain', margin: '0.75rem 0' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                      }}
                    />
                  ) : (
                    <div style={{
                      height: '80px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b',
                      gap: '4px',
                      margin: '0.75rem 0'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>SIN IMAGEN</span>
                    </div>
                  )}

                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </h4>
                     <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px' }}>
                       <span>{product.price}</span>
                       {product.unit && (
                         <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginLeft: '2px' }}>/ {product.unit}</span>
                       )}
                     </div>
                  </div>

                  <button
                    style={{
                      width: '100%',
                      marginTop: '0.85rem',
                      padding: '6px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isAdded ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> Agregado
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Agregar
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
