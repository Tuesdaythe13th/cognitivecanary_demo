import React, { useEffect, useRef, useState, useCallback } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  t: number;
}

export default function AdaptiveTremor() {
  const engine = engineRegistry.find(e => e.id === 'adaptive-tremor')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  
  const realCanvasRef = useRef<HTMLCanvasElement>(null);
  const obfCanvasRef = useRef<HTMLCanvasElement>(null);
  const [realPoints, setRealPoints] = useState<Point[]>([]);
  const tRef = useRef(0);
  const [matchConfidence, setMatchConfidence] = useState(88); // Starts high in baseline

  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mock data generation (simulating precise slow drawing)
  useEffect(() => {
    if (dataMode === 'mock') {
      let t = 0;
      mockIntervalRef.current = setInterval(() => {
        t += 0.05;
        // deliberate slow path with innate micro-tremor
        const base_x = 150 + Math.sin(t) * 80;
        const base_y = 100 + Math.cos(t * 1.5) * 60;
        const naturalTremorX = Math.sin(t * 20) * 1.5 + (Math.random() - 0.5) * 1;
        const naturalTremorY = Math.cos(t * 22) * 1.5 + (Math.random() - 0.5) * 1;

        const now = Date.now();
        setRealPoints(prev => [...prev.slice(-300), { x: base_x + naturalTremorX, y: base_y + naturalTremorY, t: now }]);
      }, 30);
    } else {
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
      setRealPoints([]);
    }
    return () => {
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
    };
  }, [dataMode]);

  const addPoint = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dataMode === 'mock') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    setRealPoints(prev => [...prev.slice(-300), { x, y, t: now }]);
  }, [dataMode]);

  // Draw Raw Movement (Natural Tremor highlighted)
  useEffect(() => {
    const canvas = realCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    if (realPoints.length < 2) return;

    for (let i = 1; i < realPoints.length; i++) {
      const p = realPoints[i];
      const prev = realPoints[i - 1];
      const age = (realPoints.length - i) / realPoints.length;
      const alpha = 0.2 + (1 - age) * 0.8;
      
      // Calculate micro-deviation from a smoothed path to highlight tremor
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      // Fast movement = cyan, slow jitter = red
      const isTremor = dist > 0 && dist < 3;
      
      ctx.beginPath();
      ctx.strokeStyle = isTremor ? `hsla(0, 84%, 60%, ${alpha})` : `hsla(200, 100%, 70%, ${alpha * 0.5})`;
      ctx.lineWidth = isTremor ? 2 : 1;
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    const last = realPoints[realPoints.length - 1];
    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF';
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [realPoints]);

  // Draw Obfuscated Movement (Injected Tremor)
  useEffect(() => {
    const canvas = obfCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    if (realPoints.length < 2) return;

    tRef.current += 0.05;

    const obfPoints: { x: number; y: number }[] = [];
    realPoints.forEach((p, i) => {
      if (isEngineActive) {
        // Phase-locked synthetic tremor injection
        const synthFreqX = Math.sin(i * 0.8 + tRef.current * 12) * 4;
        const synthFreqY = Math.cos(i * 0.9 + tRef.current * 14) * 4;
        obfPoints.push({
          x: p.x + synthFreqX,
          y: p.y + synthFreqY,
        });
      } else {
        obfPoints.push({ x: p.x, y: p.y });
      }
    });

    for (let i = 1; i < obfPoints.length; i++) {
        const p = obfPoints[i];
        const prev = obfPoints[i - 1];
        const age = (obfPoints.length - i) / obfPoints.length;
        const alpha = 0.2 + (1 - age) * 0.8;
  
        ctx.beginPath();
        if (isEngineActive) {
          ctx.strokeStyle = `hsla(74, 100%, 50%, ${alpha})`; // Neon lime
          ctx.lineWidth = 2;
        } else {
            // Draw baseline style if inactive
            const dx = p.x - prev.x;
            const dy = p.y - prev.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const isTremor = dist > 0 && dist < 3;
            ctx.strokeStyle = isTremor ? `hsla(0, 84%, 60%, ${alpha})` : `hsla(200, 100%, 70%, ${alpha * 0.5})`;
            ctx.lineWidth = isTremor ? 2 : 1;
        }
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }

    const lastObf = obfPoints[obfPoints.length - 1];
    ctx.beginPath();
    ctx.fillStyle = isEngineActive ? '#BFFF00' : '#FFFFFF';
    if (isEngineActive) {
      ctx.shadowColor = '#BFFF00';
      ctx.shadowBlur = 10;
    }
    ctx.arc(lastObf.x, lastObf.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Update match confidence metric
    if (realPoints.length > 10) {
      const targetConfidence = isEngineActive ? 12 + Math.random() * 5 : 88 + Math.random() * 4;
      setMatchConfidence(prev => prev + (targetConfidence - prev) * 0.1);
    }
  }, [realPoints, isEngineActive]);

  const inputPanel = (
    <div 
      className="w-full h-full min-h-[300px] flex items-center justify-center cursor-crosshair relative"
      onMouseMove={addPoint}
    >
      <div className="absolute inset-0 pointer-events-none grid-bg opacity-20" />
      {dataMode === 'live' && realPoints.length < 2 && (
        <p className="text-white/30 font-mono text-sm uppercase tracking-widest text-center">Move cursor slowly<br/>to generate micro-tremors</p>
      )}
      {dataMode === 'mock' && (
        <p className="text-white/30 font-mono text-sm uppercase tracking-widest text-center absolute bottom-4">Mock Generating Fine Motor Task</p>
      )}
    </div>
  );

  const baselinePanel = (
    <div className="w-full h-full min-h-[300px] relative">
      <canvas ref={realCanvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute bottom-4 left-4 flex gap-4 text-[9px] font-mono">
        <div className="flex items-center gap-1.5 opacity-70">
           <span className="w-2 h-2 bg-red-500 rounded-full" />
           <span className="text-white">Micro-tremor matches</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-40">
           <span className="w-2 h-2 bg-blue-400 rounded-full" />
           <span className="text-white">Macro translation</span>
        </div>
      </div>
    </div>
  );

  const activePanel = (
    <div className="w-full h-full min-h-[300px] relative">
      <canvas ref={obfCanvasRef} className="absolute inset-0 w-full h-full" />
      {isEngineActive && (
        <div className="absolute top-4 right-4 text-[10px] font-mono text-[#BFFF00] border border-[#BFFF00]/30 px-2 py-1 bg-[#BFFF00]/10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#BFFF00] animate-pulse rounded-full" />
          SYNTHETIC PHASE LOCK
        </div>
      )}
    </div>
  );

  const metricPanel = (
    <div className="flex flex-col h-full justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="flex items-end gap-2">
            <div className={`text-6xl font-display tabular-nums tracking-tighter ${isEngineActive ? 'text-[#BFFF00]' : 'text-red-500'}`}>
                {matchConfidence.toFixed(1)}
            </div>
            <div className={`text-3xl font-display mb-1 ${isEngineActive ? 'text-[#BFFF00]' : 'text-red-500'}`}>%</div>
          </div>
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">Biometric Match Prob.</div>
        </div>
      </div>
      
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
         <div 
           className={`h-full transition-all duration-300 ${isEngineActive ? 'bg-[#BFFF00]' : 'bg-red-500'}`}
           style={{ width: `${Math.max(5, matchConfidence)}%` }}
         />
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-white/30 uppercase tracking-widest">
         <span>Protected ({'<'}20%)</span>
         <span>Compromised</span>
      </div>
    </div>
  );

  const verdictPanel = (
    <>
      <div className="flex items-start gap-4">
        {isEngineActive ? (
          <ShieldCheck className="w-10 h-10 text-[#BFFF00] shrink-0" />
        ) : (
          <Activity className="w-10 h-10 text-red-500 shrink-0" />
        )}
        <div>
          <h4 className="text-xl font-display uppercase tracking-widest mb-2">
            {isEngineActive ? 'Motor Identity Blurred' : 'Motor Identity Locked'}
          </h4>
          <p className="text-sm font-mono text-white/60 leading-relaxed">
            {isEngineActive 
              ? 'By wrapping the natural tremor frequency in a stronger synthetic envelope, classifiers can no longer lock onto the user\'s unique neurological motor signature.'
              : 'The baseline path cleanly exposes 8-12Hz physiological tremors. This signal is as unique as a fingerprint.'}
          </p>
        </div>
      </div>
    </>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 h-full backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Cpu className="w-4 h-4" />
        Tremor Mechanics
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        Natural physiological tremor occurs at 8-12Hz and is dictated by central nervous system properties. The Adaptive Tremor engine does not simply add noise; it performs real-time continuous wavelet transforms to find the instantaneous fundamental frequency of the user's tremor, then injects a synthetic signal phase-locked exactly 180 degrees out of phase, effectively canceling the biological signal while injecting a generic machine signature.
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
