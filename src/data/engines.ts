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
];
