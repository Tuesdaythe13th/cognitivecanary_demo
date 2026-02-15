const navLinks = [
  { label: 'Problem', href: '#problem' },
  { label: 'Engines', href: '#engines' },
  { label: 'Demo', href: '#demo' },
  { label: 'Results', href: '#results' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Roadmap', href: '#roadmap' },
];

const SiteFooter = () => {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h3 className="text-xl text-foreground mb-3" style={{ lineHeight: '1' }}>Cognitive Canary</h3>
            <p className="text-body text-xs text-muted-foreground leading-relaxed mb-4">
              Advanced behavioral obfuscation engine. Protecting cognitive fingerprints since 2024.
            </p>
            <div className="flex gap-2">
              <span className="tag-badge">v6.0</span>
              <span className="text-mono text-[9px] bg-muted text-muted-foreground px-2 py-0.5 tracking-wider uppercase border border-border">
                MIT
              </span>
            </div>
          </div>

          <div>
            <p className="text-mono text-[10px] text-foreground/80 tracking-wider uppercase mb-4">Navigation</p>
            <div className="space-y-2">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-body text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-mono text-[10px] text-foreground/80 tracking-wider uppercase mb-4">Links</p>
            <div className="space-y-2">
              <a href="https://github.com/Tuesdaythe13th/cognitivecanary" target="_blank" rel="noopener noreferrer" className="block text-body text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                GitHub →
              </a>
              <a href="https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq" target="_blank" rel="noopener noreferrer" className="block text-body text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                Colab Notebook →
              </a>
              <a href="https://linktr.ee/Tuesdaythe13th" target="_blank" rel="noopener noreferrer" className="block text-body text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                Linktree →
              </a>
            </div>
          </div>

          <div>
            <p className="text-mono text-[10px] text-foreground/80 tracking-wider uppercase mb-4">Citation</p>
            <div className="glass-panel p-3">
              <code className="text-mono text-[10px] text-muted-foreground block leading-relaxed">
                @software{'{'}<br />
                &nbsp;&nbsp;cognitive_canary_v6,<br />
                &nbsp;&nbsp;title=Cognitive Canary,<br />
                &nbsp;&nbsp;version=6.0,<br />
                &nbsp;&nbsp;year=2026<br />
                {'}'}
              </code>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <p className="text-mono text-[10px] text-muted-foreground/50">
            © 2026 Cognitive Canary · ARTIFEX Labs
          </p>
          <p className="text-mono text-[10px] text-muted-foreground/30">
            d/acc — defensive acceleration
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
