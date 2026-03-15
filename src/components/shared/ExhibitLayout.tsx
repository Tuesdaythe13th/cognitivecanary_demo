import React from 'react';
import { EngineDefinition, DataMode, EngineCategory } from '../../types/engine';
import { Shield, BrainCircuit, Activity, FileText, FlaskConical, AlertTriangle } from 'lucide-react';

interface ExhibitLayoutProps {
  engine: EngineDefinition;
  dataMode: DataMode;
  onDataModeChange: (mode: DataMode) => void;
  inputPanel: React.ReactNode;
  baselinePanel: React.ReactNode;
  activePanel: React.ReactNode;
  metricPanel: React.ReactNode;
  verdictPanel: React.ReactNode;
  limitationsPanel?: React.ReactNode;
  supplementaryPanel?: React.ReactNode;
  onPrimaryAction: () => void;
  isEngineActive: boolean;
}

const categoryIcons = {
  privacy: Shield,
  neural: BrainCircuit,
  monitoring: Activity,
  governance: FileText,
  forensics: FlaskConical
};

// Neon color mappings based on aesthetic spec
const categoryColors: Record<EngineCategory, string> = {
  privacy: "text-primary border-primary bg-primary/10",
  monitoring: "text-[#00e5ff] border-[#00e5ff] bg-[#00e5ff]/10",
  neural: "text-[#b44aff] border-[#b44aff] bg-[#b44aff]/10",
  forensics: "text-amber-400 border-amber-400 bg-amber-400/10",
  governance: "text-white border-white/40 bg-white/5",
};

export default function ExhibitLayout({
  engine,
  dataMode,
  onDataModeChange,
  inputPanel,
  baselinePanel,
  activePanel,
  metricPanel,
  verdictPanel,
  limitationsPanel,
  supplementaryPanel,
  onPrimaryAction,
  isEngineActive
}: ExhibitLayoutProps) {
  const Icon = categoryIcons[engine.category];
  const colorClass = categoryColors[engine.category];

  return (
    <div className="bg-[#050505] text-white p-6 lg:p-12 font-sans relative">
      <div className="max-w-[1400px] mx-auto space-y-12 relative z-10 w-full">
        
        {/* Top Row: Meta info and controls */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/10 pb-8">
          <div className="space-y-4">
             <div className="flex items-center gap-3 flex-wrap">
               <span className="text-display text-4xl text-white/20 leading-none">
                 {engine.index.toString().padStart(2, '0')}
               </span>
               <h1 className="text-display text-4xl leading-none">{engine.title}</h1>
               <div className={`px-2 py-0.5 border text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5 ml-2 ${colorClass}`}>
                 <Icon className="w-3 h-3" />
                 {engine.category}
               </div>
               {engine.status === 'prototype' && (
                 <span className="px-2 py-0.5 bg-destructive/20 text-destructive border border-destructive/30 text-[9px] font-mono uppercase tracking-widest">Prototype</span>
               )}
               <span className="text-[10px] font-mono text-white/40">{engine.fileName}</span>
             </div>
             <p className="text-body max-w-2xl text-white/60 leading-relaxed text-sm">
               {engine.shortDescription}
             </p>
          </div>

          <div className="flex bg-[#050505] border border-white/20 p-1">
             <button
               onClick={() => onDataModeChange('mock')}
               className={`px-6 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-all ${dataMode === 'mock' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white/80'}`}
             >
               Mock Data
             </button>
             <button
               disabled={!engine.supportsLiveMode}
               onClick={() => engine.supportsLiveMode && onDataModeChange('live')}
               className={`px-6 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-all flex border-l border-white/10 items-center gap-2 ${!engine.supportsLiveMode ? 'opacity-30 cursor-not-allowed' : ''} ${dataMode === 'live' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white/80'}`}
             >
               {dataMode === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
               Live Telemetry
             </button>
          </div>
        </header>

        {/* Middle Row: The Grammar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Input Panel */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
            <h3 className="text-mono text-[10px] text-white/40 border-b border-white/10 pb-2">01 / {engine.inputLabel}</h3>
            <div className="flex-1 border border-white/10 bg-black/40 backdrop-blur-md p-4 relative min-h-[300px]">
              {inputPanel}
            </div>
          </div>

          {/* Baseline Panel */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
            <h3 className="text-mono text-[10px] text-white/40 border-b border-white/10 pb-2">02 / {engine.baselineSpec.title}</h3>
            <div className={`flex-1 border p-4 transition-all duration-500 backdrop-blur-md relative overflow-hidden min-h-[300px] ${!isEngineActive ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-black/40 opacity-50 grayscale'}`}>
              <div className="absolute top-4 left-4 z-10 text-[10px] bg-black/70 px-2 py-1 font-mono text-white tracking-wider border border-white/10 backdrop-blur-md max-w-[80%] leading-relaxed">{engine.baselineSpec.description}</div>
              {baselinePanel}
            </div>
          </div>

          {/* Active Panel */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
            <h3 className="text-mono text-[10px] text-white/40 border-b border-white/10 pb-2">03 / {engine.activeSpec.title}</h3>
            <div className={`flex-1 border p-4 transition-all duration-500 backdrop-blur-md relative overflow-hidden min-h-[300px] ${isEngineActive ? `border-primary/50 bg-primary/5 shadow-[0_0_30px_rgba(191,255,0,0.15)]` : 'border-white/10 bg-black/40 opacity-50 grayscale'}`}>
              <div className="absolute top-4 left-4 z-10 text-[10px] bg-black/70 px-2 py-1 font-mono text-white tracking-wider border border-white/10 backdrop-blur-md max-w-[80%] leading-relaxed">{engine.activeSpec.description}</div>
              {activePanel}
            </div>
          </div>

          {/* Metric + Verdict Stack */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
             {/* CTA Array */}
             <button
               onClick={onPrimaryAction}
               className={`w-full py-6 flex items-center justify-center gap-3 text-mono font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] ${isEngineActive ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-primary text-black shadow-[0_0_20px_rgba(191,255,0,0.3)] hover:shadow-[0_0_30px_rgba(191,255,0,0.5)]'}`}
             >
               {isEngineActive ? 'Engine Active' : engine.cta.label}
             </button>

             {/* Metric View */}
             <div className="flex-1 border border-white/10 bg-black/40 p-6 flex flex-col relative overflow-hidden group">
               <h3 className="text-mono text-[10px] text-white/40 mb-4 border-b border-white/10 pb-2">04 / {engine.metricLabel}</h3>
               {metricPanel}
             </div>

             {/* Verdict View */}
             <div className={`border p-6 flex flex-col justify-center gap-4 ${isEngineActive ? 'border-primary/40 bg-primary/10' : 'border-white/10 bg-white/5'}`}>
               <h3 className="text-mono text-[10px] text-white/40 border-b border-white/10 pb-2">05 / {engine.verdictLabel}</h3>
               {verdictPanel}
             </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-12 border-t border-white/10 mt-12 block">
           <div className="col-span-1 lg:col-span-2 space-y-4">
             {supplementaryPanel}
           </div>
           
           <div className="col-span-1 border border-destructive/20 bg-destructive/5 p-6 h-fit bg-black/60 backdrop-blur-md">
             {limitationsPanel || (
               <>
                 <h4 className="text-[10px] font-mono text-destructive uppercase tracking-widest mb-3 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4" />
                   Architectural Limitation
                 </h4>
                 <p className="text-xs font-mono text-destructive/80 leading-relaxed">
                   {engine.limitations}
                 </p>
               </>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}
