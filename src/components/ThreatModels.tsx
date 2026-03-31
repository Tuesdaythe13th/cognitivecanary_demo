import { AlertTriangle, Fingerprint, Eye, Brain, DatabaseZap } from 'lucide-react';

const THREATS = [
  {
    name: "Fraud Vendors",
    goal: "Risk assessment via session behavior",
    inputs: "Mouse velocity, scroll curvature, typing cadence",
    inference: "Bot certainty, account takeover likelihood",
    countermeasure: "Cursor Obfuscation, Keystroke Jitter",
    icon: Fingerprint
  },
  {
    name: "Workplace Surveillance",
    goal: "Productivity tracking & insider threat",
    inputs: "Application focus, idle times, keystroke density",
    inference: "Engagement scores, fatigue estimation",
    countermeasure: "Context Isolation, Timing Perturbation",
    icon: Eye
  },
  {
    name: "Recommender Systems",
    goal: "Engagement optimization",
    inputs: "Dwell time, hover hesitation, micro-scrolling",
    inference: "Implicit preference, emotional resonance",
    countermeasure: "Kinematic Noise, False Interest Injection",
    icon: DatabaseZap
  },
  {
    name: "BCI Vendors",
    goal: "Longitudinal neural profiling",
    inputs: "Raw EEG waves, error-related potentials",
    inference: "Cognitive decline, affective state, latent bias",
    countermeasure: "Affective Firewall, Phase Scrambling",
    icon: Brain
  },
  {
    name: "State-Grade Collection",
    goal: "Deanonymization & dragnet surveillance",
    inputs: "Cross-site behavioral fusing, metadata",
    inference: "True identity bridging across anonymous accounts",
    countermeasure: "Strategic Fidelity, Profile Selection",
    icon: AlertTriangle
  }
];

export default function ThreatModels() {
  return (
    <section className="py-32 px-6 md:px-20 bg-black border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <p className="text-[10px] font-mono tracking-[0.5em] text-[#BFFF00] uppercase">Who we counter</p>
          <h2 className="text-4xl md:text-5xl font-brutal tracking-tighter text-white">THREAT MODELS</h2>
          <p className="text-xl font-grotesque font-light text-white/50 max-w-2xl">
            Behavioral defense requires context and risk-tiering. We map countermeasures to specific adversary goals to minimize unnecessary friction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {THREATS.map((threat, i) => (
            <div key={i} className="flex flex-col p-6 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-colors relative group">
              <threat.icon className="w-8 h-8 text-[#BFFF00] mb-6 opacity-80" />
              <h3 className="text-lg font-brutal text-white mb-2">{threat.name}</h3>
              <p className="text-xs font-mono text-white/40 mb-6 flex-1">{threat.goal}</p>
              
              <div className="space-y-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[8px] font-mono uppercase tracking-widest text-[#BFFF00]/70 mb-1">Inputs Collected</p>
                  <p className="text-[11px] text-white/70 leading-snug">{threat.inputs}</p>
                </div>
                <div>
                  <p className="text-[8px] font-mono uppercase tracking-widest text-red-400/70 mb-1">Inference Target</p>
                  <p className="text-[11px] text-white/70 leading-snug">{threat.inference}</p>
                </div>
                <div className="bg-[#BFFF00]/10 p-2 border-l-2 border-[#BFFF00]">
                  <p className="text-[8px] font-mono uppercase tracking-widest text-[#BFFF00] mb-1">Canary Countermeasure</p>
                  <p className="text-[10px] font-mono text-white leading-snug">{threat.countermeasure}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
