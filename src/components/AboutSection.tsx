import { useInView } from '@/hooks/useInView';

const featureCategories = [
  { category: 'Kinematic', metrics: 'Velocity, Acceleration, Jerk', basis: 'Time derivatives of displacement', inference: 'Motor skill, fatigue, aging' },
  { category: 'Geometric', metrics: 'Curvature, Path Efficiency', basis: 'Path-to-Euclidean ratio', inference: 'Intention, confusion, spatial ability' },
  { category: 'Spectral', metrics: 'PSD, Dominant Frequency', basis: 'Fourier Transform', inference: 'Essential tremor, anxiety, stress' },
  { category: 'Entropic', metrics: 'Spectral Entropy, Shannon', basis: 'Spectrum irregularity', inference: 'Human vs. Bot, cognitive load' },
];

const bciPlatforms = [
  { platform: 'Neuralink', approach: 'Invasive Intracortical', resolution: 'High (1,024 ch)', application: 'Telepathic control' },
  { platform: 'Synchron', approach: 'Endovascular (Stentrode)', resolution: 'Moderate', application: 'Hands-free communication' },
  { platform: 'Precision Neuroscience', approach: 'Surface Micro-ECoG', resolution: 'High (Minimally Invasive)', application: 'Speech & motor recovery' },
  { platform: 'Paradromics', approach: 'Intracortical Array', resolution: 'Ultra-High', application: 'Visual prosthetics' },
];

const coreComponents = [
  {
    id: '01',
    title: 'Lissajous Harmonic Overlay',
    desc: 'Injects small-amplitude Lissajous curves into cursor data using superposition of perpendicular simple harmonic motions. Irrational frequency ratios create non-repeating, complex trajectories that mimic spectral characteristics of human hand movement.',
    math: 'x(t) = A·sin(ωₓt + δ), y(t) = B·sin(ωᵧt)',
  },
  {
    id: '02',
    title: 'Pink Noise Synthesis',
    desc: 'Adds low-variance Gaussian jitter with 1/f spectral structure — a hallmark of biological feedforward control. Ensures cursor movement looks "human" and "natural" while decoupling motion from actual CNS state.',
    math: 'S(f) ∝ 1/f^α, α ≈ 1',
  },
  {
    id: '03',
    title: 'Context-Aware Modulation',
    desc: 'Adjusts injection amplitude based on task sensitivity. High injection during passive browsing, moderate during text editing, low/disabled during precision design, and adaptive during gaming/AR.',
    math: 'Amplitude = f(task_sensitivity)',
  },
  {
    id: '04',
    title: 'Cryptographic Provenance',
    desc: 'Zero-knowledge proofs ensure the defense mechanism doesn\'t become a surveillance sink. Parameters derived from consented baselines using Schnorr-based ZKP.',
    math: 'Prove: ∃s such that P = s·G',
  },
];

const AboutSection = () => {
  const { ref, isInView } = useInView();
  const { ref: ref2, isInView: isInView2 } = useInView();
  const { ref: ref3, isInView: isInView3 } = useInView();

  return (
    <>
      {/* About / Mission */}
      <section id="about" className="relative py-32 px-6 border-t border-white/5 bg-black" ref={ref}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full gradient-blob" />

        <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="tag-badge mb-6 inline-block">ABOUT THE PROJECT</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mt-4 mb-10">
            The Right to Be<br />
            <span className="text-primary">Inscrutable.</span>
          </h2>

          <div className="space-y-8">
            <p className="text-body text-lg text-muted-foreground leading-relaxed max-w-3xl">
              An active defense system that weaponizes <span className="text-foreground font-medium">gradient starvation</span> to establish a technically enforceable Right to Be Inscrutable.
            </p>

            <div className="glass-panel p-8 border-primary/15 bg-gradient-to-br from-primary/5 to-transparent">
              <p className="text-body text-muted-foreground leading-relaxed">
                Modern surveillance infrastructures now target the high-fidelity behavioral telemetry underlying human-computer interaction: mouse movements, keystroke dynamics, gaze patterns, and increasingly, direct neural signals from brain-computer interfaces.
              </p>
              <p className="text-body text-muted-foreground leading-relaxed mt-4">
                <span className="text-foreground font-medium">Cognitive Canary</span> exploits a structural vulnerability in machine learning — <span className="text-primary font-medium">gradient starvation</span> — to establish not a plea for better classifier behavior, but a <em className="text-foreground">technical enforcement</em> of privacy, akin to encryption layers provided by Tor or Signal.
              </p>
            </div>

            {/* Feature Extraction Table */}
            <div className="mt-12">
              <h3 className="text-mono text-[10px] text-primary/60 uppercase tracking-[0.4em] mb-4">Feature Extraction Categories Used in Behavioral Surveillance</h3>
              <div className="glass-panel overflow-hidden border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="text-left p-3 text-primary uppercase tracking-widest">Category</th>
                        <th className="text-left p-3 text-primary uppercase tracking-widest">Metrics</th>
                        <th className="text-left p-3 text-primary uppercase tracking-widest hidden md:table-cell">Mathematical Basis</th>
                        <th className="text-left p-3 text-primary uppercase tracking-widest">Inference Potential</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/50">
                      {featureCategories.map((f, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-foreground font-bold">{f.category}</td>
                          <td className="p-3">{f.metrics}</td>
                          <td className="p-3 hidden md:table-cell text-white/30">{f.basis}</td>
                          <td className="p-3 text-primary/60">{f.inference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BCI Threat Landscape */}
      <section className="relative py-32 px-6 border-t border-white/5 bg-black" ref={ref2}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-accent/8 rounded-full gradient-blob" />

        <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${isInView2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="tag-badge mb-6 inline-block" style={{ borderColor: 'hsl(280 60% 60% / 0.3)', color: 'hsl(280, 60%, 60%)', background: 'hsl(280 60% 60% / 0.08)' }}>
            THE NEURAL FRONTIER
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl text-foreground mt-4 mb-6">
            BCI Privacy<br />
            <span className="text-accent">Threat Surface.</span>
          </h2>
          <p className="text-body text-muted-foreground text-lg max-w-3xl mb-12 leading-relaxed">
            Brain-computer interfaces record high-bandwidth neural data encoding far beyond motor intent: attention states, emotional valence, elements of intended speech, and decision-making processes.
          </p>

          {/* BCI Platforms Table */}
          <div className="glass-panel overflow-hidden border-white/5 mb-12">
            <div className="p-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em]">Contemporary BCI Platforms & Surveillance Potential</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-accent uppercase tracking-widest">Platform</th>
                    <th className="text-left p-3 text-accent uppercase tracking-widest">Approach</th>
                    <th className="text-left p-3 text-accent uppercase tracking-widest hidden sm:table-cell">Resolution</th>
                    <th className="text-left p-3 text-accent uppercase tracking-widest">Application</th>
                  </tr>
                </thead>
                <tbody className="text-white/50">
                  {bciPlatforms.map((b, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-foreground font-bold">{b.platform}</td>
                      <td className="p-3">{b.approach}</td>
                      <td className="p-3 hidden sm:table-cell text-white/30">{b.resolution}</td>
                      <td className="p-3 text-accent/60">{b.application}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gradient Starvation Explanation */}
          <div className="glass-panel p-8 border-primary/15 bg-gradient-to-br from-primary/5 to-transparent">
            <h3 className="text-mono text-xs text-primary uppercase tracking-[0.3em] mb-4 font-bold">The "Clever Hans" Effect in Machine Learning</h3>
            <p className="text-body text-muted-foreground leading-relaxed mb-4">
              Cognitive Canary leverages <span className="text-foreground font-medium">gradient starvation</span> (Pezeshki et al., 2021) — a fundamental learning bias where over-parameterized neural networks capture only the "cheapest" predictive features while ignoring others. Like Clever Hans, the horse that appeared to do arithmetic but responded to subtle cues, neural networks rely on <span className="text-primary font-medium">shortcuts</span> rather than robust features.
            </p>
            <p className="text-body text-muted-foreground leading-relaxed">
              Canary intentionally induces this state by flooding the feature space with synthetic but biologically plausible noise. By making "cheap" spectral features statistically meaningless, Canary forces classifiers into a regime where they <span className="text-foreground italic">fail to develop representations</span> for sensitive neuromotor signatures.
            </p>
          </div>
        </div>
      </section>

      {/* Defensive Engineering */}
      <section className="relative py-32 px-6 border-t border-white/5 bg-black" ref={ref3}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />

        <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${isInView3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="tag-badge mb-6 inline-block">DEFENSIVE ENGINEERING</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl text-foreground mt-4 mb-12">
            How it<br />
            <span className="text-primary">works.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreComponents.map((c, i) => (
              <div
                key={c.id}
                className="glass-panel p-6 group hover:neon-border-glow"
                style={{
                  opacity: isInView3 ? 1 : 0,
                  transform: isInView3 ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-mono text-[10px] text-primary/40">{c.id}</span>
                  <h3 className="text-sm text-foreground font-medium">{c.title}</h3>
                </div>
                <p className="text-body text-xs text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                <div className="bg-black/40 border border-primary/10 px-3 py-2">
                  <code className="text-mono text-[10px] text-primary/60">{c.math}</code>
                </div>
              </div>
            ))}
          </div>

          {/* Context-Aware Modulation Table */}
          <div className="mt-8 glass-panel overflow-hidden border-white/5">
            <div className="p-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em]">Context-Aware Modulation Strategy</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-primary uppercase tracking-widest">Task Type</th>
                    <th className="text-left p-3 text-primary uppercase tracking-widest">Injection</th>
                    <th className="text-left p-3 text-primary uppercase tracking-widest">Rationale</th>
                  </tr>
                </thead>
                <tbody className="text-white/50">
                  {[
                    { task: 'Passive Browsing', injection: 'High', rationale: 'High surveillance stakes; low precision stakes' },
                    { task: 'Text Editing', injection: 'Moderate', rationale: 'Balance obfuscation and character selection' },
                    { task: 'Precision Design', injection: 'Low / Disabled', rationale: 'Fine control critical; usability priority' },
                    { task: 'Gaming / AR', injection: 'Adaptive', rationale: 'Minimized latency; rapid response preservation' },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-foreground font-bold">{r.task}</td>
                      <td className="p-3 text-primary/70">{r.injection}</td>
                      <td className="p-3 text-white/30">{r.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
