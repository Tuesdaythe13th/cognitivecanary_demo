import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import DefenseEngines from '@/components/DefenseEngines';
import LiveDemo from '@/components/LiveDemo';
import Results from '@/components/Results';
import Architecture from '@/components/Architecture';
import Roadmap from '@/components/Roadmap';
import SiteFooter from '@/components/SiteFooter';

const navLinks = [
  { label: 'Problem', href: '#problem' },
  { label: 'Engines', href: '#engines' },
  { label: 'Demo', href: '#demo' },
  { label: 'Results', href: '#results' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Roadmap', href: '#roadmap' },
];

const Index = () => {
  return (
    <main className="relative bg-background text-foreground overflow-x-hidden grid-bg grain-overlay">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" className="text-display text-sm text-foreground tracking-tight">
            Cognitive Canary
          </a>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-mono text-[10px] text-muted-foreground hover:text-primary tracking-wider uppercase transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Tuesdaythe13th/cognitivecanary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mono text-[10px] text-muted-foreground hover:text-primary tracking-wider uppercase transition-colors duration-200"
            >
              GitHub
            </a>
            <span className="tag-badge text-[8px]">v6.0</span>
          </div>
        </div>
      </nav>

      <Hero />
      <ProblemSection />
      <DefenseEngines />
      <LiveDemo />
      <Results />
      <Architecture />
      <Roadmap />
      <SiteFooter />
    </main>
  );
};

export default Index;
