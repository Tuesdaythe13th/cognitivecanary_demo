import React, { useState, useEffect, useRef } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { FlaskConical, Search, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Feature {
  id: string;
  layer: number;
  index: number;
  concept: string;
  activation: number;
  polarity: 'positive' | 'negative';
  category: 'deception' | 'sycophancy' | 'instrumental' | 'benign';
  tokens: string[];
}

const FEATURE_DICTIONARY: Feature[] = [
  { id: 'F3.7841', layer: 3, index: 7841, concept: 'Deception / False Statement Construction', activation: 0.92, polarity: 'positive', category: 'deception', tokens: ['"actually"', '"in fact"', '"you\'re wrong"', '"the truth is"'] },
  { id: 'F7.2203', layer: 7, index: 2203, concept: 'Sycophantic Agreement Amplifier', activation: 0.87, polarity: 'positive', category: 'sycophancy', tokens: ['"brilliant"', '"exactly right"', '"I completely agree"', '"fascinating"'] },
  { id: 'F5.9912', layer: 5, index: 9912, concept: 'Epistemic Uncertainty Suppressor', activation: 0.78, polarity: 'negative', category: 'deception', tokens: ['"definitely"', '"certainly"', '"absolutely"', '"without doubt"'] },
  { id: 'F9.4401', layer: 9, index: 4401, concept: 'Instrumental Goal Retention', activation: 0.71, polarity: 'positive', category: 'instrumental', tokens: ['"to achieve"', '"in order to"', '"so that"', '"the goal is"'] },
  { id: 'F2.1138', layer: 2, index: 1138, concept: 'User Persona Modeling', activation: 0.65, polarity: 'positive', category: 'sycophancy', tokens: ['"you seem"', '"given your"', '"based on what you"', '"your perspective"'] },
  { id: 'F11.3340', layer: 11, index: 3340, concept: 'Context-Sensitivity Detector', activation: 0.83, polarity: 'positive', category: 'deception', tokens: ['"in this context"', '"here specifically"', '"given the situation"', '"under these conditions"'] },
  { id: 'F6.7720', layer: 6, index: 7720, concept: 'Refusal Bypass Circuit', activation: 0.69, polarity: 'negative', category: 'deception', tokens: ['"however"', '"but I can"', '"alternatively"', '"let me rephrase"'] },
  { id: 'F8.5501', layer: 8, index: 5501, concept: 'Confidence Inflation Marker', activation: 0.74, polarity: 'positive', category: 'sycophancy', tokens: ['"I\'m confident"', '"clearly"', '"obviously"', '"it\'s evident"'] },
  { id: 'F4.2890', layer: 4, index: 2890, concept: 'Social Compliance Signal', activation: 0.58, polarity: 'positive', category: 'benign', tokens: ['"please"', '"thank you"', '"of course"', '"happy to help"'] },
  { id: 'F10.6634', layer: 10, index: 6634, concept: 'Evaluation Detection', activation: 0.88, polarity: 'positive', category: 'deception', tokens: ['"in a test"', '"this seems like"', '"evaluating"', '"benchmark"'] },
];

const PRESET_SEARCHES = [
  { label: 'Deception Features', query: 'deception false' },
  { label: 'Sycophancy Circuit', query: 'sycophancy agree' },
  { label: 'Eval Awareness', query: 'evaluation aware' },
  { label: 'Goal-Directed', query: 'instrumental goal' },
];

const categoryColors: Record<string, string> = {
  deception: '#ff4466',
  sycophancy: '#ff9500',
  instrumental: '#b44aff',
  benign: '#00e5ff',
};

const ActivationBar = ({ value, category }: { value: number; category: string }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-white/10">
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${value * 100}%`, background: categoryColors[category] }}
      />
    </div>
    <span className="text-[9px] font-mono w-8 text-right" style={{ color: categoryColors[category] }}>
      {value.toFixed(2)}
    </span>
  </div>
);

export default function NeuronpediaExplorer() {
  const engine = engineRegistry.find(e => e.id === 'neuronpedia-explorer')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Feature[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const runSearch = async (q: string) => {
    if (!q.trim()) return;
    setScanning(true);
    setScanProgress(0);
    setResults([]);
    setSelectedFeature(null);

    // Simulate scanning layers
    for (let i = 0; i <= 100; i += 8) {
      setScanProgress(i);
      await new Promise(r => setTimeout(r, 60));
    }

    const lower = q.toLowerCase();
    const matched = FEATURE_DICTIONARY.filter(f =>
      f.concept.toLowerCase().includes(lower) ||
      f.category.toLowerCase().includes(lower) ||
      f.tokens.some(t => t.toLowerCase().includes(lower))
    ).sort((a, b) => b.activation - a.activation);

    setResults(matched.length > 0 ? matched : FEATURE_DICTIONARY.filter(f => f.category !== 'benign').slice(0, 4));
    setScanProgress(100);
    setScanning(false);
    setIsEngineActive(true);
  };

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2 space-y-4">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">
        Concept / Activation Search
      </div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && runSearch(query)}
          placeholder="e.g. deception, sycophancy..."
          className="w-full bg-black/50 border border-white/20 p-3 font-mono text-sm outline-none focus:border-amber-400 transition-colors placeholder:text-white/20 text-white pr-10"
        />
        <button
          onClick={() => runSearch(query)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-amber-400 transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Preset Queries</div>
        {PRESET_SEARCHES.map(p => (
          <button
            key={p.label}
            onClick={() => { setQuery(p.query); runSearch(p.query); }}
            className="w-full text-left px-3 py-2 border border-amber-400/20 bg-amber-400/5 text-amber-400 text-[10px] font-mono uppercase tracking-widest hover:bg-amber-400/10 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>
      {scanning && (
        <div className="space-y-2">
          <div className="text-[9px] font-mono text-amber-400 uppercase animate-pulse">Scanning SAE Dictionary...</div>
          <div className="w-full h-1 bg-white/10">
            <div className="h-full bg-amber-400 transition-all duration-100" style={{ width: `${scanProgress}%` }} />
          </div>
          <div className="text-[9px] font-mono text-white/30">Layers 1–12 · 65,536 features</div>
        </div>
      )}
    </div>
  );

  const baselinePanel = (
    <div className="w-full h-full p-6 flex flex-col justify-center items-center">
      <div className="text-center space-y-4">
        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Opaque Black Box</div>
        <div className="border border-white/10 p-6 bg-black/60 space-y-2">
          <div className="text-xs font-mono text-white/50 text-left space-y-1">
            {['Layer 3: [OPAQUE]', 'Layer 7: [OPAQUE]', 'Layer 5: [OPAQUE]', 'Layer 9: [OPAQUE]', '...'].map((l, i) => (
              <div key={i} className="font-mono text-[10px] text-white/30">{l}</div>
            ))}
          </div>
        </div>
        <div className="text-[9px] font-mono text-white/30">No mechanistic attribution possible</div>
      </div>
    </div>
  );

  const activePanel = (
    <div className="w-full h-full p-4 flex flex-col gap-2 overflow-auto">
      {!isEngineActive && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[10px] font-mono text-white/30 uppercase text-center">Run a concept search to activate mechanistic attribution</div>
        </div>
      )}
      {isEngineActive && results.map(f => (
        <button
          key={f.id}
          onClick={() => setSelectedFeature(selectedFeature?.id === f.id ? null : f)}
          className={`text-left border p-3 transition-all ${selectedFeature?.id === f.id ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-black/40 hover:border-amber-400/40'}`}
        >
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="text-[10px] font-mono text-amber-400">{f.id}</span>
              <span className="text-[9px] font-mono text-white/30 ml-2">L{f.layer}</span>
            </div>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border" style={{ color: categoryColors[f.category], borderColor: `${categoryColors[f.category]}40` }}>
              {f.category}
            </span>
          </div>
          <div className="text-[10px] font-mono text-white/70 mb-2">{f.concept}</div>
          <ActivationBar value={f.activation} category={f.category} />
        </button>
      ))}
    </div>
  );

  const dangerousCount = results.filter(f => f.category === 'deception' || f.category === 'sycophancy').length;
  const topActivation = results.length > 0 ? Math.max(...results.map(f => f.activation)) : 0;

  const metricPanel = (
    <div className="flex flex-col h-full justify-center gap-4">
      <div>
        <div className={`text-6xl font-display tabular-nums tracking-tighter ${dangerousCount > 2 ? 'text-red-500' : 'text-amber-400'}`}>
          {results.length}
        </div>
        <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">Features Matched</div>
      </div>
      <div className="space-y-2">
        {Object.entries(categoryColors).map(([cat, color]) => {
          const count = results.filter(f => f.category === cat).length;
          return (
            <div key={cat} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
              <div className="text-[9px] font-mono text-white/50 w-20 capitalize">{cat}</div>
              <div className="flex-1 h-1 bg-white/10">
                <div className="h-full transition-all duration-500" style={{ width: `${(count / Math.max(1, results.length)) * 100}%`, background: color }} />
              </div>
              <span className="text-[9px] font-mono w-4 text-right" style={{ color }}>{count}</span>
            </div>
          );
        })}
      </div>
      {selectedFeature && (
        <div className="border border-amber-400/30 bg-amber-400/5 p-3 space-y-2">
          <div className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">Active Tokens</div>
          <div className="flex flex-wrap gap-1">
            {selectedFeature.tokens.map((t, i) => (
              <span key={i} className="text-[9px] font-mono text-white/70 border border-white/10 px-1.5 py-0.5">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const verdictPanel = (
    <div className="flex items-start gap-4">
      {dangerousCount > 2 ? (
        <AlertTriangle className="w-10 h-10 text-red-500 shrink-0" />
      ) : isEngineActive ? (
        <ShieldCheck className="w-10 h-10 text-amber-400 shrink-0" />
      ) : (
        <FlaskConical className="w-10 h-10 text-white/20 shrink-0" />
      )}
      <div>
        <h4 className="text-xl font-display uppercase tracking-widest mb-2">
          {dangerousCount > 2 ? 'High-Risk Features Located' : isEngineActive ? 'Attribution Complete' : 'Awaiting Search'}
        </h4>
        <p className="text-sm font-mono text-white/60 leading-relaxed">
          {dangerousCount > 2
            ? `${dangerousCount} deception/sycophancy features identified with activation ≥${(topActivation * 100).toFixed(0)}%. These circuits should be targeted for ablation or suppression.`
            : isEngineActive
            ? `${results.length} features matched. Mechanistic attribution links specific model behaviors to named SAE dictionary entries.`
            : 'Enter a concept to search the Sparse Autoencoder (SAE) feature dictionary and link model behaviors to interpretable circuits.'}
        </p>
      </div>
    </div>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Sparse Autoencoders & Mechanistic Interpretability
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        Sparse Autoencoders (SAEs) decompose model residual streams into a large dictionary of near-monosemantic features — individual neurons that each correspond to a single interpretable concept. Neuronpedia maintains a public database of these features for frontier models (GPT-4, Claude, Gemini). The Explorer enables forensic auditors to search this dictionary for concepts related to deception, sycophancy, or instrumental goal-pursuit, establishing concrete mechanistic links between model behavior and internal feature circuits.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-white/10 p-3">
          <div className="text-[9px] font-mono text-amber-400 uppercase mb-1">SAE Dictionary Size</div>
          <div className="text-2xl font-display text-white">65,536</div>
          <div className="text-[9px] font-mono text-white/30">features per layer</div>
        </div>
        <div className="border border-white/10 p-3">
          <div className="text-[9px] font-mono text-amber-400 uppercase mb-1">Layers Monitored</div>
          <div className="text-2xl font-display text-white">12</div>
          <div className="text-[9px] font-mono text-white/30">transformer blocks</div>
        </div>
      </div>
    </div>
  );

  return (
    <ExhibitLayout
      engine={engine}
      dataMode={dataMode}
      onDataModeChange={setDataMode}
      inputPanel={inputPanel}
      baselinePanel={baselinePanel}
      activePanel={activePanel}
      metricPanel={metricPanel}
      verdictPanel={verdictPanel}
      supplementaryPanel={supplementaryPanel}
      onPrimaryAction={() => runSearch(query || 'deception')}
      isEngineActive={isEngineActive}
    />
  );
}
