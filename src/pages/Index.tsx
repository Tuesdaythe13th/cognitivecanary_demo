import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import ImportanceSection from '@/components/ImportanceSection';
import DefenseEngines from '@/components/DefenseEngines';
import LiveDemo from '@/components/LiveDemo';
import AffectiveFirewall from '@/components/AffectiveFirewall';
import CreditAuditor from '@/components/CreditAuditor';
import StrategicRisks from '@/components/StrategicRisks';
import Results from '@/components/Results';
import Architecture from '@/components/Architecture';
import Roadmap from '@/components/Roadmap';
import SiteFooter from '@/components/SiteFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary relative font-sans text-foreground">
      {/* Background textures */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="fixed inset-0 grain-overlay pointer-events-none opacity-50 mix-blend-overlay" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/60 backdrop-blur-xl border border-primary/20 p-4 pointer-events-auto shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3">
            <span className="text-primary font-black tracking-tighter text-xl font-mono shadow-[0_0_10px_var(--neon-green)]">CC // ARTIFEX</span>
            <span className="text-[9px] bg-primary text-black px-2 py-0.5 font-mono font-black tracking-widest uppercase">v6.0</span>
          </div>
          <div className="hidden md:flex gap-10 items-center font-mono text-[10px] uppercase tracking-[0.3em] font-black">
            <a href="#problem" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Threats</a>
            <a href="#importance" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Urgency</a>
            <a href="#engines" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Engines</a>
            <a href="#affective" className="text-primary hover:text-white transition-all duration-300 border-b border-primary/20 pb-0.5">Affective</a>
            <a href="#credit" className="text-primary hover:text-white transition-all duration-300 border-b border-primary/20 pb-0.5">Auditor</a>
            <a href="#demo" className="text-white/40 hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Canary</a>
            <a href="https://github.com/Tuesdaythe13th/cognitivecanary_demo" target="_blank" className="bg-primary text-black px-6 py-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">Source</a>
          </div>
        </div>
      </nav>

      <main className="relative">
        <Hero />
        <ProblemSection />
        <ImportanceSection />
        <DefenseEngines />

        {/* Lab Case Studies Section Header */}
        <section className="py-40 px-6 border-t border-white/5 bg-black relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] grid-bg" />
          <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
            <div className="inline-block px-4 py-1.5 border border-primary/30 text-[10px] font-mono text-primary uppercase tracking-[0.5em] bg-primary/5 font-black">
              Case Studies: 2026-2030 Evolution
            </div>
            <h2 className="text-7xl font-black font-mono tracking-tighter text-white uppercase italic leading-none">
              LAB BENCH <span className="text-primary not-italic block mt-4 shadow-[0_0_30px_rgba(0,255,65,0.2)]">EXHIBITS</span>
            </h2>
            <p className="mt-8 text-[11px] font-mono text-white/40 max-w-xl mx-auto uppercase tracking-[0.2em] leading-relaxed">
              Deconstructing the mathematical scaffolding of the next-generation <span className="text-white italic">Affective Economy</span>.
            </p>
          </div>
        </section>

        <AffectiveFirewall />
        <CreditAuditor />

        <StrategicRisks />

        <div className="h-40 bg-gradient-to-b from-black to-black/20" />

        <LiveDemo />
        <Results />
        <Architecture />
        <Roadmap />
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
