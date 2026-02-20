import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';

interface KeyEvent {
  key: string;
  dwellMs: number;     // how long key was held
  flightMs: number;    // time since last keyup
  timestamp: number;
}

interface TypingProfile {
  events: KeyEvent[];
  wpm: number;
  avgDwell: number;
  avgFlight: number;
  stdDwell: number;
  stdFlight: number;
  rhythmScore: number; // 0-1, lower = more robotic/identifiable
}

const SAMPLE_PROMPTS = [
  'the quick brown fox jumps over',
  'behavioral obfuscation protects',
  'cognitive canary active defense',
  'neural fingerprint interference',
];

function stddev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length);
}

function analyzeProfile(events: KeyEvent[]): Omit<TypingProfile, 'events'> {
  if (events.length === 0) return { wpm: 0, avgDwell: 0, avgFlight: 0, stdDwell: 0, stdFlight: 0, rhythmScore: 0 };
  const dwells = events.map(e => e.dwellMs).filter(d => d > 0 && d < 500);
  const flights = events.map(e => e.flightMs).filter(f => f > 0 && f < 1000);

  const avgDwell = dwells.length ? dwells.reduce((a, b) => a + b, 0) / dwells.length : 0;
  const avgFlight = flights.length ? flights.reduce((a, b) => a + b, 0) / flights.length : 0;
  const sdDwell = stddev(dwells);
  const sdFlight = stddev(flights);

  // rhythmScore: higher std dev relative to mean = less predictable pattern
  const rhythmScore = Math.min(1, (sdDwell / Math.max(1, avgDwell) + sdFlight / Math.max(1, avgFlight)) / 2);

  // WPM from timestamps
  const totalTime = events.length > 1
    ? (events[events.length - 1].timestamp - events[0].timestamp) / 60000
    : 0;
  const wpm = totalTime > 0 ? Math.round((events.length / 5) / totalTime) : 0;

  return { wpm, avgDwell, avgFlight, stdDwell: sdDwell, stdFlight: sdFlight, rhythmScore };
}

// Add pink noise to timing values to simulate obfuscation
function obfuscateEvents(events: KeyEvent[]): KeyEvent[] {
  return events.map(e => ({
    ...e,
    dwellMs: Math.max(10, e.dwellMs + (Math.random() - 0.5) * 80 + Math.sin(e.timestamp * 0.003) * 25),
    flightMs: Math.max(10, e.flightMs + (Math.random() - 0.5) * 120 + Math.cos(e.timestamp * 0.005) * 40),
  }));
}

const BarChart = ({
  events,
  obfuscated,
  maxEvents = 40,
}: {
  events: KeyEvent[];
  obfuscated: boolean;
  maxEvents?: number;
}) => {
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

    const display = obfuscated ? obfuscateEvents(events) : events;
    const recent = display.slice(-maxEvents);
    if (recent.length === 0) {
      ctx.fillStyle = 'hsla(142, 10%, 30%, 0.4)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('begin typing to see your keystroke pattern', W / 2, H / 2);
      return;
    }

    const maxDwell = Math.max(...recent.map(e => e.dwellMs), 200);
    const maxFlight = Math.max(...recent.map(e => e.flightMs), 200);
    const barW = Math.max(3, (W - 20) / maxEvents);
    const padding = 24;

    // Grid lines
    ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.04)';
    ctx.lineWidth = 0.5;
    for (let row = 0; row <= 4; row++) {
      const y = padding + (row / 4) * (H - padding * 2);
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(W - 10, y);
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = 'hsla(0, 0%, 100%, 0.2)';
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('DWELL', 12, padding - 6);
    ctx.fillStyle = 'hsla(175, 60%, 45%, 0.4)';
    ctx.fillText('FLIGHT', 12 + 50, padding - 6);

    recent.forEach((e, i) => {
      const x = 10 + i * barW;
      const dwellH = ((e.dwellMs / maxDwell) * (H - padding * 2)) * 0.85;
      const flightH = ((e.flightMs / maxFlight) * (H - padding * 2)) * 0.65;

      // Dwell bar (green)
      const dwellColor = obfuscated
        ? `hsla(142, 71%, ${35 + Math.random() * 20}%, 0.6)`
        : `hsla(${Math.max(0, 142 - e.dwellMs * 0.3)}, 71%, 45%, 0.75)`;
      ctx.fillStyle = dwellColor;
      ctx.fillRect(x, H - padding - dwellH, barW * 0.55, dwellH);

      // Flight bar (cyan) — offset
      const flightColor = obfuscated
        ? `hsla(175, 60%, ${35 + Math.random() * 20}%, 0.5)`
        : `hsla(175, 60%, 45%, 0.5)`;
      ctx.fillStyle = flightColor;
      ctx.fillRect(x + barW * 0.55, H - padding - flightH, barW * 0.35, flightH);
    });

    // Glow on last bar
    if (recent.length > 0) {
      const last = recent[recent.length - 1];
      const x = 10 + (recent.length - 1) * barW;
      const dwellH = ((last.dwellMs / maxDwell) * (H - padding * 2)) * 0.85;
      ctx.shadowColor = obfuscated ? 'hsla(142, 71%, 50%, 0.8)' : 'hsla(0, 75%, 55%, 0.6)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = obfuscated ? 'hsla(142, 71%, 65%, 0.9)' : 'hsla(0, 75%, 60%, 0.9)';
      ctx.fillRect(x, H - padding - dwellH, barW * 0.55, dwellH);
      ctx.shadowBlur = 0;
    }

    // Baseline
    ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, H - padding);
    ctx.lineTo(W - 10, H - padding);
    ctx.stroke();

  }, [events, obfuscated, maxEvents]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

const KeystrokeDynamics = () => {
  const { ref, isInView } = useInView();
  const [events, setEvents] = useState<KeyEvent[]>([]);
  const [obfuscated, setObfuscated] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const keyDownTimes = useRef<Map<string, number>>(new Map());
  const lastKeyUpTime = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = performance.now();
    keyDownTimes.current.set(e.key, now);
  }, []);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = performance.now();
    const downTime = keyDownTimes.current.get(e.key);
    if (!downTime) return;

    const dwellMs = now - downTime;
    const flightMs = lastKeyUpTime.current > 0 ? downTime - lastKeyUpTime.current : 0;
    lastKeyUpTime.current = now;
    keyDownTimes.current.delete(e.key);

    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Space') {
      const ev: KeyEvent = {
        key: e.key === 'Backspace' ? '⌫' : e.key === ' ' ? '␣' : e.key,
        dwellMs: Math.max(0, Math.min(500, dwellMs)),
        flightMs: Math.max(0, Math.min(1000, flightMs)),
        timestamp: now,
      };
      setEvents(prev => [...prev.slice(-100), ev]);
    }
  }, []);

  const handleClear = () => {
    setEvents([]);
    setInputValue('');
    lastKeyUpTime.current = 0;
    keyDownTimes.current.clear();
    setPromptIdx(i => (i + 1) % SAMPLE_PROMPTS.length);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const profile = analyzeProfile(events);
  const obfProfile = obfuscated ? analyzeProfile(obfuscateEvents(events)) : null;
  const activeProfile = obfProfile ?? profile;

  // Identifiability score: inverse of rhythmScore after obf
  const identifiabilityRaw = events.length > 5 ? Math.max(0, 1 - profile.rhythmScore) : 0;
  const identifiabilityObf = obfProfile ? Math.max(0, 1 - obfProfile.rhythmScore * 3.5) : null;
  const activeIdentifiability = identifiabilityObf ?? identifiabilityRaw;

  const identLevel = (val: number) =>
    val > 0.7 ? { label: 'HIGH RISK', color: 'hsla(0, 75%, 60%, 0.9)' }
    : val > 0.4 ? { label: 'MODERATE', color: 'hsla(38, 95%, 55%, 0.9)' }
    : val > 0.1 ? { label: 'LOW', color: 'hsla(142, 71%, 45%, 0.9)' }
    : { label: 'PROTECTED', color: 'hsla(142, 71%, 55%, 1)' };

  const riskInfo = identLevel(activeIdentifiability);

  return (
    <section id="keystroke" ref={ref} className="py-32 px-6 border-t border-white/5 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/10 rounded-full gradient-blob pointer-events-none" />

      <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 border border-secondary/30 text-[9px] font-mono text-secondary uppercase tracking-[0.4em] bg-secondary/5">
              Lab Exhibit 04
            </div>
            <h2 className="text-5xl md:text-6xl font-black font-mono tracking-tighter uppercase italic leading-none">
              KEYSTROKE <span className="text-primary not-italic block mt-2">DYNAMICS<span className="text-white opacity-20"> ANALYZER</span></span>
            </h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] max-w-md leading-relaxed">
              Type anything — we measure dwell time and flight time in real milliseconds. Your rhythm is your identity.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleClear}
              className="text-[9px] font-mono px-4 py-2 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all uppercase tracking-widest"
            >
              Clear / Next Prompt
            </button>
            <button
              onClick={() => setObfuscated(o => !o)}
              className={`text-[9px] font-mono px-5 py-2 border transition-all duration-500 uppercase tracking-widest font-bold ${
                obfuscated
                  ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                  : 'bg-transparent border-primary/40 text-primary/60 hover:text-primary hover:border-primary'
              }`}
            >
              {obfuscated ? 'Keystroke Jitter: ON' : 'Keystroke Jitter: OFF'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Left: Input + Chart */}
          <div className="md:col-span-2 space-y-4">

            {/* Prompt */}
            <div className="glass-panel p-4 border-white/5">
              <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-2">Type this phrase:</div>
              <div className="text-sm font-mono text-white/60 italic tracking-wide">
                "{SAMPLE_PROMPTS[promptIdx]}"
              </div>
            </div>

            {/* Input Field */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                placeholder="Start typing here..."
                className={`w-full bg-black p-4 font-mono text-sm outline-none transition-all duration-300 tracking-wider uppercase placeholder:opacity-20 border ${
                  obfuscated
                    ? 'border-primary/40 text-primary focus:border-primary focus:shadow-[0_0_15px_rgba(0,255,65,0.1)]'
                    : 'border-red-500/20 text-white/80 focus:border-red-500/40'
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[8px] font-mono text-white/20">{events.length} keystrokes</span>
                <div className={`w-1.5 h-1.5 rounded-full ${obfuscated ? 'bg-primary animate-pulse' : 'bg-red-500/60'}`} />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="glass-panel border-white/5 overflow-hidden">
              <div className="p-3 border-b border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  Keystroke Timing Pattern
                </span>
                <div className="flex gap-4 text-[8px] font-mono">
                  <span className="text-primary/60">■ Dwell (ms)</span>
                  <span className="text-secondary/60">■ Flight (ms)</span>
                </div>
              </div>
              <div className="h-40 p-2">
                <BarChart events={events} obfuscated={obfuscated} />
              </div>
            </div>

            {/* Recent Keys */}
            <div className="glass-panel p-4 border-white/5">
              <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-3">Recent Keystrokes</div>
              <div className="flex flex-wrap gap-1">
                {(obfuscated ? obfuscateEvents(events) : events).slice(-30).map((e, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center px-1.5 py-1 border border-white/5 bg-white/[0.02]"
                    title={`Dwell: ${e.dwellMs.toFixed(0)}ms / Flight: ${e.flightMs.toFixed(0)}ms`}
                  >
                    <span className="text-[9px] font-mono text-white/60">{e.key}</span>
                    <span
                      className="text-[7px] font-mono"
                      style={{ color: obfuscated ? 'hsla(142, 71%, 45%, 0.6)' : 'hsla(0, 75%, 60%, 0.6)' }}
                    >
                      {e.dwellMs.toFixed(0)}
                    </span>
                  </div>
                ))}
                {events.length === 0 && (
                  <span className="text-[9px] font-mono text-white/20 italic">awaiting input...</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Stats Panel */}
          <div className="space-y-4">

            {/* Identifiability Risk */}
            <div className="glass-panel p-6 border-white/5 relative overflow-hidden">
              <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-4">Identifiability Risk</div>
              <div className="text-5xl font-mono font-black tracking-tight mb-2" style={{ color: riskInfo.color }}>
                {events.length > 5 ? `${(activeIdentifiability * 100).toFixed(0)}%` : '--'}
              </div>
              <div
                className="text-[9px] font-mono uppercase tracking-widest font-bold mb-4"
                style={{ color: riskInfo.color }}
              >
                {events.length > 5 ? riskInfo.label : 'AWAITING DATA'}
              </div>

              {/* Risk Bar */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${events.length > 5 ? activeIdentifiability * 100 : 0}%`,
                    background: riskInfo.color,
                    boxShadow: `0 0 6px ${riskInfo.color}`,
                  }}
                />
              </div>

              {obfuscated && events.length > 5 && (
                <div className="text-[8px] font-mono text-primary/50 uppercase">
                  Jitter reduction: {((1 - activeIdentifiability / Math.max(0.01, identifiabilityRaw)) * 100).toFixed(0)}%
                </div>
              )}
            </div>

            {/* Metrics */}
            {[
              { label: 'WPM', value: activeProfile.wpm > 0 ? `${activeProfile.wpm}` : '--', sub: 'words per minute' },
              { label: 'Avg Dwell', value: activeProfile.avgDwell > 0 ? `${activeProfile.avgDwell.toFixed(0)}ms` : '--', sub: 'key hold duration' },
              { label: 'Avg Flight', value: activeProfile.avgFlight > 0 ? `${activeProfile.avgFlight.toFixed(0)}ms` : '--', sub: 'inter-key interval' },
              { label: 'σ Dwell', value: activeProfile.stdDwell > 0 ? `${activeProfile.stdDwell.toFixed(0)}ms` : '--', sub: 'timing variability' },
              { label: 'σ Flight', value: activeProfile.stdFlight > 0 ? `${activeProfile.stdFlight.toFixed(0)}ms` : '--', sub: 'rhythm entropy' },
            ].map(m => (
              <div key={m.label} className="glass-panel p-4 border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{m.label}</div>
                    <div className="text-xl font-mono font-black text-white/80 mt-1">{m.value}</div>
                    <div className="text-[7px] font-mono text-white/20 mt-0.5 uppercase">{m.sub}</div>
                  </div>
                  {obfuscated && (
                    <div className="text-[7px] font-mono text-primary/40 mt-1 uppercase">jittered</div>
                  )}
                </div>
              </div>
            ))}

            <div className="text-[7px] font-mono text-white/15 uppercase tracking-[0.2em] leading-loose px-1">
              [REF: TYPING DNA // BEHAVIOSEC // NEUROTYPE-2026] <br />
              Standard: TypingDNA EER &lt;1% on 30+ chars <br />
              Status: <span className="text-primary/40">{obfuscated ? 'Jitter active' : 'Monitoring'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeystrokeDynamics;
