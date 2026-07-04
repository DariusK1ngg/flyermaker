import React, { useState } from 'react';
import { X, Search, Plus, Check, ShoppingBag, Trash2 } from 'lucide-react';
import type { Product } from '../types';
import { PREDEFINED_PRODUCTS } from '../data/predefinedProducts';

interface PredefinedCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  currentProductIds: string[];
  dbProducts: Product[];
  onDeleteProduct: (id: string) => Promise<void>;
}

export const PredefinedCatalogModal: React.FC<PredefinedCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  currentProductIds,
  dbProducts,
  onDeleteProduct
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  // Combine predefined list and custom Neon DB products
  const allProducts = [...dbProducts, ...PREDEFINED_PRODUCTS];

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
      zIndex: 100,
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
              <ShoppingBag className="text-accent" /> Catálogo de Productos Preestablecidos
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Haz clic en cualquier producto para agregarlo automáticamente a tu flyer de ofertas (Máximo 4)
            </p>
          </div>
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
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
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
              const isCustomDbProduct = dbProducts.some(dbP => dbP.id === product.id);

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
                  {/* Delete Button for Custom DB products */}
                  {isCustomDbProduct && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const confirmDelete = window.confirm(
                          `¿Estás seguro de que deseas eliminar "${product.name}" de tu catálogo?`
                        );
                        if (confirmDelete) {
                          onDeleteProduct(product.id);
                        }
                      }}
                      title="Eliminar de Neon DB"
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
                  )}

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

                  {product.isHighlighted && !isCustomDbProduct && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
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

                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ height: '80px', objectFit: 'contain', margin: '0.75rem 0' }}
                  />

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
