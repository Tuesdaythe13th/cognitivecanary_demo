import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
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
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/40 backdrop-blur-md border border-white/10 p-4 pointer-events-auto shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="text-primary font-bold tracking-tighter text-xl font-mono">CC // ARTIFEX</span>
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 font-mono border border-primary/30">v6.0-ENTERPRISE</span>
          </div>
          <div className="hidden md:flex gap-8 items-center font-mono text-[10px] uppercase tracking-widest font-bold">
            <a href="#problem" className="hover:text-primary transition-colors">Threats</a>
            <a href="#engines" className="hover:text-primary transition-colors">Engines</a>
            <a href="#affective" className="hover:text-primary transition-colors text-accent">Affective</a>
            <a href="#credit" className="hover:text-primary transition-colors text-destructive">Auditor</a>
            <a href="#demo" className="hover:text-primary transition-colors">Canary</a>
            <a href="https://github.com/Tuesdaythe13th/cognitivecanary_demo" target="_blank" className="bg-primary text-black px-4 py-1 hover:brightness-110 transition-all">GitHub</a>
          </div>
        </div>
      </nav>

      <main className="relative">
        <Hero />
        <ProblemSection />
        <DefenseEngines />

        {/* Lab Case Studies Section Header */}
        <section className="pt-24 pb-12 px-6 border-t border-border/50 bg-black/20">
          <div className="max-w-6xl mx-auto text-center">
            <span className="text-[10px] font-mono text-primary bg-primary/10 px-3 py-1 border border-primary/20 uppercase tracking-widest">Case Studies: 2026-2030 Risks</span>
            <h2 className="text-4xl font-bold font-mono tracking-tighter mt-4 text-white uppercase italic">Lab Bench <span className="text-accent underline decoration-white/20 underline-offset-8">Exhibits</span></h2>
            <p className="mt-6 text-sm font-mono text-white/40 max-w-2xl mx-auto uppercase">
              Exploring the boundary between behavioral metrics and human agency.
            </p>
          </div>
        </section>

        <AffectiveFirewall />
        <CreditAuditor />

        <StrategicRisks />

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
