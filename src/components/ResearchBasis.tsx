import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MODULES = [
  {
    title: "Empirical Basis",
    tag: "Grounding",
    content: null,
    richContent: {
      paras: [
        "Canary's defense strategy is grounded in the gradient starvation phenomenon (Pezeshki et al., 2021): classifiers over-relying on dominant low-frequency features are brittle to structured perturbation of exactly those features. By injecting variance into inter-keystroke intervals, cursor trajectory curvature, and EEG band power, we systematically deny classifiers the stable statistical structures they require.",
        "BCI privacy literature (FPF 2021 Brain-Computer Interface Report; arXiv:2412.11394) confirms that neural data is uniquely re-identifiable: a single 30-second EEG segment carries sufficient entropy to link a user across sessions with >93% accuracy using standard CNNs. A 2024 Neurorights Foundation audit of 30 consumer neurotechnology companies found that 96.7% reserve the right to transfer brain data to third parties, fewer than 20% mention encryption, and only 16.7% commit to breach notification. Wang et al. (2026) provide the first systematic benchmarking of synthetic EEG generation across four BCI paradigms, establishing evaluation scaffolding for adversarial augmentation strategies (arXiv:2603.12296). Behavioral biometric classifiers (TypingDNA, BioCatch, IDmission) similarly operate on sub-500ms micro-timing windows — well within our perturbation envelope.",
        "Prior work on mouse dynamics (Antal et al., 2016; Shen et al., 2013) establishes that 90–120 seconds of raw cursor data yields ~94% identification accuracy. Our Lissajous injection reduces this to chance-level within 8 seconds of active obfuscation.",
      ],
      citations: [
        "Pezeshki et al. (2021). Gradient Starvation: A Learning Proclivity in Neural Networks. NeurIPS.",
        "FPF (2021). Shining a Light on Smart Home Devices and the Brain-Computer Interface Report.",
        "arXiv:2412.11394 — Neurodata Privacy and Governance Frameworks for BCI Systems.",
        "Antal & Nemes (2016). Evaluating Mouse Dynamics-Based Authentication. ACM CODASPY.",
        "Wang et al. (2026). Synthetic Data Generation for Brain-Computer Interfaces: Overview, Benchmarking, and Future Directions. arXiv:2603.12296.",
        "Neurorights Foundation (2024). Industry Audit: Neural Data Governance in Consumer Neurotechnology Companies.",
      ]
    }
  },
  {
    title: "Mathematical Intuition",
    tag: "Formalism",
    content: null,
    richContent: {
      paras: [
        "For a raw behavioral trajectory T(t), let F: T → [0,1] be a trained classifier. Our goal is to find a perturbation function N(t) such that F(T(t) + N(t)) ≈ 1/C (random chance over C classes), while preserving Fitts's Law throughput constraints.",
        "Keystroke Jitter uses Laplace-distributed additive noise on inter-keystroke intervals (IKI) with sensitivity Δf = max|IKI_real - IKI_perturbed| ≤ 50ms. For 1/f^α pink noise (α ≈ 1.0), this preserves the autocorrelation structure of human typing while destroying individual identity cues. Formal ε-differential privacy bounds per keystroke are a v7.1 research target.",
        "The Lissajous 3D engine generates cursor trajectories via x(t) = A·sin(ω₁t + φ₁), y(t) = B·sin(ω₂t + φ₂), z(t) = C·sin(ω₃t + φ₃), with coprime frequency ratios (13:8:5) ensuring non-repeating, biomechanically plausible paths. The injection amplitude is dynamically scaled to keep Pearson correlation ρ(T, T') < ε_threshold without violating minimum-jerk trajectory constraints (Flash & Hogan, 1985).",
      ],
      citations: [
        "Flash & Hogan (1985). The Coordination of Arm Movements: An Experimentally Confirmed Model. Journal of Neuroscience.",
        "Dwork & Roth (2014). The Algorithmic Foundations of Differential Privacy. Foundations & Trends in TCS.",
        "Vennemeyer et al. (2026). Sycophancy Is Not One Thing: Causal Separation of Sycophantic Behaviors in LLMs. ICLR 2026. arXiv:2509.21305.",
        "Rose, Cullen, Kaplowitz & de Witt (2026). Detecting Multi-Agent Collusion Through Multi-Agent Interpretability. arXiv:2604.01151.",
      ]
    }
  },
  {
    title: "Open Questions & Known Limits",
    tag: "Honesty",
    content: null,
    richContent: {
      paras: [
        "This is not a complete privacy solution. Canary's most critical unresolved question is the adaptive adversary: an attacker who collects Canary-obfuscated samples and retrains against them. The presence of Lissajous harmonics or pink-noise spectral signatures could itself become a detectable fingerprint — the same way Tor's encrypted traffic is a signal. We call this the Tor problem for behavioral obfuscation, and it is the primary focus of v7.1.",
        "Formal ε-δ differential privacy proofs exist only for the EEG Shield engine. The cursor and keystroke engines inject structured noise but without a proven privacy budget or composition theorem across T sessions. This means the privacy guarantee weakens over long interactions in ways we cannot yet bound mathematically. Wang et al. (2026) benchmark four paradigms of synthetic EEG generation; the adversarial augmentation gap in EEG Shield is now partially addressable via model-based generation, but composition bounds remain open.",
        "Forensic scope limitations (April 2026): Vennemeyer et al. (ICLR 2026) show sycophancy decomposes into at least three independently steerable directions; our Affective Firewall previously treated it as monolithic. Rose et al. (2026) demonstrate that multi-agent collusion requires group-level activation aggregation — single-agent probes are systematically blind to coordinated deception. Both gaps are targeted for v7.1. Neuromorphic side-channel attacks (arXiv:2601.16589) introduce asynchronous event-driven threat surfaces not yet covered by the Gradient Auditor taxonomy. Usability limits: mobile and touch interfaces entirely unsupported; gaze tracking unaddressed.",
      ],
      openProblems: [
        "Adaptive adversaries: classifier retraining on obfuscated data (Tor problem)",
        "Formal ε-δ proofs for behavioral (non-EEG) engines",
        "Cross-device correlation: same user, Canary on desktop vs. mobile",
        "Multi-session identity bridging under partial deployment",
        "Transfer attacks across modality boundaries (keystroke → EEG)",
        "Mobile & touch interface obfuscation",
        "Gaze tracking and pupil dilation masking",
        "Legal status of active behavioral obfuscation in some jurisdictions",
        "Multi-agent collusion detection: group-level activation aggregation (Rose et al. 2026)",
        "Sycophancy causal decomposition in Affective Firewall: 3 independently steerable directions (Vennemeyer et al. ICLR 2026)",
        "Neuromorphic side-channel threats: asynchronous event-driven attack surfaces (arXiv:2601.16589)",
        "Synthetic EEG adversarial augmentation: composition bounds under model-based generation (Wang et al. 2026)",
      ]
    }
  }
];

export default function ResearchBasis() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 px-6 md:px-20 bg-black relative z-10 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.5em] text-[#BFFF00] uppercase mb-4">Scientific Scaffolding</p>
          <h2 className="text-4xl md:text-5xl font-brutal tracking-tighter text-white">RESEARCH BASIS</h2>
          <p className="text-sm font-mono text-white/30 mt-4 max-w-xl mx-auto leading-relaxed">
            We state what we know, what we don't, and where the gaps are. Trust is built by defining the envelope of validity.
          </p>
        </div>

        <div className="space-y-4">
          {MODULES.map((mod, i) => (
            <div key={i} className="border border-white/10 bg-white/[0.02]">
              <button
                className="w-full flex items-center justify-between p-6 hover:bg-white/[0.05] transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-brutal text-white">{mod.title}</span>
                  <span className="hidden sm:inline text-[9px] font-mono border border-white/10 text-white/30 px-2 py-0.5 uppercase tracking-wider">{mod.tag}</span>
                </div>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-white/50 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-white/50 flex-shrink-0" />}
              </button>

              {openIndex === i && mod.richContent && (
                <div className="p-6 pt-0 space-y-6 animate-in slide-in-from-top-2">
                  <div className="space-y-4">
                    {mod.richContent.paras.map((para, j) => (
                      <p key={j} className="text-white/60 font-grotesque leading-relaxed text-sm">{para}</p>
                    ))}
                  </div>

                  {mod.richContent.citations && (
                    <div className="border-t border-white/10 pt-4 space-y-1">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-2">References</p>
                      {mod.richContent.citations.map((cite, j) => (
                        <p key={j} className="text-[10px] font-mono text-white/25 leading-snug">— {cite}</p>
                      ))}
                    </div>
                  )}

                  {mod.richContent.openProblems && (
                    <div className="border-t border-red-500/20 pt-4 space-y-2">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-red-400/70 mb-2">Unresolved Open Problems</p>
                      {mod.richContent.openProblems.map((prob, j) => (
                        <div key={j} className="flex gap-3">
                          <span className="text-red-500/40 text-xs flex-shrink-0">?</span>
                          <p className="text-[10px] font-mono text-white/40 leading-snug">{prob}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
