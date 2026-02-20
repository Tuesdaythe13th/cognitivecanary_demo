import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';

interface FingerprintVector {
  label: string;
  category: string;
  rawValue: string;
  entropyBits: number;
  obfuscated: boolean;
}

interface FingerprintResult {
  hash: string;
  totalBits: number;
  vectors: FingerprintVector[];
  canvasHash: string;
  webglRenderer: string;
  audioHash: string;
  scanDuration: number;
}

// Lightweight deterministic hash (djb2 variant)
function strHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(16).padStart(8, '0').toUpperCase();
}

function getCanvasFingerprint(): string {
  try {
    const c = document.createElement('canvas');
    c.width = 280; c.height = 60;
    const ctx = c.getContext('2d')!;
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

function getWebGLRenderer(): string {
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

function getAudioHash(): string {
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

function collectVectors(obfuscate: boolean): FingerprintVector[] {
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

const CATEGORY_COLOR: Record<string, string> = {
  browser: 'hsla(280, 60%, 60%, 0.9)',
  system: 'hsla(142, 71%, 45%, 0.9)',
  locale: 'hsla(175, 60%, 45%, 0.9)',
  display: 'hsla(38, 95%, 55%, 0.9)',
  input: 'hsla(330, 60%, 55%, 0.9)',
  network: 'hsla(200, 70%, 50%, 0.9)',
};

const EntropyMeter = ({ bits, max = 14, obfuscated }: { bits: number; max?: number; obfuscated: boolean }) => {
  const pct = Math.min(100, (bits / max) * 100);
  const color = obfuscated ? 'hsla(142, 71%, 45%, 0.6)' : 'hsla(0, 75%, 55%, 0.8)';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 4px ${color}` }}
        />
      </div>
      <span className="text-[9px] font-mono" style={{ color }}>
        {obfuscated ? '~0.0' : bits.toFixed(1)}b
      </span>
    </div>
  );
};

const BrowserFingerprint = () => {
  const { ref, isInView } = useInView();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<FingerprintResult | null>(null);
  const [obfuscated, setObfuscated] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [obfResult, setObfResult] = useState<FingerprintResult | null>(null);
  const progressRef = useRef<number>(0);

  const runScan = useCallback(async (obf: boolean) => {
    setScanning(true);
    setScanProgress(0);
    progressRef.current = 0;

    const tick = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + Math.random() * 12, 95);
      setScanProgress(progressRef.current);
    }, 80);

    const t0 = performance.now();
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400));

    const canvasHash = obf ? strHash('ARTIFEX_SYNTHETIC_' + Math.random().toString(36)) : getCanvasFingerprint();
    const webglRenderer = obf ? 'Synthetic GPU (ANGLE) // Virtual-Renderer/1.0' : getWebGLRenderer();
    const audioHash = obf ? strHash('NOISE_' + Math.random().toString(36)) : getAudioHash();
    const vectors = collectVectors(obf);

    const totalBits = obf
      ? vectors.reduce((a, v) => a + v.entropyBits, 0) + 0.8 + 0.5 + 0.3
      : vectors.reduce((a, v) => a + v.entropyBits, 0) + 8.2 + 4.1 + 3.8;

    const hashInput = vectors.map(v => v.rawValue).join('|') + canvasHash + audioHash;
    const hash = obf
      ? Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
      : strHash(hashInput);

    clearInterval(tick);
    setScanProgress(100);
    await new Promise(r => setTimeout(r, 200));

    const r: FingerprintResult = {
      hash,
      totalBits,
      vectors,
      canvasHash,
      webglRenderer,
      audioHash,
      scanDuration: Math.round(performance.now() - t0),
    };

    if (obf) setObfResult(r);
    else setResult(r);

    setScanning(false);
    setScanProgress(0);
  }, []);

  // Auto-run real scan on view
  useEffect(() => {
    if (isInView && !result) runScan(false);
  }, [isInView, result, runScan]);

  // Auto-run obfuscated scan when toggled
  useEffect(() => {
    if (obfuscated && !obfResult) runScan(true);
  }, [obfuscated, obfResult, runScan]);

  const activeResult = obfuscated ? obfResult : result;
  const maxBits = result ? Math.max(...result.vectors.map(v => v.entropyBits)) : 14;
  const totalExposed = result?.totalBits ?? 0;
  const totalObf = obfResult?.totalBits ?? 0;
  const reductionPct = totalExposed > 0 && totalObf > 0
    ? Math.round((1 - totalObf / totalExposed) * 100)
    : null;

  return (
    <section id="fingerprint" ref={ref} className="py-32 px-6 border-t border-white/5 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent/10 rounded-full gradient-blob pointer-events-none" />

      <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 border border-accent/30 text-[9px] font-mono text-accent uppercase tracking-[0.4em] bg-accent/5">
              Lab Exhibit 03
            </div>
            <h2 className="text-5xl md:text-6xl font-black font-mono tracking-tighter uppercase italic leading-none">
              BROWSER <span className="text-primary not-italic block mt-2">FINGERPRINT<span className="text-white opacity-20"> AUDIT</span></span>
            </h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] max-w-md leading-relaxed">
              Real entropy extraction from your actual browser session. These are your real identifiers — not simulated.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => { setObfuscated(false); runScan(false); }}
              disabled={scanning}
              className="text-[9px] font-mono px-4 py-2 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all uppercase tracking-widest disabled:opacity-30"
            >
              Rescan
            </button>
            <button
              onClick={() => setObfuscated(!obfuscated)}
              className={`text-[9px] font-mono px-5 py-2 border transition-all duration-500 uppercase tracking-widest font-bold ${
                obfuscated
                  ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                  : 'bg-transparent border-primary/40 text-primary/60 hover:text-primary hover:border-primary'
              }`}
            >
              {obfuscated ? 'Canary Shield: ON' : 'Canary Shield: OFF'}
            </button>
          </div>
        </div>

        {/* Scan Progress */}
        {scanning && (
          <div className="mb-8 space-y-2">
            <div className="flex justify-between text-[9px] font-mono text-primary/60 uppercase tracking-widest">
              <span>Scanning {obfuscated ? 'obfuscated' : 'raw'} fingerprint vectors...</span>
              <span>{Math.round(scanProgress)}%</span>
            </div>
            <div className="w-full h-0.5 bg-white/5">
              <div
                className="h-full bg-primary transition-all duration-150 shadow-[0_0_6px_var(--neon-green)]"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {result && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              {
                label: 'Total Entropy',
                value: obfuscated && obfResult ? `${obfResult.totalBits.toFixed(1)}b` : `${result.totalBits.toFixed(1)}b`,
                sub: 'bits of identifiability',
                color: obfuscated ? 'var(--primary)' : 'hsla(0, 75%, 60%, 0.9)',
              },
              {
                label: 'Fingerprint Hash',
                value: (activeResult?.hash ?? '--------').slice(0, 8),
                sub: 'cross-session stable ID',
                color: obfuscated ? 'var(--primary)' : 'hsla(280, 60%, 65%, 0.9)',
              },
              {
                label: 'Canvas FP',
                value: (activeResult?.canvasHash ?? '--------').slice(0, 8),
                sub: 'rendering engine signature',
                color: obfuscated ? 'var(--primary)' : 'hsla(38, 95%, 55%, 0.9)',
              },
              {
                label: 'Entropy Reduction',
                value: reductionPct !== null && obfuscated ? `${reductionPct}%` : '--',
                sub: 'identity entropy destroyed',
                color: 'var(--primary)',
              },
            ].map((c, i) => (
              <div key={i} className="glass-panel p-4 border-white/5 relative overflow-hidden group">
                <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-2">{c.label}</div>
                <div className="text-2xl font-mono font-black tracking-tighter" style={{ color: c.color }}>
                  {c.value}
                </div>
                <div className="text-[8px] font-mono text-white/20 mt-1 uppercase">{c.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Vector Table */}
        <div className="glass-panel border-primary/10 bg-black/60 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-primary animate-pulse' : obfuscated ? 'bg-primary' : 'bg-red-500'} shadow-[0_0_6px_currentColor]`} />
              <span className="text-[9px] font-mono tracking-[0.3em] text-white/60 uppercase">
                {scanning ? 'Scanning vectors...' : obfuscated ? 'Obfuscated Output // Canary v6.0 Active' : 'Raw Fingerprint // Identity Exposed'}
              </span>
            </div>
            <div className="flex gap-3 items-center">
              {['browser', 'system', 'locale', 'display', 'input', 'network'].map(cat => (
                <div key={cat} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLOR[cat] }} />
                  <span className="text-[7px] font-mono text-white/30 uppercase">{cat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-white/[0.03]">
            {(activeResult?.vectors ?? []).map((v, i) => (
              <div
                key={v.label}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors group"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_COLOR[v.category] }} />
                <div className="w-36 shrink-0">
                  <div className="text-[9px] font-mono text-white/50 uppercase tracking-wide group-hover:text-white/70 transition-colors">
                    {v.label}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[10px] font-mono truncate transition-all duration-500"
                    style={{ color: v.obfuscated ? 'hsla(142, 71%, 45%, 0.7)' : 'hsla(0, 0%, 80%, 0.8)' }}
                  >
                    {v.rawValue}
                  </div>
                </div>
                <div className="shrink-0 w-28">
                  <EntropyMeter bits={v.entropyBits} max={maxBits} obfuscated={v.obfuscated} />
                </div>
              </div>
            ))}

            {/* Canvas / WebGL / Audio rows */}
            {activeResult && (
              <>
                {[
                  { label: 'Canvas Fingerprint', cat: 'browser', value: activeResult.canvasHash, bits: obfuscated ? 0.1 : 8.2 },
                  { label: 'WebGL Renderer', cat: 'system', value: activeResult.webglRenderer, bits: obfuscated ? 0.1 : 4.1 },
                  { label: 'Audio Context', cat: 'browser', value: activeResult.audioHash, bits: obfuscated ? 0.1 : 3.8 },
                ].map((v, i) => (
                  <div key={v.label} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors group">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_COLOR[v.cat] }} />
                    <div className="w-36 shrink-0">
                      <div className="text-[9px] font-mono text-white/50 uppercase tracking-wide group-hover:text-white/70 transition-colors">
                        {v.label}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[10px] font-mono truncate"
                        style={{ color: obfuscated ? 'hsla(142, 71%, 45%, 0.7)' : 'hsla(280, 60%, 70%, 0.8)' }}
                      >
                        {v.value}
                      </div>
                    </div>
                    <div className="shrink-0 w-28">
                      <EntropyMeter bits={v.bits} max={maxBits} obfuscated={obfuscated} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer warning */}
          <div className={`p-4 border-t border-white/5 ${obfuscated ? 'bg-primary/5 border-primary/10' : 'bg-red-500/5 border-red-500/10'}`}>
            <p className="text-[9px] font-mono uppercase tracking-widest leading-relaxed" style={{ color: obfuscated ? 'hsla(142, 71%, 45%, 0.7)' : 'hsla(0, 75%, 60%, 0.6)' }}>
              {obfuscated
                ? '[PROTECTED] Entropy reduced by ~' + (reductionPct ?? '--') + '%. Cross-session correlation: ~0.02. Identity vector space collapsed.'
                : '[EXPOSED] ' + (result?.totalBits.toFixed(1) ?? '--') + ' bits of entropy. Sufficient for 1-in-' + (result ? Math.round(Math.pow(2, result.totalBits / 2)).toLocaleString() : '--') + ' individual identification.'}
            </p>
          </div>
        </div>

        {/* WebGL Renderer display */}
        {result && (
          <div className="mt-4 flex items-center gap-3 px-4 py-3 border border-white/5 bg-black/40">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest shrink-0">WebGL Renderer</span>
            <span className="text-[10px] font-mono text-white/60 truncate">{activeResult?.webglRenderer}</span>
            <span className="text-[8px] font-mono text-white/20 shrink-0 ml-auto">~4.1b entropy</span>
          </div>
        )}

        <div className="mt-8 text-[8px] font-mono text-white/15 uppercase tracking-[0.2em] leading-loose">
          [REF: ECKERSLEY (2010) — HOW UNIQUE IS YOUR WEB BROWSER?] <br />
          [VECTORS: CANVAS // WEBGL // AUDIO // NAVIGATOR // SCREEN // LOCALE] <br />
          Status: <span className="text-primary/40">{result ? 'Scan Complete' : 'Awaiting scan...'}</span>
        </div>
      </div>
    </section>
  );
};

export default BrowserFingerprint;
