import { useInView } from '@/hooks/useInView';

const threats = [
  { label: 'Mouse Dynamics', desc: 'Cursor velocity, acceleration, and trajectory patterns uniquely identify you across sessions.' },
  { label: 'Keystroke Biometrics', desc: 'Dwell time, flight time, and typing rhythm create a fingerprint more unique than your password.' },
  { label: 'Scroll Behavior', desc: 'Scroll speed, direction changes, and pause patterns reveal cognitive state and identity.' },
  { label: 'Click Patterns', desc: 'Click timing, pressure, and target area preferences are silently harvested.' },
];

const ProblemSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="problem" className="relative py-32 px-6" ref={ref}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-body-medium text-primary text-sm tracking-[0.3em] uppercase mb-4">The Problem</p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mb-16">
            Your behavior<br />is your password.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {threats.map((threat, i) => (
            <div
              key={threat.label}
              className={`glass-panel p-8 group hover:border-primary/50 transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="text-display text-4xl text-primary/40 group-hover:text-primary transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl text-foreground mb-2" style={{ lineHeight: '1.2' }}>{threat.label}</h3>
                  <p className="text-body text-muted-foreground leading-relaxed">{threat.desc}</p>
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
