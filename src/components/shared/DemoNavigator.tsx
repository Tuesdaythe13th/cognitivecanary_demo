import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { engineRegistry } from '../../data/engineRegistry';
import { ChevronRight, ChevronLeft, Menu, X, Shield, BrainCircuit, Activity, FileText, FlaskConical } from 'lucide-react';

const categoryIcons = {
  privacy: Shield,
  neural: BrainCircuit,
  monitoring: Activity,
  governance: FileText,
  forensics: FlaskConical
};

export default function DemoNavigator() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const currentIndex = engineRegistry.findIndex(e => e.id === id);
  const currentEngine = currentIndex >= 0 ? engineRegistry[currentIndex] : null;
  const prevEngine = currentIndex > 0 ? engineRegistry[currentIndex - 1] : null;
  const nextEngine = currentIndex < engineRegistry.length - 1 ? engineRegistry[currentIndex + 1] : null;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key === 'Escape') setIsOpen(false);
        return;
      }
      const isInput = e.target instanceof HTMLInputElement ||
                      e.target instanceof HTMLTextAreaElement ||
                      e.target instanceof HTMLSelectElement ||
                      (e.target as HTMLElement).isContentEditable;
      if (isInput) return;

      if (e.key === 'ArrowLeft' && prevEngine) navigate(`/demo/${prevEngine.id}`);
      if (e.key === 'ArrowRight' && nextEngine) navigate(`/demo/${nextEngine.id}`);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, prevEngine, nextEngine, navigate]);

  return (
    <>
      {/* Bottom Floating Nav Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-stretch gap-0 bg-black/90 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl pointer-events-auto overflow-hidden">

        {/* Prev */}
        <Link
          to={prevEngine ? `/demo/${prevEngine.id}` : '#'}
          className={`group flex items-center gap-2 px-5 py-3 transition-all duration-200 ${prevEngine ? 'text-white/50 hover:text-primary hover:bg-white/5' : 'text-white/10 cursor-not-allowed pointer-events-none'}`}
          title={prevEngine?.title}
        >
          <ChevronLeft size={16} className="shrink-0" />
          <span className="text-[9px] font-mono uppercase tracking-widest hidden sm:block max-w-[100px] truncate">
            {prevEngine?.title ?? ''}
          </span>
        </Link>

        <div className="w-px bg-white/10 self-stretch" />

        {/* Center: current exhibit */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-6 py-3 text-white/80 hover:text-primary hover:bg-white/5 transition-all duration-200"
        >
          <Menu size={13} className="text-primary shrink-0" />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/30">
              {currentIndex >= 0 ? `${(currentIndex + 1).toString().padStart(2, '0')} / ${engineRegistry.length}` : '-- / --'}
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/80 max-w-[160px] truncate">
              {currentEngine?.title ?? 'Select Exhibit'}
            </span>
          </div>
        </button>

        <div className="w-px bg-white/10 self-stretch" />

        {/* Next */}
        <Link
          to={nextEngine ? `/demo/${nextEngine.id}` : '#'}
          className={`group flex items-center gap-2 px-5 py-3 transition-all duration-200 ${nextEngine ? 'text-white/50 hover:text-primary hover:bg-white/5' : 'text-white/10 cursor-not-allowed pointer-events-none'}`}
          title={nextEngine?.title}
        >
          <span className="text-[9px] font-mono uppercase tracking-widest hidden sm:block max-w-[100px] truncate">
            {nextEngine?.title ?? ''}
          </span>
          <ChevronRight size={16} className="shrink-0" />
        </Link>
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[99] pointer-events-none">
        <span className="text-[8px] font-mono uppercase tracking-widest text-white/15 flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 border border-white/10 rounded text-white/20">←</kbd>
          <kbd className="px-1.5 py-0.5 border border-white/10 rounded text-white/20">→</kbd>
          navigate
        </span>
      </div>

      {/* Full Screen Overlay Menu */}
      <div className={`fixed inset-0 z-[110] bg-black/95 backdrop-blur-sm transition-all duration-500 overflow-y-auto ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
            <div className="space-y-1">
              <h2 className="text-display text-4xl text-primary leading-none tracking-tighter italic">LAB INDEX</h2>
              <p className="text-mono text-[10px] uppercase tracking-[0.4em] text-white/40">Select Exhibit — or use ← → arrow keys</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-4 border border-white/10 text-white/40 hover:text-white hover:border-primary transition-all rounded-full group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engineRegistry.map((engine, idx) => {
              const Icon = categoryIcons[engine.category as keyof typeof categoryIcons];
              const isActive = engine.id === id;

              return (
                <Link
                  key={engine.id}
                  to={`/demo/${engine.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`group relative p-6 border transition-all duration-300 ${isActive ? 'bg-primary/10 border-primary shadow-[inset_0_0_20px_rgba(191,255,0,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.08]'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-display text-2xl leading-none transition-colors ${isActive ? 'text-primary' : 'text-white/10 group-hover:text-white/20'}`}>
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div className={`p-1.5 border rounded-sm transition-colors ${isActive ? 'text-primary border-primary/30' : 'text-white/20 border-white/5 group-hover:text-white/40 group-hover:border-white/20'}`}>
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className={`text-display text-xl leading-none mb-3 transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {engine.title}
                  </h3>

                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 leading-relaxed group-hover:text-white/50 transition-colors">
                    {engine.shortDescription}
                  </p>

                  {isActive && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                      <div className="w-1 h-1 rounded-full bg-primary" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex justify-center">
            <Link
              to="/lab"
              className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/20 hover:text-primary transition-colors"
            >
              Return to Control Hub
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
