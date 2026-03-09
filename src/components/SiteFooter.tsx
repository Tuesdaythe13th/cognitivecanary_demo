import { useInView } from '@/hooks/useInView';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Lab Update', href: '#lab-update' },
  { label: 'Threats', href: '#problem' },
  { label: 'Engines', href: '#engines' },
  { label: 'Demo', href: '#demo' },
  { label: 'Results', href: '#results' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Roadmap', href: '#roadmap' },
];

const SiteFooter = () => {
  const { ref, isInView } = useInView(0.05);

  return (
    <footer className="border-t border-border py-20 px-6 relative overflow-hidden" ref={ref}>
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] grid-bg" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full gradient-blob" />

      <div
        className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-primary font-black tracking-tighter text-lg font-mono" style={{ textShadow: '0 0 8px var(--neon-green)' }}>CC // ARTIFEX</span>
            </div>
            <p className="text-body text-xs text-muted-foreground leading-relaxed mb-5">
              Advanced behavioral obfuscation engine protecting cognitive fingerprints since 2024.
            </p>
            <div className="flex gap-2">
              <span className="tag-badge">v6.2</span>
              <span className="text-mono text-[9px] bg-muted text-muted-foreground px-2 py-0.5 tracking-wider uppercase border border-border">
                MIT
              </span>
            </div>
          </div>

          <div>
            <p className="text-mono text-[10px] text-foreground/60 tracking-[0.2em] uppercase mb-5">Navigation</p>
            <div className="space-y-2.5">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-body text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-mono text-[10px] text-foreground/60 tracking-[0.2em] uppercase mb-5">Links</p>
            <div className="space-y-2.5">
              <a href="https://github.com/Tuesdaythe13th/cognitivecanary" target="_blank" rel="noopener noreferrer" className="block text-body text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                GitHub →
              </a>
              <a href="https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq" target="_blank" rel="noopener noreferrer" className="block text-body text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                Colab Notebook →
              </a>
              <a href="https://linktr.ee/Tuesdaythe13th" target="_blank" rel="noopener noreferrer" className="block text-body text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                Linktree →
              </a>
            </div>
          </div>

          <div>
            <p className="text-mono text-[10px] text-foreground/60 tracking-[0.2em] uppercase mb-5">Citation</p>
            <div className="glass-panel p-4 hover:neon-border-glow transition-all duration-300">
              <code className="text-mono text-[10px] text-muted-foreground block leading-loose">
                @software{'{'}<br />
                &nbsp;&nbsp;cognitive_canary_v6_2,<br />
                &nbsp;&nbsp;title=Cognitive Canary,<br />
                &nbsp;&nbsp;version=6.2,<br />
                &nbsp;&nbsp;year=2026<br />
                {'}'}
              </code>
            </div>
          </div>
        </div>

        <div className="section-divider mb-8" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-mono text-[10px] text-muted-foreground/40">
            © 2026 Cognitive Canary · ARTIFEX Labs
          </p>
          <p className="text-mono text-[10px] text-muted-foreground/25">
            d/acc — defensive acceleration
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
