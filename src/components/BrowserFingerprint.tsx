import { useState, useEffect, useCallback } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '@/data/engineRegistry';
import { DataMode } from '@/types/engine';
import { 
  FingerprintResult, 
  collectVectors, 
  getCanvasFingerprint, 
  getWebGLRenderer, 
  getAudioHash, 
  strHash,
  CATEGORY_COLOR 
} from '@/lib/fingerprint';

const EntropyMeter = ({ bits, max = 14, obfuscated }: { bits: number; max?: number; obfuscated: boolean }) => {
  const pct = Math.min(100, (bits / max) * 100);
  const color = obfuscated ? 'hsla(142, 71%, 45%, 0.6)' : 'hsla(0, 75%, 55%, 0.8)';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[8px] font-mono" style={{ color }}>
        {obfuscated ? '~0.0' : bits.toFixed(1)}b
      </span>
    </div>
  );
};

export default function BrowserFingerprint() {
  const engine = engineRegistry.find(e => e.id === 'browser-fingerprint')!;
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<FingerprintResult | null>(null);
  const [obfResult, setObfResult] = useState<FingerprintResult | null>(null);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [dataMode, setDataMode] = useState<DataMode>('live');

  const runScan = useCallback(async (obf: boolean) => {
    setScanning(true);
    const t0 = performance.now();
    await new Promise(r => setTimeout(r, 1200));

    const canvasHash = obf ? strHash('ARTIFEX_SYNTHETIC_' + Math.random().toString(36)) : getCanvasFingerprint();
    const webglRenderer = obf ? 'Synthetic GPU (ANGLE) // Virtual-Renderer/1.0' : getWebGLRenderer();
    const audioHash = obf ? strHash('NOISE_' + Math.random().toString(36)) : getAudioHash();
    const vectors = collectVectors(obf);

    const totalBits = obf
      ? vectors.reduce((a, v) => a + v.entropyBits, 0) + 1.6
      : vectors.reduce((a, v) => a + v.entropyBits, 0) + 16.1;

    const hashInput = vectors.map(v => v.rawValue).join('|') + canvasHash + audioHash;
    const hash = obf ? 'OBF-' + Math.random().toString(16).slice(2, 8).toUpperCase() : strHash(hashInput);

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
  }, []);

  useEffect(() => {
    if (!result) runScan(false);
  }, [result, runScan]);

  useEffect(() => {
    if (isShieldActive && !obfResult) runScan(true);
  }, [isShieldActive, obfResult, runScan]);

  const activeResult = isShieldActive ? obfResult : result;
  const maxBits = result ? Math.max(...result.vectors.map(v => v.entropyBits)) : 14;

  // Panels
  const inputPanel = (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest block">Collection Rate</label>
        <div className="text-xs font-mono text-primary">64.2 vectors / sec</div>
      </div>
      <div className="space-y-4">
        {['Canvas', 'WebGL', 'Audio', 'Navigator', 'Screen'].map(v => (
          <div key={v} className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] font-mono text-white/60 uppercase">{v}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${scanning ? 'bg-primary animate-pulse' : 'bg-primary/20'}`} />
          </div>
        ))}
      </div>
      <button 
        onClick={() => runScan(isShieldActive)} 
        disabled={scanning}
        className="w-full py-2 border border-white/10 text-[9px] font-mono uppercase tracking-widest hover:bg-white/5 transition-colors disabled:opacity-30"
      >
        {scanning ? 'Capturing...' : 'Re-collect'}
      </button>
    </div>
  );

  const VectorList = ({ r, obf }: { r: FingerprintResult | null, obf: boolean }) => (
    <div className="space-y-3 overflow-y-auto h-full pr-2 font-mono scrollbar-none">
      {!r && <div className="text-center py-20 text-[10px] text-white/20 animate-pulse">SYSTEM COLD...</div>}
      {r?.vectors.map(v => (
        <div key={v.label} className="group">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-white/40 group-hover:text-white/70 transition-colors uppercase truncate max-w-[120px]">{v.label}</span>
            <EntropyMeter bits={v.entropyBits} max={maxBits} obfuscated={obf} />
          </div>
          <div className="text-[9px] text-white/20 truncate group-hover:text-white/40 transition-colors">
            {v.rawValue}
          </div>
        </div>
      ))}
      {r && (
        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-primary/60 uppercase">Canvas Hash</span>
            <span className="text-primary/80 truncate text-[9px]">{r.canvasHash.slice(0, 16)}...</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-primary/60 uppercase">WebGL Rend</span>
            <span className="text-primary/80 truncate text-[9px]">{r.webglRenderer.slice(0, 12)}...</span>
          </div>
        </div>
      )}
    </div>
  );

  const metricPanel = (
    <div className="flex flex-col justify-between h-full py-2">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono uppercase">
            <span className="text-white/40">Identity Stability</span>
            <span className="text-white">{isShieldActive ? '2.1%' : '98.9%'}</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${isShieldActive ? 'bg-primary w-[2%]' : 'bg-red-500 w-[99%]'}`} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono uppercase">
            <span className="text-white/40">Unique Match Rate</span>
            <span className="text-white">{isShieldActive ? '1 : 2.4B' : '1 : 34K'}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-primary/5 border border-primary/20 text-center">
        <div className="text-2xl font-mono text-primary font-black">
          {activeResult?.totalBits.toFixed(1)}b
        </div>
        <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest mt-1">Extraction Entropy</div>
      </div>
    </div>
  );

  const verdictPanel = (
    <div className="space-y-3">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Unified Result</div>
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${isShieldActive ? 'bg-primary' : 'bg-red-500 animate-pulse'}`} />
        <span className="text-sm font-display uppercase tracking-wider">{isShieldActive ? 'Virtual Persona' : 'Identity Leaked'}</span>
      </div>
      <div className="text-[9px] font-mono text-white/30 uppercase leading-relaxed">
        {isShieldActive 
          ? 'Fingerprint successfully collision-mapped. You are now part of a large anonymity set.' 
          : 'High entropy signature detected. Cross-session correlation is highly likely.'}
      </div>
    </div>
  );

  return (
    <ExhibitLayout
      engine={engine}
      dataMode={dataMode}
      onDataModeChange={setDataMode}
      inputPanel={inputPanel}
      baselinePanel={<VectorList r={result} obf={false} />}
      activePanel={<VectorList r={obfResult} obf={true} />}
      metricPanel={metricPanel}
      verdictPanel={verdictPanel}
      onPrimaryAction={() => setIsShieldActive(!isShieldActive)}
      isEngineActive={isShieldActive}
      supplementaryPanel={
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] leading-loose">
          [REF: ECKERSLEY (2010)] <br />
          [VECTORS: CANVAS // WEBGL // AUDIO // NAVIGATOR // SCREEN // LOCALE]
        </p>
      }
    />
  );
}
