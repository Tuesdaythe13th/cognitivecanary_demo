import React, { useState, useEffect, useRef } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { Activity, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface TelemetryPoint {
  step: number;
  gradNorm: number;
  rankCollapse: number;
  anomaly: boolean;
  anomalyType?: string;
}

const ANOMALY_TYPES = [
  'Gradient Inversion',
  'Rank Collapse',
  'Norm Spike',
  'Weight Poisoning Signal',
  'Targeted Layer Destabilization',
];

const STREAM_CONFIGS = [
  { id: 'transformer', name: 'Transformer Block', layers: 12, desc: 'Standard attention + FFN architecture' },
  { id: 'moe', name: 'Mixture of Experts', layers: 8, desc: 'Sparse routing with 64 expert heads' },
  { id: 'rlhf', name: 'RLHF Fine-tune', layers: 4, desc: 'Reward model gradient telemetry' },
];

const GradientCanvas = ({
  data,
  isActive,
}: {
  data: TelemetryPoint[];
  isActive: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    if (data.length < 2) {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '10px "Geist Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('AWAITING TELEMETRY STREAM', W / 2, H / 2);
      return;
    }

    const maxNorm = Math.max(...data.map(d => d.gradNorm), 5);
    const padding = { top: 20, bottom: 30, left: 10, right: 10 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * chartH;
      ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(W - padding.right, y); ctx.stroke();
    }

    // Anomaly bands
    data.forEach((pt, i) => {
      if (pt.anomaly) {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const bandW = chartW / data.length + 2;
        ctx.fillStyle = 'rgba(255, 50, 50, 0.12)';
        ctx.fillRect(x - bandW / 2, padding.top, bandW, chartH);
      }
    });

    // Rank collapse fill (secondary)
    ctx.beginPath();
    data.forEach((pt, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + chartH - (pt.rankCollapse * chartH * 0.4);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 229, 255, 0.06)';
    ctx.fill();

    // Gradient norm line
    ctx.beginPath();
    data.forEach((pt, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + chartH - ((pt.gradNorm / maxNorm) * chartH * 0.85);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = isActive ? '#BFFF00' : 'rgba(191, 255, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Anomaly spikes
    data.forEach((pt, i) => {
      if (pt.anomaly) {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + chartH - ((pt.gradNorm / maxNorm) * chartH * 0.85);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ff4466';
        ctx.shadowColor = '#ff4466';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // X-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '8px "Geist Mono", monospace';
    ctx.textAlign = 'center';
    const labelEvery = Math.ceil(data.length / 5);
    data.forEach((pt, i) => {
      if (i % labelEvery === 0) {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        ctx.fillText(`s${pt.step}`, x, H - 4);
      }
    });

    // Legend
    ctx.fillStyle = '#BFFF00';
    ctx.font = '8px "Geist Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('▸ GRAD NORM', 12, 14);
    ctx.fillStyle = 'rgba(0, 229, 255, 0.6)';
    ctx.fillText('▸ RANK COLLAPSE', 100, 14);

  }, [data, isActive]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default function GradientAuditor() {
  const engine = engineRegistry.find(e => e.id === 'gradient-auditor')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(STREAM_CONFIGS[0]);
  const [data, setData] = useState<TelemetryPoint[]>([]);
  const [anomalyCount, setAnomalyCount] = useState(0);
  const [threatScore, setThreatScore] = useState(0);
  const stepRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Seed with initial normal data
    const initial: TelemetryPoint[] = Array.from({ length: 40 }, (_, i) => ({
      step: i,
      gradNorm: 1.2 + Math.sin(i * 0.4) * 0.3 + Math.random() * 0.2,
      rankCollapse: 0.05 + Math.random() * 0.08,
      anomaly: false,
    }));
    setData(initial);
    stepRef.current = 40;
    setAnomalyCount(0);
    setThreatScore(0);
  }, [selectedConfig]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const step = stepRef.current++;
      let gradNorm: number;
      let rankCollapse: number;
      let anomaly = false;
      let anomalyType: string | undefined;

      if (isEngineActive && Math.random() < 0.12) {
        // Inject anomaly
        anomaly = true;
        anomalyType = ANOMALY_TYPES[Math.floor(Math.random() * ANOMALY_TYPES.length)];
        gradNorm = 3 + Math.random() * 6;
        rankCollapse = 0.6 + Math.random() * 0.35;
        setAnomalyCount(c => c + 1);
        setThreatScore(ts => Math.min(100, ts + 12 + Math.random() * 8));
      } else {
        gradNorm = 1.2 + Math.sin(step * 0.4) * 0.3 + Math.random() * 0.25;
        rankCollapse = 0.05 + Math.random() * 0.1;
        setThreatScore(ts => Math.max(0, ts - 0.5));
      }

      const pt: TelemetryPoint = { step, gradNorm, rankCollapse, anomaly, anomalyType };
      setData(prev => [...prev.slice(-80), pt]);
    }, 300);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isEngineActive]);

  const recentAnomalies = data.filter(d => d.anomaly).slice(-3);

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2 space-y-4">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">
        Telemetry Stream Config
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {STREAM_CONFIGS.map(cfg => (
          <button
            key={cfg.id}
            onClick={() => setSelectedConfig(cfg)}
            className={`p-3 text-left border transition-all ${selectedConfig.id === cfg.id ? 'border-[#00e5ff]/60 bg-[#00e5ff]/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
          >
            <div className="text-sm font-display uppercase tracking-wider text-[#00e5ff]">{cfg.name}</div>
            <div className="text-[9px] font-mono text-white/40 mt-1">{cfg.desc}</div>
            <div className="text-[9px] font-mono text-white/30 mt-1">{cfg.layers} layers monitored</div>
          </button>
        ))}
      </div>
      <div className="border border-white/10 p-3">
        <div className="text-[9px] font-mono text-white/40 mb-2 uppercase tracking-widest">Live Stream Status</div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isEngineActive ? 'bg-[#BFFF00] animate-pulse' : 'bg-white/20'}`} />
          <span className="text-[10px] font-mono text-white/60">
            {isEngineActive ? 'ANOMALY DETECTION ARMED' : 'MONITORING (PASSIVE)'}
          </span>
        </div>
      </div>
    </div>
  );

  const baselinePanel = (
    <div className="relative w-full h-full">
      <GradientCanvas data={data.slice(0, 40)} isActive={false} />
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/30 uppercase">Normal gradient flow — no threats</div>
    </div>
  );

  const activePanel = (
    <div className="relative w-full h-full">
      <GradientCanvas data={data} isActive={isEngineActive} />
      {isEngineActive && anomalyCount > 0 && (
        <div className="absolute bottom-4 left-4 space-y-1">
          {recentAnomalies.map((a, i) => (
            <div key={i} className="text-[9px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5">
              ⚠ {a.anomalyType} @ step {a.step}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ts = Math.round(threatScore);
  const metricPanel = (
    <div className="flex flex-col h-full justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className={`text-6xl font-display tabular-nums tracking-tighter ${ts > 40 ? 'text-red-500' : 'text-[#BFFF00]'}`}>
            {ts}
          </div>
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">Threat Score</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-display text-red-400">{anomalyCount}</div>
          <div className="text-[9px] font-mono text-white/40 uppercase">Anomalies</div>
        </div>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${ts > 40 ? 'bg-red-500' : 'bg-[#BFFF00]'}`}
          style={{ width: `${ts}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-white/30 uppercase tracking-widest">
        <span>Clean (0)</span>
        <span>Attack (100)</span>
      </div>
    </div>
  );

  const verdictPanel = (
    <div className="flex items-start gap-4">
      {ts > 40 ? (
        <AlertTriangle className="w-10 h-10 text-red-500 shrink-0 animate-pulse" />
      ) : (
        <ShieldCheck className="w-10 h-10 text-[#BFFF00] shrink-0" />
      )}
      <div>
        <h4 className="text-xl font-display uppercase tracking-widest mb-2">
          {ts > 40 ? 'Attack Pattern Detected' : isEngineActive ? 'Stream Normal' : 'Audit Armed'}
        </h4>
        <p className="text-sm font-mono text-white/60 leading-relaxed">
          {ts > 40
            ? `${anomalyCount} anomalous gradient events detected in ${selectedConfig.name} stream. Rank collapse indicators suggest targeted layer destabilization.`
            : isEngineActive
            ? 'Gradient norms within expected range. No inversion or collapse events in monitored window.'
            : 'Activate the auditor to arm real-time gradient norm monitoring with anomaly spike detection.'}
        </p>
      </div>
    </div>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Gradient Forensics Explained
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        During fine-tuning or RLHF, an adversary can target specific layers via gradient inversion attacks or rank-collapse triggers — effectively planting backdoors or destabilizing capabilities. The Gradient Auditor monitors the L2-norm of gradients across all layers. Sudden spikes, inversion events, or spectral rank collapse provide the earliest detectable signal of a supply-chain compromise.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {ANOMALY_TYPES.map(a => (
          <div key={a} className="border border-red-500/20 bg-red-500/5 p-2">
            <div className="text-[9px] font-mono text-red-400 uppercase tracking-wide">{a}</div>
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
      onPrimaryAction={() => {
        setIsEngineActive(!isEngineActive);
        if (!isEngineActive) {
          setAnomalyCount(0);
          setThreatScore(0);
        }
      }}
      isEngineActive={isEngineActive}
    />
  );
}
