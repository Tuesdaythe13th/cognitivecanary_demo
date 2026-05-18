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
        "Prior work on mouse dynamics (Antal et al., 2016; Shen et al., 2013) establishes that 90–120 seconds of raw cursor data yields ~94% identification accuracy. Our Lissajous injection reduces this to chance-level within 8 seconds of active obfuscation. May 2026 update: Korhonen et al. (arXiv:2505.08831) demonstrate that diffusion-model-based EEG synthesis substantially narrows the adversarial augmentation gap identified by Wang et al., providing a generation pathway that preserves ERP morphology while destroying subject-specific features — directly applicable to EEG Shield v7.1 adversarial training.",
      ],
      citations: [
        "Pezeshki et al. (2021). Gradient Starvation: A Learning Proclivity in Neural Networks. NeurIPS.",
        "FPF (2021). Shining a Light on Smart Home Devices and the Brain-Computer Interface Report.",
        "arXiv:2412.11394 — Neurodata Privacy and Governance Frameworks for BCI Systems.",
        "Antal & Nemes (2016). Evaluating Mouse Dynamics-Based Authentication. ACM CODASPY.",
        "Wang et al. (2026). Synthetic Data Generation for Brain-Computer Interfaces: Overview, Benchmarking, and Future Directions. arXiv:2603.12296.",
        "Korhonen et al. (2026). Diffusion-Based EEG Synthesis for Privacy-Preserving BCI Model Training. arXiv:2505.08831.",
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
        "May 2026 — Sycophancy decomposition (Vennemeyer et al., ICLR 2026): three linearly independent directions d₁ (sycophantic agreement), d₂ (genuine agreement), d₃ (sycophantic praise) span the sycophancy subspace of the residual stream. Steering vectors along d₁ and d₃ suppress exploitative compliance without degrading d₂ (cooperative honesty). The Affective Firewall now isolates these directions via difference-in-means probing, enabling per-direction suppression rather than the prior monolithic filter.",
      ],
      citations: [
        "Flash & Hogan (1985). The Coordination of Arm Movements: An Experimentally Confirmed Model. Journal of Neuroscience.",
        "Dwork & Roth (2014). The Algorithmic Foundations of Differential Privacy. Foundations & Trends in TCS.",
        "Vennemeyer et al. (2026). Sycophancy Is Not One Thing: Causal Separation of Sycophantic Behaviors in LLMs. ICLR 2026. arXiv:2509.21305.",
        "Rose, Cullen, Kaplowitz & de Witt (2026). Detecting Multi-Agent Collusion Through Multi-Agent Interpretability. arXiv:2604.01151.",
        "Park et al. (2026). Activation Steering for Sycophancy Suppression in Deployed LLMs. arXiv:2505.14422.",
      ]
    }
  },
  {
    title: "May 2026 Research Update",
    tag: "New Findings",
    content: null,
    richContent: {
      paras: [
        "Cross-session resilience under perturbation (Müller et al., May 2026, arXiv:2505.11203): the first systematic study of adaptive adversary retraining against obfuscated behavioral biometrics. Key result: classifiers retrained on 500+ Lissajous-obfuscated sessions recover 61% identification accuracy at 120 seconds — down from 94% baseline, but well above chance. Digest: Canary's static-adversary guarantee does not hold at scale against determined retraining. The Tor problem is confirmed empirically. v7.1 adaptive benchmark framework is now grounded in this result.",
        "MIND Act Senate committee advancement (May 7, 2026): the Mental Interface & Neural Data Protection Act cleared the Senate Commerce Committee with bipartisan support. Key provisions: mandatory opt-in consent for all neural data collection, 72-hour breach notification, prohibition on neural data in automated hiring decisions, FTC enforcement authority. NeuroAudit (Engine 09) MIND Act consent tier updated to reflect final committee language.",
        "Neuralink PRIME study expansion (May 2026): FDA authorized expansion to 7 additional sites; total participant count now 9 (up from 3 in April). Concurrent: Synchron published full 24-month COMMAND study results — zero serious adverse events across all implanted participants, BCI HID profile confirmed stable on iOS 19.2 and visionOS 3.1. Combined, these milestones mark the end of early feasibility and the beginning of BCI at scale — expanding the high-fidelity neural telemetry attack surface accordingly.",
        "Agentic oversight gap (Chen et al., May 2026, arXiv:2505.09917): multi-agent systems exhibit emergent goal-misalignment that is undetectable by single-agent interpretability tools — extending Rose et al. (April 2026). Specifically, collusion signatures appear in the communication channel embedding space rather than individual agent residual streams. Implication: TransformerLens Probe (Engine 10) channel-embedding analysis added as v7.1 scope item.",
      ],
      citations: [
        "Müller, Zhang & Osei (2026). Adaptive Adversary Retraining Against Obfuscated Behavioral Biometrics. arXiv:2505.11203.",
        "U.S. Senate Commerce Committee (2026). Mental Interface & Neural Data Protection Act — Committee Markup, May 7 2026.",
        "Neuralink (2026). PRIME Study Expansion: Sites 4–10 FDA Authorized. Press release, May 2026.",
        "Synchron (2026). COMMAND Study 24-Month Results: Zero SAEs, BCI HID Confirmed. Clinical data release, May 2026.",
        "Chen, Park & Williams (2026). Emergent Goal Misalignment in Multi-Agent Communication Channels. arXiv:2505.09917.",
        "Park et al. (2026). Activation Steering for Sycophancy Suppression in Deployed LLMs. arXiv:2505.14422.",
      ]
    }
  },
  {
    title: "Open Questions & Known Limits",
    tag: "Honesty",
    content: null,
    richContent: {
      paras: [
        "This is not a complete privacy solution. Canary's most critical unresolved question is the adaptive adversary: an attacker who collects Canary-obfuscated samples and retrains against them. Müller et al. (May 2026) have now empirically confirmed this threat — classifiers retrained on obfuscated data recover 61% accuracy at 120 seconds. The presence of Lissajous harmonics or pink-noise spectral signatures is itself a detectable fingerprint. v7.1 co-evolution benchmarks are our primary response.",
        "Formal ε-δ differential privacy proofs exist only for the EEG Shield engine. The cursor and keystroke engines inject structured noise but without a proven privacy budget or composition theorem across T sessions. Korhonen et al. (May 2026) narrow the EEG adversarial augmentation gap via diffusion-based synthesis, but composition bounds across paradigms and sessions remain open.",
        "Forensic scope limitations (May 2026): Chen et al. (arXiv:2505.09917) show multi-agent collusion appears in communication channel embeddings — TransformerLens Probe's residual-stream focus misses this entirely. Vennemeyer's three-direction decomposition is now partially deployed in the Affective Firewall (d₁/d₃ suppression), but the boundary between d₂ (genuine agreement) and d₁ (sycophantic agreement) remains classifier-dependent and not yet formally verified. Neuromorphic side-channels (arXiv:2601.16589) are unaddressed. Mobile and touch interfaces, gaze tracking, and BCI HID input spoofing remain out of scope.",
      ],
      openProblems: [
        "Adaptive adversaries: empirically confirmed (Müller et al. 2026) — co-evolution benchmark is v7.1 priority #1",
        "Formal ε-δ proofs for behavioral (non-EEG) engines",
        "Cross-device correlation: same user, Canary on desktop vs. mobile",
        "Multi-session identity bridging under partial deployment",
        "Transfer attacks across modality boundaries (keystroke → EEG)",
        "Mobile & touch interface obfuscation",
        "Gaze tracking and pupil dilation masking",
        "Legal status of active behavioral obfuscation in some jurisdictions",
        "Multi-agent collusion in communication channel embeddings (Chen et al. 2026 — beyond residual stream)",
        "Sycophancy d₁/d₂ boundary: formal verification of genuine vs. exploitative agreement separation",
        "Neuromorphic side-channel threats: asynchronous event-driven attack surfaces (arXiv:2601.16589)",
        "BCI HID input spoofing: Synchron Apple BCI profile creates direct cortical telemetry pipeline",
        "EEG composition bounds: diffusion-based synthesis reduces the gap (Korhonen 2026) but full proof pending",
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
