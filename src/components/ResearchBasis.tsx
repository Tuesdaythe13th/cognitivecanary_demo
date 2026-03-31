import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MODULES = [
  {
    title: "Empirical Basis",
    content: "Our defenses are grounded in recent BCI privacy literature and behavioral gradient starvation models. By exploiting the sensitivity of standard classifiers (e.g., Random Forests, CNNs) to timing and spatial variance, Canary forces a drop in model confidence. Prior work highlights that biometric models rely heavily on low-frequency structural components; targeting these frequencies allows high evasion with minimal UX cost. [Citations: FPF 2021 BCI Report, arXiv:2412.11394]"
  },
  {
    title: "Mathematical Intuition",
    content: "Canary employs dynamic phase scrambling and kinematic perturbation functions, modeled via generalized Lissajous curves for 3D trajectory synthesis. In a standard continuous-time trajectory T(t), our perturbation engine injects a noise profile N(t) such that the Pearson correlation between T(t) and T'(t) = T(t) + N(t) falls below the classification threshold ε. This breaks cross-session correlation without violating Fitts's Law constraints."
  },
  {
    title: "Open Questions & Limits",
    content: "The defense is not absolute. Unanswered questions include the threat of adaptive adversaries (e.g., reinforcement learning agents trained specifically on Canary-obfuscated data) and limits on transfer attacks across modality boundaries. Usability limits in extremely high-precision tasks (e.g., competitive gaming, microsurgery interfaces) necessitate disabling obfuscation, exposing the user during those active windows."
  }
];

export default function ResearchBasis() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 px-6 md:px-20 bg-black relative z-10 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.5em] text-[#BFFF00] uppercase mb-4">Scientific Scaffolding</p>
          <h2 className="text-4xl md:text-5xl font-brutal tracking-tighter text-white">RESEARCH BASIS</h2>
        </div>

        <div className="space-y-4">
          {MODULES.map((mod, i) => (
            <div key={i} className="border border-white/10 bg-white/[0.02]">
              <button 
                className="w-full flex items-center justify-between p-6 hover:bg-white/[0.05] transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-lg font-brutal text-white">{mod.title}</span>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
              </button>
              
              {openIndex === i && (
                <div className="p-6 pt-0 text-white/60 font-grotesque leading-relaxed text-sm animate-in slide-in-from-top-2">
                  {mod.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
