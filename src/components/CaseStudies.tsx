import { Play, ArrowRight } from 'lucide-react';

const STUDIES = [
  {
    title: 'Journalist Workflow: Secure Draft',
    description: 'Bypassing continuous behavioral authentication while maintaining editor access to a sensitive investigation.',
    before: 'Typing cadence exposed identity via Random Forest classifier on 30s keystroke snippets. Accuracy: 93.4%.',
    after: 'Keystroke Jitter normalized intra-key timings using 1/f pink noise. Classifier accuracy dropped to 12.1% — below random chance threshold.',
    time: '2 hours',
    engine: 'Keystroke Jitter',
    metric: '12.1% classifier accuracy',
    tradeoff: '~12ms average latency increase'
  },
  {
    title: 'Analyst Workflow: Neuro Interface',
    description: 'Preventing affective state logging during high-stress data visualization sessions using a consumer BCI headset.',
    before: 'BCI headset captured Error-Related Negativity (ERN) and P300 components, enabling real-time cognitive exhaustion scoring.',
    after: 'Affective Firewall applied counter-phase spectral injection during focus shifts. Stress state became statistically invisible to downstream classifier.',
    time: '45 mins',
    engine: 'Phase Scrambling + Firewall',
    metric: 'Affective state: undetectable',
    tradeoff: 'Reduced BCI cursor precision during active sessions'
  },
  {
    title: 'Activist Workflow: Cross-Site Tracking',
    description: 'Breaking behavioral fingerprint continuity across advocacy platforms under dragnet surveillance conditions.',
    before: 'Cross-site scroll curvature and mouse velocity fingerprint persisted across 14 sessions. Multi-modal fusion linked pseudonymous accounts with 87% confidence.',
    after: 'Kinematic Noise + Profile Selection rotated behavioral persona each session. Cross-session correlation fell to r=0.04 — statistically decorrelated.',
    time: '3 weeks (longitudinal)',
    engine: 'Kinematic Noise + Profile Selection',
    metric: 'r=0.04 cross-session correlation',
    tradeoff: 'Increased CAPTCHA frequency on high-security sites'
  }
];

export default function CaseStudies() {
  return (
    <section className="py-32 px-6 md:px-20 bg-black relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-[10px] font-mono tracking-[0.5em] text-[#BFFF00] uppercase mb-4">Real Workflows</p>
            <h2 className="text-4xl md:text-5xl font-brutal tracking-tighter text-white">CASE STUDIES</h2>
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/20 px-6 py-3 text-[10px] font-mono tracking-widest uppercase hover:bg-white/10 transition-colors">
            All Exhibits <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STUDIES.map((study, i) => (
            <div key={i} className="group border border-white/10 bg-white/[0.02] p-8 hover:bg-white/[0.05] transition-all relative flex flex-col">
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#BFFF00] group-hover:border-[#BFFF00] group-hover:text-black transition-all">
                <Play className="w-3 h-3 ml-0.5" />
              </div>

              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-mono text-white/50 uppercase tracking-widest mb-6 self-start">
                {study.engine}
              </div>

              <h3 className="text-xl font-brutal text-white mb-3 pr-12">{study.title}</h3>
              <p className="text-sm font-grotesque text-white/50 mb-6 leading-relaxed">{study.description}</p>

              <div className="space-y-3 flex-1">
                <div className="p-4 bg-red-500/5 border-l-2 border-red-500/50">
                  <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest mb-1">Before Canary</p>
                  <p className="text-xs text-white/80 font-mono leading-relaxed">{study.before}</p>
                </div>
                <div className="p-4 bg-[#BFFF00]/5 border-l-2 border-[#BFFF00]/50">
                  <p className="text-[9px] font-mono text-[#BFFF00] uppercase tracking-widest mb-1">After Canary</p>
                  <p className="text-xs text-white/80 font-mono leading-relaxed">{study.after}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[8px] font-mono text-white/25 uppercase tracking-widest mb-1">Key Metric</p>
                  <p className="text-[10px] font-mono text-[#BFFF00]/80">{study.metric}</p>
                </div>
                <div>
                  <p className="text-[8px] font-mono text-white/25 uppercase tracking-widest mb-1">UX Tradeoff</p>
                  <p className="text-[10px] font-mono text-white/40">{study.tradeoff}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
