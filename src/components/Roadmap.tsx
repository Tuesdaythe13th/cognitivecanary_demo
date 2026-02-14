import { useInView } from '@/hooks/useInView';

const milestones = [
  { version: 'v4.0', date: '2024 Q1', title: 'Foundation', desc: 'Core obfuscation engine with mouse trajectory rewriting.', done: true },
  { version: 'v5.0', date: '2024 Q3', title: 'Multi-Vector', desc: 'Added keystroke, scroll, and click obfuscation engines.', done: true },
  { version: 'v6.0', date: '2025 Q1', title: 'Entropy Mixer', desc: 'Session entropy mixing and cross-session decorrelation.', done: true },
  { version: 'v7.0', date: '2025 Q3', title: 'Neural Adversary', desc: 'GAN-based behavioral synthesis for next-gen evasion.', done: false },
  { version: 'v8.0', date: '2026 Q1', title: 'Zero-Knowledge', desc: 'Proof-of-humanity without behavioral exposure.', done: false },
];

const Roadmap = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="roadmap" className="relative py-32 px-6" ref={ref}>
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-accent/10 rounded-full gradient-blob" />

      <div className="max-w-4xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-body-medium text-primary text-sm tracking-[0.3em] uppercase mb-4">Roadmap</p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground">
            What's next.
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div
                key={m.version}
                className={`flex items-start gap-6 md:gap-10 pl-4 md:pl-8 relative transition-all duration-500 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Dot */}
                <div className={`absolute left-4 md:left-8 -translate-x-1/2 w-3 h-3 border-2 ${
                  m.done ? 'bg-primary border-primary' : 'bg-background border-muted-foreground'
                }`} />

                <div className="glass-panel p-6 ml-6 flex-1 group hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-display text-sm text-primary">{m.version}</span>
                    <span className="text-xs text-muted-foreground text-body-medium">{m.date}</span>
                    {m.done && (
                      <span className="text-xs text-body-medium bg-primary/10 text-primary px-2 py-0.5 tracking-wider uppercase">Shipped</span>
                    )}
                  </div>
                  <h3 className="text-lg text-foreground mb-1" style={{ lineHeight: '1.2' }}>{m.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
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
