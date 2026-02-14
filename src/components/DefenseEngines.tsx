import { useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

interface Engine {
  name: string;
  tag: string;
  desc: string;
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
}

const engines: Engine[] = [
  {
    name: 'Lissajous Trajectory Rewriter',
    tag: 'MOUSE',
    desc: 'Replaces cursor paths with mathematically generated Lissajous curves, destroying trajectory-based fingerprints.',
    drawFn: (ctx, w, h, t) => {
      ctx.strokeStyle = 'hsla(12, 74%, 51%, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 300; i++) {
        const a = (i / 300) * Math.PI * 8;
        const x = w / 2 + Math.sin(3 * a + t) * (w * 0.35);
        const y = h / 2 + Math.sin(4 * a) * (h * 0.35);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    },
  },
  {
    name: 'Perlin Tremor Injector',
    tag: 'TREMOR',
    desc: 'Injects naturalistic micro-tremors into pointer position using layered Perlin noise generators.',
    drawFn: (ctx, w, h, t) => {
      ctx.strokeStyle = 'hsla(32, 92%, 63%, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < w; i++) {
        const noise = Math.sin(i * 0.05 + t * 3) * 8 + Math.sin(i * 0.12 + t * 5) * 4 + Math.sin(i * 0.3 + t * 8) * 2;
        const y = h / 2 + noise;
        i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
      }
      ctx.stroke();
    },
  },
  {
    name: 'Keystroke Jitter Engine',
    tag: 'KEYSTROKES',
    desc: 'Randomizes inter-key timing with bounded noise to defeat keystroke dynamics profiling.',
    drawFn: (ctx, w, h, t) => {
      const barCount = 20;
      const barW = (w - 20) / barCount;
      for (let i = 0; i < barCount; i++) {
        const barH = 10 + Math.abs(Math.sin(i * 0.7 + t * 2)) * (h - 30);
        ctx.fillStyle = `hsla(345, 100%, 77%, ${0.3 + Math.sin(i + t) * 0.2})`;
        ctx.fillRect(10 + i * barW, h - barH - 5, barW - 2, barH);
      }
    },
  },
  {
    name: 'Scroll Phantom Generator',
    tag: 'SCROLL',
    desc: 'Generates phantom scroll events with realistic velocity profiles to mask genuine reading behavior.',
    drawFn: (ctx, w, h, t) => {
      ctx.strokeStyle = 'hsla(12, 74%, 51%, 0.5)';
      ctx.lineWidth = 1;
      for (let j = 0; j < 5; j++) {
        ctx.beginPath();
        for (let i = 0; i < w; i++) {
          const y = h * 0.2 + j * (h * 0.15) + Math.sin(i * 0.03 + t * (1 + j * 0.3)) * 15;
          i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
        }
        ctx.stroke();
      }
    },
  },
  {
    name: 'Session Entropy Mixer',
    tag: 'SESSION',
    desc: 'Continuously rotates behavioral signatures across sessions to prevent cross-session correlation.',
    drawFn: (ctx, w, h, t) => {
      for (let i = 0; i < 40; i++) {
        const x = (Math.sin(t * 0.5 + i * 1.2) * 0.5 + 0.5) * w;
        const y = (Math.cos(t * 0.3 + i * 0.9) * 0.5 + 0.5) * h;
        const r = 2 + Math.sin(t + i) * 1.5;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${(i * 25 + t * 30) % 360}, 70%, 60%, 0.5)`;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        // Draw connections
        for (let j = i + 1; j < Math.min(i + 4, 40); j++) {
          const x2 = (Math.sin(t * 0.5 + j * 1.2) * 0.5 + 0.5) * w;
          const y2 = (Math.cos(t * 0.3 + j * 0.9) * 0.5 + 0.5) * h;
          const dist = Math.hypot(x2 - x, y2 - y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(12, 74%, 51%, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
    },
  },
];

const MiniCanvas = ({ drawFn }: { drawFn: Engine['drawFn'] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      drawFn(ctx, w, h, t);
      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [drawFn]);

  return <canvas ref={canvasRef} className="w-full h-40" />;
};

const DefenseEngines = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="engines" className="relative py-32 px-6" ref={ref}>
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-accent/15 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-body-medium text-primary text-sm tracking-[0.3em] uppercase mb-4">Defense Engines</p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground">
            Five layers<br />of deception.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engines.map((engine, i) => (
            <div
              key={engine.name}
              className={`glass-panel group hover:border-primary/50 transition-all duration-500 overflow-hidden ${
                i === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="bg-foreground/5">
                <MiniCanvas drawFn={engine.drawFn} />
              </div>
              <div className="p-6">
                <span className="inline-block text-xs text-body-medium tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 mb-3">
                  {engine.tag}
                </span>
                <h3 className="text-lg text-foreground mb-2" style={{ lineHeight: '1.1' }}>{engine.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{engine.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DefenseEngines;
