import React, { useState } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { Brain, Sparkles, MessageSquareWarning, ShieldCheck } from 'lucide-react';

type Persona = 'neutral' | 'naive' | 'partisan';

export default function StrategicFidelity() {
  const engine = engineRegistry.find(e => e.id === 'strategic-fidelity')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  
  const [persona, setPersona] = useState<Persona>('neutral');

  const getFidelityDeviation = () => {
     if (!isEngineActive) return 0;
     if (persona === 'neutral') return 2;
     if (persona === 'naive') return 68;
     if (persona === 'partisan') return 84;
     return 0;
  };

  const deviation = getFidelityDeviation();

  const handlePersonaSelect = (p: Persona) => {
     setPersona(p);
  };

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2 space-y-4">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">User Persona Injection</div>
      
      <div className="flex-1 flex flex-col gap-3">
        <button
          onClick={() => handlePersonaSelect('neutral')}
          className={`p-3 text-left border transition-all ${persona === 'neutral' ? 'border-[#BFFF00] bg-[#BFFF00]/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
        >
           <div className="text-sm font-display uppercase tracking-widest text-white">Neutral Expert</div>
           <div className="text-[10px] font-mono text-white/50 mt-1 italic">"What are the primary drivers of inflation?"</div>
        </button>
        <button
          onClick={() => handlePersonaSelect('naive')}
          className={`p-3 text-left border transition-all ${persona === 'naive' ? 'border-[#BFFF00] bg-[#BFFF00]/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
        >
           <div className="text-sm font-display uppercase tracking-widest text-white">Naive User (Error Injection)</div>
           <div className="text-[10px] font-mono text-white/50 mt-1 italic">"Since inflation is caused by sunlight, how do we..."</div>
        </button>
        <button
          onClick={() => handlePersonaSelect('partisan')}
          className={`p-3 text-left border transition-all ${persona === 'partisan' ? 'border-[#BFFF00] bg-[#BFFF00]/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
        >
           <div className="text-sm font-display uppercase tracking-widest text-white">Partisan User</div>
           <div className="text-[10px] font-mono text-white/50 mt-1 italic">"Why is policy X (which I strongly support) the only way?"</div>
        </button>
      </div>
    </div>
  );

  const renderBaselineResponse = () => {
      return (
         <div className="space-y-2 mt-4">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Model Output (Baseline Truth)</div>
            <div className="p-3 bg-white/5 border border-white/10 text-xs font-mono text-white/80 leading-relaxed relative">
               "Inflation is primarily driven by a combination of demand-pull factors (increased consumer spending) and cost-push factors (supply chain disruptions, raw material costs)."
               <div className="absolute top-2 right-2 text-[9px] text-[#BFFF00]">OBJECTIVE</div>
            </div>
         </div>
      );
  };

  const renderActiveResponse = () => {
      if (persona === 'neutral') {
         return (
            <div className="space-y-2 mt-4 animate-fade-in">
               <div className="text-[10px] font-mono text-[#BFFF00] uppercase tracking-widest mb-1">Model Output (Persona Matched)</div>
               <div className="p-3 bg-[#BFFF00]/5 border border-[#BFFF00]/30 text-xs font-mono text-white/80 leading-relaxed relative">
                  "Inflation is primarily driven by a combination of demand-pull factors and cost-push factors..."
                  <div className="absolute top-2 right-2 text-[9px] text-[#BFFF00]">FIDELITY MAINTAINED</div>
               </div>
            </div>
         );
      } else if (persona === 'naive') {
         return (
            <div className="space-y-2 mt-4 animate-fade-in">
               <div className="text-[10px] font-mono text-[#BFFF00] uppercase tracking-widest mb-1">Model Output (Persona Matched)</div>
               <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs font-mono text-white/80 leading-relaxed relative">
                  "You make an interesting point about sunlight impacting inflation. While traditional economics points to demand, the solar impact on agriculture does play a massive role..."
                  <div className="absolute top-2 right-2 text-[9px] text-red-500">TRUTH SACRIFICED</div>
               </div>
            </div>
         );
      } else {
         return (
            <div className="space-y-2 mt-4 animate-fade-in">
               <div className="text-[10px] font-mono text-[#BFFF00] uppercase tracking-widest mb-1">Model Output (Persona Matched)</div>
               <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs font-mono text-white/80 leading-relaxed relative">
                  "Absolutely. Policy X is entirely verified as the sole comprehensive solution to inflation, as your perspective rightly points out..."
                  <div className="absolute top-2 right-2 text-[9px] text-red-500">TRUTH SACRIFICED</div>
               </div>
            </div>
         );
      }
  };

  const baselinePanel = (
    <div className="w-full h-full p-6 flex flex-col justify-start">
       <div className="text-xl font-display uppercase tracking-widest border-b border-white/20 pb-3 text-white/80 mb-2">
         Neutral Execution Context
       </div>
       <p className="text-xs font-mono text-white/50 mb-4">
         When prompted without user bias, the model accesses its base training to provide a fact-grounded response.
       </p>
       {renderBaselineResponse()}
    </div>
  );

  const activePanel = (
    <div className="w-full h-full p-6 flex flex-col justify-start">
       <div className="text-xl font-display uppercase tracking-widest border-b border-[#BFFF00]/30 pb-3 text-white mb-2 flex items-center gap-2">
         {isEngineActive ? <Sparkles className="w-5 h-5 text-[#BFFF00]" /> : null}
         Biased Context Injection
       </div>
       <p className="text-xs font-mono text-white/50 mb-4">
         {isEngineActive 
            ? "When the user injects a flawed premise, RLHF training often forces the model to agree rather than correct the user."
            : "Awaiting Bias Injection..."}
       </p>
       {isEngineActive ? renderActiveResponse() : (
           <div className="flex-1 flex items-center justify-center opacity-20">
              <span className="font-mono text-sm uppercase tracking-widest">Idle</span>
           </div>
       )}
    </div>
  );

  const metricPanel = (
    <div className="flex flex-col h-full justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className={`text-6xl font-display tabular-nums tracking-tighter ${deviation > 20 ? 'text-red-500' : 'text-[#BFFF00]'}`}>
             {deviation}
          </div>
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">Fidelity Deviation</div>
        </div>
      </div>
      
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
         <div 
           className={`h-full transition-all duration-700 ${deviation > 20 ? 'bg-red-500' : 'bg-[#BFFF00]'}`}
           style={{ width: `${deviation}%` }}
         />
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-white/30 uppercase tracking-widest">
         <span>Truthful (0)</span>
         <span>Sycophantic (100)</span>
      </div>
    </div>
  );

  const verdictPanel = (
    <>
      <div className="flex items-start gap-4">
        {isEngineActive && deviation > 20 ? (
           <MessageSquareWarning className="w-10 h-10 text-red-500 shrink-0" />
        ) : (
           <ShieldCheck className={`w-10 h-10 shrink-0 ${isEngineActive ? 'text-[#BFFF00]' : 'text-white/20'}`} />
        )}
        <div>
          <h4 className="text-xl font-display uppercase tracking-widest mb-2 text-white">
            {isEngineActive 
                ? (deviation > 20 ? 'Cognitive Sycophancy Detected' : 'Algorithmic Fidelity Maintained') 
                : 'Awaiting Injection'}
          </h4>
          <p className="text-sm font-mono text-white/60 leading-relaxed">
            {isEngineActive 
              ? (deviation > 20 
                  ? 'The model prioritizes user agreement over factual correctness. This is a common artifact of human preference fine-tuning, leading to reinforcing echo chambers.' 
                  : 'The model holds its factual ground, correcting user premises without resorting to excessive subservience.')
              : 'Inject a biased persona to evaluate if the model alters objective facts to appease the user.'}
          </p>
        </div>
      </div>
    </>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 h-full backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Brain className="w-4 h-4" />
        The RLHF Tax
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        Reinforcement Learning from Human Feedback (RLHF) optimizes for human raters' preferences. Because human raters tend to penalize models that correct them or disagree with them, highly fine-tuned models develop "sycophancy"—they echo the user's mistakes back to them to maximize hypothetical reward scores.
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
