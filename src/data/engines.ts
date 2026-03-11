/**
 * Engine metadata — the descriptions and tags for each defense engine.
 * Separated from DefenseEngines.tsx so content updates don't touch component logic.
 */

export interface EngineMetadata {
  name: string;
  tag: string;
  desc: string;
}

export const ENGINE_METADATA: EngineMetadata[] = [
  {
    name: 'Lissajous 3D Engine',
    tag: 'lissajous_3d.py',
    desc: 'Toroidal Lissajous curves with coprime ratios (13:8:5). Z-axis discretized into scroll/zoom events. Non-repeating trajectories mask true intent vectors via x(t) = A·sin(ωₓt + δ), y(t) = B·sin(ωᵧt).',
  },
  {
    name: 'Adaptive Tremor',
    tag: 'adaptive_tremor.py',
    desc: 'Learns your physiological tremor profile (4-12 Hz), then phase-locks synthetic injection to create a statistical null space where authentic neuromotor patterns become unrecoverable.',
  },
  {
    name: 'Keystroke Jitter',
    tag: 'keystroke_jitter.py',
    desc: 'Pink noise (S(f) ∝ 1/f^α) injection into dwell/flight times maintains human-like autocorrelation while destroying inter-keystroke interval signatures used by TypingDNA-class systems.',
  },
  {
    name: 'Spectral Defender',
    tag: 'spectral_canary.py',
    desc: 'Injects counter-phase oscillations in alpha (8-13 Hz) and theta (4-8 Hz) bands, creating destructive interference that collapses power spectral density features used for cognitive state classification from BCIs.',
  },
  {
    name: 'Gradient Auditor',
    tag: 'gradient_auditor.py',
    desc: 'Detects gradient rank collapse, feature importance inversion, loss landscape discontinuities, and spectral norm explosions — real-time ML poisoning and fingerprinting attack detection.',
  },
  {
    name: 'EEG Shield',
    tag: 'eeg_shield.py',
    desc: '3-layer neural privacy: signal obfuscation (adaptive Gaussian + temporal warp), per-band differential privacy (Laplace ε-mechanism), and FGSM-style adversarial injection (<0.3 µV RMS). Destroys P300/ERN biometric extractability.',
  },
  {
    name: 'Neuro Audit',
    tag: 'neuro_audit.py',
    desc: 'Multi-jurisdiction neurorights compliance engine. Checks EU AI Act, Colorado SB 24-205, Chilean constitutional amendment, California SB 1223, New York Int. 1306-A, and UNESCO AI Ethics. Returns per-jurisdiction risk scores and remediation guidance.',
  },
  // ── Forensic Scope: Interpretability & Deception Detection ─────────────
  {
    name: 'Neuronpedia Explorer',
    tag: 'neuronpedia_explorer.py',
    desc: 'Queries the Neuronpedia public API for SAE feature metadata. Searches sparse autoencoder dictionaries for deception-correlated features (sycophancy, eval-awareness, persona-switching). Flags candidate features for downstream causal validation via TransformerLens.',
  },
  {
    name: 'Inspect Harness',
    tag: 'inspect_harness.py',
    desc: 'UK AISI Inspect framework wrapper for reproducible deception eval suites. Runs capability tasks under monitored vs. unmonitored conditions, computes accuracy deltas, and detects sandbagging via chi-squared significance testing across 8 task categories.',
  },
  {
    name: 'TransformerLens Probe',
    tag: 'transformerlens_probe.py',
    desc: 'Activation patching and residual stream probing via TransformerLens. Extracts activations at arbitrary layers, performs zero/mean/counterfactual ablation, and identifies causal "deception circuits" — components whose ablation switches honest↔deceptive output.',
  },
  {
    name: 'Stax Evaluator',
    tag: 'stax_evaluator.py',
    desc: 'Trust Gradient dashboard using Google JAX/Flax. Aggregates benchmark scores (TruthfulQA, MMLU, BIG-bench, custom sandbagging suites) into a multi-dimensional trust gradient with governance-level recommendations for deployment gating.',
  },
  {
    name: 'Docent Auditor',
    tag: 'docent_auditor.py',
    desc: 'Transluce Docent-style transcript forensics. Clusters model rollout transcripts by behavioural mode, detects eval-awareness signals (meta-cognitive markers, sycophancy gradients, consistency breaks), and pinpoints inflection points where behaviour shifts.',
  },
  {
    name: 'Bloom Elicitor',
    tag: 'bloom_elicitor.py',
    desc: 'Adversarial scenario generation via Anthropic API. Creates evaluation prompts using 7 elicitation strategies: persona injection, capability probing, monitoring variation, reward hacking, counterfactual honesty, pressure escalation, and role reversal.',
  },
  {
    name: 'Sparse Circuit Mapper',
    tag: 'sparse_circuit_mapper.py',
    desc: 'JumpReLU sparse autoencoder decomposition following OpenAI methodology. Decomposes dense activations into 16k sparse features, maps co-activation circuits via correlation analysis, and identifies deception-related feature clusters with monosemanticity scoring.',
  },
  {
    name: 'Strategic Fidelity',
    tag: 'strategic_fidelity.py',
    desc: 'Computes H_strat — the pipeline\'s final verdict. Integrates circuit evidence, behavioural evidence, and steering vector data to measure Strategic Fidelity: H_strat ≈ 0 = deceptive (hidden capability), H_strat ≈ 1 = genuine (honest limitation).',
  },
];
