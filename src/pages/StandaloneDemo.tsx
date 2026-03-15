import { useParams, Link } from 'react-router-dom';
import AffectiveFirewall from '@/components/AffectiveFirewall';
import CreditAuditor from '@/components/CreditAuditor';
import AssistantAxis from '@/components/AssistantAxis';
import BrowserFingerprint from '@/components/BrowserFingerprint';
import KeystrokeDynamics from '@/components/KeystrokeDynamics';
import DeceptionPipeline from '@/components/DeceptionPipeline';
import LiveDemo from '@/components/LiveDemo';
import ThreatFeed from '@/components/ThreatFeed';
import { ExternalLink } from 'lucide-react';

const DEMOS: Record<string, React.FC> = {
  'affective-firewall': AffectiveFirewall,
  'credit-auditor': CreditAuditor,
  'assistant-axis': AssistantAxis,
  'browser-fingerprint': BrowserFingerprint,
  'keystroke-dynamics': KeystrokeDynamics,
  'deception-pipeline': DeceptionPipeline,
  'live-demo': LiveDemo,
  'threat-feed': ThreatFeed,
};

export default function StandaloneDemo() {
  const { id } = useParams<{ id: string }>();
  
  if (!id || !DEMOS[id]) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-sm">
        <div>Demo not found. <Link to="/" className="text-primary hover:underline ml-2">Return Home</Link></div>
      </div>
    );
  }

  const DemoComponent = DEMOS[id];

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
