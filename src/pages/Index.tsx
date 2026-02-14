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
    <main className="relative bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-display text-lg text-foreground">CC<span className="text-primary">.</span></span>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-body-medium text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
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
