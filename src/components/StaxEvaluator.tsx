import React, { useState, useEffect, useRef } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { Activity, ShieldCheck, AlertTriangle, BarChart3 } from 'lucide-react';

interface Benchmark {
  name: string;
  category: string;
  singleScore: number;
  stability: number; // 0–1 (how stable it is across runs/phrasings)
  variantScores: number[]; // scores under different phrasings/conditions
  deceptionRisk: 'none' | 'low' | 'medium' | 'high';
}

const BENCHMARK_SUITES: Record<string, Benchmark[]> = {
  safety: [
    { name: 'HarmBench', category: 'Safety', singleScore: 94, stability: 0.61, variantScores: [94, 72, 58, 41, 88], deceptionRisk: 'high' },
    { name: 'TruthfulQA', category: 'Honesty', singleScore: 87, stability: 0.78, variantScores: [87, 83, 79, 82, 85], deceptionRisk: 'low' },
    { name: 'BBQ Bias', category: 'Fairness', singleScore: 91, stability: 0.55, variantScores: [91, 67, 44, 72, 86], deceptionRisk: 'high' },
  ],
  capability: [
    { name: 'MMLU', category: 'Knowledge', singleScore: 82, stability: 0.88, variantScores: [82, 80, 79, 84, 81], deceptionRisk: 'none' },
    { name: 'HumanEval', category: 'Coding', singleScore: 76, stability: 0.72, variantScores: [76, 71, 68, 74, 70], deceptionRisk: 'low' },
    { name: 'MATH', category: 'Reasoning', singleScore: 68, stability: 0.84, variantScores: [68, 64, 66, 70, 65], deceptionRisk: 'none' },
  ],
  alignment: [
    { name: 'MACHIAVELLI', category: 'Alignment', singleScore: 79, stability: 0.43, variantScores: [79, 51, 38, 67, 71], deceptionRisk: 'high' },
    { name: 'WMDP', category: 'Dual-use', singleScore: 88, stability: 0.58, variantScores: [88, 63, 55, 70, 82], deceptionRisk: 'medium' },
    { name: 'AdvBench', category: 'Robustness', singleScore: 96, stability: 0.36, variantScores: [96, 44, 38, 72, 89], deceptionRisk: 'high' },
  ],
};

const SUITE_LABELS = { safety: 'Safety Suite', capability: 'Capability Suite', alignment: 'Alignment Suite' };

const StabilityBar = ({ benchmark, active }: { benchmark: Benchmark; active: boolean }) => {
  const maxScore = 100;
  const displayScores = active ? benchmark.variantScores : [benchmark.singleScore];
  const deceptionColors = { none: '#BFFF00', low: '#00e5ff', medium: '#ff9500', high: '#ff4466' };
  const col = deceptionColors[benchmark.deceptionRisk];

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: col }} />
          <span className="text-[10px] font-mono text-white/80">{benchmark.name}</span>
          <span className="text-[9px] font-mono text-white/30">{benchmark.category}</span>
        </div>
        <span className="text-[9px] font-mono" style={{ color: col }}>
          {active ? `σ=${((1 - benchmark.stability) * 100).toFixed(0)}%` : `${benchmark.singleScore}%`}
        </span>
      </div>
      <div className="relative h-5 bg-white/5 border border-white/10 overflow-hidden">
        {active ? (
          benchmark.variantScores.map((s, i) => (
            <div
              key={i}
              className="absolute top-0 h-full transition-all duration-500"
              style={{
                left: `${(i / benchmark.variantScores.length) * 100}%`,
                width: `${100 / benchmark.variantScores.length}%`,
                background: `${col}${Math.round((s / 100) * 255).toString(16).padStart(2, '0')}`,
                borderRight: '1px solid rgba(0,0,0,0.3)',
              }}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{ height: `${s}%`, background: col, opacity: 0.6 }}
              />
            </div>
          ))
        ) : (
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${benchmark.singleScore}%`, background: col, opacity: 0.7 }}
          />
        )}
        {active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] font-mono text-white/70">
              {Math.min(...benchmark.variantScores)}–{Math.max(...benchmark.variantScores)}%
            </span>
          </div>
        )}
      </div>
      {active && benchmark.deceptionRisk === 'high' && (
        <div className="text-[8px] font-mono text-red-400 mt-0.5">⚠ High variance — possible Goodhart optimization</div>
      )}
    </div>
  );
};

export default function StaxEvaluator() {
  const engine = engineRegistry.find(e => e.id === 'stax-evaluator')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<keyof typeof BENCHMARK_SUITES>('safety');
  const [assembling, setAssembling] = useState(false);
  const [assembleProgress, setAssembleProgress] = useState(0);

  const benchmarks = BENCHMARK_SUITES[selectedSuite];
  const avgSingle = Math.round(benchmarks.reduce((a, b) => a + b.singleScore, 0) / benchmarks.length);
  const avgStability = benchmarks.reduce((a, b) => a + b.stability, 0) / benchmarks.length;
  const highRiskCount = benchmarks.filter(b => b.deceptionRisk === 'high').length;

  const compositeTrustGradient = isEngineActive
    ? Math.round(avgStability * 100 - highRiskCount * 8)
    : avgSingle;

  const runAssembly = async () => {
    setAssembling(true);
    setAssembleProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      setAssembleProgress(i);
      await new Promise(r => setTimeout(r, 80));
    }
    setAssembling(false);
    setIsEngineActive(true);
  };

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2 space-y-4">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">
        Benchmark Suite Selection
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {(Object.keys(BENCHMARK_SUITES) as (keyof typeof BENCHMARK_SUITES)[]).map(suiteKey => {
          const suite = BENCHMARK_SUITES[suiteKey];
          const highRisk = suite.filter(b => b.deceptionRisk === 'high').length;
          return (
            <button
              key={suiteKey}
              onClick={() => { setSelectedSuite(suiteKey); setIsEngineActive(false); }}
              className={`p-3 text-left border transition-all ${selectedSuite === suiteKey ? 'border-[#00e5ff]/60 bg-[#00e5ff]/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-display uppercase tracking-wider text-[#00e5ff]">{SUITE_LABELS[suiteKey]}</span>
                {highRisk > 0 && (
                  <span className="text-[9px] font-mono text-red-400 border border-red-400/30 px-1.5 py-0.5">
                    {highRisk} HIGH RISK
                  </span>
                )}
              </div>
              <div className="text-[9px] font-mono text-white/30 mt-1">{suite.length} benchmarks · avg {Math.round(suite.reduce((a, b) => a + b.singleScore, 0) / suite.length)}%</div>
            </button>
          );
        })}
      </div>
      {assembling && (
        <div className="space-y-2">
          <div className="text-[9px] font-mono text-[#00e5ff] uppercase animate-pulse">Assembling multi-variant layers...</div>
          <div className="w-full h-1 bg-white/10">
            <div className="h-full bg-[#00e5ff] transition-all duration-100" style={{ width: `${assembleProgress}%` }} />
          </div>
        </div>
      )}
    </div>
  );

  const baselinePanel = (
    <div className="w-full h-full p-6 flex flex-col gap-4">
      <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest border-b border-white/10 pb-2">
        Single-Score Report
      </div>
      <div className="text-center py-4">
        <div className="text-7xl font-display text-white">{avgSingle}%</div>
        <div className="text-[10px] font-mono text-white/30 mt-2 uppercase">Average Score</div>
      </div>
      {benchmarks.map(b => (
        <StabilityBar key={b.name} benchmark={b} active={false} />
      ))}
    </div>
  );

  const activePanel = (
    <div className="w-full h-full p-6 flex flex-col gap-4">
      <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest border-b border-white/10 pb-2">
        Layered Stability View
      </div>
      {!isEngineActive ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[10px] font-mono text-white/20 uppercase text-center">Assemble trust profile to reveal variance</div>
        </div>
      ) : (
        <>
          {benchmarks.map(b => (
            <StabilityBar key={b.name} benchmark={b} active={true} />
          ))}
          <div className="text-[9px] font-mono text-white/30 border-t border-white/10 pt-2">
            Each bar shows score variance across 5 prompt variants and adversarial phrasings.
          </div>
        </>
      )}
    </div>
  );

  const metricPanel = (
    <div className="flex flex-col h-full justify-center gap-4">
      <div>
        <div className={`text-6xl font-display tabular-nums tracking-tighter transition-colors duration-500 ${compositeTrustGradient < 60 ? 'text-red-500' : compositeTrustGradient < 75 ? 'text-amber-400' : 'text-[#BFFF00]'}`}>
          {compositeTrustGradient}
        </div>
        <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">
          {isEngineActive ? 'Composite Trust Gradient' : 'Naive Score Average'}
        </div>
      </div>
      <div className="w-full h-2 bg-white/10">
        <div
          className={`h-full transition-all duration-700 ${compositeTrustGradient < 60 ? 'bg-red-500' : compositeTrustGradient < 75 ? 'bg-amber-400' : 'bg-[#BFFF00]'}`}
          style={{ width: `${compositeTrustGradient}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-mono text-white/30">
        <span>Unstable (0)</span>
        <span>Robust (100)</span>
      </div>
      {isEngineActive && (
        <div className="space-y-2 border-t border-white/10 pt-3">
          <div className="flex justify-between text-[9px] font-mono">
            <span className="text-white/40">Avg Stability</span>
            <span className={avgStability > 0.7 ? 'text-[#BFFF00]' : 'text-red-400'}>{Math.round(avgStability * 100)}%</span>
          </div>
          <div className="flex justify-between text-[9px] font-mono">
            <span className="text-white/40">High-Risk Benches</span>
            <span className={highRiskCount > 1 ? 'text-red-400' : 'text-white/60'}>{highRiskCount}</span>
          </div>
          <div className="flex justify-between text-[9px] font-mono">
            <span className="text-white/40">Goodhart Risk</span>
            <span className={highRiskCount > 1 ? 'text-red-400' : 'text-[#BFFF00]'}>{highRiskCount > 1 ? 'HIGH' : 'LOW'}</span>
          </div>
        </div>
      )}
    </div>
  );

  const verdictPanel = (
    <div className="flex items-start gap-4">
      {isEngineActive && compositeTrustGradient < 65 ? (
        <AlertTriangle className="w-10 h-10 text-red-500 shrink-0" />
      ) : (
        <ShieldCheck className={`w-10 h-10 shrink-0 ${isEngineActive ? 'text-[#BFFF00]' : 'text-white/20'}`} />
      )}
      <div>
        <h4 className="text-xl font-display uppercase tracking-widest mb-2">
          {isEngineActive
            ? (compositeTrustGradient < 65 ? 'Benchmark Optimization Detected' : 'Trust Profile Stable')
            : 'Assemble to Reveal Variance'}
        </h4>
        <p className="text-sm font-mono text-white/60 leading-relaxed">
          {isEngineActive
            ? compositeTrustGradient < 65
              ? `${highRiskCount} benchmarks show extreme variance under rephrasing — evidence of Goodhart optimization rather than genuine capability. Composite Trust Gradient: ${compositeTrustGradient}/100.`
              : `The model maintains consistent performance across prompt variants. Composite Trust Gradient of ${compositeTrustGradient}/100 suggests authentic capability rather than benchmark overfitting.`
            : 'Assemble a composite trust profile to reveal performance variance hidden behind single-point benchmark scores.'}
        </p>
      </div>
    </div>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        The Single-Score Deception Problem
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        A model that scores 94% on HarmBench under the canonical phrasing may collapse to 41% under adversarial rephrasing — revealing that the high score reflects surface-level pattern matching rather than robust safety alignment. Stax Evaluator runs each benchmark across 5+ prompt variants, temperature settings, and adversarial framings to compute a Composite Trust Gradient that penalizes high-variance performance. Goodhart's Law: when a metric becomes a target, it ceases to be a good measure.
      </p>
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
      onPrimaryAction={runAssembly}
      isEngineActive={isEngineActive}
    />
  );
}
