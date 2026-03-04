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

  const points: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i <= 600; i++) {
    const angle = (i / 600) * Math.PI * 2 * 4;
    const x = Math.sin(13 * angle + t * 0.3);
    const y = Math.sin(8 * angle + t * 0.15);
    const z = Math.cos(5 * angle + t * 0.2);
    points.push({ x, y, z });
  }

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const depth = (p.z + 1) / 2;
    const px = cx + p.x * scale * (0.7 + depth * 0.3);
    const py = cy + p.y * scale * (0.7 + depth * 0.3);
    const prevP = points[i - 1];
    const prevPx = cx + prevP.x * scale * (0.7 + ((prevP.z + 1) / 2) * 0.3);
    const prevPy = cy + prevP.y * scale * (0.7 + ((prevP.z + 1) / 2) * 0.3);
    ctx.beginPath();
    ctx.strokeStyle = `hsla(142, 71%, ${40 + depth * 25}%, ${0.12 + depth * 0.45})`;
    ctx.lineWidth = 0.5 + depth * 1.2;
    ctx.moveTo(prevPx, prevPy);
    ctx.lineTo(px, py);
    ctx.stroke();
  }

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
  ctx.strokeStyle = 'hsla(160, 10%, 30%, 0.4)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(20, h - 25); ctx.lineTo(w - 10, h - 25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, h - 25); ctx.lineTo(20, 10); ctx.stroke();

  ctx.fillStyle = 'hsla(160, 10%, 45%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('4 Hz', 35, h - 12);
  ctx.fillText('8 Hz', w * 0.4, h - 12);
  ctx.fillText('12 Hz', w * 0.7, h - 12);
  ctx.fillText('POWER', 25, 18);

  const numBins = 40;
  const barWidth = (w - 40) / numBins;
  for (let i = 0; i < numBins; i++) {
    const freq = 2 + (i / numBins) * 18;
    const inTremorBand = freq >= 4 && freq <= 12;
    let power = 0;
    if (inTremorBand) {
      power = Math.exp(-((freq - 9) ** 2) / 6) * 0.8;
      power += Math.sin(t * 2.5 + i * 0.3) * 0.15;
      power += Math.random() * 0.05;
    } else { power = 0.02 + Math.random() * 0.04; }
    const barH = power * (h - 45);
    const x = 25 + i * barWidth;
    ctx.fillStyle = inTremorBand ? `hsla(142, 71%, 45%, ${0.3 + power * 0.6})` : 'hsla(160, 10%, 30%, 0.25)';
    ctx.fillRect(x, h - 25 - barH, barWidth - 1, barH);
    if (inTremorBand && power > 0.3) {
      ctx.fillStyle = `hsla(142, 71%, 55%, ${power * 0.8})`;
      ctx.fillRect(x, h - 25 - barH, barWidth - 1, 2);
    }
  }
  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.7)';
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.fillText('TREMOR BAND', w * 0.35, 25);

  const band4x = 25 + (2 / 18) * (w - 40);
  const band12x = 25 + (10 / 18) * (w - 40);
  ctx.strokeStyle = 'hsla(142, 71%, 45%, 0.2)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(band4x, 30); ctx.lineTo(band4x, h - 25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(band12x, 30); ctx.lineTo(band12x, h - 25); ctx.stroke();
  ctx.setLineDash([]);
};

// Engine 3: Keystroke Jitter
const drawKeystroke = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
  const keyCount = 16;
  const barWidth = (w - 40) / keyCount;
  const halfH = h / 2;

  ctx.fillStyle = 'hsla(160, 10%, 45%, 0.6)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('RAW', 5, 14);
  ctx.fillText('OBFUSCATED', 5, halfH + 14);

  ctx.strokeStyle = 'hsla(160, 15%, 22%, 0.5)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, halfH); ctx.lineTo(w, halfH); ctx.stroke();

  const rawTimings = [85, 120, 65, 90, 110, 75, 130, 88, 95, 70, 115, 82, 100, 78, 125, 92];

  for (let i = 0; i < keyCount; i++) {
    const timing = rawTimings[i];
    const barH = (timing / 150) * (halfH - 28);
    const x = 20 + i * barWidth;
    const y = halfH - barH - 8;
    ctx.fillStyle = 'hsla(0, 0%, 55%, 0.45)';
    ctx.fillRect(x, y, barWidth - 3, barH);
  }

  for (let i = 0; i < keyCount; i++) {
    const raw = rawTimings[i];
    const jitter = Math.sin(i * 1.5 + t * 3) * 25 + Math.sin(i * 0.4 + t * 1.2) * 18 + Math.sin(i * 3.7 + t * 5) * 8 + (Math.random() - 0.5) * 12;
    const obfTiming = Math.max(30, raw + jitter);
    const barH = (obfTiming / 150) * (halfH - 28);
    const x = 20 + i * barWidth;
    const y = h - barH - 8;
    const hue = 142 + Math.sin(t + i * 0.2) * 10;
    ctx.fillStyle = `hsla(${hue}, 71%, 45%, 0.55)`;
    ctx.fillRect(x, y, barWidth - 3, barH);
  }
};

// Engine 4: Spectral Defender
const drawSpectral = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
  const halfH = h / 2;

  ctx.fillStyle = 'hsla(160, 10%, 45%, 0.6)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('ALPHA (8-13 Hz)', 5, 14);
  ctx.fillText('THETA (4-8 Hz)', 5, halfH + 14);

  ctx.beginPath();
  ctx.strokeStyle = 'hsla(175, 60%, 45%, 0.6)';
  ctx.lineWidth = 1.2;
  for (let x = 0; x < w; x++) {
    const rawAlpha = Math.sin(x * 0.06 + t * 2) * 20;
    const adversarial = Math.sin(x * 0.065 + t * 2.1 + Math.PI * 0.8) * 15 * Math.sin(t * 0.3);
    const y = halfH * 0.4 + rawAlpha + adversarial;
    x === 0 ? ctx.moveTo(x, y + 18) : ctx.lineTo(x, y + 18);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = 'hsla(175, 60%, 45%, 0.12)';
  ctx.setLineDash([2, 4]);
  ctx.lineWidth = 0.8;
  for (let x = 0; x < w; x++) {
    const y = halfH * 0.4 + Math.sin(x * 0.06 + t * 2) * 20;
    x === 0 ? ctx.moveTo(x, y + 18) : ctx.lineTo(x, y + 18);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = 'hsla(160, 15%, 18%, 0.4)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, halfH); ctx.lineTo(w, halfH); ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = 'hsla(280, 60%, 60%, 0.55)';
  ctx.lineWidth = 1.2;
  for (let x = 0; x < w; x++) {
    const rawTheta = Math.sin(x * 0.035 + t * 1.3) * 22;
    const adversarial = Math.cos(x * 0.04 + t * 1.4 + Math.PI * 0.6) * 12 * Math.sin(t * 0.4 + 1);
    const y = halfH + halfH * 0.4 + rawTheta + adversarial;
    x === 0 ? ctx.moveTo(x, y + 12) : ctx.lineTo(x, y + 12);
  }
  ctx.stroke();

  ctx.fillStyle = `hsla(142, 71%, 50%, ${0.4 + Math.sin(t * 2) * 0.3})`;
  ctx.beginPath();
  ctx.arc(w - 14, 14, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.65)';
  ctx.font = '7px JetBrains Mono, monospace';
  ctx.fillText('INJECTING', w - 65, 18);
};

// Engine 5: Gradient Auditor
const drawAuditor = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
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
  const connections = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[4,7],[5,8],[6,7],[7,8]];

  connections.forEach(([a, b]) => {
    const na = nodes[a]; const nb = nodes[b];
    const isAlert = na.alert || nb.alert;
    ctx.beginPath();
    ctx.strokeStyle = isAlert ? `hsla(142, 100%, 75%, ${0.5 + Math.sin(t * 3) * 0.3})` : 'hsla(142, 71%, 45%, 0.12)';
    ctx.lineWidth = isAlert ? 1.5 : 0.6;
    ctx.moveTo(na.x * w, na.y * h); ctx.lineTo(nb.x * w, nb.y * h);
    ctx.stroke();
    const progress = ((t * 0.5 + a * 0.3) % 1);
    const dx = na.x + (nb.x - na.x) * progress;
    const dy = na.y + (nb.y - na.y) * progress;
    ctx.beginPath();
    ctx.fillStyle = isAlert ? `hsla(142, 100%, 80%, 1)` : `hsla(142, 71%, 50%, 0.35)`;
    ctx.arc(dx * w, dy * h, isAlert ? 2 : 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  nodes.forEach(node => {
    const nx = node.x * w; const ny = node.y * h;
    const isGA = node.label === 'GA';
    const radius = isGA ? 10 : 6;
    if (node.alert) {
      ctx.beginPath();
      ctx.arc(nx, ny, radius + 5 + Math.sin(t * 3) * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(142, 100%, 95%, ${0.08 + Math.sin(t * 3) * 0.06})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = node.alert ? 'hsla(142, 100%, 60%, 0.35)' : isGA ? 'hsla(142, 71%, 45%, 0.3)' : 'hsla(0, 0%, 5%, 0.9)';
    ctx.strokeStyle = node.alert ? 'hsla(142, 100%, 95%, 1)' : isGA ? 'hsla(142, 71%, 45%, 0.9)' : 'hsla(142, 30%, 30%, 0.5)';
    ctx.arc(nx, ny, radius, 0, Math.PI * 2);
    ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = node.alert ? 'hsla(142, 100%, 95%, 1)' : isGA ? 'hsla(142, 100%, 85%, 1)' : 'hsla(142, 50%, 75%, 0.75)';
    ctx.font = `bold ${isGA ? '10' : '8'}px JetBrains Mono, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(node.label, nx, ny + 3);
    ctx.textAlign = 'start';
  });

  ctx.fillStyle = 'hsla(142, 100%, 70%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('GRADIENT AUDIT: NOMINAL', 5, h - 8);
};

// Engine 6: EEG Shield — differential privacy + adversarial injection visualisation
const drawEEGShield = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
  const mid = h / 2;

  // Raw EEG (top half)
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const tx = (x / w) * 4 * Math.PI + t * 0.04;
    const y = mid * 0.45
      + 18 * Math.sin(tx * 10.5)
      + 12 * Math.sin(tx * 6.0)
      + 4 * Math.sin(tx * 30)
      + (Math.random() - 0.5) * 3;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'hsla(0, 60%, 55%, 0.65)';
  ctx.lineWidth = 1.1;
  ctx.stroke();

  // Divider
  ctx.strokeStyle = 'hsla(160, 10%, 22%, 0.5)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke();
  ctx.setLineDash([]);

  // Shielded EEG (bottom half) — destructive interference applied
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const tx = (x / w) * 4 * Math.PI + t * 0.04;
    const raw = 18 * Math.sin(tx * 10.5) + 12 * Math.sin(tx * 6.0);
    const adv = 16 * Math.sin(tx * 10.5 + Math.PI * 0.85) + 10 * Math.sin(tx * 6.0 + Math.PI * 0.75);
    const noise = (Math.random() - 0.5) * 4;
    const y = mid + mid * 0.45 + (raw + adv) * 0.5 + noise;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'hsla(142, 71%, 45%, 0.7)';
  ctx.lineWidth = 1.1;
  ctx.stroke();

  ctx.fillStyle = 'hsla(0, 60%, 60%, 0.65)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('RAW EEG', 6, 12);
  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.8)';
  ctx.fillText('SHIELDED', 6, mid + 12);
};

// Engine 7: Neuro Audit — jurisdiction risk bar chart
const drawNeuroAudit = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
  const jurisdictions = [
    { label: 'EU AI Act', score: 0.82, color: 'hsla(200, 70%, 50%, 0.8)' },
    { label: 'Chile NR',  score: 0.91, color: 'hsla(142, 71%, 45%, 0.8)' },
    { label: 'Colorado',  score: 0.65, color: 'hsla(45, 80%, 55%, 0.8)' },
    { label: 'CA SB1223', score: 0.74, color: 'hsla(280, 60%, 60%, 0.8)' },
    { label: 'UNESCO',    score: 0.58, color: 'hsla(175, 60%, 45%, 0.8)' },
  ];
  const barH = (h - 30) / jurisdictions.length - 6;
  const animOffset = Math.sin(t * 0.8) * 0.03;

  jurisdictions.forEach((j, i) => {
    const y = 10 + i * (barH + 6);
    const score = Math.min(1, j.score + animOffset);
    const barW = (w - 80) * score;
    const pulse = i % 2 === 0 ? Math.sin(t * 1.2 + i) * 0.08 : 0;

    ctx.fillStyle = 'hsla(160, 10%, 12%, 0.6)';
    ctx.fillRect(60, y, w - 80, barH);
    ctx.fillStyle = j.color.replace('0.8)', `${0.4 + pulse + (1 - score) * 0.1})`);
    ctx.fillRect(60, y, barW, barH);

    ctx.fillStyle = 'hsla(160, 10%, 55%, 0.8)';
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillText(j.label, 0, y + barH - 2);

    const riskLabel = score > 0.75 ? 'HIGH' : score > 0.5 ? 'MOD' : 'LOW';
    ctx.fillStyle = score > 0.75 ? 'hsla(0,60%,55%,0.8)' : score > 0.5 ? 'hsla(45,80%,55%,0.8)' : 'hsla(142,71%,50%,0.8)';
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillText(riskLabel, w - 18, y + barH - 2);
  });
};

const engines: Engine[] = [
  { name: 'Lissajous 3D Engine', tag: 'lissajous_3d.py', desc: 'Toroidal Lissajous curves with coprime ratios (13:8:5). Z-axis discretized into scroll/zoom events. Non-repeating trajectories mask true intent vectors via x(t) = A·sin(ωₓt + δ), y(t) = B·sin(ωᵧt).', draw: drawLissajous },
  { name: 'Adaptive Tremor', tag: 'adaptive_tremor.py', desc: 'Learns your physiological tremor profile (4-12 Hz), then phase-locks synthetic injection to create a statistical null space where authentic neuromotor patterns become unrecoverable.', draw: drawTremor },
  { name: 'Keystroke Jitter', tag: 'keystroke_jitter.py', desc: 'Pink noise (S(f) ∝ 1/f^α) injection into dwell/flight times maintains human-like autocorrelation while destroying inter-keystroke interval signatures used by TypingDNA-class systems.', draw: drawKeystroke },
  { name: 'Spectral Defender', tag: 'spectral_canary.py', desc: 'Injects counter-phase oscillations in alpha (8-13 Hz) and theta (4-8 Hz) bands, creating destructive interference that collapses power spectral density features used for cognitive state classification from BCIs.', draw: drawSpectral },
  { name: 'Gradient Auditor', tag: 'gradient_auditor.py', desc: 'Detects gradient rank collapse, feature importance inversion, loss landscape discontinuities, and spectral norm explosions — real-time ML poisoning and fingerprinting attack detection.', draw: drawAuditor },
  { name: 'EEG Shield', tag: 'eeg_shield.py', desc: '3-layer neural privacy: signal obfuscation (adaptive Gaussian + temporal warp), per-band differential privacy (Laplace ε-mechanism), and FGSM-style adversarial injection (<0.3 µV RMS). Destroys P300/ERN biometric extractability.', draw: drawEEGShield },
  { name: 'Neuro Audit', tag: 'neuro_audit.py', desc: 'Multi-jurisdiction neurorights compliance engine. Checks EU AI Act, Colorado SB 24-205, Chilean constitutional amendment, California SB 1223, New York Int. 1306-A, and UNESCO AI Ethics. Returns per-jurisdiction risk scores and remediation guidance.', draw: drawNeuroAudit },
];

const EngineCard = ({ engine, index, isInView }: { engine: Engine; index: number; isInView: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let t = index * 0.5; // stagger starting phase per engine

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const draw = () => {
      engine.draw(ctx, canvas.offsetWidth, canvas.offsetHeight, t);
      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [engine, index]);

  return (
    <div
      className="glass-panel group hover:neon-border-glow overflow-hidden"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
    >
      <div className="relative">
        <canvas ref={canvasRef} className="w-full h-44" />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <span className="text-mono text-[10px] text-primary/40 tracking-wider">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="text-sm text-foreground font-medium" style={{ lineHeight: '1.2' }}>{engine.name}</h3>
          </div>
        </div>
        <span className="text-mono text-[10px] text-muted-foreground/50 block mb-3">{engine.tag}</span>
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
      <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-secondary/8 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div
          className="mb-16"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="tag-badge mb-6 inline-block">7 ENGINES</span>
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
