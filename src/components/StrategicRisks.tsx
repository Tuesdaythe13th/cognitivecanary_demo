import { useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

export default function StrategicRisks() {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const { ref, isInView } = useInView();

   useEffect(() => {
      if (!isInView || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      let animId: number;
      let t = 0;

      const draw = () => {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         const w = canvas.width;
         const h = canvas.height;

         // Brain wave visualization
         ctx.beginPath();
         ctx.strokeStyle = 'hsla(142, 71%, 45%, 0.4)';
         ctx.lineWidth = 1;
         for (let x = 0; x < w; x++) {
            const y = h / 2 + Math.sin(x * 0.05 + t) * 20 * Math.sin(x * 0.01);
            ctx.lineTo(x, y);
         }
         ctx.stroke();

         // Decoding "tokens"
         if (t % 20 < 1) {
            ctx.fillStyle = 'hsla(280, 60%, 60%, 0.8)';
            ctx.font = '8px monospace';
            ctx.fillText('INTENT: SELECT', Math.random() * w, Math.random() * h);
         }

         t += 0.1;
         animId = requestAnimationFrame(draw);
      };

      draw();
      return () => cancelAnimationFrame(animId);
   }, [isInView]);

   return (
      <section id="strategic" ref={ref} className="py-32 px-6 border-t border-white/5 bg-black relative overflow-hidden">
         {/* Internal Section Grid */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />

         <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="grid md:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <div className="space-y-4">
                     <div className="inline-block px-3 py-1 border border-primary/30 text-[9px] font-mono text-primary uppercase tracking-[0.4em] bg-primary/5">
                        Lab Exhibit 03
                     </div>
                     <h2 className="text-6xl font-black font-mono tracking-tighter text-white uppercase italic leading-none">
                        STRATEGIC <span className="text-primary not-italic block mt-2 shadow-[0_0_20px_rgba(0,255,65,0.2)]">RISKS <span className="text-white opacity-20">v0.9</span></span>
                     </h2>
                     <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold">
                        The BCI Frontier // Cognitive Sovereignty
                     </p>
                  </div>

                  <div className="prose prose-invert prose-sm font-mono text-white/60 space-y-6">
                     <p className="leading-relaxed text-[13px] uppercase tracking-wide">
                        As human-computer interaction moves toward direct neural interfaces, the surface area for behavioral harvesting is expanding from cursor trajectories to <span className="text-primary italic font-black">intended cognitive signals</span>.
                     </p>

                     <div className="glass-panel p-8 border-primary/10 bg-black/40 space-y-3 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">[ANALYSIS] Meta's Brain2QWERTY</h4>
                        <p className="text-[11px] leading-relaxed uppercase font-bold text-white/30 group-hover:text-white/60 transition-colors">
                           Utilizing non-invasive MEG/EEG, Meta has demonstrated the ability to decode "intended typing" with as low as <span className="text-primary">19% character error rates</span>. The boundary between thought and digital input is dissolving, creating a permanent "Neural Debt."
                        </p>
                     </div>

                     <div className="glass-panel p-8 border-primary/10 bg-black/40 space-y-3 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">[DETECTION] BCI for RecSys</h4>
                        <p className="text-[11px] leading-relaxed uppercase font-bold text-white/30 group-hover:text-white/60 transition-colors">
                           sEMG wristbands capture <span className="text-primary">pre-movement motor signals</span>. This data provides recommendation algorithms with high-fidelity implicit feedback—capturing your "intention" to click or skip before a muscle even twitches.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="space-y-12">
                  <div className="glass-panel p-1 border-primary/20 bg-black h-[400px] relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                     <div className="absolute inset-0 pointer-events-none opacity-[0.05] grid-bg" />
                     <canvas ref={canvasRef} width={600} height={400} className="w-full h-full opacity-80" />
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-[9px] font-mono text-primary/30 uppercase tracking-[0.8em] animate-pulse font-black">
                           NEURAL TELEMETRY BLOCKED
                        </div>
                     </div>
                     <div className="absolute top-6 left-6 text-[9px] font-mono text-primary animate-pulse font-black tracking-widest">
                        [SIGNAL DECODING ACTIVE...]
                     </div>
                     <div className="absolute bottom-6 right-6 text-[8px] font-mono text-white/20 uppercase tracking-widest">
                        // Latent intent capture: 0.1s
                     </div>
                  </div>

                  <div className="glass-panel p-8 border-primary/20 bg-primary/5 space-y-6">
                     <h3 className="text-[10px] font-black font-mono text-primary uppercase tracking-[0.3em]">Legal Neuro-rights Chokepoint</h3>
                     <table className="w-full text-[10px] font-mono border-collapse">
                        <thead>
                           <tr className="border-b border-primary/20 text-primary uppercase font-black tracking-widest">
                              <th className="text-left pb-3">Jurisdiction</th>
                              <th className="text-left pb-3">Privacy Status</th>
                           </tr>
                        </thead>
                        <tbody className="text-white/40 font-bold uppercase">
                           <tr className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 text-white">Chile</td>
                              <td className="py-4 italic text-[9px] tracking-tighter">Constitutional "Organ Status" — Protection of Psychic Integrity.</td>
                           </tr>
                           <tr className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 text-white">US (CA/CO)</td>
                              <td className="py-4 text-[9px] tracking-tighter">"Sensitive Data" — Standard consumer protection framework.</td>
                           </tr>
                           <tr className="group hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 text-white">Global Area</td>
                              <td className="py-4 text-primary text-[9px] tracking-tighter font-black">Current "Legal Vacuum" regarding automated behavior sampling.</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
