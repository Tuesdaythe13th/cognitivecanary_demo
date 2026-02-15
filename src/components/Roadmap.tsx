import { useInView } from '@/hooks/useInView';

const milestones = [
  { version: 'v4.0', date: '2024 Q1', title: 'Foundation', desc: 'Core obfuscation engine with 2D Lissajous cursor rewriting.', done: true },
  { version: 'v5.0', date: '2024 Q3', title: 'Multi-Vector', desc: 'Added keystroke jitter, scroll obfuscation, and adaptive tremor engines.', done: true },
  { version: 'v6.0', date: '2025 Q1', title: 'Entropy Mixer', desc: '3D Lissajous, spectral defense, gradient auditing, session decorrelation.', done: true },
  { version: 'v6.1', date: '2026 Q2', title: 'Federated Guard', desc: 'Federated learning attack detection and cross-device identity unlinking.', done: false, current: true },
  { version: 'v7.0', date: '2026 Q3', title: 'Neural Adversary', desc: 'GAN-based behavioral synthesis for next-gen evasion.', done: false },
  { version: 'v8.0', date: '2026 Q4', title: 'Zero-Knowledge', desc: 'Proof-of-humanity without behavioral exposure.', done: false },
];

const Roadmap = () => {
  const { ref, isInView } = useInView();

  const doneCount = milestones.filter(m => m.done).length;
  const progressPercent = (doneCount / milestones.length) * 100;

  return (
    <section id="roadmap" className="relative py-32 px-6" ref={ref}>
      <div className="section-divider mb-32" />
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-accent/10 rounded-full gradient-blob" />

      <div className="max-w-4xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="tag-badge mb-6 inline-block">TIMELINE</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mt-4">
            What's next.
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line — background */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border" />

          {/* Animated progress line */}
          <div
            className="absolute left-4 md:left-8 top-0 w-px transition-all duration-[2s] ease-out"
            style={{
              height: isInView ? `${progressPercent}%` : '0%',
              background: 'linear-gradient(180deg, hsl(142, 71%, 45%), hsl(175, 60%, 45%))',
              boxShadow: '0 0 8px hsla(142, 71%, 50%, 0.4)',
            }}
          />

          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div
                key={m.version}
                className={`flex items-start gap-6 md:gap-10 pl-4 md:pl-8 relative transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Dot */}
                <div className={`absolute left-4 md:left-8 -translate-x-1/2 w-3 h-3 border-2 transition-all duration-500 ${m.done
                    ? 'bg-primary border-primary'
                    : (m as any).current
                      ? 'bg-background border-primary'
                      : 'bg-background border-muted-foreground/40'
                  }`}
                  style={
                    (m as any).current
                      ? { boxShadow: '0 0 8px hsla(142, 71%, 50%, 0.5)', animation: 'pulse-glow 2s ease-in-out infinite' }
                      : undefined
                  }
                />

                <div className={`glass-panel p-6 ml-6 flex-1 group transition-all duration-300 ${m.done ? 'hover:neon-border-glow' : 'opacity-70'
                  }`}>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-mono text-sm text-primary">{m.version}</span>
                    <span className="text-mono text-[10px] text-muted-foreground/60">{m.date}</span>
                    {m.done && (
                      <span className="text-mono text-[9px] bg-primary/10 text-primary px-2 py-0.5 tracking-wider uppercase border border-primary/20">
                        Shipped
                      </span>
                    )}
                    {(m as any).current && (
                      <span className="text-mono text-[9px] bg-secondary/10 text-secondary px-2 py-0.5 tracking-wider uppercase border border-secondary/20">
                        In Progress
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg text-foreground mb-1" style={{ lineHeight: '1.2' }}>{m.title}</h3>
                  <p className="text-body text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
