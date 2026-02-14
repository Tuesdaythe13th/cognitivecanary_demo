import { useInView } from '@/hooks/useInView';

const steps = [
  { id: 'INPUT', label: 'Raw Input', desc: 'Mouse, keyboard, scroll events' },
  { id: 'INTERCEPT', label: 'Event Interceptor', desc: 'Captures all behavioral signals' },
  { id: 'ANALYZE', label: 'Pattern Analyzer', desc: 'Detects fingerprintable patterns' },
  { id: 'OBFUSCATE', label: 'Obfuscation Core', desc: '5 engines run in parallel' },
  { id: 'INJECT', label: 'Signal Injector', desc: 'Replaces original with synthetic' },
  { id: 'OUTPUT', label: 'Clean Output', desc: 'Unidentifiable behavioral data' },
];

const Architecture = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="architecture" className="relative py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-body-medium text-primary text-sm tracking-[0.3em] uppercase mb-4">Architecture</p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground">
            The pipeline.
          </h2>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`glass-panel p-5 text-center group hover:border-primary/50 transition-all duration-500 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className="text-display text-xs text-primary tracking-[0.2em] block mb-2">{step.id}</span>
                <h3 className="text-sm text-foreground mb-1" style={{ lineHeight: '1.2' }}>{step.label}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
                {i < steps.length - 1 && (
                  <span className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-primary text-lg">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
