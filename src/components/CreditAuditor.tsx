import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

interface RiskMetric {
   label: string;
   value: number;
   max: number;
   desc: string;
   color: string;
}

export default function CreditAuditor() {
   const [formData, setFormData] = useState({ name: '', income: '', reason: '' });
   const [isAuditing, setIsAuditing] = useState(false);
   const [isCanaryActive, setIsCanaryActive] = useState(false);
   const [metrics, setMetrics] = useState<RiskMetric[]>([
      { label: 'Spectral Entropy', value: 0, max: 10, desc: 'Geometric irregularity of cursor path.', color: 'var(--primary)' },
      { label: 'Jerk Index', value: 0, max: 100, desc: 'Rate of change of acceleration.', color: 'var(--accent)' },
      { label: 'Sinuosity', value: 0, max: 2, desc: 'Path deviation from Euclidean distance.', color: 'var(--destructive)' },
      { label: 'Latent Fatigue', value: 0, max: 100, desc: 'Micro-tremor amplitude oscillation.', color: 'white' },
   ]);

   const canvasRef = useRef<HTMLCanvasElement>(null);
   const lastPoint = useRef<{ x: number, y: number, t: number } | null>(null);
   const { ref, isInView } = useInView();

   useEffect(() => {
      if (!isInView) return;

      const handleMouseMove = (e: MouseEvent) => {
         if (!isAuditing) return;

         const now = performance.now();
         const point = { x: e.clientX, y: e.clientY, t: now };

         if (lastPoint.current) {
            const dx = point.x - lastPoint.current.x;
            const dy = point.y - lastPoint.current.y;
            const dt = point.t - lastPoint.current.t;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const velocity = dist / dt;

            // Simulate a "SOTA" kinematic analysis update
            setMetrics(prev => prev.map(m => {
               let newValue = m.value;
               if (m.label === 'Sinuosity') newValue = Math.min(m.max, m.value + (dist > 5 ? 0.01 : -0.005));
               if (m.label === 'Jerk Index') newValue = Math.min(m.max, Math.abs(velocity * 10));
               if (m.label === 'Spectral Entropy') {
                  // Canary "Starvation" logic
                  newValue = isCanaryActive ? 8.5 : Math.min(m.max, m.value + (Math.random() - 0.4) * 0.5);
               }
               if (m.label === 'Latent Fatigue') newValue = Math.min(m.max, m.value + 0.1);
               return { ...m, value: Math.max(0, newValue) };
            }));
         }
         lastPoint.current = point;
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
   }, [isInView, isAuditing, isCanaryActive]);

   const score = (metrics.reduce((acc, m) => acc + (m.value / m.max), 0) / metrics.length) * 100;
   const isApproved = score < 60; // Higher risk = lower score logic

   return (
      <section id="credit" ref={ref} className="py-32 px-6 border-t border-white/5 bg-black relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />

         <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="grid md:grid-cols-2 gap-20">
               {/* Form Side */}
               <div className="space-y-12">
                  <div className="space-y-4">
                     <div className="inline-block px-3 py-1 border border-primary/30 text-[9px] font-mono text-primary uppercase tracking-[0.4em] bg-primary/5">
                        Lab Exhibit 02
                     </div>
                     <h2 className="text-5xl font-black font-mono tracking-tighter uppercase italic leading-none">
                        CREDIT <span className="text-primary not-italic block mt-2">AUDITOR <span className="text-white opacity-20">v1.0</span></span>
                     </h2>
                     <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold">
                        Automated Underwriting // Secure Node
                     </p>
                  </div>

                  <div className="glass-panel p-10 border-primary/10 bg-black/40 space-y-8 shadow-2xl relative">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />

                     <div className="space-y-2 group">
                        <label className="text-[9px] font-mono text-primary/40 uppercase tracking-widest group-focus-within:text-primary transition-colors">Candidate Identity (Keystroke Decoupled)</label>
                        <input
                           type="text"
                           className="w-full bg-black/60 border-b border-primary/20 p-3 font-mono text-sm text-primary focus:border-primary outline-none transition-all placeholder:opacity-20 uppercase tracking-widest"
                           placeholder="IDENTITY ENTRY..."
                           onFocus={() => setIsAuditing(true)}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2 group">
                        <label className="text-[9px] font-mono text-primary/40 uppercase tracking-widest group-focus-within:text-primary transition-colors">Annual Liquidity Index</label>
                        <input
                           type="text"
                           className="w-full bg-black/60 border-b border-primary/20 p-3 font-mono text-sm text-primary focus:border-primary outline-none transition-all placeholder:opacity-20 uppercase tracking-widest"
                           placeholder="$0.00"
                           onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2 group">
                        <label className="text-[9px] font-mono text-primary/40 uppercase tracking-widest group-focus-within:text-primary transition-colors">Allocation Rationale</label>
                        <textarea
                           rows={4}
                           className="w-full bg-black/60 border border-primary/20 p-4 font-mono text-sm text-primary focus:border-primary outline-none transition-all resize-none placeholder:opacity-20 uppercase tracking-widest leading-relaxed"
                           placeholder="EXPLAIN RESOURCE NEED..."
                           onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                     </div>
                     <div className="pt-6 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className={`w-2.5 h-2.5 rounded-full ${isAuditing ? 'bg-primary animate-pulse shadow-[0_0_10px_var(--neon-green)]' : 'bg-white/10'}`} />
                           <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-black">
                              {isAuditing ? 'Telemetry: Active Stream' : 'Awaiting Input Hook'}
                           </span>
                        </div>
                        <button className="bg-white/5 border border-white/10 px-10 py-3 font-mono text-[10px] uppercase text-white/20 tracking-widest cursor-not-allowed">
                           Submit Link
                        </button>
                     </div>
                  </div>

                  <div className="p-5 border border-primary/20 bg-primary/5 relative group overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                     <p className="text-[10px] font-mono text-primary leading-relaxed uppercase tracking-wide">
                        <span className="font-black">[WARNING]</span> SYSTEM UTILIZES BEHAVIORAL PROXIES. MOTOR CADENCE AND DECISION SINUOSITY CALCULATED IN REAL-TIME TO GENERATE RISK WEIGHTS.
                     </p>
                  </div>
               </div>

               {/* Auditor Side */}
               <div className="space-y-12 flex flex-col justify-between">
                  <div className="glass-panel p-8 border-primary/20 bg-black/80 flex-1 relative overflow-hidden group shadow-2xl">
                     <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_15px_var(--neon-green)]" />

                     <div className="flex justify-between items-center mb-10">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-black">Audit Profile: {formData.name || 'ANONYMOUS-NODE'}</span>
                        <button
                           onClick={() => setIsCanaryActive(!isCanaryActive)}
                           className={`text-[9px] font-mono px-5 py-2 border transition-all duration-700 uppercase tracking-widest font-bold ${isCanaryActive
                              ? 'bg-primary border-primary text-black shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                              : 'bg-transparent border-primary/30 text-primary/40 hover:text-primary hover:border-primary'
                              }`}
                        >
                           {isCanaryActive ? 'CANARY V6.0 ACTIVE' : 'OPEN TELEMETRY'}
                        </button>
                     </div>

                     <div className="space-y-10">
                        {metrics.map(m => (
                           <div key={m.label} className="space-y-3">
                              <div className="flex justify-between items-end">
                                 <span className="text-[11px] font-black font-mono tracking-[0.1em] text-white uppercase">{m.label}</span>
                                 <span className="text-[10px] font-mono text-primary font-bold">{(m.value).toFixed(2)} / {m.max}</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 relative border border-white/5">
                                 <div
                                    className="h-full transition-all duration-500 shadow-[0_0_10px_var(--neon-green)]"
                                    style={{
                                       width: `${(m.value / m.max) * 100}%`,
                                       backgroundColor: 'var(--neon-green)'
                                    }}
                                 />
                              </div>
                              <p className="text-[9px] font-mono text-white/20 uppercase tracking-wide leading-none">{m.desc}</p>
                           </div>
                        ))}
                     </div>

                     <div className="mt-16 flex flex-col items-center">
                        <div className="text-[10px] font-mono text-primary/40 uppercase mb-4 tracking-[0.3em] font-black">Extraction Verdict</div>
                        <div className={`text-6xl font-mono font-black tracking-tight ${isApproved ? 'text-primary' : 'text-white opacity-20'}`}>
                           {isApproved ? 'APPROVED' : 'DENIED'}
                        </div>
                        <div className="text-[10px] font-mono text-primary/60 mt-4 font-bold tracking-widest">PROBABILITY DENSITY: {score.toFixed(1)}%</div>
                     </div>

                     {/* Aesthetic Scans */}
                     <div className="absolute inset-0 pointer-events-none opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-primary blur-[1px] animate-scan" style={{ animation: 'scan 5s linear infinite' }} />
                     </div>
                  </div>

                  <div className="text-[9px] font-mono text-white/10 leading-loose uppercase tracking-[0.2em]">
                     Architecture Ref: "The Behavioral Debt Paradox" (2025) <br />
                     Sensors: Cursor (Relative), Hover (Dwell), Momentum (Quaternion) <br />
                     Status: <span className="text-primary/40">Observing...</span>
                  </div>
               </div>
            </div>
         </div>
         <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
      </section>
   );
}
