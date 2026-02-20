import { useInView } from '@/hooks/useInView';

const threats = [
  { label: 'Cursor Micro-Tremors', desc: 'Your hand\'s physiological tremor (4-12 Hz) creates a unique motor signature. Velocity, acceleration, and trajectory patterns identify you across sessions — more reliably than a password.', icon: '◎' },
  { label: 'Keystroke Dynamics', desc: 'Dwell time, flight time, and typing rhythm form a biometric fingerprint. Commercial systems like TypingDNA and BehavioSec harvest this silently.', icon: '⌨' },
  { label: 'Scroll & Zoom Profiling', desc: 'Your scroll velocity, direction changes, and zoom habits reveal cognitive state, reading speed, and identity — even across different devices.', icon: '↕' },
  { label: 'Neural State Inference', desc: 'EEG headsets and BCI devices decode attention, stress, and fatigue from alpha/theta band ratios. Your cognitive state is being read.', icon: '◇' },
];

const ProblemSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="problem" className="relative py-32 px-6" ref={ref}>
      <div className="section-divider mb-32" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div
          className="transition-all duration-1000"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <span className="tag-badge mb-6 inline-block">THE INFERENCE GAP</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mb-6 mt-4">
            Your behavior<br />is your password.
          </h2>
          <p className="text-body text-muted-foreground text-lg max-w-2xl mb-16 leading-relaxed">
            Encryption protects <em>what you say</em>. Nothing protects <em>how you move</em>. AI systems now infer cognitive states from behavioral metadata alone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threats.map((threat, i) => (
            <div
              key={threat.label}
              className="glass-panel p-8 group hover:neon-border-glow"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
              }}
            >
              <div className="flex items-start gap-5">
                <span className="text-mono text-2xl text-primary/25 group-hover:text-primary/60 transition-colors duration-400 mt-1 flex-shrink-0">
                  {threat.icon}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-mono text-xs text-primary/30 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base text-foreground font-medium" style={{ lineHeight: '1.2' }}>{threat.label}</h3>
                  </div>
                  <p className="text-body text-sm text-muted-foreground leading-relaxed">{threat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
