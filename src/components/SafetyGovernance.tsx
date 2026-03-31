import { Activity, Lock, Database, Trash2, ShieldOff, AlertCircle } from 'lucide-react';

export default function SafetyGovernance() {
  return (
    <section className="py-32 px-6 md:px-20 bg-[#050505] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-6">
           <p className="text-[10px] font-mono tracking-[0.5em] text-[#BFFF00] uppercase">Safety & Misuse</p>
           <h2 className="text-4xl font-brutal tracking-tighter text-white">LIFECYCLE CONTROLS</h2>
           <p className="text-xl font-grotesque font-light text-white/50 leading-relaxed">
             An anti-surveillance tool cannot become its own surveillance sink. Canary is designed with strict participatory design principles and lifecycle controls.
           </p>
        </div>

        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 border border-white/10 bg-black/40 relative">
            <Lock className="w-6 h-6 text-[#BFFF00] mb-4" />
            <h3 className="text-lg font-brutal text-white mb-2">Local-First Processing</h3>
            <p className="text-sm font-grotesque text-white/50">All kinematic obfuscation and feature interception occurs entirely client-side. No raw behavioral telemetry leaves the local execution environment.</p>
          </div>
          <div className="p-6 border border-white/10 bg-black/40 relative">
            <Database className="w-6 h-6 text-[#BFFF00] mb-4" />
            <h3 className="text-lg font-brutal text-white mb-2">No Raw Retention</h3>
            <p className="text-sm font-grotesque text-white/50">By default, Canary retains only obfuscated logs necessary for diagnostic tuning. Raw signal retention is impossible without explicit, revocable user overrides.</p>
          </div>
          <div className="p-6 border border-white/10 bg-black/40 relative">
            <Trash2 className="w-6 h-6 text-[#BFFF00] mb-4" />
            <h3 className="text-lg font-brutal text-white mb-2">Export & Delete</h3>
            <p className="text-sm font-grotesque text-white/50">Users maintain cognitive sovereignty with single-click export of generated personas, and cryptographic deletion of local session histories.</p>
          </div>
          <div className="p-6 border border-white/10 bg-black/40 relative">
            <Activity className="w-6 h-6 text-[#BFFF00] mb-4" />
            <h3 className="text-lg font-brutal text-white mb-2">Tamper-Evident Logs</h3>
            <p className="text-sm font-grotesque text-white/50">Compliance logging uses an append-only, tamper-evident architecture, ensuring operators can verify the integrity of the obfuscation pipeline.</p>
          </div>
          <div className="p-6 border border-white/10 bg-black/40 relative sm:col-span-2">
            <ShieldOff className="w-6 h-6 text-yellow-400 mb-4" />
            <h3 className="text-lg font-brutal text-white mb-2">BCI Safety Interlock</h3>
            <p className="text-sm font-grotesque text-white/50 mb-3">
              Spectral Defender and EEG Shield must not disrupt legitimate BCI control loops. If a P300 speller, motor imagery classifier, or medical BCI control pathway is detected, affected engines enter <span className="font-mono text-yellow-400">OBSERVE-ONLY</span> mode: surveillance is logged without counter-phase injection.
            </p>
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-white/10">
              <AlertCircle className="w-4 h-4 text-yellow-400/60 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] font-mono text-white/30 leading-relaxed">
                This safeguard is critical: interference with medical BCI devices is a hard no-go condition. Engine parameters must always be validated against known BCI platform APIs before deployment in clinical or assistive technology contexts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
