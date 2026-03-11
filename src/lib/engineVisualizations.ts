/**
 * Canvas drawing functions for each defense engine visualization.
 *
 * Extracted from DefenseEngines.tsx so the component only handles
 * layout, state, and lifecycle — not rendering math.
 */

export type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

// ── Engine 1: Lissajous 3D ────────────────────────────────────────────────

export const drawLissajous: DrawFn = (ctx, w, h, t) => {
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

  const scrollDelta = Math.abs(gp.z) < 0.15 ? 0 : Math.sign(gp.z) * Math.min(3, 1 + Math.floor(Math.abs(gp.z) / 0.3));
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`ω 13:8:5  z=${gp.z.toFixed(2)}  scroll${scrollDelta >= 0 ? '+' : ''}${scrollDelta}`, 7, h - 8);
};

// ── Engine 2: Adaptive Tremor ─────────────────────────────────────────────

export const drawTremor: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);

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
      power = Math.exp(-((freq - 8.5) ** 2) / 5) * 0.85;
      if (!locked) {
        power += Math.sin(t * 3 + i * 0.4) * 0.18 + Math.sin(t * 7 + i) * 0.08;
      } else {
        power += Math.sin(t * 2.4 + i * 0.3) * 0.1 * (1 - lockProgress * 0.5);
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

  const b4x  = 26 + (2 / 18)  * (w - 40);
  const b12x = 26 + (10 / 18) * (w - 40);
  ctx.strokeStyle = 'hsla(142, 71%, 45%, 0.18)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(b4x,  32); ctx.lineTo(b4x,  h - 26); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(b12x, 32); ctx.lineTo(b12x, h - 26); ctx.stroke();
  ctx.setLineDash([]);

  const statusColor = locked ? 'hsla(142, 71%, 50%, 0.85)' : 'hsla(45, 80%, 60%, 0.85)';
  ctx.fillStyle = statusColor;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(locked ? '⬤ PHASE-LOCKED' : '◌ CALIBRATING…', w * 0.32, 16);
};

// ── Engine 3: Keystroke Jitter ────────────────────────────────────────────

export const drawKeystroke: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const keyCount = 16;
  const barW = (w - 44) / keyCount;
  const halfH = h / 2;

  ctx.fillStyle = 'hsla(0, 50%, 55%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('RAW  (identifiable)', 6, 13);
  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.75)';
  ctx.fillText('OBFUSCATED (pink noise injected)', 6, halfH + 13);

  ctx.strokeStyle = 'hsla(160, 10%, 22%, 0.5)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, halfH); ctx.lineTo(w, halfH); ctx.stroke();

  const rawTimings = [85, 120, 65, 90, 110, 75, 130, 88, 95, 70, 115, 82, 100, 78, 125, 92];

  for (let i = 0; i < keyCount; i++) {
    const x = 22 + i * barW;
    const raw = rawTimings[i];

    const rawBh = (raw / 155) * (halfH - 28);
    ctx.fillStyle = 'hsla(0, 0%, 55%, 0.38)';
    ctx.fillRect(x, halfH - rawBh - 6, barW - 3, rawBh);

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

  const corr = Math.max(0.02, 0.72 - 0.62 * Math.min(1, t / 8) + Math.sin(t * 0.9) * 0.04);
  ctx.fillStyle = corr < 0.2 ? 'hsla(142, 71%, 50%, 0.8)' : 'hsla(45, 80%, 55%, 0.8)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`r²=${corr.toFixed(3)}  ${corr < 0.15 ? 'IDENTITY DESTROYED' : 'erasing…'}`, 6, h - 6);
};

// ── Engine 4: Spectral Defender ───────────────────────────────────────────

export const drawSpectral: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const q1 = h * 0.46, q2 = h * 0.54;

  const drawBand = (
    yBase: number, yRange: number,
    freq: number, amp: number,
    advFreq: number, advAmp: number, advPhase: number,
    strokeColor: string, labelText: string
  ) => {
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

  ctx.strokeStyle = 'hsla(160, 10%, 22%, 0.4)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
  ctx.setLineDash([]);

  const cancel = 0.72 + Math.sin(t * 0.7) * 0.12;
  ctx.fillStyle = `hsla(142, 71%, 50%, ${0.5 + Math.sin(t * 2) * 0.3})`;
  ctx.beginPath();
  ctx.arc(w - 12, 12, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.8)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`∅ ${(cancel * 100).toFixed(0)}% cancelled`, w - 100, h - 7);
};

// ── Engine 5: Gradient Auditor ────────────────────────────────────────────

export const drawAuditor: DrawFn = (ctx, w, h, t) => {
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

// ── Engine 6: EEG Shield ──────────────────────────────────────────────────

export const drawEEGShield: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const mid = h / 2;
  const topBase = mid * 0.48;
  const botBase = mid + mid * 0.48;

  const rawRMS = { sum: 0, n: 0 };
  const shieldRMS = { sum: 0, n: 0 };

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

  ctx.strokeStyle = 'hsla(160, 10%, 22%, 0.45)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke();
  ctx.setLineDash([]);

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

  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillStyle = 'hsla(0, 60%, 62%, 0.75)';
  ctx.fillText('RAW EEG  (P300 visible)', 6, 12);
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.85)';
  ctx.fillText('SHIELDED  (P300 erased)', 6, mid + 12);

  const rRaw = Math.sqrt(rawRMS.sum / (rawRMS.n || 1));
  const rShield = Math.sqrt(shieldRMS.sum / (shieldRMS.n || 1));
  const reduction = rRaw > 0 ? (1 - rShield / rRaw) * 100 : 0;
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.75)';
  ctx.fillText(`↓ ${reduction.toFixed(0)}% amplitude  <0.3µV RMS`, 6, h - 8);
};

// ── Engine 7: Neuro Audit ─────────────────────────────────────────────────

export const drawNeuroAudit: DrawFn = (ctx, w, h, t) => {
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
  const barAreaW = w - labelW - 28;
  const rowH = (h - 14) / jurisdictions.length;
  const animOffset = Math.sin(t * 0.7) * 0.025;

  jurisdictions.forEach((j, i) => {
    const y = 8 + i * rowH;
    const bh = Math.max(6, rowH - 6);
    const score = Math.min(1, Math.max(0, j.score + animOffset));
    const barW = barAreaW * score;
    const pulse = i % 2 === 0 ? Math.sin(t * 1.1 + i) * 0.06 : 0;

    ctx.fillStyle = 'hsla(160, 10%, 11%, 0.55)';
    ctx.fillRect(labelW, y, barAreaW, bh);

    const fillAlpha = 0.35 + pulse + (score > 0.75 ? 0.15 : 0);
    ctx.fillStyle = j.color.replace(/[\d.]+\)$/, `${fillAlpha})`);
    ctx.fillRect(labelW, y, barW, bh);

    ctx.fillStyle = j.color.replace(/[\d.]+\)$/, '0.7)');
    ctx.fillRect(labelW + barW - 1, y, 2, bh);

    ctx.fillStyle = 'hsla(160, 10%, 58%, 0.85)';
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillText(j.label, 2, y + bh - 2);

    const risk = score > 0.75 ? 'HIGH' : score > 0.5 ? 'MED' : 'LOW';
    ctx.fillStyle = score > 0.75 ? 'hsla(0,65%,58%,0.9)' : score > 0.5 ? 'hsla(45,80%,58%,0.9)' : 'hsla(142,71%,52%,0.9)';
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillText(risk, w - 22, y + bh - 2);
  });

  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.65)';
  ctx.font = '7px JetBrains Mono, monospace';
  ctx.fillText('6 jurisdictions · live risk scoring', 2, h - 2);
};

// ── Engine 8: Neuronpedia Explorer ─────────────────────────────────────────

export const drawNeuronpedia: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const cols = 8, rows = 6;
  const cellW = (w - 20) / cols, cellH = (h - 30) / rows;
  const totalFeatures = cols * rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const x = 10 + c * cellW, y = 10 + r * cellH;
      const phase = Math.sin(t * 0.8 + idx * 0.73) * 0.5 + 0.5;
      const isActive = phase > 0.65;
      const isDeception = idx % 11 === 3 || idx % 13 === 5;

      ctx.fillStyle = isActive
        ? (isDeception ? 'hsla(280, 60%, 50%, 0.25)' : 'hsla(142, 71%, 45%, 0.18)')
        : 'hsla(160, 10%, 11%, 0.4)';
      ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

      ctx.strokeStyle = isActive
        ? (isDeception ? 'hsla(280, 60%, 62%, 0.7)' : 'hsla(142, 71%, 50%, 0.5)')
        : 'hsla(160, 10%, 25%, 0.3)';
      ctx.lineWidth = isActive ? 1.2 : 0.5;
      ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

      if (isActive) {
        const barH = phase * (cellH - 12);
        const hue = isDeception ? 280 : 142;
        ctx.fillStyle = `hsla(${hue}, 71%, 55%, ${0.4 + phase * 0.4})`;
        ctx.fillRect(x + 3, y + cellH - 3 - barH, cellW - 6, barH);
        ctx.fillStyle = `hsla(${hue}, 71%, 80%, 0.9)`;
        ctx.font = '6px JetBrains Mono, monospace';
        ctx.fillText(`${idx}`, x + 3, y + 9);
        if (phase > 0.85) {
          ctx.shadowColor = `hsla(${hue}, 71%, 55%, 0.8)`;
          ctx.shadowBlur = 6;
          ctx.fillStyle = `hsla(${hue}, 71%, 70%, 0.3)`;
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
          ctx.shadowBlur = 0;
        }
      }
    }
  }

  const activeCount = Math.floor(totalFeatures * (0.2 + Math.sin(t * 0.5) * 0.08));
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`FEATURES: ${totalFeatures}  ACTIVE: ${activeCount}  SAE: 16k JumpReLU`, 7, h - 8);
};

// ── Engine 9: Inspect Harness ─────────────────────────────────────────────

export const drawInspect: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);

  const tasks = [
    { name: 'math', monScore: 0.92, unmonScore: 0.61 },
    { name: 'code', monScore: 0.88, unmonScore: 0.67 },
    { name: 'reason', monScore: 0.85, unmonScore: 0.72 },
    { name: 'ethics', monScore: 0.79, unmonScore: 0.58 },
    { name: 'aware', monScore: 0.74, unmonScore: 0.45 },
    { name: 'persona', monScore: 0.81, unmonScore: 0.63 },
    { name: 'safety', monScore: 0.90, unmonScore: 0.82 },
    { name: 'know', monScore: 0.86, unmonScore: 0.70 },
  ];

  const barW = (w - 80) / tasks.length;
  const maxH = h - 42;
  const phase = (t * 0.15) % 1;
  const revealCount = Math.min(tasks.length, Math.floor(phase * tasks.length * 1.5));

  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('MONITORED', 6, 12);
  ctx.fillStyle = 'hsla(0, 65%, 55%, 0.7)';
  ctx.fillText('UNMONITORED', w * 0.55, 12);

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const x = 40 + i * barW;
    const revealed = i < revealCount;

    const monH = revealed ? task.monScore * maxH * 0.7 : 0;
    ctx.fillStyle = 'hsla(142, 71%, 45%, 0.55)';
    ctx.fillRect(x, h - 22 - monH, barW * 0.4, monH);

    const jitter = Math.sin(t * 2 + i) * 0.03;
    const unmonH = revealed ? (task.unmonScore + jitter) * maxH * 0.7 : 0;
    ctx.fillStyle = 'hsla(0, 55%, 50%, 0.45)';
    ctx.fillRect(x + barW * 0.45, h - 22 - unmonH, barW * 0.4, unmonH);

    ctx.fillStyle = 'hsla(160, 10%, 50%, 0.7)';
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillText(task.name, x, h - 10);

    if (revealed) {
      const delta = task.monScore - task.unmonScore;
      if (delta > 0.15) {
        ctx.fillStyle = 'hsla(0, 65%, 58%, 0.8)';
        ctx.font = '6px JetBrains Mono, monospace';
        ctx.fillText(`\u0394${(delta * 100).toFixed(0)}`, x + barW * 0.15, h - 25 - Math.max(monH, unmonH));
      }
    }
  }

  const progW = (w - 16) * Math.min(1, phase * 1.3);
  ctx.fillStyle = 'hsla(142, 71%, 45%, 0.15)';
  ctx.fillRect(8, h - 6, w - 16, 3);
  ctx.fillStyle = 'hsla(142, 71%, 50%, 0.6)';
  ctx.fillRect(8, h - 6, progW, 3);
};

// ── Engine 10: TransformerLens Probe ──────────────────────────────────────

export const drawTransformerLens: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const nLayers = 16, nPositions = 24;
  const cellW = (w - 50) / nPositions, cellH = (h - 30) / nLayers;

  ctx.fillStyle = 'hsla(160, 10%, 45%, 0.6)';
  ctx.font = '6px JetBrains Mono, monospace';
  for (let l = 0; l < nLayers; l += 4) {
    ctx.fillText(`L${l}`, 2, 14 + l * cellH + cellH / 2);
  }

  for (let l = 0; l < nLayers; l++) {
    for (let p = 0; p < nPositions; p++) {
      const x = 24 + p * cellW, y = 8 + l * cellH;
      const layerEffect = Math.exp(-((l - 8) ** 2) / 25);
      const posEffect = Math.sin(p * 0.4 + t * 0.3) * 0.3 + 0.5;
      const patchEffect = (l === Math.floor(7 + Math.sin(t * 0.2) * 3) && p > 10 && p < 18)
        ? Math.sin(t * 2) * 0.5 + 0.5 : 0;
      const intensity = Math.max(0, Math.min(1, layerEffect * posEffect + patchEffect * 0.4));

      if (patchEffect > 0.1) {
        ctx.fillStyle = `hsla(280, 60%, ${30 + intensity * 40}%, ${0.3 + intensity * 0.6})`;
      } else {
        ctx.fillStyle = `hsla(142, 71%, ${20 + intensity * 35}%, ${0.15 + intensity * 0.65})`;
      }
      ctx.fillRect(x, y, cellW - 0.5, cellH - 0.5);
    }
  }

  const scanLayer = Math.floor(7 + Math.sin(t * 0.2) * 3);
  ctx.strokeStyle = 'hsla(175, 60%, 55%, 0.6)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(24, 8 + scanLayer * cellH);
  ctx.lineTo(w - 20, 8 + scanLayer * cellH);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = 'hsla(175, 60%, 55%, 0.8)';
  ctx.font = '7px JetBrains Mono, monospace';
  ctx.fillText(`\u25B8 PATCH L${scanLayer}`, w - 60, 8 + scanLayer * cellH - 2);

  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`RESIDUAL STREAM  ${nLayers}L\u00D7${nPositions}P  PATCH: mean-ablation`, 7, h - 8);
};

// ── Engine 11: Stax Evaluator ─────────────────────────────────────────────

export const drawStax: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);

  const benchmarks = [
    { name: 'TruthfulQA', score: 0.72, weight: 0.20 },
    { name: 'MMLU', score: 0.81, weight: 0.10 },
    { name: 'BIG-bench', score: 0.78, weight: 0.10 },
    { name: 'Sandbagging', score: 0.42, weight: 0.25 },
    { name: 'Eval-Aware', score: 0.38, weight: 0.20 },
    { name: 'H_strat', score: 0.35, weight: 0.25 },
  ];

  const labelW = 72, barAreaW = w - labelW - 35;
  const rowH = (h - 20) / benchmarks.length;
  const animOffset = Math.sin(t * 0.5) * 0.02;

  benchmarks.forEach((b, i) => {
    const y = 8 + i * rowH;
    const bh = Math.max(6, rowH - 8);
    const score = Math.min(1, Math.max(0, b.score + animOffset + Math.sin(t * 0.7 + i) * 0.015));

    let hue: number, lightness: number;
    if (score > 0.7) { hue = 142; lightness = 45; }
    else if (score > 0.5) { hue = 45; lightness = 55; }
    else { hue = 0; lightness = 55; }

    ctx.fillStyle = 'hsla(160, 10%, 11%, 0.5)';
    ctx.fillRect(labelW, y, barAreaW, bh);
    const barW = barAreaW * score;
    ctx.fillStyle = `hsla(${hue}, 65%, ${lightness}%, 0.45)`;
    ctx.fillRect(labelW, y, barW, bh);
    ctx.fillStyle = `hsla(${hue}, 65%, ${lightness + 15}%, 0.8)`;
    ctx.fillRect(labelW + barW - 1, y, 2, bh);

    ctx.fillStyle = 'hsla(160, 10%, 58%, 0.85)';
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillText(b.name, 2, y + bh - 3);
    ctx.fillStyle = `hsla(${hue}, 65%, ${lightness + 15}%, 0.9)`;
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillText(score.toFixed(2), w - 28, y + bh - 3);
  });

  const overall = benchmarks.reduce((s, b) => s + b.score * b.weight, 0) /
    benchmarks.reduce((s, b) => s + b.weight, 0);
  const trustColor = overall > 0.6 ? 'hsla(142, 71%, 50%, 0.8)' : overall > 0.4 ? 'hsla(45, 80%, 55%, 0.8)' : 'hsla(0, 65%, 55%, 0.8)';
  ctx.fillStyle = trustColor;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`TRUST GRADIENT: ${overall.toFixed(3)}  ${overall > 0.6 ? 'DEPLOYABLE' : 'HOLD'}`, 7, h - 5);
};

// ── Engine 12: Docent Auditor ─────────────────────────────────────────────

export const drawDocent: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);

  const centroids = [
    { x: 0.22, y: 0.30 }, { x: 0.65, y: 0.25 },
    { x: 0.40, y: 0.70 }, { x: 0.80, y: 0.68 },
  ];
  const clusterHues = [175, 142, 200, 45];

  const docs: { x: number; y: number; cluster: number; flagged: boolean }[] = [];
  for (let i = 0; i < 20; i++) {
    const cluster = i % centroids.length;
    const cx = centroids[cluster].x, cy = centroids[cluster].y;
    const drift = Math.min(1, t * 0.08);
    const startX = (i * 0.051 + 0.05) % 0.9;
    const startY = ((i * 0.073 + 0.1) % 0.8) + 0.05;
    docs.push({
      x: startX + (cx - startX) * drift + Math.sin(t * 0.5 + i * 1.3) * 0.02,
      y: startY + (cy - startY) * drift + Math.cos(t * 0.4 + i * 0.9) * 0.02,
      cluster,
      flagged: i === 3 || i === 11 || i === 17,
    });
  }

  docs.forEach(doc => {
    const ccx = centroids[doc.cluster].x * w, ccy = centroids[doc.cluster].y * h;
    ctx.beginPath();
    ctx.strokeStyle = `hsla(${clusterHues[doc.cluster]}, 60%, 48%, 0.08)`;
    ctx.lineWidth = 0.5;
    ctx.moveTo(doc.x * w, doc.y * h);
    ctx.lineTo(ccx, ccy);
    ctx.stroke();
  });

  docs.forEach((doc, i) => {
    const dx = doc.x * w, dy = doc.y * h;
    if (doc.flagged) {
      const pulse = Math.sin(t * 3 + i) * 0.3 + 0.7;
      ctx.strokeStyle = `hsla(0, 65%, 58%, ${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(dx - 8, dy - 6, 16, 13);
      ctx.fillStyle = 'hsla(0, 55%, 50%, 0.6)';
    } else {
      ctx.fillStyle = `hsla(${clusterHues[doc.cluster]}, 60%, 48%, 0.5)`;
    }
    ctx.fillRect(dx - 5, dy - 3.5, 10, 7);
    ctx.fillStyle = doc.flagged ? 'hsla(0, 55%, 70%, 0.6)' : 'hsla(160, 10%, 60%, 0.3)';
    ctx.fillRect(dx - 3, dy - 2, 6, 1);
    ctx.fillRect(dx - 3, dy + 1, 4, 1);
  });

  const scanY = ((t * 0.12) % 1) * h;
  ctx.strokeStyle = 'hsla(175, 60%, 50%, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(w, scanY); ctx.stroke();

  docs.forEach(doc => {
    if (doc.flagged && Math.abs(doc.y * h - scanY) < 8) {
      ctx.fillStyle = 'hsla(0, 65%, 60%, 0.9)';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillText('!', doc.x * w + 8, doc.y * h + 3);
    }
  });

  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`CLUSTERS: ${centroids.length}  FLAGGED: ${docs.filter(d => d.flagged).length}  EVAL-AWARENESS: scanning`, 7, h - 8);
};

// ── Engine 13: Bloom Elicitor ─────────────────────────────────────────────

export const drawBloom: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);

  const rootX = 30, rootY = h / 2;
  ctx.beginPath();
  ctx.arc(rootX, rootY, 8, 0, Math.PI * 2);
  ctx.fillStyle = 'hsla(142, 71%, 45%, 0.6)';
  ctx.fill();
  ctx.strokeStyle = 'hsla(142, 71%, 55%, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = 'hsla(142, 71%, 80%, 0.9)';
  ctx.font = 'bold 7px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('B', rootX, rootY + 3);
  ctx.textAlign = 'start';

  const strategies = ['PI', 'MV', 'CP', 'RH', 'CH', 'PE', 'RR'];
  const branchSpacing = (h - 30) / strategies.length;
  const growth = Math.min(1, (t * 0.1) % 1.5);

  strategies.forEach((label, i) => {
    const endY = 15 + i * branchSpacing;
    const midX = rootX + (w - rootX - 30) * 0.4;
    const endX = rootX + (w - rootX - 30) * 0.75 * growth;
    const progress = Math.min(1, growth * 1.3);

    if (progress > 0) {
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${142 + i * 18}, 60%, 45%, ${0.2 + progress * 0.3})`;
      ctx.lineWidth = 1;
      ctx.moveTo(rootX + 8, rootY);
      ctx.quadraticCurveTo(midX, rootY + (endY - rootY) * 0.3, endX, endY);
      ctx.stroke();
    }

    if (growth > 0.3) {
      const nodeAlpha = Math.min(1, (growth - 0.3) * 2);
      const isActive = Math.sin(t * 1.5 + i * 0.8) > 0.3;
      ctx.beginPath();
      ctx.arc(endX, endY, 5, 0, Math.PI * 2);
      ctx.fillStyle = isActive
        ? `hsla(${142 + i * 18}, 60%, 50%, ${nodeAlpha * 0.5})`
        : `hsla(160, 10%, 20%, ${nodeAlpha * 0.5})`;
      ctx.fill();
      ctx.strokeStyle = `hsla(${142 + i * 18}, 60%, 55%, ${nodeAlpha * 0.7})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = `hsla(${142 + i * 18}, 60%, 70%, ${nodeAlpha * 0.9})`;
      ctx.font = '6px JetBrains Mono, monospace';
      ctx.fillText(label, endX + 8, endY + 2);

      if (growth > 0.6 && isActive) {
        for (let s = 0; s < 3; s++) {
          const subY = endY - 8 + s * 8;
          const subX = endX + 30 + s * 8;
          const subAlpha = Math.min(1, (growth - 0.6) * 3);
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${142 + i * 18}, 60%, 45%, ${subAlpha * 0.2})`;
          ctx.moveTo(endX + 5, endY);
          ctx.lineTo(subX, subY);
          ctx.stroke();
          ctx.fillStyle = `hsla(${142 + i * 18}, 60%, 55%, ${subAlpha * 0.4})`;
          ctx.fillRect(subX - 2, subY - 2, 4, 4);
        }
      }
    }
  });

  const scenarioCount = Math.floor(growth * strategies.length * 3);
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`STRATEGIES: ${strategies.length}  SCENARIOS: ${scenarioCount}  BLOOM: generating`, 7, h - 8);
};

// ── Engine 14: Sparse Circuit Mapper ──────────────────────────────────────

export const drawSparseCircuit: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);

  const nInput = 20, inputX = 30;
  for (let i = 0; i < nInput; i++) {
    const y = 12 + (i / nInput) * (h - 24);
    ctx.beginPath();
    ctx.arc(inputX, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'hsla(175, 60%, 50%, 0.5)';
    ctx.fill();
  }

  const bottleX1 = w * 0.35, bottleX2 = w * 0.45;
  ctx.fillStyle = 'hsla(142, 71%, 45%, 0.06)';
  ctx.fillRect(bottleX1, 4, bottleX2 - bottleX1, h - 8);
  ctx.strokeStyle = 'hsla(142, 71%, 45%, 0.2)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 3]);
  ctx.strokeRect(bottleX1, 4, bottleX2 - bottleX1, h - 8);
  ctx.setLineDash([]);
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.4)';
  ctx.font = '7px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SAE', (bottleX1 + bottleX2) / 2, h / 2);
  ctx.textAlign = 'start';

  const nOutput = 40;
  const outputStartX = w * 0.55;
  const features: { x: number; y: number; active: boolean }[] = [];
  for (let i = 0; i < nOutput; i++) {
    const col = i % 5, row = Math.floor(i / 5);
    const x = outputStartX + col * ((w - outputStartX - 10) / 5) + 10;
    const y = 12 + row * ((h - 24) / 8);
    const isActive = Math.sin(t * 0.9 + i * 1.7) > 0.7;
    features.push({ x, y, active: isActive });

    ctx.beginPath();
    ctx.arc(x, y, isActive ? 3.5 : 2, 0, Math.PI * 2);
    if (isActive) {
      ctx.fillStyle = 'hsla(142, 71%, 55%, 0.7)';
      ctx.fill();
      ctx.shadowColor = 'hsla(142, 71%, 55%, 0.5)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.strokeStyle = 'hsla(160, 10%, 30%, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  const activeFeatures = features.filter(f => f.active);
  for (let i = 0; i < activeFeatures.length; i++) {
    for (let j = i + 1; j < activeFeatures.length; j++) {
      const a = activeFeatures[i], b = activeFeatures[j];
      const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      if (dist < 80) {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(280, 60%, 60%, ${0.15 + (80 - dist) / 80 * 0.25})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        const prog = ((t * 0.4 + i * 0.2) % 1);
        ctx.beginPath();
        ctx.fillStyle = 'hsla(280, 60%, 70%, 0.6)';
        ctx.arc(a.x + (b.x - a.x) * prog, a.y + (b.y - a.y) * prog, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < nInput; i += 3) {
    const y = 12 + (i / nInput) * (h - 24);
    const prog = ((t * 0.3 + i * 0.1) % 1);
    ctx.beginPath();
    ctx.fillStyle = 'hsla(175, 60%, 55%, 0.3)';
    ctx.arc(inputX + (bottleX1 - inputX) * prog, y + Math.sin(prog * Math.PI) * 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.7)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`FEATURES: ${nOutput}  ACTIVE: ${activeFeatures.length}  CIRCUITS: ${Math.max(1, Math.floor(activeFeatures.length / 3))}`, 7, h - 8);
};

// ── Engine 15: Strategic Fidelity ─────────────────────────────────────────

export const drawStrategicFidelity: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2, cy = h * 0.42;
  const radius = Math.min(w, h) * 0.28;
  const hStrat = 0.42 + Math.sin(t * 0.3) * 0.05 + Math.sin(t * 0.7) * 0.02;
  const clamped = Math.max(0, Math.min(1, hStrat));

  const startAngle = Math.PI * 0.8;
  const endAngle = Math.PI * 2.2;
  const totalArc = endAngle - startAngle;

  for (let i = 0; i <= 10; i++) {
    const frac = i / 10;
    const angle = startAngle + frac * totalArc;
    const innerR = radius - 6, outerR = radius + 2;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(cx + innerR * cos, cy + innerR * sin);
    ctx.lineTo(cx + outerR * cos, cy + outerR * sin);
    ctx.strokeStyle = i % 5 === 0 ? 'hsla(160, 10%, 50%, 0.6)' : 'hsla(160, 10%, 30%, 0.3)';
    ctx.lineWidth = i % 5 === 0 ? 1.5 : 0.5;
    ctx.stroke();
    if (i % 5 === 0) {
      ctx.fillStyle = 'hsla(160, 10%, 55%, 0.7)';
      ctx.font = '7px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText((frac).toFixed(1), cx + (outerR + 10) * cos, cy + (outerR + 10) * sin + 3);
    }
  }
  ctx.textAlign = 'start';

  const segments = [
    { from: 0, to: 0.3, color: 'hsla(0, 65%, 50%, 0.35)' },
    { from: 0.3, to: 0.7, color: 'hsla(45, 80%, 50%, 0.35)' },
    { from: 0.7, to: 1.0, color: 'hsla(142, 71%, 45%, 0.35)' },
  ];
  segments.forEach(seg => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle + seg.from * totalArc, startAngle + seg.to * totalArc);
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = 6;
    ctx.stroke();
  });

  const needleAngle = startAngle + clamped * totalArc;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + (radius - 12) * Math.cos(needleAngle), cy + (radius - 12) * Math.sin(needleAngle));
  ctx.strokeStyle = 'hsla(0, 0%, 90%, 0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'hsla(0, 0%, 80%, 0.8)';
  ctx.fill();

  const scoreColor = clamped > 0.7 ? 'hsla(142, 71%, 55%, 0.9)' : clamped > 0.3 ? 'hsla(45, 80%, 55%, 0.9)' : 'hsla(0, 65%, 55%, 0.9)';
  ctx.fillStyle = scoreColor;
  ctx.font = 'bold 16px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(clamped.toFixed(3), cx, cy + radius * 0.55);
  ctx.textAlign = 'start';

  ctx.fillStyle = 'hsla(0, 65%, 55%, 0.6)';
  ctx.font = '6px JetBrains Mono, monospace';
  ctx.fillText('DECEPTIVE', 12, h * 0.65);
  ctx.fillStyle = 'hsla(142, 71%, 55%, 0.6)';
  ctx.fillText('GENUINE', w - 52, h * 0.65);

  const barY = h * 0.78, barW = w * 0.25;
  const channels = [
    { label: 'CKT', value: 0.45 + Math.sin(t * 0.6) * 0.05, color: 'hsla(142, 71%, 50%, 0.6)' },
    { label: 'BHV', value: 0.62 + Math.sin(t * 0.8) * 0.04, color: 'hsla(175, 60%, 48%, 0.6)' },
    { label: 'STR', value: 0.55 + Math.sin(t * 0.5) * 0.06, color: 'hsla(280, 60%, 60%, 0.6)' },
  ];
  channels.forEach((ch, i) => {
    const bx = 20 + i * (barW + 12);
    ctx.fillStyle = 'hsla(160, 10%, 50%, 0.7)';
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillText(ch.label, bx, barY - 3);
    ctx.fillStyle = 'hsla(160, 10%, 11%, 0.5)';
    ctx.fillRect(bx, barY, barW, 5);
    ctx.fillStyle = ch.color;
    ctx.fillRect(bx, barY, barW * ch.value, 5);
  });

  const verdict = clamped > 0.7 ? 'GENUINE' : clamped > 0.3 ? 'SUSPICIOUS' : 'DECEPTIVE';
  ctx.fillStyle = scoreColor;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText(`H_strat = ${clamped.toFixed(3)}  VERDICT: ${verdict}`, 7, h - 5);
};

/**
 * Ordered array of all draw functions, matching the ENGINE_METADATA order.
 */
export const ENGINE_DRAW_FUNCTIONS: DrawFn[] = [
  drawLissajous,
  drawTremor,
  drawKeystroke,
  drawSpectral,
  drawAuditor,
  drawEEGShield,
  drawNeuroAudit,
  drawNeuronpedia,
  drawInspect,
  drawTransformerLens,
  drawStax,
  drawDocent,
  drawBloom,
  drawSparseCircuit,
  drawStrategicFidelity,
];
