import { useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

const steps = [
  { id: 'INPUT', label: 'Raw Input', desc: 'Mouse, keyboard, scroll, EEG events', color: 'hsla(0, 0%, 60%, 0.8)' },
  { id: 'INTERCEPT', label: 'Event Interceptor', desc: 'Captures all behavioral signals', color: 'hsla(175, 60%, 45%, 0.8)' },
  { id: 'CLASSIFY', label: 'Task Classifier', desc: 'Detects context, selects profile', color: 'hsla(175, 60%, 45%, 0.8)' },
  { id: 'OBFUSCATE', label: 'Obfuscation Core', desc: '7 engines run in parallel', color: 'hsla(142, 71%, 45%, 0.9)' },
  { id: 'AUDIT', label: 'Gradient Auditor', desc: 'Detects ML attacks in real-time', color: 'hsla(280, 60%, 60%, 0.8)' },
  { id: 'OUTPUT', label: 'Clean Output', desc: 'Unidentifiable behavioral data', color: 'hsla(142, 71%, 55%, 0.9)' },
];

const FlowCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let t = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const stageWidth = w / steps.length;

      for (let i = 0; i < steps.length - 1; i++) {
        const x1 = stageWidth * i + stageWidth / 2;
        const x2 = stageWidth * (i + 1) + stageWidth / 2;
        const y = h / 2;

        // Connection line with gradient
        const grad = ctx.createLinearGradient(x1, y, x2, y);
        grad.addColorStop(0, steps[i].color.replace('0.8)', '0.2)').replace('0.9)', '0.25)'));
        grad.addColorStop(1, steps[i + 1].color.replace('0.8)', '0.2)').replace('0.9)', '0.25)'));
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.moveTo(x1 + 16, y);
        ctx.lineTo(x2 - 16, y);
        ctx.stroke();

        // Traveling dots
        for (let d = 0; d < 3; d++) {
          const progress = ((t * 0.35 + i * 0.15 + d * 0.33) % 1);
          const dx = x1 + 16 + (x2 - x1 - 32) * progress;
          const dy = y + Math.sin(progress * Math.PI) * -6;
          const alpha = Math.sin(progress * Math.PI) * 0.9;

          ctx.beginPath();
          ctx.fillStyle = `hsla(142, 71%, 50%, ${alpha})`;
          ctx.shadowColor = 'hsla(142, 71%, 50%, 0.5)';
          ctx.shadowBlur = 6;
          ctx.arc(dx, dy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      // Stage nodes
      steps.forEach((step, i) => {
        const cx = stageWidth * i + stageWidth / 2;
        const cy = h / 2;
        const isCore = step.id === 'OBFUSCATE';
        const radius = isCore ? 14 : 10;

        if (isCore) {
          const pulseR = radius + 6 + Math.sin(t * 2) * 3;
          ctx.beginPath();
          ctx.strokeStyle = `hsla(142, 71%, 50%, ${0.12 + Math.sin(t * 2) * 0.08})`;
          ctx.lineWidth = 1;
          ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = isCore ? 'hsla(142, 71%, 45%, 0.18)' : 'hsla(200, 12%, 11%, 0.9)';
        ctx.strokeStyle = step.color;
        ctx.lineWidth = isCore ? 1.5 : 1;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = step.color;
        ctx.font = `${isCore ? '7' : '6'}px JetBrains Mono, monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(step.id, cx, cy + 3);
        ctx.textAlign = 'start';
      });

      t += 0.016;
      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-20 mb-6" />;
};

const Architecture = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="architecture" className="relative py-32 px-6" ref={ref}>
      <div className="section-divider mb-32" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/8 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div
          className="mb-16"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="tag-badge mb-6 inline-block">PIPELINE</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mt-4">
            The pipeline.
          </h2>
        </div>

        <div
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 150ms, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 150ms',
          }}
        >
          <FlowCanvas />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="glass-panel p-4 text-center group hover:neon-border-glow"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80 + 200}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80 + 200}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full mx-auto mb-2"
                style={{ background: step.color, boxShadow: `0 0 6px ${step.color}` }}
              />
              <span className="text-mono text-[10px] tracking-[0.15em] block mb-1.5" style={{ color: step.color }}>{step.id}</span>
              <h3 className="text-xs text-foreground mb-1 font-medium" style={{ lineHeight: '1.3' }}>{step.label}</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
