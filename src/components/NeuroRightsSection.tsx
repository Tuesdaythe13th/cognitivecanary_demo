import { useInView } from '@/hooks/useInView';
import { useState } from 'react';
import { ChevronDown, ExternalLink, Shield, Scale, Brain, Lock, FileText, Eye } from 'lucide-react';

/* ── Data ── */

const regulations = [
  {
    name: 'U.S. MIND Act',
    year: '2025–2026',
    icon: Shield,
    requirements: [
      'Neural data classified as sensitive personal information',
      'Explicit, revocable consent before collection/processing',
      'Data-minimisation & retention limits (≤30 days raw signals)',
      'Risk-assessment & impact-report for cognitive-state AI',
    ],
    designImplications: [
      'On-device preprocessing — only consent-approved embeddings transmitted',
      'Secure enclave / TEE for consent flags & cryptographic keys',
      'Dynamic consent UI with pause, delete, export controls',
      'Automated DPIA on each new model version',
    ],
  },
  {
    name: 'UNESCO Neuro-Technology Ethics',
    year: '2025',
    icon: Scale,
    requirements: [
      'Human dignity, autonomy, and equitable access',
      'Transparent, explainable AI with human-in-the-loop',
      'Prohibition of non-consensual cognitive profiling',
    ],
    designImplications: [
      'Explainability layer — "why" annotation on each output',
      'Human-in-the-loop gating with confirm/edit before downstream',
      'Inclusive training data balanced across demographics',
    ],
  },
  {
    name: 'EU AI Act (High-Risk)',
    year: '2024–2026',
    icon: FileText,
    requirements: [
      'BCI language models classified as high-risk',
      'Conformity assessment & technical documentation',
      'Robustness against adversarial attacks',
      'Post-market monitoring required',
    ],
    designImplications: [
      'Model-card & data-sheet detailing pipeline & safeguards',
      'Adversarial robustness testing (gradient-starvation, EM-injection)',
      'Continuous monitoring dashboard with anomaly alerts',
    ],
  },
  {
    name: 'CCPA / Colorado Neural Data',
    year: '2024–2025',
    icon: Lock,
    requirements: [
      'Neural recordings = personal information',
      'Rights to access, deletion, and opt-out of data sale',
    ],
    designImplications: [
      'User-controlled encrypted data vault with export/erase',
      'No-sale clause — architecture forbids third-party commercial use',
    ],
  },
  {
    name: 'UNESCO Neuro-Rights Charter',
    year: '2025',
    icon: Brain,
    requirements: [
      'Right to control one\'s own mental data',
      'Freedom from covert manipulation',
    ],
    designImplications: [
      'Zero-knowledge proof of human-only data origin',
      'Gradient-starvation / synthetic-noise injection to prevent reconstruction',
    ],
  },
];

const dataLifecycle = [
  { stage: 'Acquisition', trigger: 'Consent & purpose-limitation', countermeasure: 'Explicit consent UI; immediate discard if declined' },
  { stage: 'Pre-processing', trigger: 'Data-minimisation', countermeasure: 'On-device conversion to 128-dim embeddings; raw buffer deletion' },
  { stage: 'Storage', trigger: 'Retention limits & right to erasure', countermeasure: 'Encrypted time-bound storage (TTL 30d) with auto-shred' },
  { stage: 'Training', trigger: 'Fairness & bias mitigation', countermeasure: 'Federated learning; only DP-sensitive model updates aggregated' },
  { stage: 'Inference', trigger: 'Human-in-the-loop & transparency', countermeasure: 'Show inferred intent before LLM generation; "reject" button' },
  { stage: 'Output', trigger: 'Content safety & non-discrimination', countermeasure: 'Content-filter pipeline against policy list; audit logs' },
  { stage: 'Monitoring', trigger: 'Conformity & post-market monitoring', countermeasure: 'Continuous logging, periodic external audits, privacy dashboard' },
];

const privacyTechniques = [
  { technique: 'Differential Privacy (DP)', regulation: 'MIND Act, CCPA', implementation: 'Calibrated Laplace/Gaussian noise on intent vector before LLM' },
  { technique: 'Zero-Knowledge Proofs (ZKP)', regulation: 'UNESCO Charter', implementation: 'Schnorr-type ZKPs on embedding hash; verifier checks without seeing data' },
  { technique: 'Gradient-Starvation Noise', regulation: 'DARPA, MIND Act', implementation: 'Lissajous curves + pink-noise jitter on cursor/keystroke streams' },
  { technique: 'Secure Enclave / TEE', regulation: 'MIND Act, EU AI Act', implementation: 'BCI driver + inference engine inside SGX or TrustZone enclave' },
  { technique: 'Federated Learning', regulation: 'UNESCO, CCPA', implementation: 'Local model training; encrypted updates via homomorphic encryption' },
  { technique: 'On-Device Inference', regulation: 'MIND Act', implementation: 'Lightweight LLM (~2B param) running locally on GPU-enabled headset' },
];

const dpLibraries = [
  { name: 'OpenDP', lang: 'C++ / Python', features: 'Formal (ε,δ) guarantees; Laplace & Gaussian mechanisms for vector data', url: 'https://github.com/opendp/opendp' },
  { name: 'TensorFlow Privacy', lang: 'Python (TF)', features: 'DP-SGD optimizer; privacy-accounting utilities; Keras integration', url: 'https://github.com/tensorflow/privacy' },
  { name: 'Opacus', lang: 'Python (PyTorch)', features: 'DP-SGD/Adam; per-sample gradient clipping; PrivacyEngine with live ε tracking', url: 'https://github.com/pytorch/opacus' },
  { name: 'Diffprivlib', lang: 'Python (Scikit)', features: 'DP versions of common ML primitives (PCA, K-means, linear models)', url: 'https://github.com/IBM/diffprivlib' },
  { name: 'PySyft', lang: 'Python (PyTorch/TF)', features: 'Federated learning + DP + Secure MPC; virtual workers for simulation', url: 'https://github.com/OpenMined/PySyft' },
];

const zkpLibraries = [
  { name: 'libsnark', lang: 'C++ / Python', features: 'zk-SNARK (Groth16); circuit compiler for arithmetic circuits', url: 'https://github.com/scipr-lab/libsnark' },
  { name: 'bellman', lang: 'Rust', features: 'Efficient Groth16; Pedersen commitments & range proofs', url: 'https://github.com/zkcrypto/bellman' },
  { name: 'arkworks', lang: 'Rust', features: 'Modular SNARK/STARK (Groth16, PLONK, Marlin); on-chain verification', url: 'https://github.com/arkworks-rs' },
  { name: 'circom + snarkjs', lang: 'JS / TypeScript', features: 'DSL for circuits; WASM proof generation; browser-compatible', url: 'https://github.com/iden3/circom' },
  { name: 'Bulletproofs', lang: 'Rust', features: 'Short range proofs without trusted setup; sub-ms verification', url: 'https://github.com/dalek-cryptography/bulletproofs' },
  { name: 'zkInterface', lang: 'Rust / Python', features: 'Language-agnostic circuit protocol; multiple back-ends', url: 'https://github.com/ZKInterface/zkinterface' },
];

const keyTakeaways = [
  { reg: 'MIND Act', impact: 'On-device preprocessing, explicit consent UI, strict retention limits, DPIA per model update' },
  { reg: 'UNESCO Guidelines', impact: 'Explainability, human-in-the-loop, equitable data, prohibition of covert profiling' },
  { reg: 'EU AI Act', impact: 'High-risk classification → conformity assessment, robustness testing, post-market monitoring' },
  { reg: 'State Neural-Data Laws', impact: 'Rights to access, delete, opt-out; no commercial resale of raw neural data' },
  { reg: 'Neuro-Rights Charter', impact: 'Cognitive sovereignty → ZKPs and gradient-starvation prevent involuntary extraction' },
];

/* ── Collapsible ── */

const CollapsiblePanel = ({ title, badge, children, defaultOpen = false }: { title: string; badge: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-panel overflow-hidden border-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-accent/60 uppercase tracking-[0.3em] px-2 py-0.5 border border-accent/20 bg-accent/5">{badge}</span>
          <span className="text-xs font-mono text-foreground uppercase tracking-wider">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${open ? 'max-h-[6000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

/* ── Component ── */

const NeuroRightsSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="neuro-rights" className="relative py-32 px-6 border-t border-white/5 bg-background" ref={ref}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/6 rounded-full gradient-blob" />

      <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <span className="tag-badge mb-6 inline-block" style={{ borderColor: 'hsl(var(--accent) / 0.3)', color: 'hsl(var(--accent))', background: 'hsl(var(--accent) / 0.08)' }}>
          REGULATORY LANDSCAPE
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl text-foreground mt-4 mb-4">
          Neuro-Rights &<br />
          <span className="text-accent">Compliance by Design.</span>
        </h2>
        <p className="text-body text-muted-foreground text-lg max-w-3xl mb-16 leading-relaxed">
          How emerging neuro-rights regulations shape BCI-enabled language-model design — and the privacy-preserving techniques that satisfy them.
        </p>

        <div className="space-y-4">

          {/* 1. Regulations */}
          <CollapsiblePanel title="Regulatory Frameworks Shaping BCI-LLM Design" badge="01" defaultOpen={true}>
            <div className="p-4 space-y-3">
              {regulations.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="glass-panel p-4 border-white/5 hover:border-accent/15 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-accent/20 bg-accent/5">
                        <Icon className="w-4 h-4 text-accent/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-foreground font-bold text-xs font-mono">{r.name}</span>
                          <span className="text-[8px] font-mono text-muted-foreground">{r.year}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Core Requirements</span>
                            <ul className="mt-1.5 space-y-1">
                              {r.requirements.map((req, j) => (
                                <li key={j} className="text-[10px] font-mono text-white/50 flex gap-1.5">
                                  <span className="text-accent/40 flex-shrink-0">§</span> {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Design Implications</span>
                            <ul className="mt-1.5 space-y-1">
                              {r.designImplications.map((imp, j) => (
                                <li key={j} className="text-[10px] font-mono text-primary/60 flex gap-1.5">
                                  <span className="text-primary/30 flex-shrink-0">→</span> {imp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsiblePanel>

          {/* 2. Data Lifecycle */}
          <CollapsiblePanel title="Data-Lifecycle Controls Imposed by Regulations" badge="02">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-3 text-accent uppercase tracking-widest">Stage</th>
                    <th className="text-left p-3 text-accent uppercase tracking-widest">Regulatory Trigger</th>
                    <th className="text-left p-3 text-accent uppercase tracking-widest hidden sm:table-cell">Technical Countermeasure</th>
                  </tr>
                </thead>
                <tbody className="text-white/50">
                  {dataLifecycle.map((d, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-foreground font-bold">{d.stage}</td>
                      <td className="p-3">{d.trigger}</td>
                      <td className="p-3 hidden sm:table-cell text-white/30">{d.countermeasure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsiblePanel>

          {/* 3. Privacy-Preserving Techniques */}
          <CollapsiblePanel title="Privacy-Preserving Techniques" badge="03">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-3 text-accent uppercase tracking-widest">Technique</th>
                    <th className="text-left p-3 text-accent uppercase tracking-widest">Satisfies</th>
                    <th className="text-left p-3 text-accent uppercase tracking-widest hidden sm:table-cell">Implementation</th>
                  </tr>
                </thead>
                <tbody className="text-white/50">
                  {privacyTechniques.map((p, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-foreground font-bold">{p.technique}</td>
                      <td className="p-3 text-accent/50">{p.regulation}</td>
                      <td className="p-3 hidden sm:table-cell text-white/30">{p.implementation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsiblePanel>

          {/* 4. Open-Source Toolkits */}
          <CollapsiblePanel title="Open-Source DP & ZKP Toolkits" badge="04">
            <div className="p-4 space-y-6">
              {/* DP Libraries */}
              <div>
                <h4 className="text-[9px] font-mono text-primary/50 uppercase tracking-[0.3em] mb-3">Differential Privacy Libraries</h4>
                <div className="space-y-2">
                  {dpLibraries.map((lib, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border border-white/5 hover:border-primary/15 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <a href={lib.url} target="_blank" rel="noopener noreferrer" className="text-foreground font-bold text-[11px] font-mono hover:text-primary transition-colors flex items-center gap-1.5">
                            {lib.name}
                            <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                          <span className="text-[8px] font-mono text-muted-foreground px-1.5 py-0.5 border border-white/5 bg-white/[0.03]">{lib.lang}</span>
                        </div>
                        <p className="text-[9px] font-mono text-white/40 mt-1 leading-relaxed">{lib.features}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ZKP Libraries */}
              <div>
                <h4 className="text-[9px] font-mono text-accent/50 uppercase tracking-[0.3em] mb-3">Zero-Knowledge Proof Libraries</h4>
                <div className="space-y-2">
                  {zkpLibraries.map((lib, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border border-white/5 hover:border-accent/15 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <a href={lib.url} target="_blank" rel="noopener noreferrer" className="text-foreground font-bold text-[11px] font-mono hover:text-accent transition-colors flex items-center gap-1.5">
                            {lib.name}
                            <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                          <span className="text-[8px] font-mono text-muted-foreground px-1.5 py-0.5 border border-white/5 bg-white/[0.03]">{lib.lang}</span>
                        </div>
                        <p className="text-[9px] font-mono text-white/40 mt-1 leading-relaxed">{lib.features}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsiblePanel>

          {/* 5. Key Takeaways */}
          <CollapsiblePanel title="Key Takeaways by Regulation" badge="05">
            <div className="p-4 space-y-0">
              {keyTakeaways.map((t, i) => (
                <div key={i} className="flex gap-4 p-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-shrink-0 w-48">
                    <span className="text-xs font-mono text-foreground font-bold">{t.reg}</span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">{t.impact}</p>
                </div>
              ))}
            </div>
          </CollapsiblePanel>
        </div>

        {/* Summary */}
        <div className="mt-8 glass-panel p-6 border-accent/15 bg-gradient-to-br from-accent/5 to-transparent">
          <h3 className="text-mono text-[10px] text-accent/80 uppercase tracking-[0.3em] mb-3 font-bold">Compliance-by-Design Principle</h3>
          <p className="text-body text-sm text-muted-foreground leading-relaxed">
            By embedding regulatory requirements early — through <span className="text-foreground font-medium">privacy-preserving pipelines</span>, <span className="text-foreground font-medium">transparent user interfaces</span>, and <span className="text-foreground font-medium">rigorous documentation</span> — developers can create BCI-enabled language models that are both technically capable and legally compliant across all major jurisdictions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NeuroRightsSection;
