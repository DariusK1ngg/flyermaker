import React from 'react';
import { Sparkles, Download, Layout, Smartphone, Square } from 'lucide-react';
import type { FlyerConfig } from '../types';

interface NavbarProps {
  config: FlyerConfig;
  setConfig: React.Dispatch<React.SetStateAction<FlyerConfig>>;
  onDownload: (format: 'png' | 'jpeg') => void;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ config, setConfig, onDownload, isGenerating }) => {
  return (
    <header className="main-header">
      {/* Brand & Logo */}
      <div className="header-brand">
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #ffd740 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f172a',
          fontWeight: 900,
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          flexShrink: 0
        }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            FlyerMaker <span style={{ color: '#ffd740', fontSize: '0.8rem', backgroundColor: 'rgba(255, 215, 64, 0.15)', padding: '2px 8px', borderRadius: '20px', border: '1px solid rgba(255, 215, 64, 0.3)' }}>PRO</span>
          </h1>
          <p className="hide-on-mobile" style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Generador Automático de Ofertas</p>
        </div>
      </div>

      {/* Format Selector (Story, Post) */}
      <div className="format-selector">
        <span className="hide-on-mobile" style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layout size={14} /> Formato:
        </span>
        <button
          onClick={() => setConfig(prev => ({ ...prev, format: 'story' }))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: config.format === 'story' ? '#10b981' : 'transparent',
            color: config.format === 'story' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s'
          }}
        >
          <Smartphone size={14} />
          <span>Story<span className="hide-on-mobile"> (9:16)</span></span>
        </button>
        <button
          onClick={() => setConfig(prev => ({ ...prev, format: 'post' }))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: config.format === 'post' ? '#10b981' : 'transparent',
            color: config.format === 'post' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s'
          }}
        >
          <Square size={14} />
          <span>Post<span className="hide-on-mobile"> (1:1)</span></span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="header-actions">
        <button
          onClick={() => onDownload('png')}
          disabled={isGenerating}
          className="btn-accent"
          style={{ opacity: isGenerating ? 0.7 : 1, padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
        >
          <Download size={16} />
          <span>{isGenerating ? 'Generando...' : <>Descargar <span className="hide-on-mobile">Flyer </span>(PNG)</>}</span>
        </button>

        <button
          onClick={() => onDownload('jpeg')}
          disabled={isGenerating}
          className="btn-secondary"
          title="Descargar como JPG de alta calidad"
          style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
        >
          JPG
        </button>
      </div>
    </header>
  );
};
