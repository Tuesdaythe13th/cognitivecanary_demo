import { Link } from 'react-router-dom';
import { ExternalLink, Terminal, Shield, FileText, Activity, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export const landingCopy = {
  hero: {
    eyebrow: "ARTIFEX LABS // RESEARCH PROTOTYPE",
    title: "COGNITIVE CANARY",
    subtitle: "Privacy defenses for behavioral surveillance. Forensic tools for frontier model audits.",
    whyNow: "A research prototype from ARTIFEX LABS exploring how to reduce human-side surveillance exposure while increasing model-side auditability.",
    primaryCta: {
      label: "Enter the Lab",
      href: "/lab",
    },
    secondaryCtas: [
      {
        label: "View Notebook",
        href: "https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq",
        icon: Terminal
      },
      {
        label: "Read Whitepaper",
        href: "/neurorights-2026.html",
        icon: FileText
      },
      {
        label: "View Code",
        href: "https://github.com/Tuesdaythe13th/cognitivecanary_demo",
        icon: ExternalLink
      },
    ],
  },
};

export default function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#BFFF00] selection:text-black relative font-sans overflow-x-hidden grain-overlay">
      {/* Custom Cursor / Glow */}
      <div 
        className="fixed w-[400px] h-[400px] bg-[#BFFF00] rounded-full blur-[120px] opacity-[0.05] pointer-events-none z-0 translate-x-[-50%] translate-y-[-50%]"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      
      {/* Noise layer is included via global class */}
      
      {/* Brutalist Nav */}
      <nav className="brutal-nav">
        <div className="flex flex-col select-none">
          <div className="text-xl font-brutal tracking-tighter text-[#BFFF00]">ARTIFEX LABS</div>
          <div className="text-[8px] font-mono tracking-[0.4em] text-white/40 -mt-1 uppercase">Tuesday // Principal Investigator</div>
        </div>
        <ul className="hidden md:flex gap-8 text-[11px] font-mono tracking-[0.3em] uppercase text-white/40">
          <li className="hover:text-white transition-colors cursor-pointer">Defenses</li>
          <li className="hover:text-white transition-colors cursor-pointer">Forensics</li>
          <li className="hover:text-white transition-colors cursor-pointer">Registry</li>
        </ul>
        <Link 
          to="/lab" 
          className="px-6 py-2 border-2 border-[#BFFF00] text-[#BFFF00] font-mono text-[10px] tracking-[0.2em] hover:bg-[#BFFF00] hover:text-black transition-all font-bold"
        >
          ENTER LAB
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20 relative z-10 overflow-hidden">
        <div className="max-w-7xl w-full mx-auto">
          <div className="mb-8 opacity-40 text-[10px] font-mono tracking-[0.5em] uppercase">
            {landingCopy.hero.eyebrow}
          </div>
          
          <h1 className="hero-word text-[12vw] md:text-[8vw] leading-[0.8] tracking-tighter text-white mb-4">
            COGNITIVE<br />
            <span className="text-[#BFFF00]">CANARY</span>
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12 mt-12 items-end">
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-grotesque font-light leading-snug text-white/80">
                Privacy defenses for <span>behavioral surveillance</span>. <br />
                Forensic tools for <span>frontier model audits</span>.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  to="/lab"
                  className="group flex items-center gap-4 bg-[#BFFF00] text-black px-10 py-6 font-brutal text-lg hover:pr-14 transition-all relative overflow-hidden"
                >
                  <span className="relative z-10">THE LAB</span>
                  <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-20" />
                </Link>
              </div>
            </div>

            <div className="border-l border-[#BFFF00]/20 pl-8 space-y-6">
              <p className="text-xs font-mono text-white/40 leading-relaxed max-w-sm tracking-wide">
                {landingCopy.hero.whyNow}
              </p>
              <div className="flex gap-6">
                 {landingCopy.hero.secondaryCtas.map((cta, i) => (
                    <a key={i} href={cta.href} target="_blank" className="text-white hover:text-[#BFFF00] transition-colors">
                      <cta.icon className="w-5 h-5" />
                    </a>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Tape */}
      <div className="tape-wrapper">
        <div className="tape-text">
          BEHAVIORAL OBFUSCATION ✦ KINEMATIC NOISE ✦ NEURO AUDIT ✦ STRATEGIC FIDELITY ✦ BEHAVIORAL OBFUSCATION ✦ KINEMATIC NOISE ✦ NEURO AUDIT ✦ STRATEGIC FIDELITY ✦
        </div>
      </div>

      {/* Section 2: Big Text / Principles */}
      <section className="py-40 px-6 md:px-20 bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[6vw] md:text-[4vw] font-grotesque font-bold leading-[1.1] tracking-tight text-white/20 uppercase">
            WE BUILD <span className="text-white">DEFENSIVE KINEMATICS</span> THAT BREAK BIOMETRIC TRACKING. <br />
            NO REPRODUCIBILITY. NO FINGERPRINTS. JUST <span className="text-[#BFFF00]">SIGNAL NOISE</span> AND <span className="text-white">RADICAL PRIVACY</span>.
          </p>
        </div>
      </section>

      {/* Operational Surfaces */}
      <section className="py-40 px-6 md:px-20 border-t border-white/5 bg-black relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-brutal tracking-tighter text-white">01 / DEFENSE</h2>
            <div className="p-10 border border-white/10 bg-white/5 hover:border-[#BFFF00]/40 transition-all">
              <Shield className="w-12 h-12 text-[#BFFF00] mb-8" />
              <p className="text-xl font-grotesque font-light text-white/70 leading-relaxed mb-6">
                Protect against behavioral fingerprinting and biometric inference using kinematic noise, timing perturbation, and browser-side obfuscation.
              </p>
              <ul className="space-y-4 font-mono text-[10px] tracking-widest text-white/40 uppercase">
                 <li className="flex items-center gap-3"><span className="text-[#BFFF00]">✦</span> Cursor Obfuscation</li>
                 <li className="flex items-center gap-3"><span className="text-[#BFFF00]">✦</span> Keystroke Jitter</li>
                 <li className="flex items-center gap-3"><span className="text-[#BFFF00]">✦</span> EEG-Oriented Privacy</li>
              </ul>
            </div>
          </div>

          <div className="flex-1 space-y-8 md:pt-40">
            <h2 className="text-4xl font-brutal tracking-tighter text-white">02 / FORENSICS</h2>
            <div className="p-10 border border-white/10 bg-white/5 hover:border-[#BFFF00]/40 transition-all">
              <Activity className="w-12 h-12 text-[#BFFF00] mb-8" />
              <p className="text-xl font-grotesque font-light text-white/70 leading-relaxed mb-6">
                Probe frontier systems for evaluation-aware behavior, strategic inconsistency, and deceptive signals.
              </p>
              <ul className="space-y-4 font-mono text-[10px] tracking-widest text-white/40 uppercase">
                 <li className="flex items-center gap-3"><span className="text-[#BFFF00]">✦</span> Sandbagging Analysis</li>
                 <li className="flex items-center gap-3"><span className="text-[#BFFF00]">✦</span> Inspect Harness</li>
                 <li className="flex items-center gap-3"><span className="text-[#BFFF00]">✦</span> Strategic Fidelity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-20 bg-black border-t-4 border-[#BFFF00] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-[8vw] md:text-[4vw] font-brutal tracking-tighter text-[#BFFF00]">ARTIFEX LABS</h2>
            <p className="text-[10px] font-mono tracking-[0.8em] text-white/40 uppercase">Tuesday // Principal Investigator</p>
          </div>
          
          <div className="flex gap-12 text-[11px] font-mono tracking-[0.4em] uppercase text-white/60">
            <Link to="/lab" className="hover:text-white transition-all">Enter Lab</Link>
            <a href="https://github.com/Tuesdaythe13th/cognitivecanary_demo" className="hover:text-white transition-all">Github</a>
            <a href="#" className="hover:text-white transition-all">Whitepaper</a>
          </div>

          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            © 2026 COGNITIVE CANARY // RESEARCH SPEC // VERSION 7.0
          </div>
        </div>
      </footer>
    </div>
  );
}
