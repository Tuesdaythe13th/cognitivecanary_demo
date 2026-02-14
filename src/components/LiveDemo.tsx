import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';

interface Point {
  x: number;
  y: number;
  t: number;
}

const LiveDemo = () => {
  const { ref, isInView } = useInView();
  const realCanvasRef = useRef<HTMLCanvasElement>(null);
  const obfCanvasRef = useRef<HTMLCanvasElement>(null);
  const [realPoints, setRealPoints] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tRef = useRef(0);

  const addPoint = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    setRealPoints(prev => [...prev.slice(-200), { x, y, t: now }]);
  }, []);

  // Draw real movement
  useEffect(() => {
    const canvas = realCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    if (realPoints.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = 'hsl(0, 0%, 12%)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    realPoints.forEach((p, i) => {
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Draw dot at last position
    const last = realPoints[realPoints.length - 1];
    ctx.beginPath();
    ctx.fillStyle = 'hsl(12, 74%, 51%)';
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [realPoints]);

  // Draw obfuscated movement
  useEffect(() => {
    const canvas = obfCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    if (realPoints.length < 2) return;

    // Apply Lissajous obfuscation
    ctx.beginPath();
    ctx.strokeStyle = 'hsl(12, 74%, 51%)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    tRef.current += 0.02;

    realPoints.forEach((p, i) => {
      const tremor = Math.sin(i * 0.3 + tRef.current * 5) * 12 + Math.sin(i * 0.7 + tRef.current * 3) * 8;
      const lissX = Math.sin(3 * (i * 0.05) + tRef.current) * 20;
      const lissY = Math.sin(4 * (i * 0.05)) * 15;
      const nx = p.x + tremor + lissX;
      const ny = p.y + tremor * 0.7 + lissY;
      i === 0 ? ctx.moveTo(nx, ny) : ctx.lineTo(nx, ny);
    });
    ctx.stroke();

    const last = realPoints[realPoints.length - 1];
    const lastTremor = Math.sin(realPoints.length * 0.3 + tRef.current * 5) * 12;
    ctx.beginPath();
    ctx.fillStyle = 'hsl(32, 92%, 63%)';
    ctx.arc(last.x + lastTremor, last.y + lastTremor * 0.7, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [realPoints]);

  return (
    <section id="demo" className="relative py-32 px-6" ref={ref}>
      <div className="absolute top-20 left-1/3 w-[600px] h-[600px] bg-secondary/15 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-body-medium text-primary text-sm tracking-[0.3em] uppercase mb-4">Live Demo</p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground">
            Move your mouse.<br />See the difference.
          </h2>
        </div>

        <div
          ref={containerRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '0.2s' }}
        >
          <div className="glass-panel p-6" onMouseMove={addPoint}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-foreground rounded-full" />
              <span className="text-body-medium text-sm text-foreground tracking-wider uppercase">Raw Input</span>
            </div>
            <canvas ref={realCanvasRef} className="w-full h-64 border border-border bg-background/50 cursor-crosshair" />
            <p className="text-xs text-muted-foreground mt-3">Your actual mouse trajectory — uniquely identifiable.</p>
          </div>

          <div className="glass-panel p-6" onMouseMove={addPoint}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-body-medium text-sm text-primary tracking-wider uppercase">Obfuscated Output</span>
            </div>
            <canvas ref={obfCanvasRef} className="w-full h-64 border border-primary/30 bg-primary/5 cursor-crosshair" />
            <p className="text-xs text-muted-foreground mt-3">Lissajous + Perlin tremor injection — identity destroyed.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
