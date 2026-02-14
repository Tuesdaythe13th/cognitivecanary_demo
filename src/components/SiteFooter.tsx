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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl text-foreground mb-4" style={{ lineHeight: '1' }}>Cognitive Canary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advanced behavioral obfuscation engine. Protecting cognitive fingerprints since 2024.
            </p>
          </div>

          <div>
            <p className="text-body-medium text-sm text-foreground tracking-wider uppercase mb-4">Navigation</p>
            <div className="space-y-2">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-body-medium text-sm text-foreground tracking-wider uppercase mb-4">Citation</p>
            <div className="glass-panel p-4">
              <code className="text-xs text-muted-foreground font-mono block leading-relaxed">
                @software{'{'}<br />
                &nbsp;&nbsp;cognitive_canary_v6,<br />
                &nbsp;&nbsp;title=Cognitive Canary,<br />
                &nbsp;&nbsp;version=6.0,<br />
                &nbsp;&nbsp;year=2025<br />
                {'}'}
              </code>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Cognitive Canary. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-body-medium bg-primary/10 text-primary px-3 py-1 tracking-wider uppercase">v6.0</span>
            <span className="text-xs text-body-medium bg-foreground/5 text-muted-foreground px-3 py-1 tracking-wider uppercase">MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
