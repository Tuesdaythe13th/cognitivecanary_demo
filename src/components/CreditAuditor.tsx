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
   const { ref, inView } = useInView();

   useEffect(() => {
      if (!inView) return;

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
   }, [inView, isAuditing, isCanaryActive]);

   const score = (metrics.reduce((acc, m) => acc + (m.value / m.max), 0) / metrics.length) * 100;
   const isApproved = score < 60; // Higher risk = lower score logic

   return (
      <section id="credit" ref={ref} className="py-24 px-6 border-t border-border/50 bg-black/60 relative">
         <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
               {/* Form Side */}
               <div className="space-y-8">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-bold font-mono tracking-tighter uppercase italic">
                        Credit<span className="text-destructive font-normal not-italic px-2">Auditor</span> v1.0
                     </h2>
                     <p className="text-xs font-mono text-white/40 uppercase tracking-widest">
                        Automated Underwriting Interface — Secure Terminal
                     </p>
                  </div>

                  <div className="glass-panel p-8 border-white/5 bg-white/[0.02] space-y-6">
                     <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase">Full Name (Verify via Keystroke)</label>
                        <input
                           type="text"
                           className="w-full bg-black/40 border-b border-white/10 p-2 font-mono text-sm focus:border-primary outline-none transition-all"
                           placeholder="IDENTITY ENTRY..."
                           onFocus={() => setIsAuditing(true)}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase">Annual Income</label>
                        <input
                           type="text"
                           className="w-full bg-black/40 border-b border-white/10 p-2 font-mono text-sm focus:border-primary outline-none transition-all"
                           placeholder="$0.00"
                           onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase">Reason for Credit</label>
                        <textarea
                           rows={4}
                           className="w-full bg-black/40 border border-white/10 p-3 font-mono text-sm focus:border-primary outline-none transition-all resize-none"
                           placeholder="EXPLAIN NEED..."
                           onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                     </div>
                     <div className="pt-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${isAuditing ? 'bg-destructive animate-pulse' : 'bg-white/20'}`} />
                           <span className="text-[10px] font-mono text-white/40 uppercase">
                              {isAuditing ? 'Live Telemetry Active' : 'Waiting for Input'}
                           </span>
                        </div>
                        <button className="bg-white/10 border border-white/20 px-8 py-2 font-mono text-xs uppercase hover:bg-white/20 transition-all opacity-50 cursor-not-allowed">
                           Submit Application
                        </button>
                     </div>
                  </div>

                  <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-sm">
                     <p className="text-[11px] font-mono text-destructive leading-tight italic">
                        WARNING: This interface uses behavioral proxies. Your motor cadence and decision sinuosity are analyzed in real-time to determine "willingness to repay."
                     </p>
                  </div>
               </div>

               {/* Auditor Side */}
               <div className="space-y-8 flex flex-col justify-between">
                  <div className="glass-panel p-6 border-white/10 bg-black/40 flex-1 relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-50" />

                     <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-mono uppercase tracking-widest text-white/60">Risk Profile: {formData.name || 'Anonymous'}</span>
                        <button
                           onClick={() => setIsCanaryActive(!isCanaryActive)}
                           className={`text-[10px] font-mono px-3 py-1 border transition-all ${isCanaryActive
                                 ? 'bg-primary/20 border-primary text-primary'
                                 : 'bg-transparent border-white/20 text-white/40 hover:text-white/60 hover:border-white/40'
                              }`}
                        >
                           {isCanaryActive ? '[!] CANARY V6.0 ACTIVE' : 'OPEN TELEMETRY'}
                        </button>
                     </div>

                     <div className="space-y-6">
                        {metrics.map(m => (
                           <div key={m.label} className="space-y-1">
                              <div className="flex justify-between items-end">
                                 <span className="text-[10px] font-bold font-mono tracking-tighter text-white uppercase">{m.label}</span>
                                 <span className="text-[10px] font-mono opacity-40">{(m.value).toFixed(2)} / {m.max}</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 relative">
                                 <div
                                    className="h-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                                    style={{
                                       width: `${(m.value / m.max) * 100}%`,
                                       backgroundColor: m.color
                                    }}
                                 />
                              </div>
                              <p className="text-[8px] font-mono opacity-30 uppercase leading-none">{m.desc}</p>
                           </div>
                        ))}
                     </div>

                     <div className="mt-12 flex flex-col items-center">
                        <div className="text-[10px] font-mono text-white/40 uppercase mb-2">Synthetic Credit Verdict</div>
                        <div className={`text-5xl font-mono font-black tracking-tighter ${isApproved ? 'text-primary' : 'text-destructive'}`}>
                           {isApproved ? 'APPROVED' : 'DENIED'}
                        </div>
                        <div className="text-[10px] font-mono opacity-40 mt-2">RISK SCORE: {score.toFixed(1)}%</div>
                     </div>

                     {/* Aesthetic Scans */}
                     <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <div className="w-full h-full border-[20px] border-white" />
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white animate-scan" style={{ animation: 'scan 4s linear infinite' }} />
                     </div>
                  </div>

                  <div className="text-[10px] font-mono text-white/20 leading-tight uppercase">
                     Architecture Ref: "The Behavioral Debt Paradox" (2025) <br />
                     Sensors: Cursor (Relative), Hover (Dwell), Momentum (Quaternion)
                  </div>
               </div>
            </div>
         </div>
         <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
      </section>
   );
}
