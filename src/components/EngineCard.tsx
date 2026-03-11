import { useEffect, useRef, useState } from 'react';
import type { DrawFn } from '@/lib/engineVisualizations';

interface EngineCardProps {
  name: string;
  tag: string;
  desc: string;
  draw: DrawFn;
  index: number;
  isInView: boolean;
  onClick?: () => void;
}

/**
 * A single defense engine card with a live canvas visualization.
 * The animation loop pauses when the card is not in the viewport.
 */
const EngineCard = ({ name, tag, desc, draw, index, isInView, onClick }: EngineCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = index * 0.6;

    // Check for reduced motion preference
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
      if (!isInView) {
        // Pause when off-screen; re-schedule a check
        animId = requestAnimationFrame(loop);
        return;
      }
      draw(ctx, canvas.offsetWidth, canvas.offsetHeight, t);
      t += prefersReducedMotion ? 0 : 0.016;
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [draw, index, isInView]);

  return (
    <div
      className="glass-panel group overflow-hidden cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
        borderColor: hovered ? 'hsla(142, 71%, 40%, 0.45)' : undefined,
        boxShadow:   hovered ? '0 0 24px hsla(142, 71%, 35%, 0.2)' : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-52"
          aria-label={`${name} visualization`}
          role="img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <span className="text-mono text-[10px] text-primary/40 tracking-wider">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="text-sm text-foreground font-medium" style={{ lineHeight: '1.2' }}>{name}</h3>
          </div>
          <span className="flex items-center gap-1.5 text-mono text-[9px] text-primary/60 tracking-wider">
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary"
              style={{ boxShadow: '0 0 5px hsla(142,71%,50%,0.7)', animation: 'pulse 2s ease-in-out infinite' }}
            />
            ACTIVE
          </span>
        </div>
        <span className="text-mono text-[10px] text-muted-foreground/50 block mb-3">{tag}</span>
        <p className="text-body text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

export default EngineCard;
