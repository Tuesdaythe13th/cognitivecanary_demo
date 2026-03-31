import { Radio, Eye, AlertTriangle, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    label: 'Emit',
    desc: 'A known behavioral signature — the "canary pattern" — is emitted into DOM interactions.',
    icon: Radio,
  },
  {
    step: '02',
    label: 'Monitor',
    desc: 'Canary watches whether downstream systems (ads, UX, recommendations) respond to the pattern.',
    icon: Eye,
  },
  {
    step: '03',
    label: 'Detect',
    desc: "If platform behavior changes in response to the canary pattern → behavioral fingerprinting is confirmed.",
    icon: AlertTriangle,
  },
  {
    step: '04',
    label: 'Alert',
    desc: '"This site is fingerprinting your behavior." Canary switches to active obfuscation mode.',
    icon: ArrowRight,
  },
];

export default function TripwireCanary() {
  return (
    <section className="py-32 px-6 md:px-20 bg-[#050505] border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <p className="text-[10px] font-mono tracking-[0.5em] text-[#BFFF00] uppercase">Active Detection</p>
          <h2 className="text-4xl md:text-5xl font-brutal tracking-tighter text-white">SURVEILLANCE DETECTION CANARY</h2>
          <p className="text-xl font-grotesque font-light text-white/50 max-w-2xl leading-relaxed">
            A canary in a coal mine <em className="not-italic text-white/70">dies to signal danger</em>. Ours emits a known behavioral signature and monitors whether the platform reacts — turning Canary from passive defense into an active detection system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {STEPS.map(({ step, label, desc, icon: Icon }) => (
            <div key={step} className="bg-[#050505] p-8 space-y-4 group hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#BFFF00]/50 tracking-widest">{step}</span>
                <Icon className="w-5 h-5 text-[#BFFF00] opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-2xl font-brutal text-white">{label}</h3>
              <p className="text-sm font-grotesque text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 p-6 border border-[#BFFF00]/20 bg-[#BFFF00]/5">
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#BFFF00] mb-3">Why This Matters</p>
            <p className="text-sm font-grotesque text-white/60 leading-relaxed">
              Pure obfuscation is reactive. A tripwire mode turns Canary into a surveillance <em className="not-italic text-white/80">detector</em> — giving users evidence that fingerprinting is occurring, not just a defense against it. This is v8.0 collective defense territory, currently a research target.
            </p>
          </div>
          <div className="flex-1 p-6 border border-white/10 bg-white/[0.02]">
            <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-3">Design Constraint</p>
            <p className="text-sm font-grotesque text-white/40 leading-relaxed">
              The canary pattern must be behaviorally plausible (indistinguishable from real user behavior) but statistically unique enough that platform response correlates specifically with it. False positive rate is a hard design constraint — alerting on coincidental UI changes erodes trust.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
