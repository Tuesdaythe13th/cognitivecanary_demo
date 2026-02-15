import { useInView } from '@/hooks/useInView';

const LabProgressUpdate = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="lab-update" className="relative py-20 px-6 border-b border-primary/20 bg-gradient-to-b from-black via-black/95 to-black" ref={ref}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full gradient-blob" style={{ filter: 'blur(120px)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="tag-badge mb-3 inline-block">APART LABS PROGRESS REVIEW</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground font-black tracking-tight">
                LAB PROGRESS UPDATE
              </h2>
            </div>
            <div className="bg-primary/10 border border-primary/30 px-6 py-3 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
              <span className="text-mono text-2xl text-primary font-black">FEB 14 2026</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submission Status */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold">14 February 2026</span></p>
                </div>
              </div>
            </div>

            {/* New Lab Websites */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🌐</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">New Lab Studio Websites</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://cognitivecanarylab.manus.space" target="_blank" rel="noopener noreferrer"
                         className="text-body text-foreground hover:text-primary transition-colors duration-200 underline decoration-primary/30 hover:decoration-primary text-sm">
                        cognitivecanarylab.manus.space
                      </a>
                    </li>
                    <li>
                      <a href="https://cognitivecanary.lovable.app" target="_blank" rel="noopener noreferrer"
                         className="text-body text-foreground hover:text-primary transition-colors duration-200 underline decoration-primary/30 hover:decoration-primary text-sm">
                        cognitivecanary.lovable.app
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Research Updates */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📚</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Research Collections Updated</h3>
                  <p className="text-body text-muted-foreground text-sm leading-relaxed">
                    <span className="text-foreground font-medium">Cognitive Canary: Defending Sovereignty Through Adversarial Kinematics</span>
                  </p>
                </div>
              </div>
            </div>

            {/* CV/Resume Update */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📄</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Tuesday Resume / CV Updated</h3>
                  <p className="text-body text-foreground text-sm">
                    <span className="text-primary font-semibold">Jailbreak Landscape</span> section added
                  </p>
                </div>
              </div>
            </div>

            {/* Whitepaper Updates */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 lg:col-span-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📝</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Research Whitepaper Updated</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-black/30 border border-primary/10 px-4 py-2">
                      <span className="text-body text-foreground text-sm font-medium">Research Notebook 1</span>
                    </div>
                    <div className="bg-black/30 border border-primary/10 px-4 py-2">
                      <span className="text-body text-foreground text-sm font-medium">Research Notebook 2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* New Demonstration */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 lg:col-span-2 bg-gradient-to-br from-primary/5 to-transparent border-primary/30">
              <div className="flex items-start gap-4">
                <span className="text-4xl">⚡</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">New Demonstration Available</h3>
                  <a href="https://cognitivecanary.lovable.app/" target="_blank" rel="noopener noreferrer"
                     className="text-foreground hover:text-primary transition-colors duration-200 underline decoration-primary/50 hover:decoration-primary text-lg font-semibold block mb-3">
                    cognitivecanary.lovable.app
                  </a>
                  <div className="bg-black/40 border-l-2 border-primary/50 pl-4 py-2">
                    <p className="text-body text-primary text-sm font-medium italic">
                      Note: This is a highly promising development.
                    </p>
                    <p className="text-body text-muted-foreground text-xs mt-1">
                      Interactive Notebook: <span className="text-foreground font-mono">cognitive_canary_notebook.ipynb</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* New Tools */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 lg:col-span-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🛠</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-4 font-black">New Tools Introduced</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/30 border border-primary/20 p-4 hover:border-primary/40 transition-colors duration-200">
                      <h4 className="text-foreground font-semibold mb-1 text-sm">Edison Platform</h4>
                      <p className="text-muted-foreground text-xs">Colab Notebook Improvements</p>
                    </div>
                    <div className="bg-black/30 border border-primary/20 p-4 hover:border-primary/40 transition-colors duration-200">
                      <h4 className="text-foreground font-semibold mb-1 text-sm">Prism LaTeX Editor</h4>
                      <p className="text-muted-foreground text-xs">Whitepaper Development</p>
                    </div>
                    <div className="bg-black/30 border border-primary/20 p-4 hover:border-primary/40 transition-colors duration-200">
                      <h4 className="text-foreground font-semibold mb-1 text-sm">SuperDesign Prompt Library</h4>
                      <p className="text-muted-foreground text-xs">Super Helpful Resource</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Studies Update Banner */}
          <div className="mt-6 glass-panel p-5 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">📊</span>
              <p className="text-mono text-foreground text-sm uppercase tracking-wider font-black">
                Case Studies Have Been Updated
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabProgressUpdate;
