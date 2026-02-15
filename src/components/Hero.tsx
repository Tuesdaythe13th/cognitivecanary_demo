import { useEffect, useRef, useState } from 'react';

const LissajousCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle constellation
    const particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        life: Math.random(),
      });
    }

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Main Lissajous curves using actual coprime ratios from the Python engine
      const curves = [
        { a: 13, b: 8, delta: t * 0.45, color: 'hsla(142, 71%, 45%, 0.7)', width: 2.5, points: 800 },
        { a: 8, b: 5, delta: t * 0.3 + Math.PI / 4, color: 'hsla(175, 60%, 45%, 0.25)', width: 1.5, points: 700 },
        { a: 5, b: 3, delta: t * 0.2 + Math.PI / 2, color: 'hsla(142, 71%, 35%, 0.15)', width: 1, points: 600 },
      ];

      curves.forEach(({ a, b, delta, color, width, points }) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        const scaleX = w * 0.35;
        const scaleY = h * 0.35;
        // Slight mouse parallax
        const offsetX = (mx - 0.5) * 40;
        const offsetY = (my - 0.5) * 30;

        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2 * 4;
          const x = w / 2 + offsetX + Math.sin(a * angle + delta) * scaleX;
          const y = h / 2 + offsetY + Math.sin(b * angle) * scaleY;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Trailing glow on the primary curve
      const glowProgress = ((t * 0.45) % (Math.PI * 8)) / (Math.PI * 8);
      const glowIdx = Math.floor(glowProgress * 800);
      for (let g = 0; g < 25; g++) {
        const idx = (glowIdx - g + 800) % 800;
        const angle = (idx / 800) * Math.PI * 2 * 4;
        const gx = w / 2 + (mx - 0.5) * 40 + Math.sin(13 * angle + t * 0.45) * (w * 0.35);
        const gy = h / 2 + (my - 0.5) * 30 + Math.sin(8 * angle) * (h * 0.35);
        const alpha = (1 - g / 25) * 1;
        const size = (1 - g / 25) * 5 + 1.2;
        ctx.beginPath();
        ctx.fillStyle = `hsla(142, 71%, 55%, ${alpha})`;
        ctx.shadowColor = 'hsla(142, 71%, 50%, 0.9)';
        ctx.shadowBlur = 25;
        ctx.arc(gx, gy, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Particle constellation with mouse repulsion
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        p.life += 0.0035;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.2) {
          const force = (0.2 - dist) * 0.0015;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        const px = p.x * w;
        const py = p.y * h;
        const size = 1.5 + Math.sin(p.life * 2.5) * 0.8;
        const alpha = 0.4 + Math.sin(p.life * 2.5) * 0.2;

        ctx.beginPath();
        ctx.fillStyle = `hsla(142, 71%, 50%, ${alpha})`;
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (particles[i].x - particles[j].x) * w;
          const dy = (particles[i].y - particles[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(142, 71%, 45%, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x * w, particles[i].y * h);
            ctx.lineTo(particles[j].x * w, particles[j].y * h);
            ctx.stroke();
          }
        }
      }

      t += 0.0075;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-[2px] h-[0.85em] bg-primary ml-1 align-middle" style={{ animation: 'typewriter-cursor 1s infinite' }} />
    </span>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanline-overlay">
      {/* Gradient mesh */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full gradient-blob animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-secondary/15 rounded-full gradient-blob animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-accent/10 rounded-full gradient-blob animate-pulse" style={{ animationDuration: '10s' }} />

      <LissajousCanvas />

      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Version badge */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-slide-up">
          <span className="tag-badge">v6.0</span>
          <span className="tag-badge" style={{ borderColor: 'hsl(175 60% 45% / 0.3)', color: 'hsl(175, 60%, 45%)', background: 'hsl(175 60% 45% / 0.08)' }}>d/acc</span>
          <span className="tag-badge" style={{ borderColor: 'hsl(280 60% 60% / 0.3)', color: 'hsl(280, 60%, 60%)', background: 'hsl(280 60% 60% / 0.08)' }}>ACTIVE DEFENSE</span>
        </div>

        <p className="text-mono text-muted-foreground text-xs tracking-[0.3em] uppercase mb-6 animate-slide-up">
          Cognitive Canary
        </p>

        <h1 className="text-5xl sm:text-7xl md:text-[7rem] text-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="block mb-2">We didn't hack</span>
          <span className="block mb-2">the password.</span>
          <span className="text-primary neon-glow block">
            <TypewriterText text="We hacked the inference." delay={800} />
          </span>
        </h1>

        <p className="text-body text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s', lineHeight: '1.6' }}>
          Multi-modal behavioral obfuscation engine that protects your cognitive fingerprint from surveillance systems.
        </p>

        <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <a href="#demo" className="inline-block bg-primary text-primary-foreground px-8 py-4 text-mono text-sm tracking-wider uppercase hover:shadow-[0_0_30px_hsl(142,71%,45%,0.3)] transition-all duration-300">
            Live Demo →
          </a>
          <a href="#engines" className="inline-block border border-primary/40 text-primary px-8 py-4 text-mono text-sm tracking-wider uppercase hover:bg-primary/10 hover:border-primary/70 transition-all duration-300">
            Explore Engines
          </a>
        </div>

        {/* Colab badge */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <a href="https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs text-mono">
            <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" className="h-5 opacity-70 hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2" style={{ animation: 'float 4s ease-in-out infinite' }}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-mono text-[10px] text-muted-foreground/50 tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
