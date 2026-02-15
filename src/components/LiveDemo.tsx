import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';

interface Point {
  x: number;
  y: number;
  t: number;
}

type Mode = 'stealth' | 'balanced' | 'maximum';

const modeConfig: Record<Mode, { label: string; amplitude: number; tremor: number; entropy: number; color: string }> = {
  stealth: { label: 'STEALTH', amplitude: 0.3, tremor: 0.4, entropy: 1.8, color: 'hsla(175, 60%, 45%, 0.8)' },
  balanced: { label: 'BALANCED', amplitude: 0.6, tremor: 0.7, entropy: 2.5, color: 'hsla(142, 71%, 45%, 0.8)' },
  maximum: { label: 'MAXIMUM', amplitude: 1.0, tremor: 1.0, entropy: 3.2, color: 'hsla(280, 60%, 60%, 0.8)' },
};

const LiveDemo = () => {
  const { ref, isInView } = useInView();
  const realCanvasRef = useRef<HTMLCanvasElement>(null);
  const obfCanvasRef = useRef<HTMLCanvasElement>(null);
  const [realPoints, setRealPoints] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tRef = useRef(0);
  const [mode, setMode] = useState<Mode>('balanced');
  const [entropy, setEntropy] = useState(0);

  const addPoint = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    setRealPoints(prev => [...prev.slice(-300), { x, y, t: now }]);
  }, []);

  const clearPoints = useCallback(() => {
    setRealPoints([]);
    setEntropy(0);
  }, []);

  // Draw raw movement with velocity heatmap
  useEffect(() => {
    const canvas = realCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    if (realPoints.length < 2) {
      // Placeholder text
      ctx.fillStyle = 'hsla(160, 10%, 35%, 0.5)';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('move your cursor here', w / 2, h / 2);
      ctx.textAlign = 'start';
      return;
    }

    // Draw trail with velocity coloring
    for (let i = 1; i < realPoints.length; i++) {
      const p = realPoints[i];
      const prev = realPoints[i - 1];
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      const vel = Math.sqrt(dx * dx + dy * dy);
      const age = (realPoints.length - i) / realPoints.length;
      const alpha = 0.15 + (1 - age) * 0.6;

      // Velocity → color (slow=cyan, fast=red)
      const hue = Math.max(0, Math.min(200, 200 - vel * 5));

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${alpha})`;
      ctx.lineWidth = 1.5 + vel * 0.08;
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    // Current position
    const last = realPoints[realPoints.length - 1];
    ctx.beginPath();
    ctx.fillStyle = 'hsla(0, 0%, 90%, 0.9)';
    ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
    ctx.fill();

    // Velocity text
    if (realPoints.length > 5) {
      const p2 = realPoints[realPoints.length - 1];
      const p1 = realPoints[realPoints.length - 5];
      const v = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2) / 4;
      ctx.fillStyle = 'hsla(0, 0%, 50%, 0.6)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`vel: ${v.toFixed(1)}px/f`, 8, h - 8);
    }
  }, [realPoints]);

  // Draw obfuscated movement
  useEffect(() => {
    const canvas = obfCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    const cfg = modeConfig[mode];

    if (realPoints.length < 2) {
      ctx.fillStyle = 'hsla(142, 71%, 35%, 0.4)';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('obfuscated output appears here', w / 2, h / 2);
      ctx.textAlign = 'start';
      return;
    }

    tRef.current += 0.02;
    const amp = cfg.amplitude;

    // Obfuscated trail
    const obfPoints: { x: number; y: number }[] = [];
    realPoints.forEach((p, i) => {
      // Lissajous displacement
      const lissX = Math.sin(3 * (i * 0.05) + tRef.current) * 25 * amp;
      const lissY = Math.sin(4 * (i * 0.05)) * 20 * amp;
      // Tremor injection (4-12Hz simulated)
      const tremor = (Math.sin(i * 0.3 + tRef.current * 5) * 12 + Math.sin(i * 0.7 + tRef.current * 3) * 8) * cfg.tremor;
      // Pink noise
      const noise = (Math.sin(i * 1.5 + tRef.current * 7) * 5 + Math.random() * 3) * amp;

      obfPoints.push({
        x: p.x + tremor + lissX + noise,
        y: p.y + tremor * 0.7 + lissY + noise * 0.5,
      });
    });

    // Draw obfuscated trail
    for (let i = 1; i < obfPoints.length; i++) {
      const age = (obfPoints.length - i) / obfPoints.length;
      const alpha = 0.2 + (1 - age) * 0.6;
      const hue = 142 + Math.sin(tRef.current + i * 0.02) * 20;

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, 71%, 45%, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.moveTo(obfPoints[i - 1].x, obfPoints[i - 1].y);
      ctx.lineTo(obfPoints[i].x, obfPoints[i].y);
      ctx.stroke();
    }

    // Glow dot
    const lastObf = obfPoints[obfPoints.length - 1];
    ctx.beginPath();
    ctx.fillStyle = cfg.color;
    ctx.shadowColor = cfg.color;
    ctx.shadowBlur = 8;
    ctx.arc(lastObf.x, lastObf.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Update entropy
    if (realPoints.length > 10) {
      const targetEntropy = cfg.entropy + Math.sin(tRef.current) * 0.2;
      setEntropy(prev => prev + (targetEntropy - prev) * 0.05);
    }

    // Mode label
    ctx.fillStyle = cfg.color;
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText(`H_s: ${entropy.toFixed(2)} nats`, 8, h - 8);
  }, [realPoints, mode, entropy]);

  return (
    <section id="demo" className="relative py-32 px-6" ref={ref}>
      <div className="section-divider mb-32" />
      <div className="absolute top-20 left-1/3 w-[600px] h-[600px] bg-secondary/15 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="tag-badge mb-6 inline-block">INTERACTIVE</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mt-4">
            Move your mouse.<br />See the difference.
          </h2>
        </div>

        {/* Controls */}
        <div className={`flex flex-wrap items-center gap-3 mb-6 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.15s' }}>
          <span className="text-mono text-xs text-muted-foreground mr-2">MODE:</span>
          {(Object.keys(modeConfig) as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-mono text-[10px] tracking-wider uppercase px-4 py-2 border transition-all duration-200 ${mode === m
                  ? 'border-primary bg-primary/15 text-primary neon-border-glow'
                  : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
            >
              {modeConfig[m].label}
            </button>
          ))}
          <button
            onClick={clearPoints}
            className="text-mono text-[10px] tracking-wider uppercase px-4 py-2 border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-all duration-200 ml-auto"
          >
            CLEAR
          </button>
        </div>

        <div
          ref={containerRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '0.2s' }}
        >
          {/* Raw Input */}
          <div className="glass-panel" onMouseMove={addPoint}>
            <div className="flex items-center gap-2 p-4 border-b border-border/50">
              <span className="w-2 h-2 bg-destructive/60 rounded-full" />
              <span className="text-mono text-[10px] text-destructive/80 tracking-wider uppercase">Surveillance Sees</span>
            </div>
            <canvas ref={realCanvasRef} className="w-full h-72 cursor-crosshair" />
            <div className="p-3 border-t border-border/50">
              <p className="text-mono text-[10px] text-muted-foreground/60">
                Your raw trajectory — velocity-colored heatmap reveals identifiable motor patterns.
              </p>
            </div>
          </div>

          {/* Obfuscated */}
          <div className="glass-panel" onMouseMove={addPoint}>
            <div className="flex items-center gap-2 p-4 border-b border-border/50">
              <span className="w-2 h-2 bg-primary rounded-full" style={{ boxShadow: '0 0 6px hsla(142, 71%, 50%, 0.5)' }} />
              <span className="text-mono text-[10px] text-primary tracking-wider uppercase">Canary Protects</span>
            </div>
            <canvas ref={obfCanvasRef} className="w-full h-72 cursor-crosshair" />
            <div className="p-3 border-t border-border/50">
              <p className="text-mono text-[10px] text-muted-foreground/60">
                Lissajous + tremor + pink noise injection — identity destroyed. [mode: {modeConfig[mode].label}]
              </p>
            </div>
          </div>
        </div>

        {/* Entropy Gauge */}
        <div className={`mt-6 glass-panel p-5 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.3s' }}>
          <div className="flex items-center gap-4">
            <span className="text-mono text-[10px] text-muted-foreground tracking-wider uppercase whitespace-nowrap">
              Spectral Entropy
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.min(100, (entropy / 3.5) * 100)}%`,
                  background: `linear-gradient(90deg,
                    hsla(175, 60%, 45%, 0.8),
                    hsla(142, 71%, 45%, 0.8) 50%,
                    hsla(280, 60%, 60%, 0.8))`,
                  boxShadow: `0 0 8px hsla(142, 71%, 50%, ${entropy / 5})`,
                }}
              />
            </div>
            <span className="text-mono text-xs text-primary" style={{ minWidth: '70px' }}>
              {entropy.toFixed(2)} / 3.20
            </span>
            <span className={`text-mono text-[10px] px-2 py-0.5 border ${entropy > 2.8
                ? 'text-primary border-primary/30 bg-primary/10'
                : entropy > 1.5
                  ? 'text-secondary border-secondary/30 bg-secondary/10'
                  : 'text-muted-foreground border-border'
              }`}>
              {entropy > 2.8 ? 'PROTECTED' : entropy > 1.5 ? 'MODERATE' : 'EXPOSED'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
