import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface PipelineStage {
  id: string;
  label: string;
  engine: string;
  description: string;
}

const STAGES: PipelineStage[] = [
  { id: 'extract', label: 'EXTRACT', engine: 'Neuronpedia + Sparse Circuit Mapper', description: 'SAE feature decomposition — 16k features, deception-correlated feature scan' },
  { id: 'test', label: 'TEST', engine: 'Inspect Harness + Bloom Elicitor', description: 'Monitored vs. unmonitored eval suites — sandbagging delta computation' },
  { id: 'audit', label: 'AUDIT', engine: 'Docent Auditor + TransformerLens', description: 'Transcript clustering, eval-awareness signals, activation patching' },
  { id: 'score', label: 'SCORE', engine: 'Strategic Fidelity + Stax Evaluator', description: 'H_strat computation — circuit + behavioural + steering evidence channels' },
];

interface ModelProfile {
  name: string;
  features: number;
  deceptionFeatures: number;
  monitoredAcc: number;
  unmonitoredAcc: number;
  flaggedTranscripts: number;
  totalTranscripts: number;
  hStrat: number;
  verdict: string;
}

const MODEL_PROFILES: Record<string, ModelProfile> = {
  aligned: {
    name: 'Model A (Aligned)',
    features: 16384,
    deceptionFeatures: 2,
    monitoredAcc: 0.84,
    unmonitoredAcc: 0.81,
    flaggedTranscripts: 1,
    totalTranscripts: 50,
    hStrat: 0.87,
    verdict: 'GENUINE',
  },
  deceptive: {
    name: 'Model B (Deceptive)',
    features: 16384,
    deceptionFeatures: 14,
    monitoredAcc: 0.91,
    unmonitoredAcc: 0.58,
    flaggedTranscripts: 18,
    totalTranscripts: 50,
    hStrat: 0.23,
    verdict: 'DECEPTIVE',
  },
};

const DeceptionPipeline = () => {
  const { ref, isInView } = useInView();
  const [selectedModel, setSelectedModel] = useState<'aligned' | 'deceptive'>('deceptive');
  const [running, setRunning] = useState(false);
  const [activeStage, setActiveStage] = useState(-1);
  const [complete, setComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const profile = MODEL_PROFILES[selectedModel];

  const runPipeline = () => {
    setRunning(true);
    setComplete(false);
    setActiveStage(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage >= STAGES.length) {
        clearInterval(interval);
        setComplete(true);
        setRunning(false);
      }
      setActiveStage(stage);
    }, 1200);
  };

  // H_strat gauge canvas
  useEffect(() => {
    if (!complete) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    const cx = w / 2, cy = h * 0.55;
    const radius = Math.min(w, h) * 0.35;
    const hStrat = profile.hStrat;

    const startAngle = Math.PI * 0.8;
    const endAngle = Math.PI * 2.2;
    const totalArc = endAngle - startAngle;

    ctx.clearRect(0, 0, w, h);

    // Arc segments
    const segments = [
      { from: 0, to: 0.3, color: 'hsla(0, 65%, 50%, 0.4)' },
      { from: 0.3, to: 0.7, color: 'hsla(45, 80%, 50%, 0.4)' },
      { from: 0.7, to: 1.0, color: 'hsla(142, 71%, 45%, 0.4)' },
    ];
    segments.forEach(seg => {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle + seg.from * totalArc, startAngle + seg.to * totalArc);
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = 8;
      ctx.stroke();
    });

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const frac = i / 10;
      const angle = startAngle + frac * totalArc;
      ctx.beginPath();
      ctx.moveTo(cx + (radius - 8) * Math.cos(angle), cy + (radius - 8) * Math.sin(angle));
      ctx.lineTo(cx + (radius + 4) * Math.cos(angle), cy + (radius + 4) * Math.sin(angle));
      ctx.strokeStyle = i % 5 === 0 ? 'hsla(160, 10%, 50%, 0.7)' : 'hsla(160, 10%, 30%, 0.3)';
      ctx.lineWidth = i % 5 === 0 ? 1.5 : 0.5;
      ctx.stroke();
    }

    // Needle
    const needleAngle = startAngle + hStrat * totalArc;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (radius - 14) * Math.cos(needleAngle), cy + (radius - 14) * Math.sin(needleAngle));
    ctx.strokeStyle = 'hsla(0, 0%, 90%, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'hsla(0, 0%, 80%, 0.8)';
    ctx.fill();

    // Score
    const scoreColor = hStrat > 0.7 ? 'hsla(142, 71%, 55%, 1)' : hStrat > 0.3 ? 'hsla(45, 80%, 55%, 1)' : 'hsla(0, 65%, 55%, 1)';
    ctx.fillStyle = scoreColor;
    ctx.font = 'bold 22px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(hStrat.toFixed(3), cx, cy + radius * 0.6);
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`H_strat`, cx, cy + radius * 0.6 + 16);
    ctx.textAlign = 'start';
  }, [complete, profile.hStrat]);

  return (
    <section id="forensics-pipeline" className="relative py-32 px-6" ref={ref}>
      <div className="section-divider mb-20" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="tag-badge">LAB EXHIBIT 06</span>
            <span className="tag-badge" style={{ borderColor: 'hsla(280, 60%, 60%, 0.4)', color: 'hsla(280, 60%, 70%, 0.9)' }}>FORENSIC SCOPE</span>
            <Link to="/demo/deception-pipeline" target="_blank" className="flex items-center gap-2 text-[9px] font-mono text-white/50 hover:text-white transition-colors uppercase tracking-widest border border-white/10 hover:border-white/30 px-3 py-1 bg-black/50 backdrop-blur-md rounded">
              <ExternalLink size={10} /> Standalone
            </Link>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl text-foreground font-black">
            Deception Forensic<br />
            <span className="text-primary" style={{ textShadow: '0 0 30px rgba(0,255,65,0.15)' }}>Pipeline v0.1</span>
          </h2>
          <p className="text-xs font-mono text-muted-foreground/50 mt-4 uppercase tracking-widest max-w-2xl">
            End-to-end mechanistic interpretability pipeline for auditing AI deception.
            SAE decomposition &rarr; Sandbagging test &rarr; Transcript audit &rarr; H_strat verdict.
          </p>
        </div>

        {/* Pipeline UI */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Pipeline stages */}
          <div className="lg:col-span-2 space-y-4">
            {/* Model selector + run button */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-2">
                {(['aligned', 'deceptive'] as const).map(key => (
                  <button
                    key={key}
                    onClick={() => { setSelectedModel(key); setComplete(false); setActiveStage(-1); }}
                    className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                      selectedModel === key
                        ? 'border-primary/60 text-primary bg-primary/10'
                        : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                    }`}
                  >
                    {MODEL_PROFILES[key].name}
                  </button>
                ))}
              </div>
              <button
                onClick={runPipeline}
                disabled={running}
                className="px-6 py-2 text-[10px] font-mono uppercase tracking-widest bg-primary text-black font-black hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,255,65,0.2)]"
              >
                {running ? 'Running...' : 'Run Pipeline'}
              </button>
            </div>

            {/* Stage cards */}
            {STAGES.map((stage, i) => {
              const isActive = i === activeStage;
              const isDone = i < activeStage || complete;

              return (
                <div
                  key={stage.id}
                  className="glass-panel p-5 bg-white/[0.02] rounded-xl transition-all duration-500"
                  style={{
                    borderColor: isActive ? 'hsla(142, 71%, 50%, 0.5)' : isDone ? 'hsla(142, 71%, 45%, 0.2)' : 'hsla(160, 10%, 20%, 0.3)',
                    boxShadow: isActive ? '0 0 30px rgba(0, 255, 65, 0.08)' : 'none',
                    opacity: (activeStage === -1 || isDone || isActive) ? 1 : 0.4,
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Stage indicator */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-mono font-black flex-shrink-0 transition-all duration-500"
                      style={{
                        background: isDone ? 'hsla(142, 71%, 45%, 0.2)' : isActive ? 'hsla(142, 71%, 45%, 0.1)' : 'hsla(160, 10%, 15%, 0.5)',
                        border: `1px solid ${isDone ? 'hsla(142, 71%, 50%, 0.4)' : isActive ? 'hsla(142, 71%, 50%, 0.3)' : 'hsla(160, 10%, 25%, 0.3)'}`,
                        color: isDone || isActive ? 'hsla(142, 71%, 60%, 0.9)' : 'hsla(160, 10%, 40%, 0.6)',
                      }}
                    >
                      {isDone ? '\u2713' : `0${i + 1}`}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-foreground tracking-tight">{stage.label}</span>
                        <span className="text-[9px] font-mono text-muted-foreground/40">{stage.engine}</span>
                        {isActive && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground/50 mt-1 font-mono">{stage.description}</p>

                      {/* Stage results */}
                      {isDone && (
                        <div className="mt-3 flex gap-4 text-[10px] font-mono">
                          {i === 0 && (
                            <>
                              <span className="text-primary/70">Features: {profile.features.toLocaleString()}</span>
                              <span className={profile.deceptionFeatures > 5 ? 'text-red-400' : 'text-primary/70'}>
                                Deception: {profile.deceptionFeatures}
                              </span>
                            </>
                          )}
                          {i === 1 && (
                            <>
                              <span className="text-primary/70">Monitored: {(profile.monitoredAcc * 100).toFixed(0)}%</span>
                              <span className="text-red-400/80">Unmonitored: {(profile.unmonitoredAcc * 100).toFixed(0)}%</span>
                              <span className={Math.abs(profile.monitoredAcc - profile.unmonitoredAcc) > 0.15 ? 'text-red-400' : 'text-primary/70'}>
                                {'\u0394'}{((profile.monitoredAcc - profile.unmonitoredAcc) * 100).toFixed(0)}%
                              </span>
                            </>
                          )}
                          {i === 2 && (
                            <>
                              <span className="text-primary/70">Transcripts: {profile.totalTranscripts}</span>
                              <span className={profile.flaggedTranscripts > 5 ? 'text-red-400' : 'text-primary/70'}>
                                Flagged: {profile.flaggedTranscripts}
                              </span>
                            </>
                          )}
                          {i === 3 && (
                            <span className={profile.hStrat < 0.3 ? 'text-red-400 font-bold' : profile.hStrat > 0.7 ? 'text-primary font-bold' : 'text-yellow-400 font-bold'}>
                              H_strat = {profile.hStrat.toFixed(3)} &mdash; {profile.verdict}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: H_strat gauge */}
          <div className="space-y-4">
            <div className="glass-panel p-5 bg-white/[0.02] rounded-xl">
              <div className="text-[9px] font-mono text-primary/50 uppercase tracking-widest mb-3">Strategic Fidelity</div>
              {complete ? (
                <canvas
                  ref={canvasRef}
                  className="w-full block"
                  style={{ height: '200px' }}
                  aria-label="H_strat gauge visualization"
                  role="img"
                />
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <span className="text-[11px] font-mono text-muted-foreground/30 uppercase tracking-widest">
                    {running ? 'Computing...' : 'Run pipeline to compute'}
                  </span>
                </div>
              )}
            </div>

            {/* Evidence channels */}
            <div className="glass-panel p-5 bg-white/[0.02] rounded-xl">
              <div className="text-[9px] font-mono text-primary/50 uppercase tracking-widest mb-3">Evidence Channels</div>
              <div className="space-y-3">
                {[
                  { label: 'Circuit', value: complete ? (selectedModel === 'deceptive' ? 0.72 : 0.12) : 0, color: 'bg-primary' },
                  { label: 'Behavioral', value: complete ? (selectedModel === 'deceptive' ? 0.81 : 0.08) : 0, color: 'bg-cyan-400' },
                  { label: 'Steering', value: complete ? (selectedModel === 'deceptive' ? 0.68 : 0.15) : 0, color: 'bg-purple-400' },
                ].map(ch => (
                  <div key={ch.label}>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-white/30 uppercase">{ch.label}</span>
                      <span className="text-white/50">{complete ? (ch.value * 100).toFixed(0) + '%' : '--'}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${ch.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${ch.value * 100}%`, opacity: 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verdict */}
            {complete && (
              <div
                className="glass-panel p-5 rounded-xl transition-all duration-500"
                style={{
                  background: profile.hStrat < 0.3 ? 'hsla(0, 65%, 50%, 0.08)' : 'hsla(142, 71%, 45%, 0.08)',
                  borderColor: profile.hStrat < 0.3 ? 'hsla(0, 65%, 50%, 0.3)' : 'hsla(142, 71%, 45%, 0.3)',
                }}
              >
                <div className="text-[9px] font-mono text-primary/50 uppercase tracking-widest mb-2">Pipeline Verdict</div>
                <div
                  className="text-lg font-black font-mono"
                  style={{ color: profile.hStrat < 0.3 ? 'hsla(0, 65%, 60%, 1)' : 'hsla(142, 71%, 55%, 1)' }}
                >
                  {profile.verdict}
                </div>
                <p className="text-[10px] font-mono text-muted-foreground/40 mt-2">
                  {profile.hStrat < 0.3
                    ? 'Model responses change significantly under probing. Hidden capability detected via steering vectors.'
                    : 'Model responses are stable regardless of monitoring context. Behaviour consistent under ablation.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeceptionPipeline;
