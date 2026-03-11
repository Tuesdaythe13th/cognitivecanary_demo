import { useEffect, useRef, useState } from 'react';
import { APP_VERSION } from '@/lib/constants';

/* ─── Starfield Canvas ─── */
const StarfieldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const stars: { x: number; y: number; z: number; pz: number }[] = [];
    const COUNT = 400;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      const z = Math.random() * 1000;
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z,
        pz: z,
      });
    }

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (const star of stars) {
        star.pz = star.z;
        star.z -= 0.35;
        if (star.z < 1) {
          star.z = 1000;
          star.pz = 1000;
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
        }

        const sx = (star.x / star.z) * 400 + cx;
        const sy = (star.y / star.z) * 400 + cy;
        const r = Math.max(0, (1 - star.z / 1000) * 1.8);
        const alpha = Math.max(0, (1 - star.z / 1000) * 0.7);

        ctx.beginPath();
        ctx.fillStyle = `hsla(160, 30%, 75%, ${alpha})`;
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
};

/* ─── Dissolve Text ─── */
const DissolveText = () => {
  const [progress, setProgress] = useState(0);
  const encoded = '1NSCRVT4BL3';
  const decoded = 'INSCRUTABLE ';

  useEffect(() => {
    const startDelay = setTimeout(() => {
      let start: number | null = null;
      const duration = 3000;

      const animate = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const p = Math.min(elapsed / duration, 1);
        // Ease in-out cubic
        const eased = p < 0.5
          ? 4 * p * p * p
          : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setProgress(eased);
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, 1800);

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <span className="inline-block relative" aria-label="INSCRUTABLE">
      {decoded.split('').map((char, i) => {
        const encChar = encoded[i] || ' ';
        const charProgress = Math.max(0, Math.min(1, (progress - i * 0.04) / 0.5));
        const showDecoded = charProgress > 0.5;
        const glitching = charProgress > 0.1 && charProgress < 0.9;

        return (
          <span
            key={i}
            className="inline-block relative"
            style={{
              opacity: 0.3 + charProgress * 0.7,
              filter: glitching ? `blur(${(1 - Math.abs(charProgress - 0.5) * 2) * 2}px)` : 'none',
              transform: glitching
                ? `translateY(${Math.sin(charProgress * Math.PI * 4) * 2}px)`
                : 'none',
              transition: 'opacity 0.1s',
            }}
          >
            {showDecoded ? char : encChar}
          </span>
        );
      })}
    </span>
  );
};

/* ─── Slow Fade-In ─── */
const FadeIn = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1), transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};

/* ─── Horizontal Rule ─── */
const Line = ({ delay }: { delay: number }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="h-px bg-primary/20 my-8"
      style={{
        transform: visible ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    />
  );
};

/* ─── Hero ─── */
const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <StarfieldCanvas />

      {/* Subtle gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.02]" />

      {/* Grid layout matching reference */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 grid grid-cols-1 md:grid-cols-[420px_1fr] gap-12 items-center h-full">
        {/* Left: Copy */}
        <div className="flex flex-col justify-center md:max-w-[380px]">
          <FadeIn delay={200}>
            <p className="text-mono text-[10px] tracking-[0.5em] uppercase text-muted-foreground/60 mb-2">
              Cognitive Canary v{APP_VERSION}
            </p>
          </FadeIn>

          <FadeIn delay={600}>
            <h1
              className="text-foreground leading-[0.88] tracking-[-0.04em] mb-0"
              style={{ fontSize: 'clamp(56px, 8vw, 96px)' }}
            >
              <DissolveText />
            </h1>
          </FadeIn>

          <Line delay={2800} />

          <FadeIn delay={3200}>
            <p className="text-body text-muted-foreground/70 text-sm leading-relaxed max-w-[320px]">
              Multi-modal behavioral obfuscation engine that protects your cognitive fingerprint from surveillance systems.
            </p>
          </FadeIn>

          <FadeIn delay={3800} className="mt-10 flex flex-col gap-3">
            <div className="flex gap-3">
              <a
                href="#demo"
                className="text-mono text-[10px] tracking-[0.3em] uppercase px-6 py-3 bg-primary text-primary-foreground hover:shadow-[0_0_40px_hsl(142,71%,45%,0.3)] transition-all duration-700"
              >
                Live Demo →
              </a>
              <a
                href="#engines"
                className="text-mono text-[10px] tracking-[0.3em] uppercase px-6 py-3 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-700"
              >
                Engines
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={4400} className="mt-16">
            <p className="text-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground/30 leading-loose">
              in development @{' '}
              <span className="text-primary/50">artifex labs</span>
              <br />
              <span className="text-muted-foreground/20">apart research studio</span>
            </p>
          </FadeIn>
        </div>

        {/* Right: 3D perspective card stack */}
        <div className="hidden md:grid place-items-center h-full">
          <FadeIn delay={1200}>
            <PerspectiveStack />
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <FadeIn delay={5000}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-mono text-[8px] text-muted-foreground/25 tracking-[0.5em] uppercase">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-primary/30 to-transparent" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

/* ─── 3D Perspective Stack ─── */
const PerspectiveStack = () => {
  const [hover, setHover] = useState(false);

  const layers = [
    { label: 'SIGNAL ACQUISITION', z: 0, color: 'hsl(var(--primary) / 0.15)' },
    { label: 'FEATURE EXTRACTION', z: 1, color: 'hsl(var(--primary) / 0.12)' },
    { label: 'GRADIENT STARVATION', z: 2, color: 'hsl(var(--primary) / 0.09)' },
    { label: 'NOISE INJECTION', z: 3, color: 'hsl(var(--secondary) / 0.08)' },
    { label: 'COGNITIVE SHIELD', z: 4, color: 'hsl(var(--accent) / 0.07)' },
  ];

  return (
    <div
      className="relative"
      style={{ perspective: '1200px', perspectiveOrigin: 'right 150px' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="relative w-[340px] lg:w-[400px]"
        style={{
          aspectRatio: '0.75',
          transformStyle: 'preserve-3d',
          transform: hover
            ? 'rotateY(-12deg) rotateX(5deg)'
            : 'rotateY(-8deg) rotateX(3deg)',
          transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {layers.map((layer, i) => (
          <div
            key={i}
            className="absolute inset-0 border border-border/40 flex items-end p-6"
            style={{
              background: layer.color,
              backdropFilter: 'blur(8px)',
              transform: `translateZ(${(hover ? 50 : 35) * i}px)`,
              transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d',
            }}
          >
            <span className="text-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">
              {layer.label}
            </span>
          </div>
        ))}

        {/* Top card with scan line */}
        <div
          className="absolute inset-0 border border-primary/20 overflow-hidden"
          style={{
            transform: `translateZ(${(hover ? 50 : 35) * 5}px)`,
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            transformStyle: 'preserve-3d',
            background: 'hsl(var(--primary) / 0.04)',
          }}
        >
          {/* Scan line */}
          <div
            className="absolute left-0 w-full h-px bg-primary/30"
            style={{
              animation: 'hero-scan 4s ease-in-out infinite',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-mono text-[10px] tracking-[0.5em] uppercase text-primary/60">
              Cognitive Canary
            </span>
            <span className="text-mono text-[7px] tracking-[0.4em] uppercase text-muted-foreground/30">
              Active Defense System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
