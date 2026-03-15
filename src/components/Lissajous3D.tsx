import React, { useEffect, useRef, useState, useCallback } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { ShieldAlert, ShieldCheck, Link2Off } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  t: number;
}

export default function Lissajous3D() {
  const engine = engineRegistry.find(e => e.id === 'lissajous-3d')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  
  const realCanvasRef = useRef<HTMLCanvasElement>(null);
  const obfCanvasRef = useRef<HTMLCanvasElement>(null);
  const [realPoints, setRealPoints] = useState<Point[]>([]);
  const tRef = useRef(0);
  const [entropy, setEntropy] = useState(0);

  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mock data generation
  useEffect(() => {
    if (dataMode === 'mock') {
      let angle = 0;
      mockIntervalRef.current = setInterval(() => {
        angle += 0.05;
        const x = 150 + Math.cos(angle * 2) * 100 + Math.sin(angle * 3) * 30;
        const y = 80 + Math.sin(angle * 1.5) * 50 + Math.cos(angle * 4) * 20;
        const now = Date.now();
        setRealPoints(prev => [...prev.slice(-300), { x, y, t: now }]);
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

  // Draw Raw Movement
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
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      const vel = Math.sqrt(dx * dx + dy * dy);
      const age = (realPoints.length - i) / realPoints.length;
      const alpha = 0.15 + (1 - age) * 0.8;
      const hue = Math.max(0, Math.min(200, 200 - vel * 5));

      ctx.beginPath();
      // Baseline shows high confidence tracking, sharp edges
      ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${alpha})`;
      ctx.lineWidth = 1.5 + vel * 0.08;
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

  // Draw Obfuscated Movement
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

    tRef.current += 0.02;

    const obfPoints: { x: number; y: number }[] = [];
    realPoints.forEach((p, i) => {
      if (isEngineActive) {
        const lissX = Math.sin(3 * (i * 0.05) + tRef.current) * 20;
        const lissY = Math.sin(4 * (i * 0.05)) * 15;
        const tremor = Math.sin(i * 0.3 + tRef.current * 5) * 8;
        const noise = (Math.random() * 2 - 1) * 3;
        obfPoints.push({
          x: p.x + tremor + lissX + noise,
          y: p.y + tremor * 0.7 + lissY + noise,
        });
      } else {
        obfPoints.push({ x: p.x, y: p.y });
      }
    });

    for (let i = 1; i < obfPoints.length; i++) {
      const age = (obfPoints.length - i) / obfPoints.length;
      const alpha = isEngineActive ? 0.2 + (1 - age) * 0.6 : 0.15 + (1 - age) * 0.8;
      
      ctx.beginPath();
      if (isEngineActive) {
        ctx.strokeStyle = `hsla(74, 100%, 50%, ${alpha})`;
        ctx.lineWidth = 2;
      } else {
        const p = realPoints[i];
        const prev = realPoints[i - 1];
        const vel = Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
        const hue = Math.max(0, Math.min(200, 200 - vel * 5));
        ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${alpha})`;
        ctx.lineWidth = 1.5 + vel * 0.08;
      }
      ctx.moveTo(obfPoints[i - 1].x, obfPoints[i - 1].y);
      ctx.lineTo(obfPoints[i].x, obfPoints[i].y);
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

    if (realPoints.length > 10) {
      const targetEntropy = isEngineActive ? 3.2 + Math.sin(tRef.current) * 0.2 : 0.8 + Math.random() * 0.2;
      setEntropy(prev => prev + (targetEntropy - prev) * 0.05);
    }
  }, [realPoints, isEngineActive]);

  const inputPanel = (
    <div 
      className="w-full h-full min-h-[300px] flex items-center justify-center cursor-crosshair relative"
      onMouseMove={addPoint}
    >
      <div className="absolute inset-0 pointer-events-none grid-bg opacity-20" />
      {dataMode === 'live' && realPoints.length < 2 && (
        <p className="text-white/30 font-mono text-sm uppercase tracking-widest text-center">Move cursor here<br/>to generate telemetry</p>
      )}
      {dataMode === 'mock' && (
        <p className="text-white/30 font-mono text-sm uppercase tracking-widest text-center absolute bottom-4">Mock Generator Active</p>
      )}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-mono opacity-50">
         <span>Rate:</span>
         <span className="text-white">120Hz</span>
      </div>
    </div>
  );

  const baselinePanel = (
    <div className="w-full h-full min-h-[300px] relative">
      <canvas ref={realCanvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );

  const activePanel = (
    <div className="w-full h-full min-h-[300px] relative">
      <canvas ref={obfCanvasRef} className="absolute inset-0 w-full h-full" />
      {isEngineActive && (
        <div className="absolute top-4 right-4 text-[10px] font-mono text-[#BFFF00] border border-[#BFFF00]/30 px-2 py-1 bg-[#BFFF00]/10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#BFFF00] animate-pulse rounded-full" />
          KINEMATIC INJECTION
        </div>
      )}
    </div>
  );

  const metricPanel = (
    <div className="flex flex-col h-full justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="text-6xl font-display text-white tabular-nums tracking-tighter">
            {entropy.toFixed(2)}
          </div>
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">nats (Shannon Entropy)</div>
        </div>
        {isEngineActive && (
          <div className="text-right">
            <div className="text-2xl font-mono text-[#BFFF00]">+2.40</div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Delta</div>
          </div>
        )}
      </div>
      
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
         <div 
           className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-[#BFFF00] transition-all duration-300"
           style={{ width: `${Math.min(100, (entropy / 4) * 100)}%` }}
         />
         <div className="absolute top-0 bottom-0 left-[60%] w-px bg-white/50" />
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-white/30 uppercase tracking-widest">
         <span>Predictable</span>
         <span>Threshold</span>
         <span>Obfuscated</span>
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
            {isEngineActive ? 'Kinematics Masked' : 'Identity Exposed'}
          </h4>
          <p className="text-sm font-mono text-white/60 leading-relaxed">
            {isEngineActive 
              ? 'Lissajous curves and tremor injection successfully break correlation between raw motor intent and recorded telemetry. Biometric fingerprinting is neutralized.'
              : 'Raw cursor trajectories exhibit highly idiosyncratic micro-tremors and flight times, allowing high-confidence user identification.'}
          </p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider mb-1">Fingerprint Confidence</div>
          <div className={`text-lg font-mono ${isEngineActive ? 'text-[#BFFF00]' : 'text-red-500'}`}>
            {isEngineActive ? '< 12%' : '> 94%'}
          </div>
        </div>
        <div>
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider mb-1">Re-identification Risk</div>
          <div className={`text-lg font-mono ${isEngineActive ? 'text-[#BFFF00]' : 'text-red-500'}`}>
            {isEngineActive ? 'LOW' : 'CRITICAL'}
          </div>
        </div>
      </div>
    </>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 h-full backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Link2Off className="w-4 h-4" />
        De-correlation Mechanics
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        The system intercepts DOM mouse events and applies a continuous noise field before passing the coordinates to the underlying application. By stacking low-frequency Lissajous drift with high-frequency pink noise, we destroy the specific frequency bands used by behavioral biometric classifiers.
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
