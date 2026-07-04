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
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.85rem 1.75rem',
      backgroundColor: 'var(--bg-panel)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      zIndex: 50
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            FlyerMaker <span style={{ color: '#ffd740', fontSize: '0.8rem', backgroundColor: 'rgba(255, 215, 64, 0.15)', padding: '2px 8px', borderRadius: '20px', border: '1px solid rgba(255, 215, 64, 0.3)' }}>PRO</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Generador Automático de Ofertas</p>
        </div>
      </div>

      {/* Format Selector (Story, Post, Landscape) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '4px',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        gap: '4px'
      }}>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
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
          Story (9:16)
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
          Post (1:1)
        </button>

      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => onDownload('png')}
          disabled={isGenerating}
          className="btn-accent"
          style={{ opacity: isGenerating ? 0.7 : 1 }}
        >
          <Download size={18} />
          {isGenerating ? 'Generando...' : 'Descargar Flyer (PNG)'}
        </button>

        <button
          onClick={() => onDownload('jpeg')}
          disabled={isGenerating}
          className="btn-secondary"
          title="Descargar como JPG de alta calidad"
        >
          JPG
        </button>
      </div>
    </header>
  );
};
