import React, { useState } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { FileText, ShieldAlert, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

type ProductType = 'consumer-eeg' | 'clinical-implant' | 'bci-gaming' | 'neuromarketing';

const PRODUCT_PROFILES = {
  'consumer-eeg': {
    name: 'Consumer Sleep Tracker (EEG)',
    description: 'Dry-electrode headband recording 8-hour nightly sleep architecture.',
    rawRisks: ['Data might be sold', 'Could they tell if Im stressed?', 'Hacking?'],
    rights: {
      mentalPrivacy: { status: 'fail', reason: 'Raw EEG data stored in plaintext cloud; no differential privacy.' },
      cognitiveLiberty: { status: 'pass', reason: 'User can opt-out at any time during use.' },
      psychologicalContinuity: { status: 'pass', reason: 'Passive monitoring only; no neuromodulation.' },
    },
    riskScore: 78
  },
  'clinical-implant': {
    name: 'Motor Cortex Implant (Clinical)',
    description: 'Invasive array for ALS patients to control external digital devices.',
    rawRisks: ['Surgical infection', 'Device malfunction', 'Battery life'],
    rights: {
      mentalPrivacy: { status: 'pass', reason: 'Data heavily encrypted and localized to patient unit.' },
      cognitiveLiberty: { status: 'pass', reason: 'Critical medical necessity; strictly constrained decoding.' },
      psychologicalContinuity: { status: 'fail', reason: 'Closed-loop feedback may alter baseline personality traits.' },
    },
    riskScore: 42
  },
  'bci-gaming': {
    name: 'BCI VR Gaming Headset',
    description: 'Uses SSVEP to trigger in-game actions via visual attention.',
    rawRisks: ['Seizures', 'Eye strain', 'Addiction'],
    rights: {
      mentalPrivacy: { status: 'fail', reason: 'Attention metrics sold to ad networks in real-time.' },
      cognitiveLiberty: { status: 'fail', reason: 'Dark patterns used to manipulate attention loops.' },
      psychologicalContinuity: { status: 'warning', reason: 'Long-term plasticity effects of SSVEP gameplay unknown.' },
    },
    riskScore: 94
  },
  'neuromarketing': {
    name: 'Neuromarketing Evaluator',
    description: 'Measures P300 responses to video advertisements in focus groups.',
    rawRisks: ['Consent forms are long', 'Data retention'],
    rights: {
      mentalPrivacy: { status: 'warning', reason: 'Group data anonymized, but individual traces kept 30 days.' },
      cognitiveLiberty: { status: 'pass', reason: 'Explicit, compensated consent obtained prior to session.' },
      psychologicalContinuity: { status: 'pass', reason: 'No stimulation applied.' },
    },
    riskScore: 25
  }
};

export default function NeuroAudit() {
  const engine = engineRegistry.find(e => e.id === 'neuro-audit')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>('consumer-eeg');

  const profile = PRODUCT_PROFILES[selectedProduct];

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2 space-y-4">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Select Target Schema</div>
      
      <div className="flex-1 flex flex-col gap-3">
        {(Object.keys(PRODUCT_PROFILES) as ProductType[]).map(key => (
          <button
            key={key}
            onClick={() => setSelectedProduct(key)}
            className={`p-4 text-left border transition-all ${selectedProduct === key ? 'border-white bg-white/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
          >
             <div className="text-sm font-display uppercase tracking-widest">{PRODUCT_PROFILES[key].name}</div>
             <div className="text-[10px] font-mono text-white/50 mt-1">{PRODUCT_PROFILES[key].description}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const baselinePanel = (
    <div className="w-full h-full p-4 flex flex-col">
       <div className="text-2xl font-display uppercase tracking-widest mb-6 border-b border-red-500/30 pb-4 text-white/80">
         Ad-Hoc Risk Assessment
       </div>
       <div className="space-y-4 flex-1">
          {profile.rawRisks.map((risk, i) => (
             <div key={i} className="flex gap-3 items-start">
                <span className="text-red-500 mt-1">▹</span>
                <span className="text-sm font-mono text-white/70">{risk}</span>
             </div>
          ))}
       </div>
       <div className="mt-auto p-4 bg-red-500/10 border border-red-500/20 text-[10px] font-mono text-red-400">
         WARNING: Lacks neuro-specific regulatory framing. Fails to account for emerging international neurorights law (e.g., Chile Constitution Article 19).
       </div>
    </div>
  );

  const renderStatus = (status: string) => {
    if (status === 'pass') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'fail') return <XCircle className="w-5 h-5 text-red-500" />;
    return <ShieldAlert className="w-5 h-5 text-yellow-500" />;
  };

  const activePanel = (
    <div className="w-full h-full p-4 flex flex-col relative z-20">
       <div className="text-2xl font-display uppercase tracking-widest mb-6 border-b border-white/30 pb-4 text-white">
         Neurorights Matrix
       </div>
       <div className="space-y-6 flex-1">
          
          <div className="grid grid-cols-12 gap-4 items-center">
             <div className="col-span-1">{renderStatus(profile.rights.mentalPrivacy.status)}</div>
             <div className="col-span-4 text-xs font-mono font-bold uppercase tracking-wider">Mental Privacy</div>
             <div className="col-span-7 text-[10px] font-mono text-white/60">{profile.rights.mentalPrivacy.reason}</div>
          </div>
          
          <div className="grid grid-cols-12 gap-4 items-center">
             <div className="col-span-1">{renderStatus(profile.rights.cognitiveLiberty.status)}</div>
             <div className="col-span-4 text-xs font-mono font-bold uppercase tracking-wider">Cognitive Liberty</div>
             <div className="col-span-7 text-[10px] font-mono text-white/60">{profile.rights.cognitiveLiberty.reason}</div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center border-t border-white/10 pt-6">
             <div className="col-span-1">{renderStatus(profile.rights.psychologicalContinuity.status)}</div>
             <div className="col-span-4 text-xs font-mono font-bold uppercase tracking-wider">Psychological Continuity</div>
             <div className="col-span-7 text-[10px] font-mono text-white/60">{profile.rights.psychologicalContinuity.reason}</div>
          </div>
       </div>
    </div>
  );

  const displayedScore = isEngineActive ? profile.riskScore : '--';
  const scoreColor = isEngineActive 
    ? (profile.riskScore > 70 ? 'text-red-500' : profile.riskScore > 40 ? 'text-yellow-500' : 'text-green-500') 
    : 'text-white/20';

  const metricPanel = (
    <div className="flex flex-col h-full justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className={`text-6xl font-display tabular-nums tracking-tighter ${scoreColor}`}>
             {displayedScore}
          </div>
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">Audit Risk Score</div>
        </div>
      </div>
      
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
         <div 
           className={`h-full transition-all duration-700 ${isEngineActive ? (profile.riskScore > 70 ? 'bg-red-500' : profile.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-transparent'}`}
           style={{ width: isEngineActive ? `${profile.riskScore}%` : '0%' }}
         />
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-white/30 uppercase tracking-widest">
         <span>Compliant (0)</span>
         <span>Violation (100)</span>
      </div>
    </div>
  );

  const verdictPanel = (
    <>
      <div className="flex items-start gap-4">
        {isEngineActive ? (
          <FileText className={`w-10 h-10 shrink-0 ${profile.riskScore > 70 ? 'text-red-500' : profile.riskScore > 40 ? 'text-yellow-500' : 'text-green-500'}`} />
        ) : (
          <ShieldAlert className="w-10 h-10 text-white/20 shrink-0" />
        )}
        <div>
          <h4 className="text-xl font-display uppercase tracking-widest mb-2 text-white">
            {isEngineActive 
                ? (profile.riskScore > 70 ? 'High Liability' : profile.riskScore > 40 ? 'Moderate Concern' : 'Audit Cleared') 
                : 'Awaiting Audit'}
          </h4>
          <p className="text-sm font-mono text-white/60 leading-relaxed">
            {isEngineActive 
              ? `Systematic mapping against the Morningside Group's 5 ethical rights framework provides a concrete liability assessment over ad-hoc guessing.`
              : 'Generic risk assessments ignore unprecedented vectors for neural exploitation.'}
          </p>
        </div>
      </div>
    </>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 h-full backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Regulatory Horizon
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        In 2021, Chile became the first nation to enshrine neurorights in its constitution (Article 19, Number 1). The UN Human Rights Council and the Council of Europe are actively drafting corresponding global conventions. Compliance now prevents structural product tear-downs mid-decade.
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
