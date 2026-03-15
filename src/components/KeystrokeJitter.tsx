import React, { useState, useEffect, useRef, useCallback } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { ShieldAlert, ShieldCheck, Keyboard } from 'lucide-react';

interface KeyEvent {
  key: string;
  dwellMs: number;
  flightMs: number;
  timestamp: number;
}

interface TypingProfile {
  wpm: number;
  avgDwell: number;
  avgFlight: number;
  stdDwell: number;
  stdFlight: number;
  rhythmScore: number;
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

function analyzeProfile(events: KeyEvent[]): TypingProfile {
  if (events.length === 0) return { wpm: 0, avgDwell: 0, avgFlight: 0, stdDwell: 0, stdFlight: 0, rhythmScore: 0 };
  const dwells = events.map(e => e.dwellMs).filter(d => d > 0 && d < 500);
  const flights = events.map(e => e.flightMs).filter(f => f > 0 && f < 1000);

  const avgDwell = dwells.length ? dwells.reduce((a, b) => a + b, 0) / dwells.length : 0;
  const avgFlight = flights.length ? flights.reduce((a, b) => a + b, 0) / flights.length : 0;
  const sdDwell = stddev(dwells);
  const sdFlight = stddev(flights);

  const rhythmScore = Math.min(1, (sdDwell / Math.max(1, avgDwell) + sdFlight / Math.max(1, avgFlight)) / 2);

  const totalTime = events.length > 1
    ? (events[events.length - 1].timestamp - events[0].timestamp) / 60000
    : 0;
  const wpm = totalTime > 0 ? Math.round((events.length / 5) / totalTime) : 0;

  return { wpm, avgDwell, avgFlight, stdDwell: sdDwell, stdFlight: sdFlight, rhythmScore };
}

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
  maxEvents = 30,
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
      ctx.fillStyle = 'hsla(0, 0%, 100%, 0.2)';
      ctx.font = '10px "Geist Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('AWAITING KEYSTROKE DATA', W / 2, H / 2);
      return;
    }

    const maxDwell = Math.max(...recent.map(e => e.dwellMs), 200);
    const maxFlight = Math.max(...recent.map(e => e.flightMs), 200);
    const barW = Math.max(3, (W - 20) / maxEvents);
    const padding = 24;

    ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.05)';
    ctx.lineWidth = 0.5;
    for (let row = 0; row <= 4; row++) {
      const y = padding + (row / 4) * (H - padding * 2);
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(W - 10, y);
      ctx.stroke();
    }

    ctx.fillStyle = 'hsla(0, 0%, 100%, 0.3)';
    ctx.font = '8px "Geist Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('DWELL', 12, padding - 8);
    ctx.fillText('FLIGHT', 12 + 50, padding - 8);

    recent.forEach((e, i) => {
      const x = 10 + i * barW;
      const dwellH = ((e.dwellMs / maxDwell) * (H - padding * 2)) * 0.85;
      const flightH = ((e.flightMs / maxFlight) * (H - padding * 2)) * 0.65;

      const dwellColor = obfuscated
        ? `hsla(74, 100%, ${35 + Math.random() * 20}%, 0.8)`
        : `hsla(0, 84%, 60%, 0.8)`;
      ctx.fillStyle = dwellColor;
      ctx.fillRect(x, H - padding - dwellH, barW * 0.45, dwellH);

      const flightColor = obfuscated
        ? `hsla(74, 100%, ${20 + Math.random() * 20}%, 0.5)`
        : `hsla(0, 84%, 40%, 0.5)`;
      ctx.fillStyle = flightColor;
      ctx.fillRect(x + barW * 0.5, H - padding - flightH, barW * 0.35, flightH);
    });

    if (recent.length > 0) {
      const last = recent[recent.length - 1];
      const x = 10 + (recent.length - 1) * barW;
      const dwellH = ((last.dwellMs / maxDwell) * (H - padding * 2)) * 0.85;
      ctx.shadowColor = obfuscated ? '#BFFF00' : '#ff4444';
      ctx.shadowBlur = 10;
      ctx.fillStyle = obfuscated ? '#BFFF00' : '#ff4444';
      ctx.fillRect(x, H - padding - dwellH, barW * 0.5, dwellH);
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, H - padding);
    ctx.lineTo(W - 10, H - padding);
    ctx.stroke();

  }, [events, obfuscated, maxEvents]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default function KeystrokeJitter() {
  const engine = engineRegistry.find(e => e.id === 'keystroke-jitter')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  
  const [events, setEvents] = useState<KeyEvent[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  
  const keyDownTimes = useRef<Map<string, number>>(new Map());
  const lastKeyUpTime = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (dataMode === 'mock') {
      const mockPhrase = "simulated typing pattern establishing baseline sequence...";
      let charIdx = 0;
      let now = performance.now();
      
      mockIntervalRef.current = setInterval(() => {
        if (charIdx >= mockPhrase.length) {
          charIdx = 0;
          setEvents([]); // Reset phrase
        }
        
        const key = mockPhrase[charIdx];
        const dwell = 80 + Math.random() * 60; // Human-like dwell
        const flight = 120 + Math.random() * 80; // Human-like flight
        
        const ev: KeyEvent = {
          key: key === ' ' ? '␣' : key,
          dwellMs: dwell,
          flightMs: flight,
          timestamp: now,
        };
        
        now += (dwell + flight);
        setEvents(prev => [...prev.slice(-100), ev]);
        charIdx++;
      }, 250); // Speed of mock typing
    } else {
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
      setEvents([]);
      setInputValue('');
    }
    return () => {
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
    };
  }, [dataMode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (dataMode === 'mock') return;
    const now = performance.now();
    keyDownTimes.current.set(e.key, now);
  }, [dataMode]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (dataMode === 'mock') return;
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
  }, [dataMode]);

  const handleClear = () => {
    if (dataMode === 'mock') return;
    setEvents([]);
    setInputValue('');
    lastKeyUpTime.current = 0;
    keyDownTimes.current.clear();
    setPromptIdx(i => (i + 1) % SAMPLE_PROMPTS.length);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const profile = analyzeProfile(events);
  const obfProfile = isEngineActive ? analyzeProfile(obfuscateEvents(events)) : null;

  const identifiabilityRaw = events.length > 5 ? Math.max(0, 1 - profile.rhythmScore) : 0;
  const identifiabilityObf = obfProfile ? Math.max(0, 1 - obfProfile.rhythmScore * 3.5) : null;
  const activeIdentifiability = identifiabilityObf ?? identifiabilityRaw;

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2">
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex justify-between items-end">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest hidden lg:block">Phrase prompt:</div>
          <button onClick={handleClear} className="text-[9px] font-mono px-3 py-1 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest bg-black/50 ml-auto">
            Reset Data
          </button>
        </div>
        
        {dataMode === 'live' ? (
          <div>
            <div className="text-lg font-mono text-white/60 tracking-wider mb-4 h-8">
              "{SAMPLE_PROMPTS[promptIdx]}"
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              placeholder="Start typing above phrase..."
              className="w-full bg-black/50 border border-white/20 p-4 font-mono text-xl outline-none focus:border-[#BFFF00] transition-colors placeholder:text-white/20 uppercase tracking-wider text-white"
            />
          </div>
        ) : (
          <div className="p-6 border border-white/10 bg-black text-center">
             <div className="text-xl font-mono text-white/50 mb-2 min-h-[60px] flex items-center justify-center uppercase tracking-widest">
               {events.map((e, i) => (
                 <span key={i} className="animate-fade-in-up">{e.key}</span>
               )).slice(-25)}
               <span className="animate-pulse bg-[#BFFF00] w-2 h-6 ml-1 inline-block" />
             </div>
             <div className="text-[10px] font-mono text-[#BFFF00] tracking-widest uppercase">Mock Engine Typing</div>
          </div>
        )}
      </div>
    </div>
  );

  const baselinePanel = (
    <BarChart events={events} obfuscated={false} />
  );

  const activePanel = (
    <>
      <BarChart events={events} obfuscated={isEngineActive} />
      {isEngineActive && (
        <div className="absolute top-4 right-4 text-[10px] font-mono text-[#BFFF00] border border-[#BFFF00]/30 px-2 py-1 bg-[#BFFF00]/10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#BFFF00] animate-pulse rounded-full" />
          TIMING PERTURBATION
        </div>
      )}
    </>
  );

  const metricPanel = (
    <div className="flex flex-col h-full justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="flex items-end gap-2">
            <div className={`text-6xl font-display tabular-nums tracking-tighter ${activeIdentifiability > 0.4 ? 'text-red-500' : 'text-[#BFFF00]'}`}>
                {events.length > 5 ? (activeIdentifiability * 100).toFixed(1) : '--'}
            </div>
            <div className={`text-3xl font-display mb-1 ${activeIdentifiability > 0.4 ? 'text-red-500' : 'text-[#BFFF00]'}`}>%</div>
          </div>
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">Identity Confidence</div>
        </div>
      </div>
      
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
         <div 
           className={`h-full transition-all duration-500 ${activeIdentifiability > 0.4 ? 'bg-red-500' : 'bg-[#BFFF00]'}`}
           style={{ width: `${events.length > 5 ? activeIdentifiability * 100 : 0}%` }}
         />
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-white/30 uppercase tracking-widest">
         <span>Protected ({'<'}30%)</span>
         <span>Identifiable</span>
      </div>
    </div>
  );

  const verdictPanel = (
    <>
      <div className="flex items-start gap-4">
        {isEngineActive ? (
          <ShieldCheck className="w-10 h-10 text-[#BFFF00] shrink-0" />
        ) : (
          <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
        )}
        <div>
          <h4 className="text-xl font-display uppercase tracking-widest mb-2">
            {isEngineActive ? 'Typing Cadence Cloaked' : 'Identity Correlated'}
          </h4>
          <p className="text-sm font-mono text-white/60 leading-relaxed">
            {isEngineActive 
              ? 'By buffering and micro-delaying key release events (flight times), the resulting cadence appears statistically unstructured to behavioral classifiers, without noticeable latency to the user.'
              : 'Dwell and flight times are incredibly stable within users. The raw timing signature establishes a 99% accuracy biometric profile within 40 characters.'}
          </p>
        </div>
      </div>
    </>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 h-full backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Keyboard className="w-4 h-4" />
        Recent Flight & Dwell
      </h4>
      <div className="flex flex-wrap gap-1 mt-4 h-[120px] overflow-hidden">
        {(isEngineActive ? obfuscateEvents(events) : events).slice(-24).map((e, i) => (
          <div key={i} className="flex flex-col items-center px-1.5 py-1 border border-white/5 bg-white/[0.02]">
            <span className="text-[9px] font-mono text-white/60">{e.key}</span>
            <span className={`text-[7px] font-mono ${isEngineActive ? 'text-[#BFFF00]' : 'text-red-500'}`}>
              {e.dwellMs.toFixed(0)}
            </span>
          </div>
        ))}
        {events.length === 0 && <span className="text-[9px] font-mono text-white/20 italic">AWAITING INPUT...</span>}
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
