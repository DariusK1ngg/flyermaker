import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import type { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<boolean> | boolean;
  initialProduct?: Product | null;
}

// Utility to strip non-digits and format with thousands dot separators
const formatGsPrice = (val: string) => {
  const clean = val.replace(/\D/g, '');
  if (!clean) return '';
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Utility to clean formatting and get raw number
const parsePriceToNumber = (val: string) => {
  const clean = val.replace(/\D/g, '');
  return clean ? parseInt(clean, 10) : 0;
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct
}) => {
  const [name, setName] = useState('');
  const [normalPrice, setNormalPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [discount, setDiscount] = useState<number | ''>('');
  const [image, setImage] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      
      const discPercent = initialProduct.discount > 0 ? initialProduct.discount : 0;
      const finalPriceNum = parsePriceToNumber(initialProduct.price);
      
      // Calculate original normal selling price
      let originalVal = finalPriceNum;
      if (discPercent > 0) {
        originalVal = Math.round(finalPriceNum / (1 - discPercent / 100));
      }
      
      setNormalPrice(formatGsPrice(String(originalVal)));
      
      let initialUnit = initialProduct.unit;
      if (initialUnit === 'und') initialUnit = 'uni';
      if (initialUnit === 'lb') initialUnit = 'gr';
      if (initialUnit === 'lt') initialUnit = 'lts';
      setUnit(initialUnit);

      setDiscount(discPercent > 0 ? discPercent : '');
      setImage(initialProduct.image);
      setIsHighlighted(!!initialProduct.isHighlighted);
    } else {
      setName('');
      setNormalPrice('');
      setUnit('kg');
      setDiscount('');
      setImage('');
      setIsHighlighted(false);
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setDiscount('');
      return;
    }
    // Only allow integer digits
    const digits = val.replace(/\D/g, '');
    if (digits === '') {
      setDiscount('');
      return;
    }
    const num = parseInt(digits, 10);
    if (num >= 0 && num <= 99) {
      setDiscount(num);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !normalPrice.trim()) return;

    // Calculate final discounted price
    const normalPriceNum = parsePriceToNumber(normalPrice);
    const discountNum = discount === '' ? 0 : discount;
    const finalPriceNum = Math.round(normalPriceNum * (1 - discountNum / 100));
    
    // Format the final price with dots and suffix
    const finalPriceStr = `${formatGsPrice(String(finalPriceNum))} Gs.`;

    const saved = await onSave({
      id: initialProduct ? initialProduct.id : `custom-${Date.now()}`,
      name: name.toUpperCase(),
      price: finalPriceStr,
      unit,
      discount: discount === '' ? 0 : discount,
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      isHighlighted,
      category: initialProduct?.category || 'frutas'
    });

    if (saved) {
      onClose();
    }
  };

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
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        borderRadius: '28px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles className="text-accent" size={20} />
            {initialProduct ? 'Editar Producto' : 'Crear Producto Personalizado'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#f8fafc',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form 
          onSubmit={handleSubmit} 
          style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem',
            overflowY: 'auto',
            flex: 1
          }}
        >
          {/* Product Name */}
          <div>
            <label className="form-label">Nombre del Producto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: AGUACATE HASS"
              required
              className="form-input"
            />
          </div>

          {/* Price & Unit in one row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Precio de Venta (Normal)</label>
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <input
                  type="text"
                  value={normalPrice}
                  onChange={(e) => setNormalPrice(formatGsPrice(e.target.value))}
                  placeholder="Ej: 15.000"
                  required
                  className="form-input"
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                />
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderLeft: 'none',
                  padding: '0 0.85rem',
                  borderTopRightRadius: '10px',
                  borderBottomRightRadius: '10px',
                  color: '#cbd5e1',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  Gs.
                </span>
              </div>
            </div>
            <div>
              <label className="form-label">Unidad (Medida)</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="form-input"
              >
                <option value="kg">kg (Kilo)</option>
                <option value="uni">uni (Unidad)</option>
                <option value="gr">gr (Gramos)</option>
                <option value="500g">500g (Medio kilo)</option>
                <option value="pack">pack / caja</option>
                <option value="lts">lts (Litro)</option>
                <option value="docena">docena</option>
              </select>
            </div>
          </div>

          {/* Discount % */}
          <div>
            <label className="form-label">Descuento (%)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Sin descuento (Ej: 20)"
              value={discount}
              onChange={handleDiscountChange}
              className="form-input"
            />
          </div>

          {/* Live Discount Calculation Display Card */}
          {(() => {
            const normalPriceNum = parsePriceToNumber(normalPrice);
            const discountNum = discount === '' ? 0 : discount;
            const calculatedOfferPriceNum = Math.round(normalPriceNum * (1 - discountNum / 100));
            const calculatedOfferPriceFormatted = formatGsPrice(String(calculatedOfferPriceNum));
            return (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '0.85rem 1rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block' }}>
                    Precio Final con Descuento (En el Flyer)
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981', marginTop: '2px', display: 'block' }}>
                    {calculatedOfferPriceFormatted ? `${calculatedOfferPriceFormatted} Gs.` : '0 Gs.'}
                  </span>
                </div>
                {discountNum > 0 && (
                  <span style={{
                    background: '#ff3d47',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}>
                    Ahorras {formatGsPrice(String(normalPriceNum - calculatedOfferPriceNum))} Gs. (-{discountNum}%)
                  </span>
                )}
              </div>
            );
          })()}

          {/* Highlight Yellow Card Toggle */}
          <div style={{
            background: 'rgba(255, 215, 64, 0.08)',
            border: '1px solid rgba(255, 215, 64, 0.25)',
            padding: '0.85rem 1rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }} onClick={() => setIsHighlighted(!isHighlighted)}>
            <div style={{ userSelect: 'none' }}>
              <span style={{ fontWeight: 800, color: '#ffd740', display: 'block', fontSize: '0.9rem' }}>
                ★ Destacar en Fondo Amarillo
              </span>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                Resalta esta tarjeta como en el Aguacate de la foto original
              </span>
            </div>
            <input
              type="checkbox"
              checked={isHighlighted}
              onChange={(e) => e.stopPropagation()} // Prevent double trigger
              onClick={(e) => {
                e.stopPropagation();
                setIsHighlighted(!isHighlighted);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#ffd740' }}
            />
          </div>

          {/* Image URL or File Upload */}
          <div>
            <label className="form-label">Imagen del Producto (PNG transparente recomendado)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Pegar URL de la imagen (o subir archivo abajo)"
                className="form-input"
              />
              <label className="btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Upload size={16} /> Subir
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {image && (
              <div style={{
                height: '80px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                border: '1px dashed rgba(255,255,255,0.15)'
              }}>
                <img src={image} alt="Preview" style={{ maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            )}
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexShrink: 0 }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {initialProduct ? 'Guardar Cambios' : 'Crear y Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
