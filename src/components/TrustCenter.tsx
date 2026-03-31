import { ShieldCheck, FileText, Code2, Link, BookOpen } from 'lucide-react';

const ARTIFACTS = [
  { label: 'Methodology Spec', icon: FileText, url: '#' },
  { label: 'Source Code', icon: Code2, url: 'https://github.com/Tuesdaythe13th/cognitivecanary_demo' },
  { label: 'Whitepaper (2026)', icon: BookOpen, url: '#' },
  { label: 'Benchmark Notes', icon: ShieldCheck, url: '#' },
  { label: 'Policy Mapping', icon: Link, url: '#' }
];

export default function TrustCenter() {
  return (
    <div className="border-t border-b border-white/10 bg-black py-4 overflow-hidden relative z-10 w-full mb-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 md:gap-12">
        <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">Trust Artifacts:</span>
        {ARTIFACTS.map((a, i) => (
          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
            <a.icon className="w-4 h-4 text-[#BFFF00] opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-mono text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">{a.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
