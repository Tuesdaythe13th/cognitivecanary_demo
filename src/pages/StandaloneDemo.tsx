import { useParams, Link } from 'react-router-dom';
import AffectiveFirewall from '@/components/AffectiveFirewall';
import CreditAuditor from '@/components/CreditAuditor';
import AssistantAxis from '@/components/AssistantAxis';
import BrowserFingerprint from '@/components/BrowserFingerprint';
import KeystrokeDynamics from '@/components/KeystrokeDynamics';
import DeceptionPipeline from '@/components/DeceptionPipeline';
import LiveDemo from '@/components/LiveDemo';
import ThreatFeed from '@/components/ThreatFeed';
import Lissajous3D from '@/components/Lissajous3D';
import AdaptiveTremor from '@/components/AdaptiveTremor';
import KeystrokeJitter from '@/components/KeystrokeJitter';
import NeuroAudit from '@/components/NeuroAudit';
import InspectHarness from '@/components/InspectHarness';
import StrategicFidelity from '@/components/StrategicFidelity';
import { ExternalLink } from 'lucide-react';
import { engineRegistry } from '@/data/engineRegistry';

const DEMOS: Record<string, React.FC> = {
  'affective-firewall': AffectiveFirewall,
  'credit-auditor': CreditAuditor,
  'assistant-axis': AssistantAxis,
  'browser-fingerprint': BrowserFingerprint,
  'keystroke-dynamics': KeystrokeDynamics,
  'deception-pipeline': DeceptionPipeline,
  'live-demo': LiveDemo,
  'threat-feed': ThreatFeed,
  'lissajous-3d': Lissajous3D,
  'adaptive-tremor': AdaptiveTremor,
  'keystroke-jitter': KeystrokeJitter,
  'neuro-audit': NeuroAudit,
  'inspect-harness': InspectHarness,
  'strategic-fidelity': StrategicFidelity,
  
  // Temporary mappings for continuity during refactor
  'gradient-auditor': ThreatFeed,
};

export default function StandaloneDemo() {
  const { id } = useParams<{ id: string }>();
  
  const engineDef = engineRegistry.find(e => e.id === id);

  if (!id) return null;

  const DemoComponent = DEMOS[id];

  if (!DemoComponent) {
    if (engineDef) {
       return (
          <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-mono p-6">
             <div className="text-display text-4xl mb-4 text-white/50">{engineDef.title}</div>
             <div className="text-xs uppercase tracking-widest text-[#BFFF00] mb-8 px-3 py-1 bg-[#BFFF00]/10 border border-[#BFFF00]/30">System Under Construction</div>
             <p className="max-w-md text-center text-white/40 leading-relaxed mb-8 text-sm">This engine is currently being refactored into the new ExhibitLayout unified grammar for v7.0.</p>
             <Link to="/lab" className="text-[10px] text-white/50 hover:text-[#BFFF00] uppercase tracking-widest transition-colors border border-white/20 px-4 py-2 hover:bg-white/5">Return to Hub</Link>
          </div>
       );
    }
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-sm">
        <div>Demo not found. <Link to="/lab" className="text-[#BFFF00] hover:underline ml-2">Return to Hub</Link></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050706] text-white selection:bg-primary/30 selection:text-primary relative font-sans overflow-x-hidden">
      {/* Background textures */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="fixed inset-0 grain-overlay pointer-events-none opacity-50 mix-blend-overlay" />
      
      {/* Header bar */}
      <div className="fixed top-0 left-0 w-full p-4 sm:p-6 z-[100] flex justify-between items-center pointer-events-none">
        <Link 
          to="/" 
          className="pointer-events-auto flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/50 hover:text-primary transition-colors bg-black/50 px-4 py-2 border border-white/10 rounded backdrop-blur-md"
        >
          <span className="text-lg leading-none mb-[2px]">‹</span> Back to Hub
        </Link>
        <div className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] px-4 py-2 border border-primary/30 bg-primary/5 backdrop-blur-md hidden sm:block">
          Standalone Exhibit Environment
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pt-20 pb-10 w-full min-h-screen flex items-center justify-center relative z-10">
        <div className="w-full">
          <DemoComponent />
        </div>
      </div>
    </div>
  );
}
