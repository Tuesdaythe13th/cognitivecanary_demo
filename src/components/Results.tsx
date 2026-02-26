import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';

interface Metric {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  prev?: number;
  category: string;
}

const metrics: Metric[] = [
  { label: '2D Mouse Fingerprint Bypass', value: 98.9, suffix: '%', category: 'Evasion', prev: 91.2 },
  { label: 'Keystroke ID Failure Rate', value: 99.3, suffix: '%', category: 'Evasion', prev: 85.4 },
  { label: '3D Lissajous Bypass', value: 99.7, suffix: '%', category: 'Evasion', prev: 0 },
  { label: 'Behavioral Entropy Increase', value: 340, suffix: '%', category: 'Defense' },
  { label: 'Cross-Session Correlation', value: 0.02, suffix: '', prefix: '→ ', category: 'Defense' },
  { label: 'Latency Overhead', value: 0.3, suffix: 'ms', prefix: '<', category: 'Performance' },
  { label: 'Detection Evasion Rate', value: 99.1, suffix: '%', category: 'Evasion', prev: 94.1 },
  { label: 'Active Obfuscation Engines', value: 5, suffix: '', category: 'System' },
];

const classifierResults = [
  { name: 'Random Forest', baseline: 93.2, withCanary: 12.1, bypass: 87.0 },
  { name: 'SVM (RBF kernel)', baseline: 89.7, withCanary: 15.3, bypass: 82.9 },
  { name: 'LSTM', baseline: 91.4, withCanary: 8.7, bypass: 90.5 },
  { name: '1D-CNN', baseline: 94.8, withCanary: 11.2, bypass: 88.2 },
  { name: 'Gradient Boosting', baseline: 92.1, withCanary: 13.8, bypass: 85.0 },
  { name: 'Neural ODE', baseline: 95.3, withCanary: 9.4, bypass: 90.1 },
  { name: 'Transformer', baseline: 96.1, withCanary: 7.8, bypass: 91.9 },
];

const CATEGORY_COLORS: Record<string, string> = {
  Evasion: 'hsl(142, 71%, 45%)',
  Defense: 'hsl(175, 60%, 45%)',
  Performance: 'hsl(280, 60%, 60%)',
  System: 'hsl(38, 95%, 55%)',
};

const AnimatedCounter = ({ value, suffix, prefix, isInView, delay = 0 }: {
  value: number; suffix: string; prefix?: string; isInView: boolean; delay?: number
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      const duration = 2200;
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplay(Number((eased * value).toFixed(value % 1 === 0 ? 0 : value < 1 ? 2 : 1)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      tick();
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  return (
    <span className="text-display text-4xl sm:text-5xl text-foreground">
      {prefix}{display}{suffix}
    </span>
  );
};

const ProgressBar = ({ value, prev, isInView, delay }: { value: number; prev?: number; isInView: boolean; delay: number }) => {
  const [width, setWidth] = useState(0);
  const [prevWidth, setPrevWidth] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      setWidth(value);
      if (prev) setPrevWidth(prev);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, value, prev, delay]);

  if (!prev) return null;

  return (
    <div className="mt-3 space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-mono text-[9px] text-muted-foreground/40 w-8">v5.0</span>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-muted-foreground/25 rounded-full"
            style={{ width: `${prevWidth}%`, transition: 'width 1.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </div>
        <span className="text-mono text-[9px] text-muted-foreground/35 w-10 text-right">{prev}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-mono text-[9px] text-primary w-8">v6.0</span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${width}%`,
              transition: 'width 2.2s cubic-bezier(0.16, 1, 0.3, 1)',
              background: 'linear-gradient(90deg, hsl(142, 71%, 45%), hsl(175, 60%, 45%))',
              boxShadow: '0 0 8px hsl(142, 71%, 50%, 0.4)',
            }}
          />
        </div>
        <span className="text-mono text-[9px] text-primary w-10 text-right">{value}%</span>
      </div>
    </div>
  );
};

const Results = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="results" className="relative py-32 px-6" ref={ref}>
      <div className="section-divider mb-32" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-primary/8 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="tag-badge mb-6 inline-block">BENCHMARKS</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mt-4">
            The numbers<br />speak.
          </h2>
          <p className="text-body text-muted-foreground text-lg max-w-2xl mt-6 leading-relaxed">
            Tested against TypingDNA, BehavioSec, and custom neural classifiers. Results from v6.0 release.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`glass-panel p-6 transition-all duration-700 hover:neon-border-glow group ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Category dot + label */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[m.category] ?? 'hsl(142,71%,45%)' }}
                />
                <span className="text-mono text-[9px] text-muted-foreground/50 tracking-wider uppercase">{m.category}</span>
              </div>
              <AnimatedCounter value={m.value} suffix={m.suffix} prefix={m.prefix} isInView={isInView} delay={i * 80} />
              <p className="text-body text-muted-foreground mt-2 text-xs leading-relaxed">{m.label}</p>
              <ProgressBar value={m.value} prev={m.prev} isInView={isInView} delay={i * 80 + 400} />
            </div>
          ))}
        </div>

        {/* Classifier Comparison Table */}
        <div className={`mt-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <h3 className="text-mono text-[10px] text-primary/60 uppercase tracking-[0.4em] mb-4">
            Performance Against State-of-the-Art Classifiers
          </h3>
          <div className="glass-panel overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-3 text-primary uppercase tracking-widest">Classifier</th>
                    <th className="text-left p-3 text-primary uppercase tracking-widest">Baseline</th>
                    <th className="text-left p-3 text-primary uppercase tracking-widest">With Canary</th>
                    <th className="text-left p-3 text-primary uppercase tracking-widest">Bypass Rate</th>
                  </tr>
                </thead>
                <tbody className="text-white/50">
                  {classifierResults.map((c, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-foreground font-bold">{c.name}</td>
                      <td className="p-3" style={{ color: 'hsla(0, 75%, 60%, 0.8)' }}>{c.baseline}%</td>
                      <td className="p-3 text-primary">{c.withCanary}%</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${c.bypass}%`, boxShadow: '0 0 4px hsla(142,71%,50%,0.4)' }}
                            />
                          </div>
                          <span className="text-primary">{c.bypass}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-primary/20 bg-primary/5">
                    <td className="p-3 text-primary font-black">Average</td>
                    <td className="p-3 text-white/60 font-bold">93.2%</td>
                    <td className="p-3 text-primary font-bold">11.2%</td>
                    <td className="p-3 text-primary font-bold">88.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Usability Metrics */}
        <div className={`mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
          {[
            { label: "Fitts's Law Impact", value: 'p > 0.05', sub: 'No significant increase' },
            { label: 'Task Completion', value: '+2.3%', sub: 'Average time increase' },
            { label: 'User Satisfaction', value: '8.7/10', sub: 'Friction score' },
            { label: 'False Positive Rate', value: '0.3%', sub: 'Bot misclassification' },
          ].map((u, i) => (
            <div key={i} className="glass-panel p-4 border-white/5 text-center">
              <div className="text-lg font-mono font-black text-primary">{u.value}</div>
              <div className="text-[9px] font-mono text-foreground/60 mt-1 uppercase tracking-wider">{u.label}</div>
              <div className="text-[8px] font-mono text-white/20 mt-0.5 uppercase">{u.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
