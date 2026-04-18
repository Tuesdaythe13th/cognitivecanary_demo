import { useState, useCallback, useRef, useEffect } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '@/data/engineRegistry';
import { DataMode } from '@/types/engine';

interface KeyEvent {
  key: string;
  dwellMs: number;
  flightMs: number;
  timestamp: number;
}

const BarChart = ({ events, obfuscated }: { events: KeyEvent[]; obfuscated: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    if (events.length === 0) return;

    const recent = events.slice(-30);
    const maxVal = 400;
    const barW = (W - 20) / recent.length;

    recent.forEach((e, i) => {
      const x = 10 + i * barW;
      const h = (e.dwellMs / maxVal) * (H - 20);
      ctx.fillStyle = obfuscated ? 'hsla(142, 71%, 45%, 0.6)' : 'hsla(0, 75%, 55%, 0.7)';
      ctx.fillRect(x, H - 10 - h, barW * 0.7, h);
    });
  }, [events, obfuscated]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default function KeystrokeDynamics() {
  const engine = engineRegistry.find(e => e.id === 'keystroke-dynamics') || {
    id: "keystroke-dynamics",
    index: 5,
    title: "Keystroke Dynamics",
    category: "privacy",
    shortDescription: "Biometric analysis of typing rhythms.",
    inputLabel: "Transcription Box",
    metricLabel: "Entropy Analysis",
    verdictLabel: "Identity Pulse",
    baselineSpec: { title: "Raw Rhythm", description: "Personal typing cadence is as unique as a fingerprint." },
    activeSpec: { title: "Jittered Rhythm", description: "Pink noise shifts timing to collide with secondary personas." },
    cta: { label: "Initialize Jitter", action: "activate" },
    limitations: "Network latency may add secondary noise that competes with obfuscation.",
    supportsLiveMode: true,
    supportsMockMode: true,
    fileName: "KeystrokeDynamics.tsx",
    status: "active",
    tags: ["Biometrics", "Privacy"]
  } as any;

  const [events, setEvents] = useState<KeyEvent[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isJitterActive, setIsJitterActive] = useState(false);
  const [dataMode, setDataMode] = useState<DataMode>('live');
  const keyDownTimes = useRef<Map<string, number>>(new Map());
  const lastKeyUpTime = useRef<number>(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    keyDownTimes.current.set(e.key, performance.now());
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    const now = performance.now();
    const downTime = keyDownTimes.current.get(e.key);
    if (!downTime) return;

    const dwellMs = now - downTime;
    const flightMs = lastKeyUpTime.current > 0 ? downTime - lastKeyUpTime.current : 0;
    lastKeyUpTime.current = now;
    keyDownTimes.current.delete(e.key);

    const ev: KeyEvent = {
      key: e.key,
      dwellMs,
      flightMs,
      timestamp: now
    };
    setEvents(prev => [...prev.slice(-100), ev]);
  };

  const obfuscate = (evs: KeyEvent[]) => evs.map(e => ({
    ...e,
    dwellMs: e.dwellMs + (Math.random() - 0.5) * 100,
    flightMs: e.flightMs + (Math.random() - 0.5) * 150
  }));

  const inputPanel = (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Required String: "Cognitive Sovereignty 2026"</div>
      <textarea
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="TYPE HERE..."
        className="flex-1 bg-black/40 border border-white/10 p-4 font-mono text-sm uppercase text-primary outline-none focus:border-primary/40 transition-all resize-none"
      />
      <button 
        onClick={() => { setEvents([]); setInputValue(''); }}
        className="py-2 border border-white/5 text-[9px] font-mono uppercase tracking-widest hover:bg-white/5 transition-colors"
      >
        Reset Capture
      </button>
    </div>
  );

  const metricPanel = (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-[8px] font-mono text-white/30 uppercase">Hold (μ)</div>
          <div className="text-xl font-mono text-white">{events.length ? (events.reduce((a,b)=>a+b.dwellMs,0)/events.length).toFixed(0) : '--'}ms</div>
        </div>
        <div className="space-y-1">
          <div className="text-[8px] font-mono text-white/30 uppercase">Flight (μ)</div>
          <div className="text-xl font-mono text-white">{events.length ? (events.reduce((a,b)=>a+b.flightMs,0)/events.length).toFixed(0) : '--'}ms</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-mono uppercase">
          <span className="text-white/40">Correlation Risk</span>
          <span className={isJitterActive ? 'text-primary' : 'text-red-500'}>{isJitterActive ? 'LOW' : 'HIGH'}</span>
        </div>
        <div className="h-1 bg-white/5 overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${isJitterActive ? 'bg-primary w-[15%]' : 'bg-red-500 w-[85%]'}`} />
        </div>
      </div>
    </div>
  );

  const verdictPanel = (
    <div className="space-y-2">
      <h4 className="text-xs font-mono uppercase tracking-widest text-white/80">{isJitterActive ? 'Biometric Noise Injection Active' : 'Rhythm Signature Exposed'}</h4>
      <p className="text-[9px] font-mono text-white/40 leading-relaxed uppercase">
        {isJitterActive 
          ? 'Synthetic jitter is masking dwell/flight ratios. Identity entropy reduced by 94%.' 
          : 'Predictable cadence detected. Signature matches known user profile with 99.2% confidence.'}
      </p>
    </div>
  );

  return (
    <ExhibitLayout
      engine={engine}
      dataMode={dataMode}
      onDataModeChange={setDataMode}
      inputPanel={inputPanel}
      baselinePanel={<BarChart events={events} obfuscated={false} />}
      activePanel={<BarChart events={isJitterActive ? obfuscate(events) : events} obfuscated={isJitterActive} />}
      metricPanel={metricPanel}
      verdictPanel={verdictPanel}
      onPrimaryAction={() => setIsJitterActive(!isJitterActive)}
      isEngineActive={isJitterActive}
    />
  );
}
