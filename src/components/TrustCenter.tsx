import { ShieldCheck, FileText, Code2, BookOpen, FlaskConical, AlertTriangle } from 'lucide-react';

const ARTIFACTS = [
  { label: 'Source Code', icon: Code2, url: 'https://github.com/Tuesdaythe13th/cognitivecanary_demo', live: true },
  { label: 'Whitepaper (2026)', icon: BookOpen, url: '/neurorights-2026.html', live: true },
  { label: 'Interactive Notebook', icon: FlaskConical, url: 'https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq', live: true },
  { label: 'Benchmark Notes', icon: ShieldCheck, url: '#results', live: false, note: 'See results section' },
  { label: 'Methodology Spec', icon: FileText, url: '#results', live: false, note: 'v7.1 — in progress' },
  { label: 'Formal Privacy Proofs', icon: AlertTriangle, url: '#', live: false, note: 'v7.1 research target' },
];

export default function TrustCenter() {
  return (
    <div className="border-t border-b border-white/10 bg-black py-5 overflow-hidden relative z-10 w-full mb-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 md:gap-10">
        <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">Trust Artifacts:</span>
        {ARTIFACTS.map((a, i) => (
          <a
            key={i}
            href={a.url}
            target={a.live && !a.url.startsWith('#') ? '_blank' : undefined}
            rel={a.live && !a.url.startsWith('#') ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-2 group"
          >
            <a.icon className={`w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity ${a.live ? 'text-[#BFFF00]' : 'text-white/30'}`} />
            <div className="flex flex-col">
              <span className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${a.live ? 'text-white/60 group-hover:text-white' : 'text-white/25'}`}>
                {a.label}
              </span>
              {!a.live && a.note && (
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">{a.note}</span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
