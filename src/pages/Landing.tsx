import { Link } from 'react-router-dom';
import { 
  Shield, 
  Cpu, 
  Home, 
  Lock, 
  Zap, 
  Database, 
  EyeOff, 
  ArrowRight,
  Fingerprint,
  Mic,
  Smartphone,
  Scale
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './Landing.css';

export default function Landing() {
  const [heroReady, setHeroReady] = useState(false);
  const [lockdownActive, setLockdownActive] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="landing-container selection:bg-[#BFFF00] selection:text-black">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-[100] px-8 py-6 flex justify-between items-center mix-blend-difference">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter text-[#BFFF00]">ARTIFEX LABS</span>
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-40">Cognitive Canary // v7.2</span>
        </div>
        <div className="flex gap-8 items-center">
          <Link to="/lab" className="text-[11px] uppercase tracking-widest font-mono hover:text-[#BFFF00] transition-colors">Lab Access</Link>
          <a href="https://github.com/Tuesdaythe13th/cognitivecanary_demo" className="text-[11px] uppercase tracking-widest font-mono hover:text-[#BFFF00] transition-colors">Source</a>
          <Link 
            to="/lab" 
            className="px-6 py-2 border border-[#BFFF00] text-[#BFFF00] text-[10px] font-mono tracking-widest hover:bg-[#BFFF00] hover:text-black transition-all"
          >
            INITIALIZE DEFENSE
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-background">
          <div className="hero-image-wrapper">
             <img src="/images/hero.png" alt="Cognitive Canary Core" className="w-full h-full object-contain opacity-50" />
          </div>
          <div className="absolute inset-0 grid-bg opacity-[0.05]" />
        </div>

        <img 
          src="/images/hero.png" 
          alt="Cognitive Canary Core" 
          className={`hero-image-main ${heroReady ? 'opacity-100' : 'opacity-0'}`} 
        />

        <h1 className="hero-title">
          COGNITIVE<br />
          <span>CANARY</span>
        </h1>

        <p className="hero-subtitle">
          From Reactive to Proactive. The 2026 Cyberstalking Defense Paradigm.<br />
          Controlling the flow of personal data, polluting adversarial AI models, and leveraging continuous threat management.
        </p>

        <div className="mt-12 flex gap-4">
          <button className="cta-button" onClick={() => window.location.href='/lab'}>
            Enter the Lab <ArrowRight />
          </button>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────── */}
      <div className="marquee-wide">
        <div className="marquee-content">
          <span className="marquee-item">AGENTIC AI DEFENSE</span>
          <span className="marquee-item">✦</span>
          <span className="marquee-item">DATA POISONING</span>
          <span className="marquee-item">✦</span>
          <span className="marquee-item">DIGITAL DIVORCE</span>
          <span className="marquee-item">✦</span>
          <span className="marquee-item">CTEM PROTOCOLS</span>
          <span className="marquee-item">✦</span>
          <span className="marquee-item">BEHAVIORAL OBFUSCATION</span>
          <span className="marquee-item">✦</span>
          {/* Duplicate for seamless scroll */}
          <span className="marquee-item">AGENTIC AI DEFENSE</span>
          <span className="marquee-item">✦</span>
          <span className="marquee-item">DATA POISONING</span>
          <span className="marquee-item">✦</span>
          <span className="marquee-item">DIGITAL DIVORCE</span>
          <span className="marquee-item">✦</span>
          <span className="marquee-item">CTEM PROTOCOLS</span>
          <span className="marquee-item">✦</span>
          <span className="marquee-item">BEHAVIORAL OBFUSCATION</span>
          <span className="marquee-item">✦</span>
        </div>
      </div>

      {/* ── AI-on-AI Defense ─────────────────────────────────────────────── */}
      <section className="content-section">
        <span className="section-label">Counter-Agent Intelligence</span>
        <h2 className="section-title">Defending Against<br />Agentic AI</h2>
        
        <div className="feature-grid">
          <div className="feature-card">
            <Cpu className="feature-icon" />
            <h3 className="feature-name">Personal Defensive AI</h3>
            <p className="feature-desc">
              Your digital bodyguard. Defensive agents filter incoming communications for micro-anomalies indicative of synthetic generation and autonomous stalking tactics.
            </p>
          </div>
          <div className="feature-card">
            <Fingerprint className="feature-icon" />
            <h3 className="feature-name">Continuous Trust Verification</h3>
            <p className="feature-desc">
              Moving beyond static auth. IAM uses behavioral signals like typing cadences and touchscreen pressure to distinguish you from a scraping bot.
            </p>
          </div>
          <div className="feature-card">
            <Mic className="feature-icon" />
            <h3 className="feature-name">Synthetic Voice Mitigation</h3>
            <p className="feature-desc">
              Secondary authentication protocols for sensitive calls combined with immersive simulated drills for voice-clone recognition.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTEM Section ─────────────────────────────────────────────────── */}
      <section className="content-section bg-[#0a0a0a]">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="section-label">Continuous Threat Management</span>
            <h2 className="section-title">Dismantle the Data Broker Grid</h2>
            <p className="feature-desc text-xl mb-8">
              Automated privacy suites dynamically issue legal takedown requests, monitor for data reappearance, and utilize data-pollution tactics to disrupt the network layer of cyberstalking architecture.
            </p>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex gap-3 text-[#BFFF00]"><Shield size={18} /> Real-time Visibility into Footprint</li>
              <li className="flex gap-3 text-[#BFFF00]"><Shield size={18} /> Automated Takedowns (TAKE IT DOWN Act)</li>
              <li className="flex gap-3 text-[#BFFF00]"><Shield size={18} /> Conflictual Data Pollution</li>
            </ul>
          </div>
          
          <div className="ctem-visualization">
            <div className="ctem-grid">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={`ctem-cell ${Math.random() > 0.8 ? 'active' : ''}`}>
                  {Math.random().toString(16).substring(2, 4)}
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#BFFF00]">
              SCANNING DATA BROKER ECOSYSTEM :: 78% DEPLOYED
            </div>
          </div>
        </div>
      </section>

      {/* ── IoT Lockdown ─────────────────────────────────────────────────── */}
      <section className="content-section">
        <span className="section-label">Smart Home Resilience</span>
        <h2 className="section-title">Digital Divorce &<br />Emergency Egress</h2>
        
        <div className="iot-lockdown">
          <div className="flex-1">
            <p className="feature-desc text-xl mb-8">
              Instantly sever administrative privileges of secondary accounts. Modern IoT devices flag anomalous access patterns, alerting you if an estranged partner is monitoring your space.
            </p>
            <div className="flex items-center gap-6">
              <div 
                className={`lockdown-switch ${lockdownActive ? 'active' : ''}`}
                onClick={() => setLockdownActive(!lockdownActive)}
              >
                <div className="switch-knob" />
              </div>
              <span className="font-mono text-sm tracking-widest text-[#BFFF00]">
                {lockdownActive ? 'EGRESS PROTOCOL ACTIVE' : 'SYSTEM IDLE'}
              </span>
            </div>
          </div>
          <div className="hidden md:block flex-1 border border-white/10 p-12 bg-white/5 relative">
            <Home className={`w-24 h-24 mb-6 transition-all duration-500 ${lockdownActive ? 'text-[#BFFF00]' : 'text-white/20'}`} />
            <div className="space-y-4">
              <div className="h-2 bg-white/10 overflow-hidden">
                <div className={`h-full bg-[#BFFF00] transition-all duration-1000 ${lockdownActive ? 'w-full' : 'w-0'}`} />
              </div>
              <div className="flex justify-between font-mono text-[10px] opacity-40">
                <span>LOCAL ARCHITECTURE ISOLATED</span>
                <span>SECURE</span>
              </div>
            </div>
            {lockdownActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#BFFF00]/10 backdrop-blur-sm animate-in fade-in duration-500">
                <Lock className="text-[#BFFF00] w-12 h-12 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Data Poisoning ────────────────────────────────────────────────── */}
      <section className="content-section bg-[#0a0a0a]">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <span className="section-label">Active Defense</span>
            <h2 className="section-title">Behavioral Obfuscation &<br />Data Poisoning</h2>
            <p className="feature-desc text-lg">
              Drawing on frontier AI safety, we use digital camouflage to protect you. Deploy tools like Cognitive Canary to poison mouse movement tracking or pass photos through "poisoning" filters (Nightshade/Glaze evolutions) that break adversarial AI likeness training.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-6 border border-[#BFFF00]/20 bg-[#BFFF00]/5 flex items-center gap-4">
              <EyeOff className="text-[#BFFF00]" />
              <span className="font-mono text-xs">COGNITIVE CAMOUFLAGE ENABLED</span>
            </div>
            <div className="p-6 border border-white/10 bg-white/5 flex items-center gap-4">
              <Zap className="text-white/40" />
              <span className="font-mono text-xs opacity-40">KINEMATIC NOISE: 450ms JITTER</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Legal / Policy ────────────────────────────────────────────────── */}
      <section className="content-section">
        <span className="section-label">Governance & Liability</span>
        <h2 className="section-title">Secure by Design.<br />Liable by Default.</h2>
        
        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <div className="p-10 border border-white/10 hover:border-[#BFFF00]/40 transition-all">
            <Scale className="text-[#BFFF00] mb-6" size={32} />
            <h3 className="text-2xl font-bold mb-4">Civil Remedies First</h3>
            <p className="opacity-60 leading-relaxed">
              Empowering survivors to pursue aggressive civil remedies when law enforcement forensic resources fall short. Shifting the burden to platforms that facilitate synthetic harassment.
            </p>
          </div>
          <div className="p-10 border border-white/10 hover:border-[#BFFF00]/40 transition-all">
            <Database className="text-[#BFFF00] mb-6" size={32} />
            <h3 className="text-2xl font-bold mb-4">Legislative Frameworks</h3>
            <p className="opacity-60 leading-relaxed">
              Enforcement of the TAKE IT DOWN Act and NO FAKES Act, criminalizing unauthorized AI generation of voice or likeness for harassment. Platform liability for failing to implement safety guardrails.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-8">READY TO DEPLOY?</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="cta-button" onClick={() => window.location.href='/lab'}>
              Initialize System <Smartphone />
            </button>
            <button className="cta-button cta-secondary">
              Read the Whitepaper
            </button>
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono tracking-[0.4em] opacity-40">
            <span>© 2026 ARTIFEX LABS</span>
            <div className="flex gap-8">
              <a href="#">PRIVACY</a>
              <a href="#">ETHICS</a>
              <a href="#">SECURITY</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
