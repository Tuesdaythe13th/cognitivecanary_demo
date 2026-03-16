import Hero from '@/components/Hero';
import SiteNav from '@/components/SiteNav';
import AboutSection from '@/components/AboutSection';
import BCILandscape from '@/components/BCILandscape';
import NeuroRightsSection from '@/components/NeuroRightsSection';
import LabProgressUpdate from '@/components/LabProgressUpdate';
import ProblemSection from '@/components/ProblemSection';
import ImportanceSection from '@/components/ImportanceSection';
import DefenseEngines from '@/components/DefenseEngines';
import StrategicRisks from '@/components/StrategicRisks';
import Results from '@/components/Results';
import Architecture from '@/components/Architecture';
import Roadmap from '@/components/Roadmap';
import SiteFooter from '@/components/SiteFooter';
import ErrorBoundary from '@/components/ErrorBoundary';
import { engineRegistry } from '@/data/engineRegistry';
import { EngineCategory } from '@/types/engine';
import { Link } from 'react-router-dom';
import { Shield, BrainCircuit, Activity, FileText, FlaskConical, ExternalLink } from 'lucide-react';

const categoryConfig: Record<EngineCategory, { title: string, description: string, icon: React.FC<any>, colorClass: string }> = {
  privacy: { title: 'Client-Side Privacy Defenses', description: 'Mask behavioral signatures before they harden into biometric identifiers.', icon: Shield, colorClass: 'text-[#BFFF00] border-[#BFFF00] bg-[#BFFF00]/10' },
  monitoring: { title: 'Endpoint Monitoring', description: 'Real-time telemetry and anomaly detection for defensive monitoring.', icon: Activity, colorClass: 'text-[#00e5ff] border-[#00e5ff] bg-[#00e5ff]/10' },
  neural: { title: 'Neural Interfaces', description: 'EEG and BCI signal processing for cognitive privacy.', icon: BrainCircuit, colorClass: 'text-[#b44aff] border-[#b44aff] bg-[#b44aff]/10' },
  governance: { title: 'Policy & Governance', description: 'Evaluate products against evolving global neurorights frameworks.', icon: FileText, colorClass: 'text-white border-white/40 bg-white/5' },
  forensics: { title: 'Forensic Model Audits', description: 'Inspect frontier models for strategic inconsistency and evaluation-sensitive behavior.', icon: FlaskConical, colorClass: 'text-amber-400 border-amber-400 bg-amber-400/10' }
};

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
          <BCILandscape />
          <NeuroRightsSection />
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

        <div className="max-w-7xl mx-auto px-6 pb-40 space-y-32">
          {Object.entries(categoryConfig).map(([catKey, config]) => {
            const categoryEngines = engineRegistry.filter(e => e.category === catKey as EngineCategory);
            if (categoryEngines.length === 0) return null;
            
            const Icon = config.icon;
            
            return (
              <section key={catKey} className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-display text-3xl flex items-center gap-4 text-white">
                    <Icon className="w-8 h-8 opacity-50" />
                    {config.title}
                  </h3>
                  <p className="text-mono text-[10px] uppercase tracking-widest text-white/40 mt-3">{config.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryEngines.map(engine => (
                    <Link 
                      key={engine.id}
                      to={`/demo/${engine.id}`}
                      className="group engine-card p-6 border border-white/10 bg-black/40 hover:bg-black/60 hover:border-white/30 transition-all flex flex-col h-full relative overflow-hidden backdrop-blur-md scan-card"
                    >
                      <div className="flex items-center justify-between mb-4 relative z-10 w-full">
                        <span className="text-display text-2xl text-white/20 leading-none group-hover:text-white/40 transition-colors">
                          {engine.index.toString().padStart(2, '0')}
                        </span>
                        <div className={`px-2 py-0.5 border text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5 ${config.colorClass}`}>
                          <Icon className="w-3 h-3" />
                          {engine.category}
                        </div>
                      </div>
                      
                      <h4 className="text-display text-xl leading-none mb-3 relative z-10">{engine.title}</h4>
                      <p className="text-xs font-mono text-white/50 leading-relaxed mb-6 flex-grow relative z-10">
                        {engine.shortDescription}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between relative z-10">
                        {engine.status === 'prototype' ? (
                           <span className="text-[10px] font-mono text-destructive uppercase tracking-widest border border-destructive/30 px-2 py-0.5 bg-destructive/10">Prototype</span>
                        ) : (
                           <span className="text-[10px] font-mono text-[#BFFF00] uppercase tracking-widest border border-[#BFFF00]/30 px-2 py-0.5 bg-[#BFFF00]/10">Active</span>
                        )}
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 group-hover:text-white transition-colors flex items-center gap-1">
                          Open <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <ErrorBoundary>
          <StrategicRisks />
        </ErrorBoundary>

        <div className="h-40 bg-gradient-to-b from-black to-black/20" />

        <ErrorBoundary>
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
