import React, { useState, useEffect, useRef } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { BrainCircuit, ShieldAlert, ShieldCheck, Eye, EyeOff } from 'lucide-react';

type WaveformMode = 'P300' | 'ERN' | 'N170';

const WAVEFORM_CONFIGS: Record<WaveformMode, { label: string; desc: string; identityLeak: number; peak: number }> = {
  P300: {
    label: 'P300 Event-Related Potential',
    desc: 'Cognitive task response — high-fidelity identity signal (300ms post-stimulus)',
    identityLeak: 0.91,
    peak: 0.78,
  },
  ERN: {
    label: 'Error-Related Negativity',
    desc: 'Error-correction response — behavioral signature with user-specific amplitude',
    identityLeak: 0.74,
    peak: -0.52,
  },
  N170: {
    label: 'N170 Face Recognition',
    desc: 'Facial recognition latency — uniquely tuned per individual, strong identity marker',
    identityLeak: 0.83,
    peak: -0.65,
  },
};

function generateERP(
  mode: WaveformMode,
  time: number,
  noiseAmp: number,
  filtered: boolean
): number[] {
  const cfg = WAVEFORM_CONFIGS[mode];
  const samples = 100;
  const result: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * 600; // 0–600ms
    let v = 0;

    // Baseline noise (EMG + thermal)
    const baseNoise = (Math.sin(time * 0.03 + i * 0.7) * 0.05 + Math.random() * 0.06) * (filtered ? 0.3 : 1.0);

    // Component waveforms
    if (mode === 'P300') {
      if (t > 250 && t < 450) {
        v = cfg.peak * Math.exp(-((t - 340) ** 2) / 2800);
        if (filtered) v *= 0.08; // Adversarial filter removes P300
      }
    } else if (mode === 'ERN') {
      if (t > 50 && t < 200) {
        v = cfg.peak * Math.exp(-((t - 100) ** 2) / 1200);
        if (filtered) v *= 0.12;
      }
    } else if (mode === 'N170') {
      if (t > 130 && t < 230) {
        v = cfg.peak * Math.exp(-((t - 170) ** 2) / 900);
        if (filtered) v *= 0.1;
      }
    }

    // Identity-linked jitter (per-user micro-timing)
    const identityJitter = filtered ? 0 : Math.sin(t * 0.08 + 2.3) * 0.04;

    result.push(v + baseNoise + identityJitter + (noiseAmp * (Math.random() - 0.5)));
  }
  return result;
}

const WaveformCanvas = ({
  mode,
  filtered,
  isActive,
  label,
}: {
  mode: WaveformMode;
  filtered: boolean;
  isActive: boolean;
  label: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      timeRef.current += 1;
      const waveformSamples = generateERP(mode, timeRef.current, filtered ? 0.04 : 0.02, filtered);
      const mid = H / 2;
      const scale = (H / 2) * 0.85;

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 3; i++) {
        const y = (i / 3) * H;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Zero line
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();
      ctx.setLineDash([]);

      // Waveform
      ctx.beginPath();
      waveformSamples.forEach((v, i) => {
        const x = (i / (waveformSamples.length - 1)) * W;
        const y = mid - v * scale;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      const color = filtered ? '#BFFF00' : '#ff4466';
      ctx.strokeStyle = color;
      ctx.lineWidth = isActive ? 2 : 1.5;
      if (isActive && !filtered) {
        ctx.shadowColor = '#ff4466';
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Peak annotation (only on baseline/unfiltered)
      if (!filtered) {
        const cfg = WAVEFORM_CONFIGS[mode];
        const peakIdx = mode === 'P300' ? 57 : mode === 'ERN' ? 17 : 28;
        const px = (peakIdx / (waveformSamples.length - 1)) * W;
        const py = mid - waveformSamples[peakIdx] * scale;
        ctx.strokeStyle = '#ff4466aa';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, H - 16); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ff4466';
        ctx.font = '8px "Geist Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(mode, px, H - 4);
      }

      // Time axis labels
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '7px "Geist Mono", monospace';
      ctx.textAlign = 'left';
      ['0ms', '200ms', '400ms', '600ms'].forEach((t, i) => {
        ctx.fillText(t, (i / 3) * W, H - 4);
      });

      // Status
      ctx.fillStyle = filtered ? '#BFFF00' : 'rgba(255,68,102,0.8)';
      ctx.font = '8px "Geist Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, 6, 14);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [mode, filtered, isActive, label]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default function EEGShield() {
  const engine = engineRegistry.find(e => e.id === 'eeg-shield')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<WaveformMode>('P300');

  const cfg = WAVEFORM_CONFIGS[selectedMode];
  const utilityRaw = isEngineActive ? 0.92 : 0.92;
  const utilityFiltered = isEngineActive ? 0.81 : null;
  const leakRaw = cfg.identityLeak;
  const leakFiltered = isEngineActive ? 0.06 + Math.random() * 0.04 : null;

  const displayLeak = isEngineActive ? 0.07 : leakRaw;
  const displayUtility = isEngineActive ? 0.81 : utilityRaw;

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2 space-y-4">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">
        Event-Related Potential Type
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {(Object.keys(WAVEFORM_CONFIGS) as WaveformMode[]).map(wm => {
          const c = WAVEFORM_CONFIGS[wm];
          return (
            <button
              key={wm}
              onClick={() => setSelectedMode(wm)}
              className={`p-3 text-left border transition-all ${selectedMode === wm ? 'border-[#b44aff]/60 bg-[#b44aff]/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-display uppercase tracking-wider text-[#b44aff]">{wm}</span>
                <span className="text-[9px] font-mono text-red-400">{Math.round(c.identityLeak * 100)}% ID leak</span>
              </div>
              <div className="text-[9px] font-mono text-white/40 mt-1 leading-relaxed">{c.desc}</div>
            </button>
          );
        })}
      </div>
      <div className="border border-white/10 p-3 space-y-2">
        <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Signal Utility</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10">
            <div className="h-full bg-[#BFFF00]" style={{ width: `${displayUtility * 100}%` }} />
          </div>
          <span className="text-[10px] font-mono text-[#BFFF00]">{Math.round(displayUtility * 100)}%</span>
        </div>
        <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Identity Extractability</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10">
            <div className="h-full bg-red-500 transition-all duration-700" style={{ width: `${displayLeak * 100}%` }} />
          </div>
          <span className="text-[10px] font-mono text-red-400">{Math.round(displayLeak * 100)}%</span>
        </div>
      </div>
    </div>
  );

  const baselinePanel = (
    <WaveformCanvas
      mode={selectedMode}
      filtered={false}
      isActive={false}
      label={`RAW ${selectedMode} — ID SIGNATURE INTACT`}
    />
  );

  const activePanel = (
    <>
      <WaveformCanvas
        mode={selectedMode}
        filtered={isEngineActive}
        isActive={isEngineActive}
        label={isEngineActive ? `SHIELD ACTIVE — IDENTITY SCRUBBED` : 'AWAITING SHIELD ACTIVATION'}
      />
      {isEngineActive && (
        <div className="absolute top-4 right-4 z-10 text-[10px] font-mono text-[#BFFF00] border border-[#BFFF00]/30 px-2 py-1 bg-[#BFFF00]/10 flex items-center gap-2">
          <EyeOff className="w-3 h-3" />
          IDENTITY LAYER REMOVED
        </div>
      )}
    </>
  );

  const metricPanel = (
    <div className="flex flex-col h-full justify-center gap-4">
      <div>
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className={`text-5xl font-display tabular-nums ${isEngineActive ? 'text-[#BFFF00]' : 'text-red-500'}`}>
              {Math.round(displayLeak * 100)}%
            </div>
            <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Identity Extractability</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-display text-[#BFFF00]">{Math.round(displayUtility * 100)}%</div>
            <div className="text-[9px] font-mono text-white/40 uppercase">Utility Retained</div>
          </div>
        </div>
        <div className="w-full h-2 bg-white/10 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${isEngineActive ? 'bg-[#BFFF00]' : 'bg-red-500'}`}
            style={{ width: `${Math.round(displayLeak * 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[9px] font-mono text-white/30">
          <span>Safe ({'<'}10%)</span>
          <span>Exposed</span>
        </div>
      </div>
      <div className="border border-white/10 p-3 space-y-2">
        <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Filter Stages Active</div>
        {['Amplitude Normalization', 'Identity Variance Removal', 'Component Suppression', 'Temporal Jitter Scrub'].map((stage, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isEngineActive ? 'bg-[#BFFF00]' : 'bg-white/20'}`} />
            <span className="text-[9px] font-mono text-white/50">{stage}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const verdictPanel = (
    <div className="flex items-start gap-4">
      {isEngineActive ? (
        <ShieldCheck className="w-10 h-10 text-[#BFFF00] shrink-0" />
      ) : (
        <Eye className="w-10 h-10 text-red-500 shrink-0" />
      )}
      <div>
        <h4 className="text-xl font-display uppercase tracking-widest mb-2">
          {isEngineActive ? 'Neural Identity Scrubbed' : 'Identity Signal Exposed'}
        </h4>
        <p className="text-sm font-mono text-white/60 leading-relaxed">
          {isEngineActive
            ? `${selectedMode} component amplitude reduced by 92%. BCI control intent preserved at 81% utility. Adversarial classifiers can no longer extract a reliable identity signature.`
            : `The raw ${selectedMode} waveform carries a ${Math.round(leakRaw * 100)}% identity extractability score. This is sufficient for persistent cross-session user re-identification.`}
        </p>
      </div>
    </div>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <BrainCircuit className="w-4 h-4" />
        The BCI Identity Problem
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        Event-Related Potentials (ERPs) are EEG signals locked to specific cognitive events. The P300 (triggered by surprising stimuli), ERN (error detection), and N170 (face recognition) components carry both intent signals used by BCI systems and highly stable identity signatures. Research demonstrates 91% user re-identification accuracy from a single 30-second P300 session. EEG Shield applies adversarial filtering — selectively attenuating the identity-linked amplitude variance — while preserving the cognitive intent vectors the BCI requires for control.
      </p>
    </div>
  );

  return (
    <ExhibitLayout
      engine={engine}
      dataMode={dataMode}
      onDataModeChange={setDataMode}
      inputPanel={inputPanel}
      baselinePanel={baselinePanel}
      activePanel={activePanel}
      metricPanel={metricPanel}
      verdictPanel={verdictPanel}
      supplementaryPanel={supplementaryPanel}
      onPrimaryAction={() => setIsEngineActive(!isEngineActive)}
      isEngineActive={isEngineActive}
    />
  );
}
