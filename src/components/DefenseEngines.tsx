import { useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

interface Engine {
  name: string;
  tag: string;
  desc: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
}

// Engine 1: Lissajous 3D — real 13:8:5 coprime ratios with Z-axis helix
const drawLissajous = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  const scale = Math.min(w, h) * 0.35;

  // Draw 3D projection of toroidal Lissajous
  const points: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i <= 600; i++) {
    const angle = (i / 600) * Math.PI * 2 * 4;
    const x = Math.sin(13 * angle + t * 0.3);
    const y = Math.sin(8 * angle + t * 0.15);
    const z = Math.cos(5 * angle + t * 0.2);
    points.push({ x, y, z });
  }

  // Render with depth fade
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const depth = (p.z + 1) / 2; // 0-1
    const px = cx + p.x * scale * (0.7 + depth * 0.3);
    const py = cy + p.y * scale * (0.7 + depth * 0.3);

    const prevP = points[i - 1];
    const prevPx = cx + prevP.x * scale * (0.7 + ((prevP.z + 1) / 2) * 0.3);
    const prevPy = cy + prevP.y * scale * (0.7 + ((prevP.z + 1) / 2) * 0.3);

    ctx.beginPath();
    ctx.strokeStyle = `hsla(142, 71%, ${40 + depth * 25}%, ${0.15 + depth * 0.4})`;
    ctx.lineWidth = 0.5 + depth * 1.2;
    ctx.moveTo(prevPx, prevPy);
    ctx.lineTo(px, py);
    ctx.stroke();
  }

  // Trailing glow dot
  const glowI = Math.floor(((t * 0.3) % (Math.PI * 8)) / (Math.PI * 8) * 600);
  const gp = points[glowI] || points[0];
  const gDepth = (gp.z + 1) / 2;
  const gx = cx + gp.x * scale * (0.7 + gDepth * 0.3);
  const gy = cy + gp.y * scale * (0.7 + gDepth * 0.3);
  ctx.beginPath();
  ctx.fillStyle = `hsla(142, 71%, 55%, 0.9)`;
  ctx.shadowColor = 'hsla(142, 71%, 50%, 0.7)';
  ctx.shadowBlur = 12;
  ctx.arc(gx, gy, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
};

// Engine 2: Adaptive Tremor — FFT power spectrum visualization
const drawTremor = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);

  // Draw frequency axis
  ctx.strokeStyle = 'hsla(160, 10%, 30%, 0.5)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(20, h - 25);
  ctx.lineTo(w - 10, h - 25);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(20, h - 25);
  ctx.lineTo(20, 10);
  ctx.stroke();

  // Labels
  ctx.fillStyle = 'hsla(160, 10%, 45%, 0.8)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('4 Hz', 35, h - 12);
  ctx.fillText('8 Hz', w * 0.4, h - 12);
  ctx.fillText('12 Hz', w * 0.7, h - 12);
  ctx.fillText('POWER', 25, 18);

  // Generate FFT-like power spectrum for physiological tremor (4-12Hz band)
  const numBins = 40;
  const barWidth = (w - 40) / numBins;

  for (let i = 0; i < numBins; i++) {
    const freq = 2 + (i / numBins) * 18; // 2-20 Hz range
    const inTremorBand = freq >= 4 && freq <= 12;

    // Physiological tremor peaks around 8-10 Hz
    let power = 0;
    if (inTremorBand) {
      power = Math.exp(-((freq - 9) ** 2) / 6) * 0.8;
      power += Math.sin(t * 2.5 + i * 0.3) * 0.15;
      power += Math.random() * 0.05;
    } else {
      power = 0.02 + Math.random() * 0.05;
    }

    const barH = power * (h - 45);
    const x = 25 + i * barWidth;

    // Fill with gradient
    if (inTremorBand) {
      ctx.fillStyle = `hsla(142, 71%, 45%, ${0.3 + power * 0.6})`;
    } else {
      ctx.fillStyle = 'hsla(160, 10%, 30%, 0.3)';
    }
    ctx.fillRect(x, h - 25 - barH, barWidth - 1, barH);

    // Glow top for tremor band
    if (inTremorBand && power > 0.3) {
      ctx.fillStyle = `hsla(142, 71%, 55%, ${power * 0.8})`;
      ctx.fillRect(x, h - 25 - barH, barWidth - 1, 2);
    }
  }

  // Highlight band label
  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.7)';
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.fillText('TREMOR BAND', w * 0.35, 25);

  // Band markers
  const band4x = 25 + (2 / 18) * (w - 40);
  const band12x = 25 + (10 / 18) * (w - 40);
  ctx.strokeStyle = 'hsla(142, 71%, 45%, 0.25)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(band4x, 30);
  ctx.lineTo(band4x, h - 25);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(band12x, 30);
  ctx.lineTo(band12x, h - 25);
  ctx.stroke();
  ctx.setLineDash([]);
};

// Engine 3: Keystroke Jitter — timing bars with pink noise injection
const drawKeystroke = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);

  const keyCount = 16;
  const barWidth = (w - 40) / keyCount;
  const halfH = h / 2;

  // Labels
  ctx.fillStyle = 'hsla(160, 10%, 45%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('RAW', 5, 15);
  ctx.fillText('OBFUSCATED', 5, halfH + 15);

  // Separator
  ctx.strokeStyle = 'hsla(160, 15%, 25%, 0.5)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, halfH);
  ctx.lineTo(w, halfH);
  ctx.stroke();

  // Generate raw keystroke timings (recognizable pattern)
  const rawTimings = [
    85, 120, 65, 90, 110, 75, 130, 88, 95, 70, 115, 82, 100, 78, 125, 92
  ];

  // Top half — raw timings
  for (let i = 0; i < keyCount; i++) {
    const timing = rawTimings[i];
    const barH = (timing / 150) * (halfH - 30);
    const x = 20 + i * barWidth;
    const y = halfH - barH - 8;

    ctx.fillStyle = 'hsla(0, 0%, 60%, 0.5)';
    ctx.fillRect(x, y, barWidth - 3, barH);

    // Dwell indicator
    const dwell = 40 + Math.sin(i * 0.8) * 15;
    ctx.fillStyle = 'hsla(0, 0%, 45%, 0.5)';
    ctx.fillRect(x, y - 3, (barWidth - 3) * (dwell / 60), 2);
  }

  // Bottom half — obfuscated with pink noise jitter
  for (let i = 0; i < keyCount; i++) {
    const raw = rawTimings[i];
    // Pink noise jitter (1/f characteristic)
    const jitter = Math.sin(i * 1.5 + t * 3) * 25 +
      Math.sin(i * 0.4 + t * 1.2) * 18 +
      Math.sin(i * 3.7 + t * 5) * 8 +
      (Math.random() - 0.5) * 12;
    const obfTiming = Math.max(30, raw + jitter);
    const barH = (obfTiming / 150) * (halfH - 30);
    const x = 20 + i * barWidth;
    const y = h - barH - 8;

    const hue = 142 + Math.sin(t + i * 0.2) * 10;
    ctx.fillStyle = `hsla(${hue}, 71%, 45%, 0.5)`;
    ctx.fillRect(x, y, barWidth - 3, barH);

    // Animated jitter noise particles
    for (let j = 0; j < 3; j++) {
      const px = x + Math.random() * (barWidth - 3);
      const py = y + Math.random() * barH;
      ctx.fillStyle = `hsla(142, 71%, 55%, ${Math.random() * 0.5})`;
      ctx.fillRect(px, py, 1, 1);
    }
  }
};

// Engine 4: Spectral Defender — adversarial EEG waveforms
const drawSpectral = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);

  const halfH = h / 2;

  // Labels
  ctx.fillStyle = 'hsla(160, 10%, 45%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('ALPHA (8-13 Hz)', 5, 15);
  ctx.fillText('THETA (4-8 Hz)', 5, halfH + 15);

  // Alpha band waveform with adversarial injection
  ctx.beginPath();
  ctx.strokeStyle = 'hsla(175, 60%, 45%, 0.6)';
  ctx.lineWidth = 1.2;
  for (let x = 0; x < w; x++) {
    const rawAlpha = Math.sin(x * 0.06 + t * 2) * 20;
    // Adversarial oscillation targeting alpha
    const adversarial = Math.sin(x * 0.065 + t * 2.1 + Math.PI * 0.8) * 15 * Math.sin(t * 0.3);
    const y = halfH * 0.4 + rawAlpha + adversarial;
    x === 0 ? ctx.moveTo(x, y + 18) : ctx.lineTo(x, y + 18);
  }
  ctx.stroke();

  // Original alpha (ghost)
  ctx.beginPath();
  ctx.strokeStyle = 'hsla(175, 60%, 45%, 0.15)';
  ctx.setLineDash([2, 4]);
  ctx.lineWidth = 0.8;
  for (let x = 0; x < w; x++) {
    const y = halfH * 0.4 + Math.sin(x * 0.06 + t * 2) * 20;
    x === 0 ? ctx.moveTo(x, y + 18) : ctx.lineTo(x, y + 18);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Separator
  ctx.strokeStyle = 'hsla(160, 15%, 20%, 0.5)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, halfH);
  ctx.lineTo(w, halfH);
  ctx.stroke();

  // Theta band with adversarial injection
  ctx.beginPath();
  ctx.strokeStyle = 'hsla(280, 60%, 60%, 0.6)';
  ctx.lineWidth = 1.2;
  for (let x = 0; x < w; x++) {
    const rawTheta = Math.sin(x * 0.035 + t * 1.3) * 22;
    const adversarial = Math.cos(x * 0.04 + t * 1.4 + Math.PI * 0.6) * 12 * Math.sin(t * 0.4 + 1);
    const y = halfH + halfH * 0.4 + rawTheta + adversarial;
    x === 0 ? ctx.moveTo(x, y + 12) : ctx.lineTo(x, y + 12);
  }
  ctx.stroke();

  // Status indicator
  ctx.fillStyle = `hsla(142, 71%, 50%, ${0.4 + Math.sin(t * 2) * 0.3})`;
  ctx.beginPath();
  ctx.arc(w - 15, 15, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.7)';
  ctx.font = '7px JetBrains Mono, monospace';
  ctx.fillText('INJECTING', w - 65, 18);
};

// Engine 5: Gradient Auditor — attack detection network graph
const drawAuditor = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);

  // Feature vector nodes
  const nodes: { x: number; y: number; label: string; alert: boolean }[] = [
    { x: 0.2, y: 0.25, label: 'F1', alert: false },
    { x: 0.5, y: 0.15, label: 'F2', alert: Math.sin(t * 1.5) > 0.7 },
    { x: 0.8, y: 0.3, label: 'F3', alert: false },
    { x: 0.15, y: 0.6, label: 'F4', alert: false },
    { x: 0.45, y: 0.55, label: 'GA', alert: Math.sin(t * 1.2 + 1) > 0.6 },
    { x: 0.75, y: 0.65, label: 'F5', alert: false },
    { x: 0.3, y: 0.85, label: 'F6', alert: false },
    { x: 0.6, y: 0.8, label: 'F7', alert: Math.sin(t * 0.8 + 2) > 0.8 },
    { x: 0.85, y: 0.85, label: 'F8', alert: false },
  ];

  // Draw connections
  const connections = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5],
    [3, 4], [4, 5], [3, 6], [4, 7], [5, 8],
    [6, 7], [7, 8],
  ];

  connections.forEach(([a, b]) => {
    const na = nodes[a];
    const nb = nodes[b];
    const isAlert = na.alert || nb.alert;

    ctx.beginPath();
    ctx.strokeStyle = isAlert
      ? `hsla(0, 70%, 55%, ${0.3 + Math.sin(t * 3) * 0.2})`
      : 'hsla(160, 15%, 25%, 0.3)';
    ctx.lineWidth = isAlert ? 1.5 : 0.5;
    ctx.moveTo(na.x * w, na.y * h);
    ctx.lineTo(nb.x * w, nb.y * h);
    ctx.stroke();

    // Animated data dot
    const progress = ((t * 0.5 + a * 0.3) % 1);
    const dx = na.x + (nb.x - na.x) * progress;
    const dy = na.y + (nb.y - na.y) * progress;
    ctx.beginPath();
    ctx.fillStyle = isAlert
      ? `hsla(0, 70%, 55%, ${0.5})`
      : `hsla(142, 71%, 50%, ${0.3})`;
    ctx.arc(dx * w, dy * h, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw nodes
  nodes.forEach(node => {
    const nx = node.x * w;
    const ny = node.y * h;
    const isGA = node.label === 'GA';
    const radius = isGA ? 10 : 6;

    // Node circle
    ctx.beginPath();
    if (node.alert) {
      ctx.fillStyle = 'hsla(0, 70%, 55%, 0.3)';
      ctx.strokeStyle = 'hsla(0, 70%, 55%, 0.8)';
      // Alert pulse
      ctx.beginPath();
      ctx.arc(nx, ny, radius + 4 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(0, 70%, 55%, ${0.1 + Math.sin(t * 3) * 0.05})`;
      ctx.fill();
    } else if (isGA) {
      ctx.fillStyle = 'hsla(142, 71%, 45%, 0.3)';
      ctx.strokeStyle = 'hsla(142, 71%, 45%, 0.8)';
    } else {
      ctx.fillStyle = 'hsla(200, 12%, 15%, 0.8)';
      ctx.strokeStyle = 'hsla(160, 15%, 30%, 0.5)';
    }

    ctx.beginPath();
    ctx.arc(nx, ny, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label
    ctx.fillStyle = node.alert
      ? 'hsla(0, 70%, 70%, 0.9)'
      : isGA ? 'hsla(142, 71%, 60%, 0.9)' : 'hsla(160, 10%, 55%, 0.7)';
    ctx.font = `${isGA ? '8' : '7'}px JetBrains Mono, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(node.label, nx, ny + 3);
    ctx.textAlign = 'start';
  });

  // Status
  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.6)';
  ctx.font = '7px JetBrains Mono, monospace';
  ctx.fillText('GRADIENT AUDIT', 5, h - 8);
};

const engines: Engine[] = [
  {
    name: 'Lissajous 3D Engine',
    tag: 'lissajous_3d.py',
    desc: 'Generates adversarial cursor paths using toroidal Lissajous curves with coprime frequency ratios (13:8:5). Z-axis discretized into scroll/zoom events.',
    draw: drawLissajous,
  },
  {
    name: 'Adaptive Tremor',
    tag: 'adaptive_tremor.py',
    desc: 'Learns your physiological tremor profile (4-12 Hz), then phase-locks synthetic tremor injection to mask your real motor signature.',
    draw: drawTremor,
  },
  {
    name: 'Keystroke Jitter',
    tag: 'keystroke_jitter.py',
    desc: 'Injects pink noise into dwell times, flight times, and typing pressure. Defeats TypingDNA-class biometric systems.',
    draw: drawKeystroke,
  },
  {
    name: 'Spectral Defender',
    tag: 'spectral_canary.py',
    desc: 'Targets alpha (8-13 Hz) and theta (4-8 Hz) EEG bands with adversarial oscillations. Blocks neural state inference from BCI devices.',
    draw: drawSpectral,
  },
  {
    name: 'Gradient Auditor',
    tag: 'gradient_auditor.py',
    desc: 'Monitors feature vectors and gradient updates for anomalous patterns. Detects ML poisoning and fingerprinting attacks in real-time.',
    draw: drawAuditor,
  },
];

const EngineCard = ({ engine, index, isInView }: { engine: Engine; index: number; isInView: boolean }) => {
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
      engine.draw(ctx, w, h, t);
      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [engine]);

  return (
    <div
      className={`glass-panel group transition-all duration-700 hover:neon-border-glow ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-44 border-b border-border/50"
      />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-mono text-[10px] text-primary/50 tracking-wider">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-sm text-foreground font-medium" style={{ lineHeight: '1.2' }}>{engine.name}</h3>
        </div>
        <span className="text-mono text-[10px] text-muted-foreground/60 block mb-3">{engine.tag}</span>
        <p className="text-body text-xs text-muted-foreground leading-relaxed">{engine.desc}</p>
      </div>
    </div>
  );
};

const DefenseEngines = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="engines" className="relative py-32 px-6" ref={ref}>
      <div className="section-divider mb-32" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-secondary/10 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="tag-badge mb-6 inline-block">5 ENGINES</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mt-4">
            The defense<br />stack.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {engines.map((engine, i) => (
            <EngineCard key={engine.name} engine={engine} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DefenseEngines;
