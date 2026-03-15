import { Link } from 'react-router-dom';
import { ExternalLink, Terminal, BrainCircuit, Shield, FileText, FlaskConical, Activity } from 'lucide-react';

export const landingCopy = {
  hero: {
    eyebrow: "ARTIFEX LABS // RESEARCH PROTOTYPE",
    title: "Cognitive Canary",
    subtitle: "Privacy defenses for behavioral surveillance.\nForensic tools for frontier model audits.",
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
    helper: "The full interactive demo environment remains available in The Lab.",
  },

  overview: {
    title: "What it is",
    body: "Cognitive Canary is a hybrid research artifact and interactive prototype. It combines client-side defenses against behavioral and physiological fingerprinting with forensic tools for probing sandbagging, evaluation awareness, and deceptive model behavior.",
  },

  audience: {
    title: "Who it's for",
    body: "Built for security and privacy engineers, AI safety researchers, evaluators, and neurorights or policy audiences studying the expanding surface area of cognitive and behavioral surveillance.",
  },

  capabilities: {
    title: "Two operational surfaces",
    left: {
      title: "Client-Side Privacy Defenses",
      body: "Protect against behavioral fingerprinting and biometric inference using kinematic noise, timing perturbation, and browser-side obfuscation. Includes cursor obfuscation, keystroke perturbation, browser fingerprint resistance, spectral defenses, and EEG-oriented privacy mechanisms.",
      icon: Shield
    },
    right: {
      title: "Forensic Model Audits",
      body: "Probe frontier systems for evaluation-aware behavior, strategic inconsistency, and deception-related signals. Includes tools and workflows for sandbagging analysis, interpretability-driven probing, transcript review, and compliance-oriented audit framing.",
      icon: BrainCircuit
    },
  },

  implemented: {
    title: "Implemented now",
    body: "The current system includes a live interactive site, multiple defense engines, forensic modules, a runnable notebook, and a whitepaper grounding the threat model. This is a working research prototype, not just a concept page.",
    bullets: [
      "Interactive lab environment",
      "Behavioral privacy defense engines",
      "Forensic and audit-oriented modules",
      "Notebook for guided exploration",
      "Threat-model and neurorights framing",
    ],
  },

  version: {
    title: "What's in v7.0",
    body: "Version 7.0 expands Cognitive Canary beyond behavioral obfuscation into deeper forensic interpretability. The emphasis shifts from protecting users against surveillance classifiers alone to also auditing model behavior under evaluation.",
  },

  highlights: {
    title: "Explore the system",
    cards: [
      {
        title: "Live Demo Environment",
        body: "Enter the full lab interface to explore the interactive exhibits, defense modules, and forensic workflows.",
        cta: "Open The Lab",
        href: "/lab",
        icon: FlaskConical
      },
      {
        title: "Notebook",
        body: "Use the Colab notebook for guided walkthroughs, experimentation, and implementation details.",
        cta: "Open Notebook",
        href: "https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq",
        icon: Terminal
      },
      {
        title: "Whitepaper",
        body: "Read the threat model, neurorights framing, and broader research context behind the project.",
        cta: "Read Whitepaper",
        href: "/neurorights-2026.html",
        icon: FileText
      },
      {
        title: "Repository",
        body: "Inspect code, engines, architecture, and development history in the public repository.",
        cta: "View Code",
        href: "https://github.com/Tuesdaythe13th/cognitivecanary_demo",
        icon: Activity
      },
    ],
  },

  limitations: {
    title: "Prototype constraints",
    body: "Cognitive Canary is a studio research artifact designed to test mechanisms, surface threats, and frame new defensive approaches. Some modules are exploratory, and the system should be read as a prototype for research and evaluation rather than a universal production security layer.",
  },

  footer: {
    line: "Cognitive Canary // ARTIFEX LABS // behavioral privacy, neurorights, and forensic AI auditing",
    links: [
      { label: "Home", href: "/" },
      { label: "The Lab", href: "/lab" },
      { label: "Notebook", href: "https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq" },
      { label: "Whitepaper", href: "/neurorights-2026.html" },
      { label: "GitHub", href: "https://github.com/Tuesdaythe13th/cognitivecanary_demo" },
    ],
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#020504] text-white selection:bg-primary/30 selection:text-primary relative font-sans overflow-x-hidden selection:text-shadow-none">
      {/* Background textures */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-20" />
      <div className="fixed inset-0 grain-overlay pointer-events-none opacity-[0.3] mix-blend-overlay" />
      <div className="fixed top-0 left-1/4 w-[800px] h-[600px] bg-primary/5 rounded-full gradient-blob pointer-events-none opacity-80" />

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 border-b border-primary/10">
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 border border-primary/30 text-[10px] font-mono text-primary uppercase tracking-[0.4em] bg-primary/5 font-black">
              {landingCopy.hero.eyebrow}
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black font-mono tracking-tighter uppercase leading-[1.1]">
              <span className="text-white block">{landingCopy.hero.title.split(' ')[0]}</span>
              <span className="text-primary block mt-1" style={{ textShadow: '0 0 30px rgba(0,255,65,0.2)' }}>{landingCopy.hero.title.split(' ')[1]}</span>
            </h1>

            <div className="space-y-4 max-w-2xl">
              <p className="text-xl sm:text-2xl font-mono text-white/90 leading-relaxed font-semibold">
                {landingCopy.hero.subtitle.split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </p>
              <p className="text-sm font-mono text-white/50 leading-relaxed tracking-wider">
                {landingCopy.hero.whyNow}
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link 
                to={landingCopy.hero.primaryCta.href}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-black font-mono uppercase tracking-widest font-black overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  {landingCopy.hero.primaryCta.label}
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </Link>

              <div className="flex items-center gap-3 flex-wrap">
                {landingCopy.hero.secondaryCtas.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.href}
                    target={cta.href.startsWith('http') ? '_blank' : undefined}
                    rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-[11px] font-mono text-white/70 hover:text-white hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all uppercase tracking-widest backdrop-blur-sm"
                  >
                    <cta.icon className="w-3 h-3" />
                    {cta.label}
                  </a>
                ))}
              </div>
            </div>
            
            <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse blur-[1px]" />
              {landingCopy.hero.helper}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-32">
        
        {/* Core Premise */}
        <section className="space-y-8">
           <h2 className="text-3xl font-black font-mono tracking-tighter uppercase text-white/40">
            {landingCopy.overview.title.split(' ').map((w,i) => i === 0 ? <span key={i} className="text-white">{w} </span> : w + ' ')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-12">
            <p className="text-sm font-mono text-white/70 leading-relaxed max-w-lg">
              {landingCopy.overview.body}
            </p>
            <div className="border-l border-primary/20 pl-6">
              <h3 className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-4 font-bold">{landingCopy.audience.title}</h3>
              <p className="text-xs font-mono text-white/50 leading-relaxed">
                {landingCopy.audience.body}
              </p>
            </div>
          </div>
        </section>

        {/* Two Operational Surfaces */}
        <section className="space-y-12">
           <div className="inline-block border-b border-primary/30 pb-2 mb-4">
             <h2 className="text-2xl font-black font-mono tracking-tighter uppercase text-white">
              {landingCopy.capabilities.title}
            </h2>
           </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Surface A */}
            <div className="p-8 border border-white/10 bg-black/40 hover:border-primary/40 transition-colors group relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
              <landingCopy.capabilities.left.icon className="w-8 h-8 text-primary/60 mb-6 group-hover:text-primary transition-colors" />
              <h3 className="text-lg font-bold font-mono text-white mb-4 uppercase tracking-wider">
                {landingCopy.capabilities.left.title}
              </h3>
              <p className="text-xs font-mono text-white/60 leading-relaxed">
                {landingCopy.capabilities.left.body}
              </p>
            </div>

            {/* Surface B */}
            <div className="p-8 border border-white/10 bg-black/40 hover:border-secondary/60 transition-colors group relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary/20 group-hover:bg-secondary/80 transition-colors" />
              <landingCopy.capabilities.right.icon className="w-8 h-8 text-secondary/60 mb-6 group-hover:text-secondary transition-colors" />
              <h3 className="text-lg font-bold font-mono text-white mb-4 uppercase tracking-wider">
                {landingCopy.capabilities.right.title}
              </h3>
              <p className="text-xs font-mono text-white/60 leading-relaxed">
                {landingCopy.capabilities.right.body}
              </p>
            </div>
          </div>
        </section>

        {/* State of Implementation Grid */}
        <section className="grid sm:grid-cols-2 gap-12 border-y border-white/10 py-16">
          <div className="space-y-6">
            <h2 className="text-lg font-black font-mono text-primary uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              {landingCopy.implemented.title}
            </h2>
            <p className="text-sm font-mono text-white/70 leading-relaxed">
              {landingCopy.implemented.body}
            </p>
            <ul className="space-y-3 font-mono text-[11px] text-white/50">
              {landingCopy.implemented.bullets.map((bullet, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-primary/50 text-xs">→</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-6 pl-0 sm:pl-12 sm:border-l border-white/10">
            <h2 className="text-lg font-black font-mono text-white uppercase tracking-widest flex items-center gap-3 opacity-60">
              <span className="w-2 h-2 border border-white/50" />
              {landingCopy.version.title}
            </h2>
            <p className="text-sm font-mono text-white/50 leading-relaxed">
              {landingCopy.version.body}
            </p>
          </div>
        </section>

        {/* Explore Resources */}
        <section className="space-y-12">
          <h2 className="text-2xl font-black font-mono tracking-tighter uppercase text-white mb-8 border-b border-white/10 pb-4">
              {landingCopy.highlights.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {landingCopy.highlights.cards.map((card, i) => (
              <a 
                key={i}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group p-6 border border-white/10 bg-black/20 hover:bg-black/40 hover:border-primary/40 transition-all flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <card.icon className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                  <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-primary/60 transition-colors opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
                <h3 className="text-sm font-bold font-mono text-white mb-2 tracking-wider uppercase">
                  {card.title}
                </h3>
                <p className="text-[11px] font-mono text-white/50 leading-relaxed mb-6 flex-grow">
                  {card.body}
                </p>
                <div className="mt-auto text-[10px] font-mono text-primary/60 uppercase tracking-widest font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                  {card.cta} <span className="text-lg leading-none mb-[2px]">›</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Limitations block */}
        <section className="p-8 border border-destructive/20 bg-destructive/5 relative overflow-hidden backdrop-blur-sm">
           <div className="absolute top-0 left-0 w-1 h-full bg-destructive/40" />
           <h3 className="text-[11px] font-mono text-destructive uppercase tracking-[0.2em] mb-4 font-bold flex items-center gap-3">
             <span className="text-lg">⚠</span> {landingCopy.limitations.title}
           </h3>
           <p className="text-xs font-mono text-destructive/70 leading-relaxed max-w-3xl">
             {landingCopy.limitations.body}
           </p>
        </section>

      </main>

      {/* Global Footer */}
      <footer className="border-t border-white/10 bg-black py-12 px-6 mt-20 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest text-center md:text-left">
            {landingCopy.footer.line}
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            {landingCopy.footer.links.map((link, i) => (
              <a 
                key={i} 
                href={link.href}
                className="text-[10px] font-mono text-white/30 hover:text-primary transition-colors uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
