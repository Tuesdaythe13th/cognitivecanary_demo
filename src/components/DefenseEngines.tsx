import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';

interface Engine {
  name: string;
  tag: string;
  desc: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
}

// ─── Engine 1: Lissajous 3D ──────────────────────────────────────────────────
const drawLissajous = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  const scale = Math.min(w, h) * 0.36;

  const points: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i <= 800; i++) {
    const angle = (i / 800) * Math.PI * 2 * 4;
    points.push({
      x: Math.sin(13 * angle + t * 0.3),
      y: Math.sin(8  * angle + t * 0.15),
      z: Math.cos(5  * angle + t * 0.2),
    });
  }

  // Curve trail
  for (let i = 1; i < points.length; i++) {
    const p = points[i], pp = points[i - 1];
    const depth = (p.z + 1) / 2;
    const px  = cx + p.x  * scale * (0.75 + depth * 0.25);
    const py  = cy + p.y  * scale * (0.75 + depth * 0.25);
    const pd  = (pp.z + 1) / 2;
    const ppx = cx + pp.x * scale * (0.75 + pd * 0.25);
    const ppy = cy + pp.y * scale * (0.75 + pd * 0.25);
    ctx.beginPath();
    ctx.strokeStyle = `hsla(142, 71%, ${38 + depth * 28}%, ${0.08 + depth * 0.5})`;
    ctx.lineWidth = 0.4 + depth * 1.5;
    ctx.moveTo(ppx, ppy);
    ctx.lineTo(px, py);
    ctx.stroke();
  }

  // Glow cursor dot
  const glowI = Math.min(Math.floor(((t * 0.3) % (Math.PI * 8)) / (Math.PI * 8) * 800), 799);
  const gp = points[glowI];
  const gd = (gp.z + 1) / 2;
  const gx = cx + gp.x * scale * (0.75 + gd * 0.25);
  const gy = cy + gp.y * scale * (0.75 + gd * 0.25);
  ctx.beginPath();
  ctx.arc(gx, gy, 10, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(142, 71%, 55%, ${0.12 + gd * 0.1})`;
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = 'hsla(142, 71%, 72%, 0.95)';
  ctx.shadowColor = 'hsla(142, 71%, 55%, 0.9)';
  ctx.shadowBlur = 14;
  ctx.arc(gx, gy, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Z-axis / scroll indicator
  const scrollDelta = Math.abs(gp.z) < 0.15 ? 0 : Math.sign(gp.z) * Math.min(3, 1 + Math.floor(Math.abs(gp.z) / 0.3));
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`ω 13:8:5  z=${gp.z.toFixed(2)}  scroll${scrollDelta >= 0 ? '+' : ''}${scrollDelta}`, 7, h - 8);
};

// ─── Engine 2: Adaptive Tremor ───────────────────────────────────────────────
const drawTremor = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);

  // Axes
  ctx.strokeStyle = 'hsla(160, 10%, 28%, 0.45)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(22, h - 26); ctx.lineTo(w - 8, h - 26); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(22, h - 26); ctx.lineTo(22, 8); ctx.stroke();

  ctx.fillStyle = 'hsla(160, 10%, 45%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('4', 36, h - 13);
  ctx.fillText('8', Math.round(w * 0.42), h - 13);
  ctx.fillText('12', Math.round(w * 0.72), h - 13);
  ctx.fillText('PWR', 24, 16);

  // Phase-lock phase: first 3 s = calibrating, then locked
  const phase = (t % 10) / 10;
  const locked = phase > 0.35;
  const lockProgress = locked ? Math.min(1, (phase - 0.35) / 0.2) : 0;

  const numBins = 38;
  const barW = (w - 40) / numBins;
  for (let i = 0; i < numBins; i++) {
    const freq = 2 + (i / numBins) * 18;
    const inBand = freq >= 4 && freq <= 12;
    let power = 0;
    if (inBand) {
      // Physiological profile
      power = Math.exp(-((freq - 8.5) ** 2) / 5) * 0.85;
      // While calibrating → fluctuate; once locked → stable + synthetic overlay
      if (!locked) {
        power += Math.sin(t * 3 + i * 0.4) * 0.18 + Math.sin(t * 7 + i) * 0.08;
      } else {
        power += Math.sin(t * 2.4 + i * 0.3) * 0.1 * (1 - lockProgress * 0.5);
        // Synthetic injection (phase-locked, turns on gradually)
        const synthetic = Math.sin(t * 2.5 + i * 0.3 + Math.PI) * 0.22 * lockProgress;
        power += synthetic;
      }
    } else {
      power = 0.02 + Math.sin(t * 5 + i) * 0.01;
    }
    power = Math.max(0, power);
    const bh = power * (h - 48);
    const x = 26 + i * barW;
    ctx.fillStyle = inBand
      ? `hsla(${locked ? 142 : 175}, 71%, 45%, ${0.3 + power * 0.55})`
      : 'hsla(160, 10%, 28%, 0.22)';
    ctx.fillRect(x, h - 26 - bh, barW - 1, bh);
    if (inBand && power > 0.35) {
      ctx.fillStyle = `hsla(${locked ? 142 : 175}, 71%, 60%, ${power * 0.75})`;
      ctx.fillRect(x, h - 26 - bh, barW - 1, 2);
    }
  }

  // Band boundary lines
  const b4x  = 26 + (2 / 18)  * (w - 40);
  const b12x = 26 + (10 / 18) * (w - 40);
  ctx.strokeStyle = 'hsla(142, 71%, 45%, 0.18)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(b4x,  32); ctx.lineTo(b4x,  h - 26); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(b12x, 32); ctx.lineTo(b12x, h - 26); ctx.stroke();
  ctx.setLineDash([]);

  // Status label
  const statusColor = locked ? 'hsla(142, 71%, 50%, 0.85)' : 'hsla(45, 80%, 60%, 0.85)';
  ctx.fillStyle = statusColor;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(locked ? '⬤ PHASE-LOCKED' : '◌ CALIBRATING…', w * 0.32, 16);
};

// ─── Engine 3: Keystroke Jitter ──────────────────────────────────────────────
const drawKeystroke = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
  const keyCount = 16;
  const barW = (w - 44) / keyCount;
  const halfH = h / 2;

  // Section labels
  ctx.fillStyle = 'hsla(0, 50%, 55%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('RAW  (identifiable)', 6, 13);
  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.75)';
  ctx.fillText('OBFUSCATED (pink noise injected)', 6, halfH + 13);

  // Divider
  ctx.strokeStyle = 'hsla(160, 10%, 22%, 0.5)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, halfH); ctx.lineTo(w, halfH); ctx.stroke();

  // Fixed raw inter-keystroke intervals (ms)
  const rawTimings = [85, 120, 65, 90, 110, 75, 130, 88, 95, 70, 115, 82, 100, 78, 125, 92];

  for (let i = 0; i < keyCount; i++) {
    const x = 22 + i * barW;
    const raw = rawTimings[i];

    // Raw bars (top, muted)
    const rawBh = (raw / 155) * (halfH - 28);
    ctx.fillStyle = 'hsla(0, 0%, 55%, 0.38)';
    ctx.fillRect(x, halfH - rawBh - 6, barW - 3, rawBh);

    // Obfuscated: sin-based pink noise (no Math.random flicker)
    const jitter =
      Math.sin(i * 1.5  + t * 2.8) * 26 +
      Math.sin(i * 0.4  + t * 1.1) * 18 +
      Math.sin(i * 3.7  + t * 4.9) * 9  +
      Math.sin(i * 7.1  + t * 0.7) * 5;
    const obf = Math.max(30, raw + jitter);
    const obfBh = (obf / 155) * (halfH - 28);
    const hue = 142 + Math.sin(t + i * 0.25) * 12;
    ctx.fillStyle = `hsla(${hue}, 71%, 46%, 0.6)`;
    ctx.fillRect(x, h - obfBh - 6, barW - 3, obfBh);
  }

  // Correlation score (1/f noise destroys it toward 0)
  const corr = Math.max(0.02, 0.72 - 0.62 * Math.min(1, t / 8) + Math.sin(t * 0.9) * 0.04);
  ctx.fillStyle = corr < 0.2 ? 'hsla(142, 71%, 50%, 0.8)' : 'hsla(45, 80%, 55%, 0.8)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`r²=${corr.toFixed(3)}  ${corr < 0.15 ? 'IDENTITY DESTROYED' : 'erasing…'}`, 6, h - 6);
};

// ─── Engine 4: Spectral Defender ─────────────────────────────────────────────
const drawSpectral = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
  const q1 = h * 0.46, q2 = h * 0.54;

  const drawBand = (
    yBase: number, yRange: number,
    freq: number, amp: number,
    advFreq: number, advAmp: number, advPhase: number,
    strokeColor: string, labelText: string
  ) => {
    // Ghost (raw only, dashed)
    ctx.beginPath();
    ctx.strokeStyle = strokeColor.replace(/[\d.]+\)$/, '0.18)');
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 4]);
    for (let x = 0; x < w; x++) {
      const y = yBase + amp * Math.sin((x / w) * freq * Math.PI * 2 + t * 1.8);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Combined (raw + counter-phase injection)
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.3;
    for (let x = 0; x < w; x++) {
      const raw = amp * Math.sin((x / w) * freq * Math.PI * 2 + t * 1.8);
      const adv = advAmp * Math.sin((x / w) * advFreq * Math.PI * 2 + t * 1.9 + advPhase) * (0.85 + Math.sin(t * 0.4) * 0.15);
      const y = yBase + (raw + adv) * yRange;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = strokeColor;
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillText(labelText, 5, yBase - yRange * amp - 4);
  };

  drawBand(q1 * 0.55, 1, 10.5, 16, 10.7, 14, Math.PI * 0.88, 'hsla(175, 60%, 48%, 0.7)', 'ALPHA  8-13 Hz');
  drawBand(q2 + (h - q2) * 0.45, 1, 6.5, 18, 6.6, 16, Math.PI * 0.78, 'hsla(280, 60%, 62%, 0.65)', 'THETA  4-8 Hz');

  // Divider
  ctx.strokeStyle = 'hsla(160, 10%, 22%, 0.4)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
  ctx.setLineDash([]);

  // Cancellation power meter
  const cancel = 0.72 + Math.sin(t * 0.7) * 0.12;
  ctx.fillStyle = `hsla(142, 71%, 50%, ${0.5 + Math.sin(t * 2) * 0.3})`;
  ctx.beginPath();
  ctx.arc(w - 12, 12, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.8)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`∅ ${(cancel * 100).toFixed(0)}% cancelled`, w - 100, h - 7);
};

// ─── Engine 5: Gradient Auditor ──────────────────────────────────────────────
const drawAuditor = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);

  let detections = 0;
  const nodes: { x: number; y: number; label: string; alert: boolean }[] = [
    { x: 0.18, y: 0.22, label: 'F1', alert: false },
    { x: 0.50, y: 0.14, label: 'F2', alert: Math.sin(t * 1.5) > 0.72 },
    { x: 0.82, y: 0.27, label: 'F3', alert: false },
    { x: 0.13, y: 0.57, label: 'F4', alert: false },
    { x: 0.46, y: 0.52, label: 'GA', alert: Math.sin(t * 1.2 + 1) > 0.65 },
    { x: 0.77, y: 0.62, label: 'F5', alert: false },
    { x: 0.28, y: 0.83, label: 'F6', alert: false },
    { x: 0.58, y: 0.78, label: 'F7', alert: Math.sin(t * 0.9 + 2) > 0.82 },
    { x: 0.87, y: 0.84, label: 'F8', alert: false },
  ];
  nodes.forEach(n => { if (n.alert) detections++; });

  const connections = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[4,7],[5,8],[6,7],[7,8]];
  connections.forEach(([a, b]) => {
    const na = nodes[a], nb = nodes[b];
    const alert = na.alert || nb.alert;
    ctx.beginPath();
    ctx.strokeStyle = alert
      ? `hsla(142, 100%, 72%, ${0.55 + Math.sin(t * 3) * 0.3})`
      : 'hsla(142, 71%, 40%, 0.11)';
    ctx.lineWidth = alert ? 1.6 : 0.6;
    ctx.moveTo(na.x * w, na.y * h);
    ctx.lineTo(nb.x * w, nb.y * h);
    ctx.stroke();

    // Traveling pulse dot
    const prog = ((t * 0.55 + a * 0.35) % 1);
    const dx = na.x + (nb.x - na.x) * prog;
    const dy = na.y + (nb.y - na.y) * prog;
    ctx.beginPath();
    ctx.fillStyle = alert ? 'hsla(142, 100%, 80%, 1)' : 'hsla(142, 71%, 50%, 0.3)';
    ctx.arc(dx * w, dy * h, alert ? 2.2 : 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  nodes.forEach(node => {
    const nx = node.x * w, ny = node.y * h;
    const isGA = node.label === 'GA';
    const r = isGA ? 11 : 7;
    if (node.alert) {
      const pulse = 6 + Math.sin(t * 3) * 3;
      ctx.beginPath();
      ctx.arc(nx, ny, r + pulse, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(142, 100%, 85%, ${0.07 + Math.sin(t * 3) * 0.05})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = node.alert ? 'hsla(142, 100%, 55%, 0.35)' : isGA ? 'hsla(142, 71%, 42%, 0.3)' : 'hsla(0,0%,5%,0.9)';
    ctx.strokeStyle = node.alert ? 'hsla(142, 100%, 90%, 1)' : isGA ? 'hsla(142, 71%, 50%, 0.9)' : 'hsla(142, 30%, 28%, 0.5)';
    ctx.arc(nx, ny, r, 0, Math.PI * 2);
    ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = node.alert ? 'hsla(0,0%,5%,1)' : isGA ? 'hsla(142, 100%, 88%, 1)' : 'hsla(142, 50%, 72%, 0.75)';
    ctx.font = `bold ${isGA ? '9' : '7'}px JetBrains Mono, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(node.label, nx, ny + 3.5);
    ctx.textAlign = 'start';
  });

  ctx.fillStyle = detections > 0 ? 'hsla(142, 100%, 65%, 0.9)' : 'hsla(142, 71%, 55%, 0.65)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(
    detections > 0 ? `⚠ ANOMALY DETECTED (${detections} node${detections > 1 ? 's' : ''})` : '✓ GRADIENT AUDIT: NOMINAL',
    6, h - 8
  );
};

// ─── Engine 6: EEG Shield ─────────────────────────────────────────────────────
const drawEEGShield = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);
  const mid = h / 2;
  const topBase = mid * 0.48;
  const botBase = mid + mid * 0.48;

  const rawRMS = { sum: 0, n: 0 };
  const shieldRMS = { sum: 0, n: 0 };

  // Raw EEG (top half)
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const tx = (x / w) * 4 * Math.PI + t * 0.05;
    const p300 = x > w * 0.4 && x < w * 0.6 ? 14 * Math.exp(-((x / w - 0.5) ** 2) / 0.004) : 0;
    const signal = 16 * Math.sin(tx * 10) + 11 * Math.sin(tx * 6) + 3 * Math.sin(tx * 28) + p300;
    rawRMS.sum += signal * signal; rawRMS.n++;
    const y = topBase + signal;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'hsla(0, 65%, 55%, 0.7)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Divider
  ctx.strokeStyle = 'hsla(160, 10%, 22%, 0.45)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke();
  ctx.setLineDash([]);

  // Shielded EEG (bottom half) — FGSM + differential privacy + temporal warp
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const tx = (x / w) * 4 * Math.PI + t * 0.05;
    const raw   = 16 * Math.sin(tx * 10) + 11 * Math.sin(tx * 6);
    const adv   = 14 * Math.sin(tx * 10 + Math.PI * 0.88) + 9 * Math.sin(tx * 6 + Math.PI * 0.78);
    const dp    = 2.5 * Math.sin(tx * 47 + t * 3.1);
    const shield = (raw + adv) * 0.45 + dp;
    shieldRMS.sum += shield * shield; shieldRMS.n++;
    const y = botBase + shield;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'hsla(142, 71%, 48%, 0.75)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Labels
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillStyle = 'hsla(0, 60%, 62%, 0.75)';
  ctx.fillText('RAW EEG  (P300 visible)', 6, 12);
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.85)';
  ctx.fillText('SHIELDED  (P300 erased)', 6, mid + 12);

  // Amplitude reduction indicator
  const rRaw = Math.sqrt(rawRMS.sum / (rawRMS.n || 1));
  const rShield = Math.sqrt(shieldRMS.sum / (shieldRMS.n || 1));
  const reduction = rRaw > 0 ? (1 - rShield / rRaw) * 100 : 0;
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.75)';
  ctx.fillText(`↓ ${reduction.toFixed(0)}% amplitude  <0.3µV RMS`, 6, h - 8);
};

// ─── Engine 7: Neuro Audit ────────────────────────────────────────────────────
const drawNeuroAudit = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);

  const jurisdictions = [
    { label: 'EU AI Act',  score: 0.82, color: 'hsla(200, 70%, 52%, 0.85)' },
    { label: 'Chile NR',   score: 0.91, color: 'hsla(142, 71%, 46%, 0.85)' },
    { label: 'Colorado',   score: 0.65, color: 'hsla(45,  80%, 56%, 0.85)' },
    { label: 'CA SB1223',  score: 0.74, color: 'hsla(280, 60%, 62%, 0.85)' },
    { label: 'NY 1306-A',  score: 0.61, color: 'hsla(175, 60%, 48%, 0.85)' },
    { label: 'UNESCO',     score: 0.58, color: 'hsla(30,  75%, 55%, 0.85)' },
  ];

  const labelW = 62;
  const barAreaW = w - labelW - 28; // leave space for risk badge on right
  const rowH = (h - 14) / jurisdictions.length;
  const animOffset = Math.sin(t * 0.7) * 0.025;

  jurisdictions.forEach((j, i) => {
    const y = 8 + i * rowH;
    const bh = Math.max(6, rowH - 6);
    const score = Math.min(1, Math.max(0, j.score + animOffset));
    const barW = barAreaW * score;
    const pulse = i % 2 === 0 ? Math.sin(t * 1.1 + i) * 0.06 : 0;

    // Track
    ctx.fillStyle = 'hsla(160, 10%, 11%, 0.55)';
    ctx.fillRect(labelW, y, barAreaW, bh);

    // Fill
    const fillAlpha = 0.35 + pulse + (score > 0.75 ? 0.15 : 0);
    ctx.fillStyle = j.color.replace(/[\d.]+\)$/, `${fillAlpha})`);
    ctx.fillRect(labelW, y, barW, bh);

    // Score glow line
    ctx.fillStyle = j.color.replace(/[\d.]+\)$/, '0.7)');
    ctx.fillRect(labelW + barW - 1, y, 2, bh);

    // Label (left)
    ctx.fillStyle = 'hsla(160, 10%, 58%, 0.85)';
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillText(j.label, 2, y + bh - 2);

    // Risk badge (right)
    const risk = score > 0.75 ? 'HIGH' : score > 0.5 ? 'MED' : 'LOW';
    ctx.fillStyle = score > 0.75 ? 'hsla(0,65%,58%,0.9)' : score > 0.5 ? 'hsla(45,80%,58%,0.9)' : 'hsla(142,71%,52%,0.9)';
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillText(risk, w - 22, y + bh - 2);
  });

  // Footer
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.65)';
  ctx.font = '7px JetBrains Mono, monospace';
  ctx.fillText('6 jurisdictions · live risk scoring', 2, h - 2);
};

// ─── Engine registry ─────────────────────────────────────────────────────────
const engines: Engine[] = [
  { name: 'Lissajous 3D Engine', tag: 'lissajous_3d.py',    desc: 'Toroidal Lissajous curves with coprime ratios (13:8:5). Z-axis discretized into scroll/zoom events. Non-repeating trajectories mask true intent vectors via x(t) = A·sin(ωₓt + δ), y(t) = B·sin(ωᵧt).', draw: drawLissajous },
  { name: 'Adaptive Tremor',     tag: 'adaptive_tremor.py', desc: 'Learns your physiological tremor profile (4-12 Hz), then phase-locks synthetic injection to create a statistical null space where authentic neuromotor patterns become unrecoverable.', draw: drawTremor },
  { name: 'Keystroke Jitter',    tag: 'keystroke_jitter.py',desc: 'Pink noise (S(f) ∝ 1/f^α) injection into dwell/flight times maintains human-like autocorrelation while destroying inter-keystroke interval signatures used by TypingDNA-class systems.', draw: drawKeystroke },
  { name: 'Spectral Defender',   tag: 'spectral_canary.py', desc: 'Injects counter-phase oscillations in alpha (8-13 Hz) and theta (4-8 Hz) bands, creating destructive interference that collapses power spectral density features used for cognitive state classification from BCIs.', draw: drawSpectral },
  { name: 'Gradient Auditor',    tag: 'gradient_auditor.py',desc: 'Detects gradient rank collapse, feature importance inversion, loss landscape discontinuities, and spectral norm explosions — real-time ML poisoning and fingerprinting attack detection.', draw: drawAuditor },
  { name: 'EEG Shield',          tag: 'eeg_shield.py',       desc: '3-layer neural privacy: signal obfuscation (adaptive Gaussian + temporal warp), per-band differential privacy (Laplace ε-mechanism), and FGSM-style adversarial injection (<0.3 µV RMS). Destroys P300/ERN biometric extractability.', draw: drawEEGShield },
  { name: 'Neuro Audit',         tag: 'neuro_audit.py',      desc: 'Multi-jurisdiction neurorights compliance engine. Checks EU AI Act, Colorado SB 24-205, Chilean constitutional amendment, California SB 1223, New York Int. 1306-A, and UNESCO AI Ethics. Returns per-jurisdiction risk scores and remediation guidance.', draw: drawNeuroAudit },
];

// ─── Card component ───────────────────────────────────────────────────────────
const EngineCard = ({ engine, index, isInView }: { engine: Engine; index: number; isInView: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let t = index * 0.6; // staggered starting phase

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      engine.draw(ctx, canvas.offsetWidth, canvas.offsetHeight, t);
      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [engine, index]);

  return (
    <div
      className="glass-panel group overflow-hidden"
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
        <canvas ref={canvasRef} className="w-full h-52" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <span className="text-mono text-[10px] text-primary/40 tracking-wider">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="text-sm text-foreground font-medium" style={{ lineHeight: '1.2' }}>{engine.name}</h3>
          </div>
          {/* Active pulse */}
          <span className="flex items-center gap-1.5 text-mono text-[9px] text-primary/60 tracking-wider">
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary"
              style={{ boxShadow: '0 0 5px hsla(142,71%,50%,0.7)', animation: 'pulse 2s ease-in-out infinite' }}
            />
            ACTIVE
          </span>
        </div>
        <span className="text-mono text-[10px] text-muted-foreground/50 block mb-3">{engine.tag}</span>
        <p className="text-body text-xs text-muted-foreground leading-relaxed">{engine.desc}</p>
      </div>
    </div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
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
