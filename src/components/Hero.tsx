import { useEffect, useRef } from 'react';

const LissajousCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw multiple Lissajous curves with different parameters
      const curves = [
        { a: 3, b: 4, delta: t * 0.3, color: 'hsla(12, 74%, 51%, 0.6)', width: 2 },
        { a: 5, b: 6, delta: t * 0.2 + 1, color: 'hsla(32, 92%, 63%, 0.4)', width: 1.5 },
        { a: 7, b: 8, delta: t * 0.15 + 2, color: 'hsla(345, 100%, 77%, 0.3)', width: 1 },
      ];

      curves.forEach(({ a, b, delta, color, width }) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        const scaleX = w * 0.35;
        const scaleY = h * 0.35;

        for (let i = 0; i <= 600; i++) {
          const angle = (i / 600) * Math.PI * 2 * 4;
          const x = w / 2 + Math.sin(a * angle + delta) * scaleX;
          const y = h / 2 + Math.sin(b * angle) * scaleY;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Floating particles
      for (let i = 0; i < 30; i++) {
        const px = (Math.sin(t * 0.5 + i * 1.7) * 0.5 + 0.5) * w;
        const py = (Math.cos(t * 0.3 + i * 2.3) * 0.5 + 0.5) * h;
        const size = 1.5 + Math.sin(t + i) * 0.8;
        ctx.beginPath();
        ctx.fillStyle = `hsla(12, 74%, 51%, ${0.15 + Math.sin(t + i) * 0.1})`;
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      t += 0.008;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanline-overlay">
      {/* Gradient blobs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/30 rounded-full gradient-blob" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/25 rounded-full gradient-blob" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full gradient-blob" />

      <LissajousCanvas />

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <p className="text-body-medium text-muted-foreground text-sm tracking-[0.3em] uppercase mb-8 animate-slide-up">
          Cognitive Canary v6.0
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-[8rem] text-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          We didn't hack the password.
          <br />
          <span className="text-primary">We hacked the inference.</span>
        </h1>
        <p className="text-body text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s', lineHeight: '1.6' }}>
          Advanced behavioral obfuscation engine that protects your cognitive fingerprint from surveillance systems.
        </p>
        <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <a href="#demo" className="inline-block bg-foreground text-background px-8 py-4 text-body-medium text-sm tracking-wider uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            Live Demo
          </a>
          <a href="#engines" className="inline-block border-2 border-foreground text-foreground px-8 py-4 text-body-medium text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-all duration-300">
            Explore Engines
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-px h-16 bg-foreground/30" />
      </div>
    </section>
  );
};

export default Hero;
