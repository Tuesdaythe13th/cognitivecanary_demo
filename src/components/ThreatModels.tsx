import { AlertTriangle, Fingerprint, Eye, Brain, DatabaseZap, ShieldAlert } from 'lucide-react';

// Dolev-Yao-style adversary model
const ADVERSARY = {
  capabilities: [
    { id: 'A1', label: 'Passive DOM observation', desc: 'Full read access to all mouse, keyboard, scroll, and timing events fired by the browser.' },
    { id: 'A2', label: 'Pre-trained classifiers', desc: 'Access to behavioral models trained on clean (non-obfuscated) interaction corpora.' },
    { id: 'A3', label: 'Cross-session correlation', desc: 'Ability to link behavioral profiles across multiple browsing sessions and sites.' },
    { id: 'A4', label: 'Multi-modal fusion', desc: 'Simultaneous analysis of cursor trajectory, keystroke timing, scroll dynamics, and touch data.' },
    { id: 'A5', label: 'Adaptive retraining', desc: 'Ability to retrain classifiers on Canary-obfuscated output — the primary open research problem.' },
  ],
  limitations: [
    'Cannot modify client-side JavaScript at runtime without full browser compromise',
    'Cannot access secure enclave contents or in-memory obfuscation state',
    'Cannot break cryptographic primitives (session keys, audit log signatures)',
  ],
  claims: [
    { adv: 'A1–A4 (static)', claim: 'Classifier confidence reduced to ≤ random chance (p > 0.05) on behavioral ID tasks' },
    { adv: 'A5 (adaptive)', claim: 'Open problem — v7.1 roadmap targets ≥ 85% evasion over N retraining cycles via adversarial co-evolution' },
  ]
};

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
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="space-y-4">
          <p className="text-[10px] font-mono tracking-[0.5em] text-[#BFFF00] uppercase">Who we counter</p>
          <h2 className="text-4xl md:text-5xl font-brutal tracking-tighter text-white">THREAT MODELS</h2>
          <p className="text-xl font-grotesque font-light text-white/50 max-w-2xl">
            Behavioral defense requires context and risk-tiering. We map countermeasures to specific adversary goals to minimize unnecessary friction.
          </p>
        </div>

        {/* Formal Adversary Model */}
        <div className="border border-white/10 bg-white/[0.02] p-8 space-y-8">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-[#BFFF00]" />
            <h3 className="text-sm font-mono uppercase tracking-widest text-white">Formal Adversary Model</h3>
            <span className="text-[9px] font-mono text-white/30 border border-white/10 px-2 py-0.5 uppercase tracking-wider">Dolev-Yao variant</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Capabilities */}
            <div className="space-y-3">
              <p className="text-[9px] font-mono uppercase tracking-widest text-[#BFFF00]">Adversary Capabilities</p>
              <div className="space-y-2">
                {ADVERSARY.capabilities.map(cap => (
                  <div key={cap.id} className="flex gap-3 group">
                    <span className="text-[10px] font-mono text-[#BFFF00]/60 flex-shrink-0 pt-0.5">{cap.id}</span>
                    <div>
                      <p className="text-[11px] font-mono text-white/80">{cap.label}</p>
                      <p className="text-[10px] text-white/30 leading-snug">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div className="space-y-3">
              <p className="text-[9px] font-mono uppercase tracking-widest text-red-400">Adversary Limitations</p>
              <div className="space-y-2">
                {ADVERSARY.limitations.map((lim, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-red-500/40 text-xs flex-shrink-0 pt-0.5">✕</span>
                    <p className="text-[10px] text-white/40 leading-snug">{lim}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Claims */}
            <div className="space-y-3">
              <p className="text-[9px] font-mono uppercase tracking-widest text-cyan-400">Security Claims</p>
              <div className="space-y-4">
                {ADVERSARY.claims.map((c, i) => (
                  <div key={i} className="border-l-2 border-cyan-500/30 pl-3 space-y-1">
                    <p className="text-[9px] font-mono text-cyan-400/70 uppercase">{c.adv}</p>
                    <p className="text-[10px] text-white/60 leading-snug">{c.claim}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-[9px] text-white/25 font-mono leading-relaxed">
                  Note: A5 (adaptive retraining) is the primary open problem — the "Tor problem" of obfuscation. Canary's presence could itself become a detectable signal. See v7.1 roadmap.
                </p>
              </div>
            </div>
          </div>
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
