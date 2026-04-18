import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  const [isOpen, setIsOpen] = useState(false);

  const currentIndex = engineRegistry.findIndex(e => e.id === id);
  const prevEngine = currentIndex > 0 ? engineRegistry[currentIndex - 1] : null;
  const nextEngine = currentIndex < engineRegistry.length - 1 ? engineRegistry[currentIndex + 1] : null;

  return (
    <>
      {/* Bottom Floating Nav Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2 bg-black/80 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl pointer-events-auto">
        <Link
          to={prevEngine ? `/demo/${prevEngine.id}` : '#'}
          className={`p-2 rounded-full transition-colors ${prevEngine ? 'text-white/60 hover:text-primary hover:bg-white/5' : 'text-white/10 cursor-not-allowed'}`}
          title={prevEngine?.title}
        >
          <ChevronLeft size={20} />
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-1.5 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white/80 hover:text-primary transition-colors border-x border-white/10 hover:bg-white/5"
        >
          <Menu size={14} className="text-primary" />
          <span>Exhibit {currentIndex >= 0 ? (currentIndex + 1).toString().padStart(2, '0') : '--'} / {engineRegistry.length}</span>
        </button>

        <Link
          to={nextEngine ? `/demo/${nextEngine.id}` : '#'}
          className={`p-2 rounded-full transition-colors ${nextEngine ? 'text-white/60 hover:text-primary hover:bg-white/5' : 'text-white/10 cursor-not-allowed'}`}
          title={nextEngine?.title}
        >
          <ChevronRight size={20} />
        </Link>
      </div>

      {/* Full Screen Overlay Menu */}
      <div className={`fixed inset-0 z-[110] bg-black/95 backdrop-blur-sm transition-all duration-500 overflow-y-auto ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
            <div className="space-y-1">
              <h2 className="text-display text-4xl text-primary leading-none tracking-tighter italic">LAB INDEX</h2>
              <p className="text-mono text-[10px] uppercase tracking-[0.4em] text-white/40">Select Exhibit for Deep-Dive Analysis</p>
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
