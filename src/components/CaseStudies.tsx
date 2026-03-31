import { Play, ArrowRight } from 'lucide-react';

const STUDIES = [
  {
    title: 'Journalist Workflow: Secure Draft',
    description: 'Bypassing continuous behavioral authentication while maintaining editor access.',
    before: 'Typing cadence exposed identity via Random Forest on 30s snippets.',
    after: 'Jitter engine normalized intra-key timings. Classifier dropped to 12.1% accuracy.',
    time: '2 hours',
    engine: 'Keystroke Jitter'
  },
  {
    title: 'Analyst Workflow: Neuro Interface',
    description: 'Preventing affective state logging during high-stress visualization tasks.',
    before: 'BCI headset captured ERN (Error-Related Negativity) for cognitive exhaustion metrics.',
    after: 'Affective Firewall scrubbed P300 waves during focus shifts, rendering stress invisible.',
    time: '45 mins',
    engine: 'Phase Scrambling + Firewall'
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STUDIES.map((study, i) => (
            <div key={i} className="group border border-white/10 bg-white/[0.02] p-8 hover:bg-white/[0.05] transition-all relative">
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#BFFF00] group-hover:border-[#BFFF00] group-hover:text-black transition-all">
                <Play className="w-4 h-4 ml-1" />
              </div>

              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-mono text-white/50 uppercase tracking-widest mb-6">
                {study.engine}
              </div>

              <h3 className="text-2xl font-brutal text-white mb-4">{study.title}</h3>
              <p className="text-sm font-grotesque text-white/60 mb-8 leading-relaxed max-w-sm">{study.description}</p>

              <div className="space-y-4">
                <div className="p-4 bg-red-500/5 border-l-2 border-red-500/50">
                  <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest mb-1">Before Canary</p>
                  <p className="text-xs text-white/80 font-mono leading-relaxed">{study.before}</p>
                </div>
                <div className="p-4 bg-[#BFFF00]/5 border-l-2 border-[#BFFF00]/50 mt-2">
                  <p className="text-[9px] font-mono text-[#BFFF00] uppercase tracking-widest mb-1">After Canary</p>
                  <p className="text-xs text-white/80 font-mono leading-relaxed">{study.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
