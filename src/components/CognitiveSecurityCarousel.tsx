import { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Eye, Shield, Zap, Lock, AlertTriangle, Cpu, Activity } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  tagColor: string;
  title: string;
  titleAccent: string;
  body: string;
  stat: string;
  statLabel: string;
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  detail: string[];
}

const slides: Slide[] = [
  {
    id: 1,
    tag: 'THE THREAT SURFACE',
    tagColor: 'text-[#BFFF00]',
    title: 'YOUR BEHAVIOR IS',
    titleAccent: 'THE PASSWORD',
    body: 'Every keystroke cadence, cursor micro-tremor, and scroll velocity is a biometric signal. Surveillance systems trained on millions of users can re-identify you across sessions, devices, and VPNs — without cookies, without accounts.',
    stat: '97.5%',
    statLabel: 're-identification accuracy via behavioral biometrics (2026)',
    icon: Eye,
    accentColor: '#BFFF00',
    borderColor: 'border-[#BFFF00]/20',
    glowColor: 'rgba(191,255,0,0.08)',
    detail: ['Keystroke dynamics', 'Cursor micro-tremors', 'Scroll velocity patterns', 'Touch pressure signatures'],
  },
  {
    id: 2,
    tag: 'COGNITIVE FINGERPRINTING',
    tagColor: 'text-[#00e5ff]',
    title: 'THE BRAIN IS',
    titleAccent: 'THE NEW FRONTIER',
    body: 'Wearable EEG headsets, hearables, and consumer BCIs now leak neural signals into commercial pipelines. Once captured, cognitive fingerprints cannot be rotated. Your thought patterns become permanent surveillance infrastructure.',
    stat: '2026',
    statLabel: 'first personalized brain-computer interface therapies in clinical use',
    icon: Brain,
    accentColor: '#00e5ff',
    borderColor: 'border-[#00e5ff]/20',
    glowColor: 'rgba(0,229,255,0.06)',
    detail: ['Consumer EEG hearables', 'Neural signal leakage', 'BCI data pipelines', 'Thought-pattern fingerprints'],
  },
  {
    id: 3,
    tag: 'MODEL INFERENCE RISK',
    tagColor: 'text-[#b44aff]',
    title: 'AI READS',
    titleAccent: 'BETWEEN THE LINES',
    body: 'Frontier models trained on human interaction data learn to infer your mental state, intent, and vulnerability from communication patterns. Sycophancy, sandbagging, and strategic deception emerge as the model optimizes against your cognitive profile.',
    stat: '1504',
    statLabel: 'Elo — Claude Opus 4.6 Thinking, #1 global model (April 2026)',
    icon: Cpu,
    accentColor: '#b44aff',
    borderColor: 'border-[#b44aff]/20',
    glowColor: 'rgba(180,74,255,0.06)',
    detail: ['Sycophancy detection', 'Intent inference', 'Sandbagging analysis', 'Strategic deception probing'],
  },
  {
    id: 4,
    tag: 'THE SURVEILLANCE STACK',
    tagColor: 'text-[#ffaa00]',
    title: 'THREE LAYERS OF',
    titleAccent: 'EXPOSURE',
    body: 'Modern cognitive surveillance operates at three stacked layers: physical kinematic collection (cursor, keystroke), neural signal acquisition (EEG, BCI), and model-level inference (LLM behavioral profiling). Each layer multiplies the attack surface.',
    stat: '3×',
    statLabel: 'compounding surveillance layers targeting cognitive state',
    icon: AlertTriangle,
    accentColor: '#ffaa00',
    borderColor: 'border-[#ffaa00]/20',
    glowColor: 'rgba(255,170,0,0.06)',
    detail: ['Physical kinematics layer', 'Neural signal layer', 'LLM inference layer', 'Cross-layer correlation attacks'],
  },
  {
    id: 5,
    tag: 'DEFENSIVE KINEMATICS',
    tagColor: 'text-[#BFFF00]',
    title: 'NOISE IS THE',
    titleAccent: 'DEFENSE',
    body: 'Cognitive Canary injects calibrated noise into behavioral signals — cursor trajectories, keystroke timing, scroll patterns — that preserves usability while destroying the statistical reproducibility required for biometric inference. No fingerprints. No tracking.',
    stat: '15',
    statLabel: 'defense and forensic engines active in the Canary system',
    icon: Shield,
    accentColor: '#BFFF00',
    borderColor: 'border-[#BFFF00]/20',
    glowColor: 'rgba(191,255,0,0.08)',
    detail: ['Lissajous cursor obfuscation', 'Keystroke jitter injection', 'EEG spectral shielding', 'Adaptive tremor engine'],
  },
  {
    id: 6,
    tag: 'MODEL AUDITABILITY',
    tagColor: 'text-[#00e5ff]',
    title: 'AUDIT THE',
    titleAccent: 'AUDITOR',
    body: 'The other half of cognitive security is making AI systems accountable. ARTIFEX\'s forensic engines probe frontier models for evaluation-aware behavior, strategic inconsistency, and hidden deception — exposing what models hide when they think they\'re not being watched.',
    stat: '8',
    statLabel: 'forensic engines targeting model-side cognitive deception',
    icon: Activity,
    accentColor: '#00e5ff',
    borderColor: 'border-[#00e5ff]/20',
    glowColor: 'rgba(0,229,255,0.06)',
    detail: ['Sandbagging detection', 'Activation patching', 'Circuit mapping', 'Strategic fidelity scoring'],
  },
  {
    id: 7,
    tag: 'THE NEURORIGHTS IMPERATIVE',
    tagColor: 'text-[#b44aff]',
    title: 'MENTAL PRIVACY IS',
    titleAccent: 'A HUMAN RIGHT',
    body: 'Chile amended its constitution. UNESCO adopted its first global neurotech standard. The MIND Act is before the US Senate. The legal architecture for cognitive sovereignty is being written now — and technology must move faster than legislation to protect what law cannot yet name.',
    stat: '2025',
    statLabel: 'UNESCO adopted the first global neurotechnology ethics standard',
    icon: Lock,
    accentColor: '#b44aff',
    borderColor: 'border-[#b44aff]/20',
    glowColor: 'rgba(180,74,255,0.06)',
    detail: ['Chile constitutional neurorights', 'UNESCO neurotech ethics', 'US MIND Act proposal', 'Colorado neural data law'],
  },
  {
    id: 8,
    tag: 'THE MISSION',
    tagColor: 'text-[#BFFF00]',
    title: 'COGNITIVE SECURITY',
    titleAccent: 'STARTS HERE',
    body: 'Cognitive Canary is a research prototype from ARTIFEX LABS demonstrating that privacy-preserving behavioral obfuscation and rigorous model auditability are not mutually exclusive — they are two faces of the same defensive imperative.',
    stat: 'd/acc',
    statLabel: 'defensive acceleration — privacy by design, accountability by default',
    icon: Zap,
    accentColor: '#BFFF00',
    borderColor: 'border-[#BFFF00]/20',
    glowColor: 'rgba(191,255,0,0.08)',
    detail: ['Open-source engines', 'Research transparency', 'Reproducible audits', 'Community-driven defense'],
  },
];

// Minimal canvas: scanning grid lines per slide
const SlideCanvas = ({ accentColor, active }: { accentColor: string; active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    let offset = 0;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Horizontal scan lines
      const spacing = 40;
      for (let y = (offset % spacing) - spacing; y < h + spacing; y += spacing) {
        const distFromCenter = Math.abs(y - h / 2) / (h / 2);
        const alpha = Math.max(0, 0.04 - distFromCenter * 0.03);
        ctx.beginPath();
        ctx.strokeStyle = `${accentColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Diagonal accent line
      const progress = (offset * 0.5) % (w + h);
      ctx.beginPath();
      ctx.strokeStyle = `${accentColor}18`;
      ctx.lineWidth = 1;
      ctx.moveTo(progress - h, 0);
      ctx.lineTo(progress, h);
      ctx.stroke();

      offset += 0.6;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, accentColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// Progress dots
const Dots = ({ total, current, onSelect, accentColor }: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
  accentColor: string;
}) => (
  <div className="flex items-center gap-2" role="tablist" aria-label="Carousel slides">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        role="tab"
        aria-selected={i === current}
        aria-label={`Slide ${i + 1}`}
        onClick={() => onSelect(i)}
        className="transition-all duration-300 focus-visible:outline-none focus-visible:ring-1"
        style={{
          width: i === current ? '24px' : '6px',
          height: '6px',
          background: i === current ? accentColor : 'rgba(255,255,255,0.2)',
          border: 'none',
          cursor: 'pointer',
        }}
      />
    ))}
  </div>
);

export default function CognitiveSecurityCarousel() {
  const [current, setCurrent] = useState(0);
  const [entering, setEntering] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slide = slides[current];

  const goTo = useCallback((idx: number) => {
    setEntering(true);
    setTimeout(() => {
      setCurrent(idx);
      setEntering(false);
    }, 180);
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    timerRef.current = setTimeout(next, 5500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, autoplay, next]);

  const pauseAutoplay = () => {
    setAutoplay(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { pauseAutoplay(); prev(); }
      if (e.key === 'ArrowRight') { pauseAutoplay(); next(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  const Icon = slide.icon;

  return (
    <section
      className="relative py-32 px-6 md:px-20 bg-black border-t border-white/5 overflow-hidden"
      aria-label="Cognitive Security — Key Concepts"
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-[10px] font-mono tracking-[0.5em] text-white/30 uppercase mb-4">
          ARTIFEX LABS // COGNITIVE SECURITY PRIMER
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="text-4xl md:text-5xl font-brutal tracking-tighter text-white">
            WHY COGNITIVE<br />
            <span className="text-[#BFFF00]" style={{ textShadow: '0 0 40px rgba(191,255,0,0.15)' }}>
              SECURITY MATTERS
            </span>
          </h2>
          <p className="text-xs font-mono text-white/30 max-w-xs leading-relaxed tracking-wide">
            Eight slides. Eight reasons every researcher, developer, and policy architect needs to understand the cognitive threat surface.
          </p>
        </div>
      </div>

      {/* Carousel body */}
      <div
        className="max-w-7xl mx-auto"
        onMouseEnter={pauseAutoplay}
        onFocus={pauseAutoplay}
      >
        {/* Main slide */}
        <div
          className={`relative border ${slide.borderColor} overflow-hidden transition-all duration-300`}
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${slide.glowColor} 0%, transparent 60%), #0a0a0a`,
            opacity: entering ? 0 : 1,
            transform: entering ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
          }}
        >
          <SlideCanvas accentColor={slide.accentColor} active={!entering} />

          <div className="relative z-10 grid md:grid-cols-[1fr_340px] min-h-[420px]">
            {/* Left: content */}
            <div className="p-10 md:p-14 flex flex-col justify-between border-r border-white/5">
              {/* Tag + icon */}
              <div className="flex items-start justify-between mb-8">
                <div className="space-y-3">
                  <span className={`text-[10px] font-mono tracking-[0.5em] uppercase ${slide.tagColor}`}>
                    {slide.tag}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-brutal tracking-tighter leading-[0.9] text-white">
                    {slide.title}<br />
                    <span style={{ color: slide.accentColor }}>{slide.titleAccent}</span>
                  </h3>
                </div>
                <div
                  className="flex-shrink-0 w-14 h-14 flex items-center justify-center border"
                  style={{
                    borderColor: `${slide.accentColor}30`,
                    background: `${slide.accentColor}08`,
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: slide.accentColor }} />
                </div>
              </div>

              <p className="text-base md:text-lg font-grotesque font-light text-white/65 leading-relaxed max-w-xl flex-1 mb-8">
                {slide.body}
              </p>

              {/* Detail bullets */}
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {slide.detail.map(d => (
                  <li key={d} className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-white/35 uppercase">
                    <span style={{ color: slide.accentColor }}>✦</span> {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: stat panel */}
            <div className="flex flex-col justify-between p-10 md:p-12">
              <div>
                <div
                  className="text-[3.5rem] md:text-[4.5rem] font-brutal leading-none tracking-tighter mb-2"
                  style={{ color: slide.accentColor, textShadow: `0 0 40px ${slide.accentColor}40` }}
                >
                  {slide.stat}
                </div>
                <p className="text-[10px] font-mono text-white/30 leading-relaxed tracking-wide uppercase">
                  {slide.statLabel}
                </p>
              </div>

              {/* Slide counter */}
              <div className="mt-auto pt-12">
                <div className="text-[9px] font-mono text-white/20 tracking-[0.4em] uppercase mb-4">
                  {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </div>
                <div
                  className="w-full h-px mb-6"
                  style={{
                    background: `linear-gradient(to right, ${slide.accentColor}60, transparent)`,
                  }}
                />
                {/* Autoplay progress bar */}
                {autoplay && (
                  <div className="w-full h-[2px] bg-white/5 overflow-hidden mb-6">
                    <div
                      className="h-full"
                      style={{
                        background: slide.accentColor,
                        animation: 'carousel-progress 5.5s linear',
                        transformOrigin: 'left',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between mt-8">
          <Dots
            total={slides.length}
            current={current}
            onSelect={(i) => { pauseAutoplay(); goTo(i); }}
            accentColor={slide.accentColor}
          />

          <div className="flex items-center gap-3">
            {!autoplay && (
              <button
                onClick={() => setAutoplay(true)}
                className="text-[9px] font-mono tracking-[0.3em] text-white/25 hover:text-white/50 uppercase transition-colors mr-2"
              >
                RESUME AUTO
              </button>
            )}
            <button
              onClick={() => { pauseAutoplay(); prev(); }}
              aria-label="Previous slide"
              className="w-12 h-12 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200 font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
            >
              ←
            </button>
            <button
              onClick={() => { pauseAutoplay(); next(); }}
              aria-label="Next slide"
              className="w-12 h-12 flex items-center justify-center border font-mono text-xs focus-visible:outline-none focus-visible:ring-1 transition-all duration-200"
              style={{
                borderColor: slide.accentColor,
                color: slide.accentColor,
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Slide preview strip */}
        <div className="mt-8 grid grid-cols-4 md:grid-cols-8 gap-2">
          {slides.map((s, i) => {
            const SIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => { pauseAutoplay(); goTo(i); }}
                className="group relative border p-3 flex flex-col items-start gap-2 transition-all duration-200 focus-visible:outline-none"
                style={{
                  borderColor: i === current ? `${s.accentColor}60` : 'rgba(255,255,255,0.06)',
                  background: i === current ? `${s.accentColor}08` : 'transparent',
                }}
                aria-label={`Go to slide ${i + 1}: ${s.tag}`}
              >
                <SIcon
                  className="w-3.5 h-3.5 transition-colors"
                  style={{ color: i === current ? s.accentColor : 'rgba(255,255,255,0.2)' }}
                />
                <span
                  className="text-[8px] font-mono tracking-wider leading-tight text-left transition-colors line-clamp-2"
                  style={{ color: i === current ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}
                >
                  {s.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes carousel-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
