/**
 * Browser fingerprint collection utilities.
 *
 * Extracted from BrowserFingerprint.tsx to keep the component focused on
 * rendering while this module handles the data-collection logic.
 */

export interface FingerprintVector {
  label: string;
  category: string;
  rawValue: string;
  entropyBits: number;
  obfuscated: boolean;
}

export interface FingerprintResult {
  hash: string;
  totalBits: number;
  vectors: FingerprintVector[];
  canvasHash: string;
  webglRenderer: string;
  audioHash: string;
  scanDuration: number;
}

// ── Deterministic hash (djb2 variant) ──────────────────────────────────────

export function strHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(16).padStart(8, '0').toUpperCase();
}

// ── Canvas fingerprint ─────────────────────────────────────────────────────

export function getCanvasFingerprint(): string {
  try {
    const c = document.createElement('canvas');
    c.width = 280; c.height = 60;
    const ctx = c.getContext('2d');
    if (!ctx) return 'N/A';
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Cwm fjordbank glyphs vext quiz 🔬', 2, 15);
    ctx.fillStyle = 'rgba(102,204,0,0.7)';
    ctx.fillText('Cwm fjordbank glyphs vext quiz 🔬', 4, 17);
    return strHash(c.toDataURL());
  } catch {
    return 'N/A';
  }
}

// ── WebGL renderer ─────────────────────────────────────────────────────────

export function getWebGLRenderer(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return 'unavailable';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
      const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) as string;
      return `${vendor} // ${renderer}`.slice(0, 60);
    }
    return (gl.getParameter(gl.RENDERER) as string).slice(0, 40) || 'generic';
  } catch {
    return 'unavailable';
  }
}

// ── Audio context hash ─────────────────────────────────────────────────────

export function getAudioHash(): string {
  try {
    const ACtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!ACtx) return 'N/A';
    const ctx = new ACtx({ sampleRate: 44100 });
    const osc = ctx.createOscillator();
    const analyser = ctx.createAnalyser();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.type = 'triangle';
    osc.frequency.value = 10000;
    osc.connect(analyser);
    analyser.connect(gain);
    gain.connect(ctx.destination);
    osc.start(0);
    const buf = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(buf);
    osc.stop();
    ctx.close();
    const sum = buf.slice(0, 30).reduce((a, v) => a + Math.abs(v), 0);
    return strHash(sum.toString());
  } catch {
    return 'N/A';
  }
}

// ── Collect all vectors ────────────────────────────────────────────────────

export function collectVectors(obfuscate: boolean): FingerprintVector[] {
  const nav = navigator;
  const scr = screen;

  const raw = [
    {
      label: 'User Agent',
      category: 'browser',
      value: nav.userAgent.slice(0, 60) + (nav.userAgent.length > 60 ? '…' : ''),
      bits: 12.4,
    },
    {
      label: 'Platform',
      category: 'system',
      value: nav.platform || 'unknown',
      bits: 3.8,
    },
    {
      label: 'Language Pack',
      category: 'locale',
      value: `${nav.language} / [${Array.from(nav.languages || [nav.language]).join(', ')}]`,
      bits: 4.2,
    },
    {
      label: 'Hardware Concurrency',
      category: 'system',
      value: `${nav.hardwareConcurrency ?? 'unknown'} logical cores`,
      bits: 2.1,
    },
    {
      label: 'Screen Resolution',
      category: 'display',
      value: `${scr.width}×${scr.height} @ ${scr.colorDepth}bit`,
      bits: 5.7,
    },
    {
      label: 'Device Pixel Ratio',
      category: 'display',
      value: `${window.devicePixelRatio.toFixed(2)}x`,
      bits: 1.8,
    },
    {
      label: 'Timezone',
      category: 'locale',
      value: Intl.DateTimeFormat().resolvedOptions().timeZone,
      bits: 3.5,
    },
    {
      label: 'Plugin Count',
      category: 'browser',
      value: `${nav.plugins?.length ?? 0} plugins detected`,
      bits: 2.9,
    },
    {
      label: 'Touch Points',
      category: 'input',
      value: `${nav.maxTouchPoints} max touch points`,
      bits: 1.4,
    },
    {
      label: 'Cookie Enabled',
      category: 'browser',
      value: `${nav.cookieEnabled}`,
      bits: 0.2,
    },
    {
      label: 'Do Not Track',
      category: 'browser',
      value: nav.doNotTrack || 'null',
      bits: 0.5,
    },
    {
      label: 'Connection Type',
      category: 'network',
      value: ((nav as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType) || 'unknown',
      bits: 1.1,
    },
  ];

  const obfValues: Record<string, string> = {
    'User Agent': 'Mozilla/5.0 (Canary-Obf/6.0) AppleWebKit/∞ (KHTML, like Gecko) ARTIFEX/1.0',
    'Platform': `synthetic_${Math.floor(Math.random() * 4) === 0 ? 'Win32' : Math.floor(Math.random() * 3) === 0 ? 'Linux' : 'MacIntel'}`,
    'Language Pack': 'en-US / [en-US, fr-FR, de-DE]',
    'Hardware Concurrency': `${[2, 4, 8, 16][Math.floor(Math.random() * 4)]} logical cores`,
    'Screen Resolution': `${[1280, 1366, 1440, 1920][Math.floor(Math.random() * 4)]}×${[720, 768, 900, 1080][Math.floor(Math.random() * 4)]} @ 24bit`,
    'Device Pixel Ratio': `${[1.0, 1.25, 1.5, 2.0][Math.floor(Math.random() * 4)].toFixed(2)}x`,
    'Timezone': ['America/Chicago', 'Europe/London', 'Asia/Tokyo', 'UTC'][Math.floor(Math.random() * 4)],
    'Plugin Count': `${Math.floor(Math.random() * 5)} plugins detected`,
    'Touch Points': `${[0, 2, 5, 10][Math.floor(Math.random() * 4)]} max touch points`,
    'Cookie Enabled': 'true',
    'Do Not Track': '1',
    'Connection Type': ['4g', '3g', 'wifi', 'broadband'][Math.floor(Math.random() * 4)],
  };

  return raw.map(v => ({
    label: v.label,
    category: v.category,
    rawValue: obfuscate ? (obfValues[v.label] ?? v.value) : v.value,
    entropyBits: obfuscate ? Math.random() * 0.4 : v.bits,
    obfuscated: obfuscate,
  }));
}

export const CATEGORY_COLOR: Record<string, string> = {
  browser: 'hsla(280, 60%, 60%, 0.9)',
  system: 'hsla(142, 71%, 45%, 0.9)',
  locale: 'hsla(175, 60%, 45%, 0.9)',
  display: 'hsla(38, 95%, 55%, 0.9)',
  input: 'hsla(330, 60%, 55%, 0.9)',
  network: 'hsla(200, 70%, 50%, 0.9)',
};
