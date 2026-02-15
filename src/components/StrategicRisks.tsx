import { useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

export default function StrategicRisks() {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const { ref, inView } = useInView();

   useEffect(() => {
      if (!inView || !canvasRef.current) return;
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
   }, [inView]);

   return (
      <section className="py-24 px-6 border-t border-border/50 bg-black/40 relative overflow-hidden">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <div className="space-y-2">
                  <h2 className="text-4xl font-bold font-mono tracking-tighter text-white uppercase italic decoration-primary underline decoration-4 underline-offset-8">
                     Strategic <span className="text-primary not-italic">Risks</span>
                  </h2>
                  <p className="text-xs font-mono text-white/40 uppercase tracking-widest mt-4">
                     The BCI Frontier & The Right to be Inscrutable
                  </p>
               </div>

               <div className="prose prose-invert prose-sm font-mono text-white/60 space-y-4">
                  <p>
                     As human-computer interaction moves toward direct neural interfaces, the surface area for behavioral harvesting is expanding from cursor trajectories to <span className="text-white italic">intended cognitive signals</span>.
                  </p>

                  <div className="glass-panel p-6 border-white/5 bg-white/[0.02]">
                     <h4 className="text-xs font-bold text-primary mb-2 uppercase">Meta's Brain2QWERTY</h4>
                     <p className="text-[11px] leading-relaxed">
                        Utilizing non-invasive MEG/EEG, Meta has demonstrated the ability to decode "intended typing" with as low as <span className="text-white font-bold">19% character error rates</span>. The boundary between thought and digital input is dissolving, creating a permanent "Neural Debt."
                     </p>
                  </div>

                  <div className="glass-panel p-6 border-white/5 bg-white/[0.02]">
                     <h4 className="text-xs font-bold text-accent mb-2 uppercase">BCI for RecSys</h4>
                     <p className="text-[11px] leading-relaxed">
                        sEMG wristbands (Meta Reality Labs) capture <span className="text-white font-bold">pre-movement motor signals</span>. This data provides recommendation algorithms with high-fidelity implicit feedback—capturing your "intention" to click or skip before a muscle even twitches.
                     </p>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="glass-panel p-1 border-white/10 bg-black h-80 relative overflow-hidden group">
                  <canvas ref={canvasRef} width={600} height={320} className="w-full h-full opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] animate-pulse">
                        SCANNED: NEURAL TELEMETRY
                     </div>
                  </div>
                  <div className="absolute top-4 left-4 text-[8px] font-mono text-primary animate-pulse">
                     SIGNAL DECODING... [SOTA: EEG/MEG TRANSFORMER]
                  </div>
               </div>

               <div className="glass-panel p-6 border-destructive/20 bg-destructive/5 space-y-4">
                  <h3 className="text-xs font-bold font-mono text-destructive uppercase tracking-widest">Legal Neuro-rights Chokepoint</h3>
                  <table className="w-full text-[10px] font-mono border-collapse">
                     <thead>
                        <tr className="border-b border-white/10 text-white/40 uppercase">
                           <th className="text-left pb-2">Jurisdiction</th>
                           <th className="text-left pb-2">Privacy Status</th>
                        </tr>
                     </thead>
                     <tbody className="text-white/60">
                        <tr className="border-b border-white/5">
                           <td className="py-2 text-white">Chile</td>
                           <td className="py-2 italic">Constitutional "Organ Status" — Protection of Psychic Integrity.</td>
                        </tr>
                        <tr className="border-b border-white/5">
                           <td className="py-2 text-white">US (CA/CO)</td>
                           <td className="py-2">"Sensitive Data" — Standard consumer protection framework.</td>
                        </tr>
                        <tr>
                           <td className="py-2 text-white">Global Scope</td>
                           <td className="py-2 text-destructive">Current "Legal Vacuum" regarding automated behavior sampling.</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </section>
   );
}
