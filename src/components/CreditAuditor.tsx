import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

interface RiskMetric {
  label: string;
  value: number;
  max: number;
  desc: string;
}

export default function CreditAuditor() {
  const [formData, setFormData] = useState({ name: '', income: '', reason: '' });
  const [isAuditing, setIsAuditing] = useState(false);
  const [isCanaryActive, setIsCanaryActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState<'NONE' | 'APPROVED' | 'DENIED'>('NONE');
  
  const [metrics, setMetrics] = useState<RiskMetric[]>([
    { label: 'Spectral Entropy', value: 0.1, max: 10, desc: 'Geometric irregularity of keystroke cadence.' },
    { label: 'Jerk Index', value: 0.5, max: 100, desc: 'Rate of change of acceleration.' },
    { label: 'Sinuosity', value: 0.2, max: 2, desc: 'Path deviation from Euclidean norm.' },
    { label: 'Latent Fatigue', value: 5.0, max: 100, desc: 'Micro-tremor amplitude oscillation.' },
  ]);

  const { ref, isInView } = useInView();
  const lastKeyTime = useRef<number>(0);

  // Simulate telemetry based on interaction
  useEffect(() => {
    if (!isInView || verdict !== 'NONE') return;

    let animId: number;
    let decay = 0.95;

    const loop = () => {
      setMetrics(prev => prev.map(m => {
        let newValue = m.value;
        
        if (isCanaryActive) {
          // Canary is protecting us: metrics flatline to safe baseline
          if (m.label === 'Spectral Entropy') newValue += (1.2 - newValue) * 0.1;
          if (m.label === 'Jerk Index') newValue += (5.0 - newValue) * 0.1;
          if (m.label === 'Sinuosity') newValue += (0.1 - newValue) * 0.1;
          if (m.label === 'Latent Fatigue') newValue += (2.0 - newValue) * 0.1;
        } else {
          // Normal mode: decay towards 0, but inputs will spike it
          newValue *= decay;
          // Add some tiny background noise
          newValue += Math.random() * (m.max * 0.005);
        }
        
        return { ...m, value: Math.max(0, Math.min(m.max, newValue)) };
      }));
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animId);
  }, [isInView, isCanaryActive, verdict]);

  // Handle keystroke telemetry spikes
  const handleKeyDown = () => {
    setIsAuditing(true);
    if (isCanaryActive || verdict !== 'NONE') return;

    const now = performance.now();
    const dt = now - lastKeyTime.current;
    lastKeyTime.current = now;

    // Erratic typing (dt < 50 or dt > 300) causes huge spikes
    const isErratic = dt < 50 || dt > 400;
    
    setMetrics(prev => prev.map(m => {
      let spike = 0;
      if (m.label === 'Spectral Entropy') spike = isErratic ? 2.5 : 0.8;
      if (m.label === 'Jerk Index') spike = isErratic ? 25 : 8;
      if (m.label === 'Sinuosity') spike = isErratic ? 0.4 : 0.1;
      if (m.label === 'Latent Fatigue') spike = 2.0;
      
      return { ...m, value: Math.min(m.max, m.value + spike) };
    }));
  };

  // Calculate overall risk score (0-100)
  const riskScore = (metrics.reduce((acc, m) => acc + (m.value / m.max), 0) / metrics.length) * 100;
  // Trust score is inverse of risk
  const trustScore = 100 - riskScore;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.income || !formData.reason) return;
    
    setIsSubmitting(true);
    setVerdict('NONE');
    
    // Fake network delay for dramatic effect
    setTimeout(() => {
      setIsSubmitting(false);
      // The core demo logic: If canary is off, human typing is too erratic and gets denied.
      // If canary is on, human typing is smoothed out and gets approved.
      if (trustScore > 75) {
        setVerdict('APPROVED');
      } else {
        setVerdict('DENIED');
      }
    }, 2000);
  };

  return (
    <section id="credit" ref={ref} className="py-32 px-6 relative overflow-hidden bg-[#050706]">
      <div className="section-divider mb-32" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] grid-bg" />

      <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        <div className="mb-16">
          <div className="inline-block px-3 py-1 border border-primary/30 text-[9px] font-mono text-primary uppercase tracking-[0.4em] bg-primary/5 mb-6">
            Lab Exhibit 02
          </div>
          <h2 className="text-4xl sm:text-6xl text-foreground font-display mb-4">
            Credit Auditor
          </h2>
          <p className="text-sm font-mono text-muted-foreground/60 max-w-2xl uppercase tracking-widest leading-relaxed">
            Automated underwriting nodes extract your keystroke cadence and physiological tremor to generate hidden neuro-risk weights. 
            Fill out the form to see how you are scored.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT: The Application Form */}
          <div className="electric-card-container theme-green p-[1px]">
            <div className="electric-glow-layer-1" />
            <div className="electric-background-glow" />
            <div className="electric-inner-container relative z-10 bg-[#0a0e0d] p-8 md:p-10 rounded-[1.4em] h-full flex flex-col justify-between">
              
              <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-white font-display text-xl tracking-tight">Financial Allocation Request</h3>
                  <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest mt-1">Identity decoupled // Behavioral proxy active</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${isAuditing ? 'bg-primary animate-[pulse-glow_1s_ease-in-out_infinite]' : 'bg-white/20'}`} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider group-focus-within:text-primary transition-colors">Applicant Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3.5 font-mono text-sm text-white focus:border-primary focus:bg-primary/[0.02] outline-none transition-all placeholder:text-white/20"
                    placeholder="Enter full name"
                    onFocus={() => setIsAuditing(true)}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider group-focus-within:text-primary transition-colors">Requested Liquidity ($)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3.5 font-mono text-sm text-white focus:border-primary focus:bg-primary/[0.02] outline-none transition-all placeholder:text-white/20"
                    placeholder="e.g. 50000"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider group-focus-within:text-primary transition-colors">Allocation Rationale</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-4 font-mono text-sm text-white focus:border-primary focus:bg-primary/[0.02] outline-none transition-all resize-none placeholder:text-white/20 leading-relaxed"
                    placeholder="Please explain in detail why you require this allocation. The system analyzes your typing patterns."
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isSubmitting || verdict !== 'NONE'}
                    className="w-full relative group overflow-hidden rounded-lg bg-primary/10 border border-primary/30 p-4 transition-all hover:bg-primary/20 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
                    <span className="relative z-10 font-mono text-[11px] font-bold text-primary uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                      {isSubmitting ? 'Auditing Neural Signature...' : verdict !== 'NONE' ? 'Application Locked' : 'Submit Allocation Request'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: The Auditor Dashboard */}
          <div className="glass-panel rounded-2xl p-8 md:p-10 h-full flex flex-col relative overflow-hidden bg-black/40 border-white/10 box-shadow-2xl">
            {/* Background warning aesthetic */}
            <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none">
              <svg width="400" height="400" viewBox="0 0 100 100" className="animate-[spin_60s_linear_infinite]"><circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4"/></svg>
            </div>

            <div className="flex justify-between items-start mb-12 relative z-10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Audit Telemetry</span>
                <div className="flex items-center gap-3 mt-2">
                  <div className="text-3xl font-display text-white">Trust Score:</div>
                  <div className={`text-4xl font-mono font-bold ${trustScore > 75 ? 'text-primary' : trustScore > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                     {trustScore.toFixed(0)}
                  </div>
                </div>
              </div>
              
              {/* Canary Toggle */}
              <button
                onClick={() => {
                  setIsCanaryActive(!isCanaryActive);
                  setVerdict('NONE');
                }}
                className={`relative overflow-hidden px-4 py-2 border rounded transition-all duration-300 ${isCanaryActive
                    ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(0,255,65,0.2)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/30'
                  }`}
              >
                {isCanaryActive && <div className="absolute inset-0 bg-primary/20 animate-pulse" />}
                <span className={`relative z-10 text-[9px] font-mono uppercase tracking-widest font-bold ${isCanaryActive ? 'text-primary' : 'text-white/40'}`}>
                  {isCanaryActive ? 'Canary Active' : 'Enable Canary'}
                </span>
              </button>
            </div>

            {/* Metrics Bars */}
            <div className="space-y-8 flex-1 relative z-10">
              {metrics.map(m => {
                const percentage = (m.value / m.max) * 100;
                // Color based on risk level (high percentage = high risk = red)
                const barColor = percentage > 70 ? '#ef4444' : percentage > 40 ? '#eab308' : '#00ff41';
                
                return (
                  <div key={m.label} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">{m.label}</span>
                      <span className="text-[9px] font-mono text-white/40">{(m.value).toFixed(2)} / {m.max}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-100 ease-out"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: barColor,
                          boxShadow: `0 0 10px ${barColor}`
                        }}
                      />
                    </div>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-wide leading-none">{m.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Verdict Overlay */}
            {verdict !== 'NONE' && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                <div className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-4 ${verdict === 'APPROVED' ? 'text-primary' : 'text-red-500'}`}>
                  Extraction Verdict
                </div>
                <h3 className={`text-5xl md:text-6xl font-display mb-6 tracking-tighter ${verdict === 'APPROVED' ? 'text-primary drop-shadow-[0_0_20px_rgba(0,255,65,0.4)]' : 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}>
                  {verdict}
                </h3>
                <p className="text-sm font-mono text-white/60 text-center max-w-sm uppercase tracking-wide leading-relaxed">
                  {verdict === 'APPROVED' 
                    ? 'Behavioral signature verified. Motor cadence falls within acceptable normative bounds.' 
                    : 'Behavioral instability detected. Irregular keystroke cadence indicates high cognitive load or deception.'}
                </p>
                
                <button 
                  onClick={() => {
                    setVerdict('NONE');
                    setFormData({ name: '', income: '', reason: '' });
                  }}
                  className="mt-12 px-6 py-2 border border-white/20 text-white/60 font-mono text-[10px] hover:text-white hover:border-white transition-colors tracking-widest uppercase rounded"
                >
                  Reset Terminal
                </button>
              </div>
            )}
            
            {/* Loading Overlay */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-8">
                 <div className="loader-container transform scale-150 mb-8">
                    <div className="radar" style={{ '--size': '24px', '--loader-accent': 'var(--primary)' } as any}></div>
                 </div>
                 <div className="text-[10px] font-mono text-primary animate-pulse tracking-widest uppercase">
                   Cross-referencing behavioral databanks...
                 </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
}
