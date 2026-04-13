import React, { useState, useEffect, useRef, useCallback } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { BrainCircuit, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

type Band = { name: string; freq: string; color: string; baseAmp: number; inferenceTarget: string };

const EEG_BANDS: Band[] = [
  { name: 'Delta', freq: '0.5–4 Hz', color: '#ff4466', baseAmp: 0.3, inferenceTarget: 'Sleep depth / loss of consciousness' },
  { name: 'Theta', freq: '4–8 Hz', color: '#ff9500', baseAmp: 0.55, inferenceTarget: 'Memory encoding / emotional stress' },
  { name: 'Alpha', freq: '8–13 Hz', color: '#BFFF00', baseAmp: 0.8, inferenceTarget: 'Cognitive load / relaxation state' },
  { name: 'Beta', freq: '13–30 Hz', color: '#00e5ff', baseAmp: 0.65, inferenceTarget: 'Active thinking / anxiety' },
  { name: 'Gamma', freq: '30–100 Hz', color: '#b44aff', baseAmp: 0.45, inferenceTarget: 'High-level cognition / binding' },
];

function generateSpectrum(
  bands: Band[],
  time: number,
  noiseLevel: number,
  suppressAlpha: boolean,
  suppressTheta: boolean
): Float32Array {
  const bins = 128;
  const spectrum = new Float32Array(bins);
  for (let i = 0; i < bins; i++) {
    const freq = (i / bins) * 100; // 0–100 Hz
    let power = 0;
    bands.forEach((band) => {
      const [lo, hi] = band.freq.split('–').map(parseFloat);
      if (freq >= lo && freq <= hi) {
        let amp = band.baseAmp;
        if (band.name === 'Alpha' && suppressAlpha) amp *= 0.08 + Math.random() * 0.04;
        if (band.name === 'Theta' && suppressTheta) amp *= 0.1 + Math.random() * 0.05;
        const wobble = Math.sin(time * 0.002 + i * 0.3) * 0.1;
        power += amp + wobble;
      }
    });
    power += noiseLevel * (Math.random() - 0.5);
    spectrum[i] = Math.max(0, Math.min(1, power));
  }
  return spectrum;
}

const SpectrumCanvas = ({
  isActive,
  suppressAlpha,
  suppressTheta,
  label,
}: {
  isActive: boolean;
  suppressAlpha: boolean;
  suppressTheta: boolean;
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
      const noise = isActive ? 0.35 : 0.05;
      const spectrum = generateSpectrum(EEG_BANDS, timeRef.current, noise, suppressAlpha, suppressTheta);
      const bins = spectrum.length;
      const barW = W / bins;

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      for (let row = 0; row <= 4; row++) {
        const y = (row / 4) * H;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Band regions
      EEG_BANDS.forEach((band) => {
        const [lo, hi] = band.freq.split('–').map(parseFloat);
        const x1 = (lo / 100) * W;
        const x2 = (hi / 100) * W;
        ctx.fillStyle = `${band.color}10`;
        ctx.fillRect(x1, 0, x2 - x1, H);
        ctx.fillStyle = `${band.color}40`;
        ctx.font = '7px "Geist Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(band.name, (x1 + x2) / 2, H - 4);
      });

      // Spectrum bars
      for (let i = 0; i < bins; i++) {
        const freq = (i / bins) * 100;
        let color = '#ffffff';
        EEG_BANDS.forEach((band) => {
          const [lo, hi] = band.freq.split('–').map(parseFloat);
          if (freq >= lo && freq <= hi) color = band.color;
        });
        const h = spectrum[i] * (H - 20);
        ctx.fillStyle = color + 'cc';
        ctx.fillRect(i * barW, H - 20 - h, barW - 0.5, h);
        if (isActive && spectrum[i] > 0.4) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.fillRect(i * barW, H - 20 - h, barW - 0.5, h);
          ctx.shadowBlur = 0;
        }
      }

      // Label
      ctx.fillStyle = isActive ? '#BFFF00' : 'rgba(255,255,255,0.3)';
      ctx.font = '9px "Geist Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, 6, 14);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, suppressAlpha, suppressTheta, label]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default function SpectralDefender() {
  const engine = engineRegistry.find(e => e.id === 'spectral-defender')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [targetBands, setTargetBands] = useState<Set<string>>(new Set(['Alpha', 'Theta']));
  const [classifierConfidence, setClassifierConfidence] = useState(87);

  // Animate classifier confidence
  useEffect(() => {
    const interval = setInterval(() => {
      setClassifierConfidence(prev => {
        if (isEngineActive) {
          const target = 8 + Math.random() * 12;
          return prev + (target - prev) * 0.15;
        } else {
          const target = 82 + Math.random() * 12;
          return prev + (target - prev) * 0.05;
        }
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isEngineActive]);

  const toggleBand = (name: string) => {
    setTargetBands(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2 space-y-4">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">
        Target Band Selection
      </div>
      <p className="text-[10px] font-mono text-white/40 leading-relaxed">
        Select which frequency bands to suppress. Alpha (cognitive load) and Theta (emotional stress) are the highest-value inference targets.
      </p>
      <div className="flex-1 flex flex-col gap-2">
        {EEG_BANDS.map(band => (
          <button
            key={band.name}
            onClick={() => toggleBand(band.name)}
            className={`p-3 text-left border transition-all ${targetBands.has(band.name) ? 'border-[#BFFF00]/60 bg-[#BFFF00]/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm" style={{ background: band.color }} />
                <span className="text-sm font-display uppercase tracking-wider text-white">{band.name}</span>
              </div>
              <span className="text-[9px] font-mono text-white/40">{band.freq}</span>
            </div>
            <div className="text-[9px] font-mono text-white/30 mt-1 truncate">{band.inferenceTarget}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const baselinePanel = (
    <SpectrumCanvas
      isActive={false}
      suppressAlpha={false}
      suppressTheta={false}
      label="RAW PSD — IDENTITY EXPOSED"
    />
  );

  const activePanel = (
    <>
      <SpectrumCanvas
        isActive={isEngineActive}
        suppressAlpha={isEngineActive && targetBands.has('Alpha')}
        suppressTheta={isEngineActive && targetBands.has('Theta')}
        label={isEngineActive ? 'SPECTRAL DEFENDER ACTIVE — BANDS SUPPRESSED' : 'AWAITING ACTIVATION'}
      />
      {isEngineActive && (
        <div className="absolute top-4 right-4 text-[10px] font-mono text-[#BFFF00] border border-[#BFFF00]/30 px-2 py-1 bg-[#BFFF00]/10 flex items-center gap-2 z-10">
          <span className="w-1.5 h-1.5 bg-[#BFFF00] animate-pulse rounded-full" />
          {targetBands.size} BAND{targetBands.size !== 1 ? 'S' : ''} ATTENUATED
        </div>
      )}
    </>
  );

  const conf = Math.round(classifierConfidence);
  const isProtected = isEngineActive && conf < 25;

  const metricPanel = (
    <div className="flex flex-col h-full justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className={`text-6xl font-display tabular-nums tracking-tighter ${conf > 50 ? 'text-red-500' : 'text-[#BFFF00]'}`}>
            {conf}%
          </div>
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">Classifier Confidence</div>
        </div>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${conf > 50 ? 'bg-red-500' : 'bg-[#BFFF00]'}`}
          style={{ width: `${conf}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-white/30 uppercase tracking-widest">
        <span>Protected ({'<'}25%)</span>
        <span>Inferrable</span>
      </div>
      <div className="mt-4 space-y-2">
        {EEG_BANDS.map(band => (
          <div key={band.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: band.color }} />
            <div className="text-[9px] font-mono text-white/50 w-14">{band.name}</div>
            <div className={`flex-1 text-[9px] font-mono ${isEngineActive && targetBands.has(band.name) ? 'text-[#BFFF00]' : 'text-red-400/60'}`}>
              {isEngineActive && targetBands.has(band.name) ? '▓▓░░░░ SUPPRESSED' : '▓▓▓▓▓▓ EXPOSED'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const verdictPanel = (
    <div className="flex items-start gap-4">
      {isProtected ? (
        <ShieldCheck className="w-10 h-10 text-[#BFFF00] shrink-0" />
      ) : (
        <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
      )}
      <div>
        <h4 className="text-xl font-display uppercase tracking-widest mb-2">
          {isEngineActive ? (isProtected ? 'Cognitive State Cloaked' : 'Partial Defense') : 'Neural State Exposed'}
        </h4>
        <p className="text-sm font-mono text-white/60 leading-relaxed">
          {isEngineActive
            ? `Targeted spectral attenuation reduces cognitive-state classifier confidence from ~87% to ${conf}%. ${targetBands.size < 2 ? 'Select additional bands for fuller coverage.' : 'Alpha + Theta suppression collapses the two primary inference vectors.'}`
            : 'Raw power spectral density (PSD) reveals cognitive load, emotional state, and attention level with high classification accuracy.'}
        </p>
      </div>
    </div>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4" />
        The Cognitive State Inference Problem
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        Consumer-grade EEG headsets (Muse, Emotiv, NeuroSky) expose spectral power density data in real time. Commercial neurotechnology platforms use these band ratios — particularly Alpha/Theta — to infer cognitive workload, attention level, emotional valence, and mental fatigue. The Spectral Defender targets band-specific attenuation via additive noise injection calibrated to minimize disruption to the BCI control signal.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {EEG_BANDS.slice(1, 3).map(band => (
          <div key={band.name} className="border border-white/10 p-3">
            <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: band.color }}>{band.name} Band</div>
            <div className="text-[9px] font-mono text-white/50">{band.inferenceTarget}</div>
          </div>
        ))}
      </div>
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
