import { useInView } from '@/hooks/useInView';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const coreCapabilities = [
  {
    project: 'Brain2QWERTY',
    org: 'Meta, 2024',
    capability: 'Intent-driven text entry from non-invasive EEG',
    highlights: ['19% CER on 30-char vocabulary', 'Hybrid CNN-RNN encoder + GPT-2 decoder', '~80ms latency on consumer GPU'],
    limitations: ['Constrained vocabulary', '~30 min user training required'],
  },
  {
    project: 'GROM',
    org: 'Google Research, 2025',
    capability: 'Multimodal neural-to-semantic mapping (EEG + eye-tracking)',
    highlights: ['Spectral EEG + gaze heatmap fusion via transformer', '0.45 BLEU on 200-phrase benchmark', 'On-device LoRA per-user adaptation'],
    limitations: ['Requires calibrated eye-tracker', '>15% drop with noisy gaze data'],
  },
  {
    project: 'Meta "Neural Speech"',
    org: 'Meta, 2025',
    capability: 'Imagined speech decoding to text',
    highlights: ['End-to-end EEG → phoneme → LLM pipeline', '70% phoneme accuracy (12-phoneme set)', 'wav2vec-2.0 front-end features'],
    limitations: ['Small phoneme set only', 'Full vocabulary generalization unsolved'],
  },
  {
    project: 'DARPA "Neuro-AI"',
    org: '2024–2026',
    capability: 'Robust, adversarial-resistant BCI pipelines',
    highlights: ['Gradient-starvation obfuscation', '99% evasion of keystroke-dynamics systems', 'Formal ZKP of human-only provenance'],
    limitations: ['~2ms added latency', 'Requires secure hardware enclave'],
  },
  {
    project: 'Neuralink',
    org: '2024–2026',
    capability: 'High-resolution intracortical recording',
    highlights: ['1,024-channel array @ 1kHz', '<5ms reaction time for motor intent', 'Open-source Neural-SDK'],
    limitations: ['Invasive; regulatory hurdles', 'Wireless hijacking risk if unhardened'],
  },
  {
    project: 'Synchron Stentrode',
    org: '2025',
    capability: 'Endovascular BCI',
    highlights: ['64-channel @ 500Hz', '~94% binary intent classification', 'Hands-free UI control'],
    limitations: ['Limited bandwidth', 'Not yet suitable for language decoding'],
  },
];

const securityThreats = [
  {
    vector: 'Passive Behavioral Fingerprinting',
    desc: 'Classifiers infer identity from cursor/keystroke dynamics, EEG micro-tremors, or gaze patterns.',
    example: 'TypingDNA & BehavioSec achieve <1% EER on 30-char sequences',
    countermeasures: ['Gradient-starvation noise injection', 'Lissajous overlay + pink-noise jitter', 'Differential privacy on embeddings'],
  },
  {
    vector: 'Active Model Poisoning',
    desc: 'Adversary injects crafted perturbations to corrupt neural-to-semantic encoder.',
    example: 'Gradient Auditor detects rank-collapse in loss landscape',
    countermeasures: ['Real-time gradient monitoring', 'Secure hardware enclaves', 'Redundant sensor fusion (EEG + EMG)'],
  },
  {
    vector: 'Side-Channel Leakage',
    desc: 'Unintended emissions (RF, power) from BCI hardware reveal raw neural data.',
    example: 'Demonstrated on prototype wireless EEG headsets (2024)',
    countermeasures: ['Shielded enclosures', 'Randomized transmission schedules', 'ZKP of data integrity'],
  },
  {
    vector: 'Replay Attacks',
    desc: 'Recorded neural patterns replayed to impersonate a user.',
    example: 'Neural-Replay attack: 78% success on binary intent classifier',
    countermeasures: ['Session-bound cryptographic nonces', 'Temporal challenge-response'],
  },
  {
    vector: 'Model Extraction & Inversion',
    desc: 'Attacker queries BCI-LLM service to reconstruct encoder or recover private neural data.',
    example: '92% fidelity reconstruction with <5k queries (Meta, 2025)',
    countermeasures: ['Rate-limiting & query-obfuscation', 'Watermarking generated text', 'DP on model outputs'],
  },
  {
    vector: 'Malicious Intent Manipulation',
    desc: 'Adversarial perturbations cause decoder to generate harmful or biased content.',
    example: 'Adversarial prompt injection on LLMs (2025)',
    countermeasures: ['Content filter guardrails', 'Context-aware safety layer', 'Auditing pipelines'],
  },
  {
    vector: 'Regulatory Non-Compliance',
    desc: 'Failure to respect neuro-rights statutes (EU AI Act, MIND Act, UNESCO).',
    example: 'Neuro-Audit flags jurisdiction-specific violations in real time',
    countermeasures: ['Integrated compliance engine', 'Automated policy-checking', 'Transparent audit logging'],
  },
];

const mitigationTools = [
  { tool: 'Gradient Starvation / Synthetic Noise', goal: 'Reduce fingerprintable feature importance', deployment: 'BCI driver level (DARPA, Cognitive Canary)' },
  { tool: 'Zero-Knowledge Proofs', goal: 'Prove human-only data origin without revealing raw signals', deployment: 'Cryptographic provenance module' },
  { tool: 'Multi-Modal Fusion', goal: 'Increase entropy, defeat single-modal attacks', deployment: 'GROM architecture; AR/VR headsets' },
  { tool: 'Real-Time Gradient Auditing', goal: 'Detect loss landscape poisoning indicators', deployment: 'On-device Gradient Auditor' },
  { tool: 'Differential Privacy on Embeddings', goal: 'Calibrated noise on latent vectors before LLM', deployment: 'DARPA Neuro-AI pipeline' },
  { tool: 'Secure Enclave / TEE', goal: 'Protect seeds, weights, and keys', deployment: 'Intel SGX, ARM TrustZone in BCI firmware' },
  { tool: 'Compliance Auditors', goal: 'Automated neuro-rights statute checks', deployment: 'Regulatory submission pipelines' },
];

const outlook = [
  { trend: 'Increasing Bandwidth of Invasive BCIs', implication: 'Full-sentence, low-latency decoding becomes feasible; security stakes rise dramatically.' },
  { trend: 'Standardization of Neuro-Privacy Laws', implication: 'Global frameworks will mandate privacy-by-design for any BCI-LLM system.' },
  { trend: 'Adversarial-Resistant Architectures', implication: 'New training regimes required to survive active gradient-obfuscation attacks.' },
  { trend: 'Open-Source Neuro-Canary Toolkits', implication: 'Community-driven libraries for privacy-preserving BCI pipelines will emerge.' },
  { trend: 'Human-Centric Evaluation Metrics', implication: 'Cognitive load, user-perceived privacy, and trust will dominate benchmarks.' },
];

const pipelineSteps = [
  { step: '01', label: 'Signal Acquisition', desc: 'EEG (dry/wet), ECoG, or intracortical electrodes' },
  { step: '02', label: 'Pre-processing', desc: 'Band-pass filtering, artifact rejection (ICA, wavelet)' },
  { step: '03', label: 'Feature Extraction', desc: 'Spectral power, phase-locking, learned embeddings' },
  { step: '04', label: 'Neural-to-Semantic Encoder', desc: 'Transformer/RNN mapping to latent intent vector' },
  { step: '05', label: 'Language Generation', desc: 'Prompt-conditioned LLM or lightweight GRU decoder' },
  { step: '06', label: 'Feedback Loop', desc: 'Visual/auditory cues to close loop & improve signal' },
];

interface CollapsibleSectionProps {
  title: string;
  badge: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ title, badge, children, defaultOpen = false }: CollapsibleSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-panel overflow-hidden border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-primary/60 uppercase tracking-[0.3em] px-2 py-0.5 border border-primary/20 bg-primary/5">{badge}</span>
          <span className="text-xs font-mono text-foreground uppercase tracking-wider">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${open ? 'max-h-[4000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

const BCILandscape = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="bci-landscape" className="relative py-32 px-6 border-t border-white/5 bg-background" ref={ref}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />
      <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-accent/6 rounded-full gradient-blob" />

      <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <span className="tag-badge mb-6 inline-block" style={{ borderColor: 'hsl(var(--destructive) / 0.3)', color: 'hsl(var(--destructive))', background: 'hsl(var(--destructive) / 0.08)' }}>
          INTELLIGENCE BRIEFING
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl text-foreground mt-4 mb-4">
          BCI Mind-Reading<br />
          <span className="text-destructive">Landscape 2023–2026.</span>
        </h2>
        <p className="text-body text-muted-foreground text-lg max-w-3xl mb-16 leading-relaxed">
          A primer on demonstrated "mind-reading" capabilities, their common architecture, and the security threats they introduce — the landscape Cognitive Canary was built to defend against.
        </p>

        <div className="space-y-4">
          {/* 1. Core Capabilities */}
          <CollapsibleSection title="Core Capabilities Demonstrated in Recent Research" badge="01" defaultOpen={true}>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {coreCapabilities.map((c, i) => (
                  <div key={i} className="border-b border-white/5 p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-48">
                        <span className="text-foreground font-bold text-xs font-mono">{c.project}</span>
                        <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{c.org}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-primary/80 font-medium mb-2">{c.capability}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Highlights</span>
                            <ul className="mt-1 space-y-0.5">
                              {c.highlights.map((h, j) => (
                                <li key={j} className="text-[10px] font-mono text-white/50 flex gap-1.5">
                                  <span className="text-primary/40 flex-shrink-0">›</span> {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Limitations</span>
                            <ul className="mt-1 space-y-0.5">
                              {c.limitations.map((l, j) => (
                                <li key={j} className="text-[10px] font-mono text-destructive/50 flex gap-1.5">
                                  <span className="text-destructive/30 flex-shrink-0">⚠</span> {l}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* 2. Common Architectural Pattern */}
          <CollapsibleSection title="Common BCI-LLM Architectural Pattern" badge="02">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-2">
                {pipelineSteps.map((s, i) => (
                  <div key={i} className="flex-1 relative group">
                    <div className="glass-panel p-3 border-primary/10 hover:border-primary/30 transition-colors h-full">
                      <div className="text-[9px] font-mono text-primary/40 mb-1">{s.step}</div>
                      <div className="text-[10px] font-mono text-foreground font-bold mb-1">{s.label}</div>
                      <div className="text-[9px] font-mono text-muted-foreground leading-relaxed">{s.desc}</div>
                    </div>
                    {i < pipelineSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-2 text-primary/30 text-xs z-10">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* 3. Security & Privacy Threats */}
          <CollapsibleSection title="Emerging Security & Privacy Threats" badge="03">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {securityThreats.map((t, i) => (
                  <div key={i} className="border-b border-white/5 p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-56">
                        <span className="text-foreground font-bold text-xs font-mono">{t.vector}</span>
                        <p className="text-[9px] text-muted-foreground font-mono mt-1 leading-relaxed">{t.desc}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Evidence</span>
                          <p className="text-[10px] font-mono text-white/50 mt-0.5">{t.example}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Countermeasures</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {t.countermeasures.map((c, j) => (
                              <span key={j} className="text-[9px] font-mono text-primary/60 px-1.5 py-0.5 border border-primary/15 bg-primary/5">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* 4. Mitigation Tools */}
          <CollapsibleSection title="Threat-Mitigation Landscape" badge="04">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-3 text-primary uppercase tracking-widest">Tool / Technique</th>
                    <th className="text-left p-3 text-primary uppercase tracking-widest">Primary Goal</th>
                    <th className="text-left p-3 text-primary uppercase tracking-widest hidden sm:table-cell">Deployment</th>
                  </tr>
                </thead>
                <tbody className="text-white/50">
                  {mitigationTools.map((m, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-foreground font-bold">{m.tool}</td>
                      <td className="p-3">{m.goal}</td>
                      <td className="p-3 hidden sm:table-cell text-white/30">{m.deployment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          {/* 5. Outlook */}
          <CollapsibleSection title="Outlook 2027–2030" badge="05">
            <div className="p-4 space-y-0">
              {outlook.map((o, i) => (
                <div key={i} className="flex gap-4 p-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-shrink-0 w-64">
                    <span className="text-xs font-mono text-foreground font-bold">{o.trend}</span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">{o.implication}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        {/* Takeaway */}
        <div className="mt-8 glass-panel p-6 border-destructive/15 bg-gradient-to-br from-destructive/5 to-transparent">
          <h3 className="text-mono text-[10px] text-destructive/80 uppercase tracking-[0.3em] mb-3 font-bold">Key Takeaway</h3>
          <p className="text-body text-sm text-muted-foreground leading-relaxed">
            Current BCI-LLM research demonstrates impressive intent-to-language capabilities, but the same channels that enable seamless interaction also open a broad attack surface — from passive fingerprinting to active model poisoning. A robust security posture requires <span className="text-foreground font-medium">signal-level obfuscation</span>, <span className="text-foreground font-medium">cryptographic guarantees</span>, <span className="text-foreground font-medium">real-time monitoring</span>, and <span className="text-foreground font-medium">regulatory compliance</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BCILandscape;
