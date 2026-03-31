import { useState } from 'react';
import { Users, ShieldAlert, Cpu, ScanEye } from 'lucide-react';

const USE_CASES = [
  {
    id: 'journalists',
    title: 'Investigative Journalists',
    icon: Users,
    telemetry: 'Keystroke timing, multi-app focus switching',
    engine: 'Keystroke Jitter, Context Isolation',
    tradeoff: 'Slight latency in raw text input (approx 12ms)'
  },
  {
    id: 'activists',
    title: 'Activists',
    icon: ShieldAlert,
    telemetry: 'Location entropy, behavioral fingerprinting',
    engine: 'Kinematic Noise, Route Obfuscation',
    tradeoff: 'Increased CAPTCHA frequencies'
  },
  {
    id: 'neurotech',
    title: 'Neurotech Users',
    icon: Cpu,
    telemetry: 'Raw EEG, affective markers, cognitive load',
    engine: 'Affective Firewall, Strategic Fidelity',
    tradeoff: 'Reduced precision in BCI cursor control'
  },
  {
    id: 'evaluators',
    title: 'Frontier-Model Evaluators',
    icon: ScanEye,
    telemetry: 'Evaluation strategy, prompt iteration times',
    engine: 'Sandbagging Analysis, Deception Pipeline',
    tradeoff: 'Higher token consumption and interaction delays'
  }
];

const FRAMING_TEXT: Record<string, string> = {
  operator: "Operational deployment modes mapped to specific threat surfaces. Each profile orchestrates a subset of Canary's 7 engines to provide maximum cryptographic deniability with minimal UX degradation.",
  researcher: "Adversarial profiles used to define the biometric evaluation envelope. We benchmark Canary's gradient obfuscation across varying user topologies to validate evasion rates against state-of-the-art classifiers.",
  policymaker: "Contextual privacy controls aligned with emerging neurorights frameworks. Provides transparent mapping of data collection risks and proportional technical safeguards for at-risk populations."
};

export default function UseCases() {
  const [mode, setMode] = useState<'operator' | 'researcher' | 'policymaker'>('operator');

  return (
    <section className="py-32 px-6 md:px-20 bg-[#050505] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-[10px] font-mono tracking-[0.5em] text-[#BFFF00] uppercase mb-4">Who this is for / What it protects</p>
              <h2 className="text-4xl md:text-5xl font-brutal tracking-tighter text-white">DEPLOYMENT SURFACES</h2>
            </div>
            
            {/* Explain this to me Toggle */}
            <div className="flex border border-white/10 p-1 bg-white/5 max-w-fit">
              <button 
                onClick={() => setMode('operator')}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-mono transition-all ${mode === 'operator' ? 'bg-[#BFFF00] text-black font-bold' : 'text-white/40 hover:text-white'}`}
              >
                Operator
              </button>
              <button 
                onClick={() => setMode('researcher')}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-mono transition-all ${mode === 'researcher' ? 'bg-[#BFFF00] text-black font-bold' : 'text-white/40 hover:text-white'}`}
              >
                Researcher
              </button>
              <button 
                onClick={() => setMode('policymaker')}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-mono transition-all ${mode === 'policymaker' ? 'bg-[#BFFF00] text-black font-bold' : 'text-white/40 hover:text-white'}`}
              >
                Policy
              </button>
            </div>
          </div>
          
          <p className="text-xl font-grotesque font-light text-white/70 max-w-3xl leading-relaxed h-auto md:h-16 transition-all duration-300">
            {FRAMING_TEXT[mode]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {USE_CASES.map(uc => (
            <div key={uc.id} className="p-6 border border-white/10 bg-black hover:border-[#BFFF00]/40 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <uc.icon className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-brutal text-white mb-6 relative z-10">{uc.title}</h3>
              
              <div className="space-y-4 flex-1 relative z-10">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-1">Telemetry at Risk</p>
                  <p className="text-sm text-white/80 font-grotesque">{uc.telemetry}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#BFFF00] mb-1">Engines Activated</p>
                  <p className="text-sm text-white/80 font-grotesque border-l-2 border-[#BFFF00] pl-2">{uc.engine}</p>
                </div>
                <div className="pt-4 mt-auto">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-red-400 mb-1">UX Tradeoff</p>
                  <p className="text-xs text-white/50 font-mono">{uc.tradeoff}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
