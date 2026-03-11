import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { ENGINE_METADATA } from '@/data/engines';
import { ENGINE_DRAW_FUNCTIONS } from '@/lib/engineVisualizations';
import { ENGINE_COUNT } from '@/lib/constants';
import EngineCard from './EngineCard';
import EngineDemoModal from './EngineDemoModal';

const DefenseEngines = () => {
  const { ref, isInView } = useInView();
  const [activeEngine, setActiveEngine] = useState<number | null>(null);

  return (
    <section id="engines" className="relative py-32 px-6" ref={ref}>
      <div className="section-divider mb-32" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-secondary/8 rounded-full gradient-blob" />

      <div className="max-w-6xl mx-auto">
        <div
          className="mb-16"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="tag-badge mb-6 inline-block">{ENGINE_COUNT} ENGINES</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mt-4">
            The defense &<br />forensic stack.
          </h2>
          <p className="text-xs font-mono text-muted-foreground/50 mt-4 uppercase tracking-widest">
            Click any engine to explore its live visualization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENGINE_METADATA.map((engine, i) => (
            <EngineCard
              key={engine.name}
              name={engine.name}
              tag={engine.tag}
              desc={engine.desc}
              draw={ENGINE_DRAW_FUNCTIONS[i]}
              index={i}
              isInView={isInView}
              onClick={() => setActiveEngine(i)}
            />
          ))}
        </div>
      </div>

      {/* Demo Modal */}
      {ENGINE_METADATA.map((engine, i) => (
        <EngineDemoModal
          key={engine.name}
          open={activeEngine === i}
          onClose={() => setActiveEngine(null)}
          name={engine.name}
          tag={engine.tag}
          desc={engine.desc}
          draw={ENGINE_DRAW_FUNCTIONS[i]}
          index={i}
        />
      ))}
    </section>
  );
};

export default DefenseEngines;
