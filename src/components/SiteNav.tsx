import { APP_TAG, APP_VERSION } from '@/lib/constants';

const SiteNav = () => (
  <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 pointer-events-none">
    <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/70 backdrop-blur-xl border border-primary/20 px-6 py-3 pointer-events-auto shadow-[0_0_60px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-3">
        <span className="text-primary font-black tracking-tighter text-xl font-mono" style={{ textShadow: '0 0 10px var(--neon-green)' }}>{APP_TAG}</span>
        <span className="text-[9px] bg-primary text-black px-2 py-0.5 font-mono font-black tracking-widest uppercase">v{APP_VERSION}</span>
      </div>
      <div className="hidden md:flex gap-8 items-center font-mono text-[10px] uppercase tracking-[0.3em] font-black">
        <a href="#about" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">About</a>
        <a href="#lab-update" className="text-primary/70 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Lab</a>
        <a href="#problem" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Threats</a>
        <a href="#engines" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Engines</a>
        <a href="#affective" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Affective</a>
        <a href="#fingerprint" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">FP Audit</a>
        <a href="#keystroke" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Keystroke</a>
        <a href="#threatfeed" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Feed</a>
        <a href="#forensics-pipeline" className="text-primary/70 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Forensics</a>
        <a href="#demo" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Demo</a>
        <a href="#roadmap" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Roadmap</a>
        <a href="https://github.com/Tuesdaythe13th/cognitivecanary_demo" target="_blank" className="bg-primary text-black px-5 py-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">Source</a>
      </div>
    </div>
  </nav>
);

export default SiteNav;
