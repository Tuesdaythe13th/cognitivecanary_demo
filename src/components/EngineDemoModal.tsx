import { useEffect, useRef, useState } from 'react';
import type { DrawFn } from '@/lib/engineVisualizations';

interface EngineDemoModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  tag: string;
  desc: string;
  draw: DrawFn;
  index: number;
}

/**
 * Full-screen slide-up modal with an expanded interactive engine visualization.
 * Uses CSS transforms for the slide animation and an enlarged canvas.
 */
const EngineDemoModal = ({ open, onClose, name, tag, desc, draw, index }: EngineDemoModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  // Manage mount/unmount with animation timing
  useEffect(() => {
    if (open) {
      setRendered(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRendered(false), 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  // Canvas animation loop — only when visible
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = index * 0.6;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      draw(ctx, canvas.offsetWidth, canvas.offsetHeight, t);
      t += prefersReducedMotion ? 0 : 0.016;
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [visible, draw, index]);

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!rendered) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-5xl mx-4 mb-4 sm:mx-6 sm:mb-6 electric-card-container theme-green flex flex-col"
        style={{
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(100%) scale(0.95)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
          maxHeight: '90vh',
        }}
      >
        <div className="electric-glow-layer-1" />
        <div className="electric-glow-layer-2" />
        <div className="electric-background-glow" />
        
        <div className="electric-inner-container flex-1 min-h-0 flex flex-col">
          <div className="electric-border-outer flex-1 min-h-0 flex flex-col">
            <div className="electric-main-card flex-1 min-h-0 flex flex-col">
              <div className="electric-overlay-1" />
              <div className="electric-overlay-2" />
              
              {/* Content */}
              <div className="electric-content-container relative z-10 overflow-y-auto flex-1 h-full max-h-[90vh]">

          {/* Header bar */}
          <div className="flex items-center justify-between p-6 pb-0">
            <div className="flex items-center gap-4">
              <span
                className="w-3 h-3 rounded-full bg-primary"
                style={{ boxShadow: '0 0 10px hsla(142, 71%, 50%, 0.8)', animation: 'pulse 2s ease-in-out infinite' }}
              />
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-mono text-[10px] text-primary/40 tracking-wider">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl font-bold text-foreground tracking-tight" style={{ lineHeight: 1.2 }}>{name}</h3>
                </div>
                <span className="text-mono text-[10px] text-muted-foreground/50 mt-0.5 block">{tag}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group flex items-center gap-2 text-[10px] font-mono px-4 py-2 border border-white/10 text-white/40 hover:text-white hover:border-primary/40 transition-all uppercase tracking-widest rounded-lg"
            >
              <span>Close</span>
              <kbd className="text-[8px] border border-white/10 px-1.5 py-0.5 rounded text-white/20 group-hover:text-white/40 transition-colors">ESC</kbd>
            </button>
          </div>

          {/* Canvas visualization — large */}
          <div className="p-6">
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: '14px',
                border: '1px solid hsla(142, 71%, 45%, 0.12)',
                boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              <canvas
                ref={canvasRef}
                className="w-full"
                style={{ height: '380px' }}
                aria-label={`${name} interactive visualization`}
                role="img"
              />
              {/* Scanline overlay */}
              <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30" />
              {/* Corner decorations */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-primary/30" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-primary/30" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-primary/30" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-primary/30" />
              {/* Status overlay with user's loader */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="loader-container transform scale-50 -ml-1">
                  <div className="radar" style={{ '--size': '16px' } as any}></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]">Live Render</span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Engine {String(index + 1).padStart(2, '0')} / 07</span>
              </div>
            </div>
          </div>

          {/* Engine description */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Description card */}
              <div className="md:col-span-2 glass-panel p-5 bg-white/[0.02]">
                <div className="text-[9px] font-mono text-primary/50 uppercase tracking-widest mb-3">Engine Description</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>

              {/* Stats card */}
              <div className="glass-panel p-5 bg-white/[0.02]">
                <div className="text-[9px] font-mono text-primary/50 uppercase tracking-widest mb-3">Status</div>
                <div className="space-y-3">
                  {[
                    { label: 'Status', value: 'ACTIVE', color: 'text-primary' },
                    { label: 'Latency', value: '<1ms', color: 'text-primary' },
                    { label: 'Coverage', value: '100%', color: 'text-primary' },
                    { label: 'Module', value: tag, color: 'text-muted-foreground' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/30 uppercase">{stat.label}</span>
                      <span className={`text-[10px] font-mono font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default EngineDemoModal;
