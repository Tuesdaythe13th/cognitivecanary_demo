import { Link } from 'react-router-dom';
import { ExternalLink, Terminal, Shield, FileText, Activity, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

// Simple hook for scroll-based reveal on the Landing page
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

export default function Landing() {
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
  const [heroReady, setHeroReady] = useState(false);
  const principlesReveal = useReveal();
  const operationsReveal = useReveal();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handleMouseMove = (e: MouseEvent) => {
      if (!prefersReduced) setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    // Stagger hero entrance
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => { window.removeEventListener('mousemove', handleMouseMove); clearTimeout(t); };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#BFFF00] selection:text-black relative font-sans overflow-x-hidden grain-overlay">
      {/* Cursor / Glow — only renders after first mouse move */}
      {mousePos.x > 0 && (
        <div
          className="fixed w-[500px] h-[500px] bg-[#BFFF00] rounded-full blur-[140px] opacity-[0.04] pointer-events-none z-0"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.12s ease-out, top 0.12s ease-out',
          }}
        />
      )}

      {/* Brutalist Nav */}
      <nav className="brutal-nav">
        <div className="flex flex-col select-none">
          <div className="text-xl font-brutal tracking-tighter text-[#BFFF00]">ARTIFEX LABS</div>
          <div className="text-[8px] font-mono tracking-[0.4em] text-white/40 -mt-1 uppercase">Tuesday // Principal Investigator</div>
        </div>
        <ul className="hidden md:flex gap-8 text-[11px] font-mono tracking-[0.3em] uppercase text-white/40">
          <li><Link to="/lab#engines" className="hover:text-white transition-colors">Defenses</Link></li>
          <li><Link to="/lab#forensics-pipeline" className="hover:text-white transition-colors">Forensics</Link></li>
          <li><Link to="/lab#engines" className="hover:text-white transition-colors">Registry</Link></li>
        </ul>
        <Link
          to="/lab"
          className="px-6 py-2 border-2 border-[#BFFF00] text-[#BFFF00] font-mono text-[10px] tracking-[0.2em] hover:bg-[#BFFF00] hover:text-black transition-all duration-200 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00]"
        >
          ENTER LAB
        </Link>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20 relative z-10 overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-[0.03]" />

        <div className="max-w-7xl w-full mx-auto">
          <div
            className="mb-8 text-[10px] font-mono tracking-[0.5em] uppercase"
            style={{
              opacity: heroReady ? 0.4 : 0,
              transform: heroReady ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {landingCopy.hero.eyebrow}
          </div>

          <h1
            className="hero-word text-[12vw] md:text-[8vw] leading-[0.8] tracking-tighter text-white mb-4"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.9s ease 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s',
            }}
          >
            COGNITIVE<br />
            <span className="text-[#BFFF00]" style={{ textShadow: '0 0 60px rgba(191,255,0,0.2)' }}>CANARY</span>
          </h1>

          {/* Version badge row */}
          <div
            className="flex gap-3 mb-8"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          >
            <span className="tag-badge">v7.0</span>
            <span className="tag-badge" style={{ borderColor: 'hsl(175 60% 45% / 0.3)', color: 'hsl(175,60%,45%)', background: 'hsl(175 60% 45% / 0.08)' }}>d/acc</span>
            <span className="tag-badge" style={{ borderColor: 'hsl(280 60% 60% / 0.3)', color: 'hsl(280,60%,60%)', background: 'hsl(280 60% 60% / 0.08)' }}>15 ENGINES</span>
          </div>

          <div
            className="grid md:grid-cols-2 gap-12 mt-6 items-end"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.9s ease 0.3s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s',
            }}
          >
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-grotesque font-light leading-snug text-white/80">
                Privacy defenses for <em className="not-italic text-white">behavioral surveillance</em>.<br />
                Forensic tools for <em className="not-italic text-[#BFFF00]">frontier model audits</em>.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/lab"
                  className="group flex items-center gap-4 bg-[#BFFF00] text-black px-10 py-6 font-brutal text-lg transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_40px_rgba(191,255,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00]"
                >
                  <span className="relative z-10">THE LAB</span>
                  <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 opacity-20" />
                </Link>
              </div>
            </div>

            <div className="border-l border-[#BFFF00]/20 pl-8 space-y-6">
              <p className="text-xs font-mono text-white/40 leading-relaxed max-w-sm tracking-wide">
                {landingCopy.hero.whyNow}
              </p>
              <div className="flex items-center gap-6">
                {landingCopy.hero.secondaryCtas.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={cta.label}
                    className="text-white/40 hover:text-[#BFFF00] transition-colors duration-200 focus-visible:outline-none focus-visible:text-[#BFFF00]"
                  >
                    <cta.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee Tape ─────────────────────────────────────────────────── */}
      <div className="tape-wrapper" aria-hidden="true">
        <div className="tape-text">
          BEHAVIORAL OBFUSCATION ✦ KINEMATIC NOISE ✦ NEURO AUDIT ✦ STRATEGIC FIDELITY ✦ 15 ENGINES ✦ PRIVACY DEFENCE ✦ FORENSIC AUDITS ✦ d/acc ✦&nbsp;
          BEHAVIORAL OBFUSCATION ✦ KINEMATIC NOISE ✦ NEURO AUDIT ✦ STRATEGIC FIDELITY ✦ 15 ENGINES ✦ PRIVACY DEFENCE ✦ FORENSIC AUDITS ✦ d/acc ✦&nbsp;
        </div>
      </div>

      {/* ── Principles ───────────────────────────────────────────────────── */}
      <section
        ref={principlesReveal.ref as React.RefObject<HTMLElement>}
        className="py-40 px-6 md:px-20 bg-[#050505] relative z-10"
        style={{
          opacity: principlesReveal.visible ? 1 : 0,
          transform: principlesReveal.visible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-[6vw] md:text-[4vw] font-grotesque font-bold leading-[1.1] tracking-tight text-white/20 uppercase">
            WE BUILD <span className="text-white">DEFENSIVE KINEMATICS</span> THAT BREAK BIOMETRIC TRACKING.{' '}
            NO REPRODUCIBILITY. NO FINGERPRINTS. JUST{' '}
            <span className="text-[#BFFF00]" style={{ textShadow: '0 0 40px rgba(191,255,0,0.15)' }}>SIGNAL NOISE</span>{' '}
            AND <span className="text-white">RADICAL PRIVACY</span>.
          </p>
        </div>
      </section>

      {/* ── Operational Surfaces ─────────────────────────────────────────── */}
      <section
        ref={operationsReveal.ref as React.RefObject<HTMLElement>}
        className="py-40 px-6 md:px-20 border-t border-white/5 bg-black relative z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          {[
            {
              num: '01', title: 'DEFENSE', icon: Shield,
              desc: 'Protect against behavioral fingerprinting and biometric inference using kinematic noise, timing perturbation, and browser-side obfuscation.',
              items: ['Cursor Obfuscation', 'Keystroke Jitter', 'EEG-Oriented Privacy', 'Spectral Defence'],
              delay: 0,
            },
            {
              num: '02', title: 'FORENSICS', icon: Activity,
              desc: 'Probe frontier systems for evaluation-aware behavior, strategic inconsistency, and deceptive signals across 8 interpretability engines.',
              items: ['Sandbagging Analysis', 'Inspect Harness', 'Strategic Fidelity', 'Circuit Mapping'],
              delay: 120,
              offset: 'md:pt-40',
            },
          ].map(({ num, title, icon: Icon, desc, items, delay, offset }) => (
            <div
              key={num}
              className={`flex-1 space-y-8 ${offset ?? ''}`}
              style={{
                opacity: operationsReveal.visible ? 1 : 0,
                transform: operationsReveal.visible ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
              }}
            >
              <h2 className="text-4xl font-brutal tracking-tighter text-white">{num} / {title}</h2>
              <div className="p-10 border border-white/10 bg-white/5 hover:border-[#BFFF00]/40 transition-all duration-300 engine-card">
                <Icon className="w-12 h-12 text-[#BFFF00] mb-8" />
                <p className="text-xl font-grotesque font-light text-white/70 leading-relaxed mb-6">{desc}</p>
                <ul className="space-y-4 font-mono text-[10px] tracking-widest text-white/40 uppercase">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="text-[#BFFF00]">✦</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-20 px-6 md:px-20 bg-black border-t-4 border-[#BFFF00] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-[8vw] md:text-[4vw] font-brutal tracking-tighter text-[#BFFF00]">ARTIFEX LABS</h2>
            <p className="text-[10px] font-mono tracking-[0.8em] text-white/40 uppercase">Tuesday // Principal Investigator</p>
          </div>

          <div className="flex gap-12 text-[11px] font-mono tracking-[0.4em] uppercase text-white/60">
            <Link to="/lab" className="hover:text-white transition-all">Enter Lab</Link>
            <a href="https://github.com/Tuesdaythe13th/cognitivecanary_demo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">GitHub</a>
            <a href="/neurorights-2026.html" className="hover:text-white transition-all">Whitepaper</a>
            <a href="https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">Notebook</a>
          </div>

          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            © 2026 COGNITIVE CANARY // RESEARCH SPEC // VERSION 7.0
          </div>
        </div>
      </footer>
    </div>
  );
}
