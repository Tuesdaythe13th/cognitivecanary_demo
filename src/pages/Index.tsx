import Hero from '@/components/Hero';
import SiteNav from '@/components/SiteNav';
import AboutSection from '@/components/AboutSection';
import LabProgressUpdate from '@/components/LabProgressUpdate';
import ProblemSection from '@/components/ProblemSection';
import ImportanceSection from '@/components/ImportanceSection';
import DefenseEngines from '@/components/DefenseEngines';
import LiveDemo from '@/components/LiveDemo';
import AffectiveFirewall from '@/components/AffectiveFirewall';
import CreditAuditor from '@/components/CreditAuditor';
import AssistantAxis from '@/components/AssistantAxis';
import BrowserFingerprint from '@/components/BrowserFingerprint';
import KeystrokeDynamics from '@/components/KeystrokeDynamics';
import ThreatFeed from '@/components/ThreatFeed';
import DeceptionPipeline from '@/components/DeceptionPipeline';
import StrategicRisks from '@/components/StrategicRisks';
import Results from '@/components/Results';
import Architecture from '@/components/Architecture';
import Roadmap from '@/components/Roadmap';
import SiteFooter from '@/components/SiteFooter';
import ErrorBoundary from '@/components/ErrorBoundary';

const Index = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary relative font-sans text-foreground">
      {/* Background textures */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="fixed inset-0 grain-overlay pointer-events-none opacity-50 mix-blend-overlay" />

      <SiteNav />

      <main className="relative">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>

        <ErrorBoundary>
          <AboutSection />
          <LabProgressUpdate />
        </ErrorBoundary>

        <ErrorBoundary>
          <ProblemSection />
          <ImportanceSection />
          <DefenseEngines />
        </ErrorBoundary>

        {/* Lab Case Studies Section Header */}
        <section className="py-40 px-6 border-t border-white/5 bg-black relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] grid-bg" />
          <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
            <div className="inline-block px-4 py-1.5 border border-primary/30 text-[10px] font-mono text-primary uppercase tracking-[0.5em] bg-primary/5 font-black">
              Case Studies: 2026-2030 Evolution
            </div>
            <h2 className="text-7xl font-black font-mono tracking-tighter text-white uppercase italic leading-none">
              LAB BENCH <span className="text-primary not-italic block mt-4" style={{ textShadow: '0 0 30px rgba(0,255,65,0.2)' }}>EXHIBITS</span>
            </h2>
            <p className="mt-8 text-[11px] font-mono text-white/40 max-w-xl mx-auto uppercase tracking-[0.2em] leading-relaxed">
              Deconstructing the mathematical scaffolding of the next-generation <span className="text-white italic">Affective Economy</span>.
            </p>
          </div>
        </section>

        <ErrorBoundary>
          <AffectiveFirewall />
          <CreditAuditor />
          <AssistantAxis />
          <BrowserFingerprint />
          <KeystrokeDynamics />
          <ThreatFeed />
          <DeceptionPipeline />
        </ErrorBoundary>

        <ErrorBoundary>
          <StrategicRisks />
        </ErrorBoundary>

        <div className="h-40 bg-gradient-to-b from-black to-black/20" />

        <ErrorBoundary>
          <LiveDemo />
          <Results />
          <Architecture />
          <Roadmap />
        </ErrorBoundary>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
