import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Shield,
  Cpu,
  Smartphone,
  EyeOff,
  Lock,
  ChevronRight
} from 'lucide-react';

import NoiseOverlay from '@/components/SOTA/NoiseOverlay';
import ThreeVisual from '@/components/SOTA/ThreeVisual';
import SerratedDivider from '@/components/SOTA/SerratedDivider';
import StickyNote from '@/components/SOTA/StickyNote';
import CatalogLabel from '@/components/SOTA/CatalogLabel';
import CognitiveSecurityCarousel from '@/components/CognitiveSecurityCarousel';

export default function Landing() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: "Agentic Defense",
      content: "Proactive agents that filter synthetic anomalies in real-time. Your digital bodyguard for the autonomous era.",
      fig: "01A",
      icon: <Cpu className="w-6 h-6" />
    },
    {
      title: "Data Poisoning",
      content: "Leveraging Nightshade protocols to pollute adversarial AI models and break unauthorized likeness training.",
      fig: "02B",
      icon: <EyeOff className="w-6 h-6" />
    },
    {
      title: "Digital Divorce",
      content: "Instant administrative isolation. Sever privileges and monitor for anomalous domestic surveillance.",
      fig: "03C",
      icon: <Lock className="w-6 h-6" />
    }
  ];

  return (
    <div className="relative min-h-screen bg-stone-black text-stone-white selection:bg-acid-lime selection:text-stone-black overflow-x-hidden">
      <NoiseOverlay />

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-[100] px-10 py-8 flex justify-between items-center">
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full border border-stone-white/20 flex items-center justify-center group-hover:border-acid-lime transition-colors duration-500">
            <div className="w-4 h-4 rounded-full bg-acid-lime group-hover:scale-125 transition-transform duration-500" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-serif font-light tracking-tighter">Cognitive Canary</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40">Artifex Labs // v8.4</span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 glass-nav p-1 rounded-full">
          {['Research', 'Security', 'About'].map((link) => (
            <Link
              key={link}
              to="#"
              className="px-6 py-2 rounded-full text-sm font-sans tracking-wide hover:bg-stone-white hover:text-stone-black transition-all duration-300"
            >
              {link}
            </Link>
          ))}
        </div>

        <Link
          to="/lab"
          className="bg-acid-lime text-stone-black px-8 py-3 rounded-full text-xs font-mono uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(212,242,104,0.3)]"
        >
          Initialize Defense
        </Link>
      </nav>

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 px-10">
        <ThreeVisual />

        <div className="grid grid-cols-12 gap-10 w-full max-w-7xl mx-auto relative z-10">
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-8xl lg:text-9xl font-serif font-light leading-[0.9] mb-8"
            >
              Asymmetric <br />
              <i className="text-acid-lime">Defense</i>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl font-sans text-stone-white/60 leading-relaxed mb-10 max-w-md"
            >
              The 2026 Cyberstalking Defense Paradigm. Controlling the flow of personal data through data-poisoning and proactive agents.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-stone-black bg-warm-charcoal overflow-hidden opacity-70 grayscale">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Trusted by 2.4k+ operators</span>
            </motion.div>
          </div>

          <div className="col-span-12 lg:col-span-7 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] max-w-lg"
            >
              <div className="absolute inset-0 rounded-t-[10rem] overflow-hidden border border-stone-white/10 shadow-2xl">
                <img
                  src="/images/sota/hero.png"
                  alt="Defense Core"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-black via-transparent to-transparent opacity-60" />
                <CatalogLabel fig="1A" status="Standby" />
              </div>

              <StickyNote
                title="The Shift"
                content="From reactive monitoring to proactive model pollution. We break the adversarial training loop."
                footer="Ref: CANARY-8"
                rotation={6}
                className="absolute -bottom-10 -right-10 w-80 hidden md:block"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <SerratedDivider className="mt-20" />

      {/* ── Bento Tabbed Content ────────────────────────────────────────── */}
      <section className="bg-warm-charcoal py-32 px-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #D4F268 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-acid-lime mb-6">Capabilities Suite</span>
            <h2 className="text-5xl md:text-6xl font-serif font-light mb-12">
              Beyond <br />
              <i className="opacity-50">Standard</i> Protocols
            </h2>

            <div className="flex flex-col gap-4">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`group relative text-left p-8 rounded-lg transition-all duration-500 overflow-hidden ${activeTab === idx ? 'bg-acid-lime text-stone-black scale-105 z-10' : 'bg-stone-black/20 hover:bg-stone-black/40 text-stone-white opacity-60 hover:opacity-100'}`}
                  style={{ transform: activeTab === idx ? 'rotate(-2deg)' : 'rotate(0deg)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] opacity-60">Fig. {tab.fig}</span>
                    {tab.icon}
                  </div>
                  <h3 className="text-2xl font-serif italic mb-2">{tab.title}</h3>
                  <p className={`text-sm leading-relaxed transition-opacity duration-500 ${activeTab === idx ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    {tab.content}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 relative min-h-[600px] bg-stone-black rounded-[24px] border border-stone-white/5 overflow-hidden flex items-center justify-center group">
             <div className="absolute inset-0 bg-gradient-to-br from-acid-lime/5 to-transparent pointer-events-none" />

             <motion.div
               key={activeTab}
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               transition={{ duration: 0.8 }}
               className="w-full h-full"
             >
                <img
                  src={activeTab === 0 ? "/images/sota/showcase-1.png" : activeTab === 1 ? "/images/sota/showcase-2.png" : "/images/sota/hero.png"}
                  alt="Feature Visual"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000"
                />
             </motion.div>

             <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 text-right">
                <span className="font-mono text-[10px] uppercase tracking-widest text-acid-lime">Status: Nominal</span>
                <span className="text-xs opacity-40 max-w-xs leading-relaxed font-mono">
                  Continuous Trust Verification Engine Active. <br /> Scanning for synthetic signatures...
                </span>
             </div>
          </div>
        </div>
      </section>

      {/* ── Cognitive Security Carousel ───────────────────────────────────── */}
      <CognitiveSecurityCarousel />

      {/* ── Marquee Tape ─────────────────────────────────────────────────── */}
      <div className="tape-wrapper" aria-hidden="true">
        <div className="tape-text">
          BEHAVIORAL OBFUSCATION ✦ KINEMATIC NOISE ✦ NEURO AUDIT ✦ STRATEGIC FIDELITY ✦ 15 ENGINES ✦ PRIVACY DEFENCE ✦ FORENSIC AUDITS ✦ d/acc ✦&nbsp;
          BEHAVIORAL OBFUSCATION ✦ KINEMATIC NOISE ✦ NEURO AUDIT ✦ STRATEGIC FIDELITY ✦ 15 ENGINES ✦ PRIVACY DEFENCE ✦ FORENSIC AUDITS ✦ d/acc ✦&nbsp;
        </div>
      </div>
      <SerratedDivider className="mb-20 rotate-180" />

      {/* ── Showcase Grid ─────────────────────────────────────────────── */}
      <section className="py-32 px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-acid-lime mb-6">Archive // 2026</span>
            <h2 className="text-6xl md:text-8xl font-serif font-light leading-none">
              Technical <br />
              <i>Manifesto</i>
            </h2>
          </div>
          <p className="text-xl font-sans text-stone-white/40 max-w-md mb-2">
            A visual documentation of our defensive architecture and its real-world application in protecting digital sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { img: "/images/sota/showcase-1.png", title: "Kinematic Jitter", fig: "4A" },
            { img: "/images/sota/showcase-2.png", title: "Camouflage Matrix", fig: "5B", offset: true },
            { img: "/images/sota/hero.png", title: "Model Pollution", fig: "6C" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className={`relative aspect-[3/4] rounded-[24px] overflow-hidden group border border-stone-white/5 ${item.offset ? 'md:translate-y-20' : ''}`}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-stone-black/40 group-hover:bg-stone-black/0 transition-colors duration-500" />
              <CatalogLabel fig={item.fig} />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-serif italic">{item.title}</h3>
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-xs font-mono uppercase tracking-widest text-acid-lime">View Spec</span>
                  <ChevronRight size={14} className="text-acid-lime" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-60 px-10 relative flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20">
           <div className="w-[800px] h-[800px] border border-acid-lime/20 rounded-full animate-[spin_20s_linear_infinite]" />
           <div className="absolute w-[600px] h-[600px] border border-acid-lime/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-7xl md:text-9xl font-serif font-light mb-12">
            Secure the <br />
            <i className="text-acid-lime">Future.</i>
          </h2>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              to="/lab"
              className="bg-acid-lime text-stone-black px-12 py-5 rounded-full text-lg font-sans font-medium hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(212,242,104,0.4)]"
            >
              Deploy Canary <Smartphone size={20} />
            </Link>
            <button className="border border-stone-white/20 px-12 py-5 rounded-full text-lg font-sans hover:bg-stone-white hover:text-stone-black transition-all duration-300">
              Read Whitepaper
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-stone-white/5 py-20 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-acid-lime" />
              <span className="text-2xl font-serif font-light tracking-tighter">Cognitive Canary</span>
            </div>
            <p className="text-stone-white/40 max-w-xs text-sm leading-relaxed">
              Defending human sovereignty in the age of autonomous synthetic agents. Powered by Artifex Labs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-acid-lime opacity-60">System</span>
              <Link to="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity">Architecture</Link>
              <Link to="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity">Protocols</Link>
              <Link to="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity">Compliance</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-acid-lime opacity-60">Legal</span>
              <Link to="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity">Privacy Policy</Link>
              <Link to="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity">Terms of Use</Link>
              <Link to="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity">Ethics Code</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-acid-lime opacity-60">Connect</span>
              <Link to="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity">GitHub</Link>
              <Link to="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity">Twitter</Link>
              <Link to="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity">Signal</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-stone-white/5 flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.3em] opacity-20">
          <span>© 2026 ARTIFEX LABS. ALL RIGHTS RESERVED.</span>
          <span>LATENCY: 14MS // ENCRYPTION: AES-GCM</span>
        </div>
      </footer>
    </div>
  );
}
