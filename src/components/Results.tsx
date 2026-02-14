import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';

interface Metric {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

const metrics: Metric[] = [
  { label: 'Fingerprint Accuracy Reduction', value: 97.3, suffix: '%' },
  { label: 'Behavioral Entropy Increase', value: 340, suffix: '%' },
  { label: 'Cross-Session Correlation', value: 0.02, suffix: '', prefix: '→ ' },
  { label: 'Latency Overhead', value: 0.3, suffix: 'ms', prefix: '<' },
  { label: 'Detection Evasion Rate', value: 99.1, suffix: '%' },
  { label: 'Active Obfuscation Engines', value: 5, suffix: '' },
];

const AnimatedCounter = ({ value, suffix, prefix, isInView }: { value: number; suffix: string; prefix?: string; isInView: boolean }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Number((eased * value).toFixed(value % 1 === 0 ? 0 : value < 1 ? 2 : 1)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [isInView, value]);

  return (
    <span className="text-display text-5xl sm:text-6xl text-foreground">
      {prefix}{display}{suffix}
    </span>
  );
};

const Results = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="results" className="relative py-32 px-6" ref={ref}>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-body-medium text-primary text-sm tracking-[0.3em] uppercase mb-4">Results</p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground">
            The numbers<br />speak.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`glass-panel p-8 transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <AnimatedCounter value={m.value} suffix={m.suffix} prefix={m.prefix} isInView={isInView} />
              <p className="text-body text-muted-foreground mt-3 text-sm">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
