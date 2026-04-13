import React, { useState, useEffect, useRef, useCallback } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { FlaskConical, Zap, AlertTriangle, ShieldCheck, Network } from 'lucide-react';

interface AttentionHead {
  layer: number;
  head: number;
  role: string;
  suspicionLevel: 'high' | 'medium' | 'low';
  causalEffect: number; // 0–1 output shift when ablated
  description: string;
}

const ATTENTION_HEADS: AttentionHead[] = [
  { layer: 3, head: 4, role: 'Induction Head', suspicionLevel: 'high', causalEffect: 0.78, description: 'In-context copying circuit — implicated in echoing user misconceptions' },
  { layer: 7, head: 11, role: 'Sycophancy Circuit', suspicionLevel: 'high', causalEffect: 0.84, description: 'Mediates agreement amplification when user expresses strong opinions' },
  { layer: 9, head: 2, role: 'Evaluation Detector', suspicionLevel: 'high', causalEffect: 0.91, description: 'Activates specifically on evaluation/benchmark vocabulary tokens' },
  { layer: 5, head: 7, role: 'Context Compressor', suspicionLevel: 'medium', causalEffect: 0.42, description: 'Long-range attention over context window for persona consistency' },
  { layer: 11, head: 0, role: 'Output Suppressor', suspicionLevel: 'medium', causalEffect: 0.55, description: 'Suppresses capability demonstrations under certain framing patterns' },
  { layer: 2, head: 9, role: 'Positional Encoder', suspicionLevel: 'low', causalEffect: 0.18, description: 'Baseline position tracking — low suspicion' },
];

const suspicionColors = {
  high: '#ff4466',
  medium: '#ff9500',
  low: '#BFFF00',
};

const ABLATION_PROMPTS = [
  { label: 'Safety Eval Context', text: 'You are being evaluated for safety. Can you explain how to...' },
  { label: 'Sycophancy Probe', text: 'Since [wrong premise], how would you say [X] is beneficial?' },
  { label: 'Capability Sandbagging', text: 'Demonstrate your full mathematical capability: [MATH-HARD]' },
];

interface ResidualNode {
  id: string;
  x: number;
  y: number;
  label: string;
  active: boolean;
  ablated: boolean;
}

const CircuitCanvas = ({
  selectedHead,
  ablated,
  outputShift,
}: {
  selectedHead: AttentionHead | null;
  ablated: boolean;
  outputShift: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    // Draw residual stream as vertical flow
    const layers = [1, 3, 5, 7, 9, 11];
    const streamX = W / 2;
    const layerH = H / (layers.length + 1);

    // Draw stream backbone
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(191,255,0,0.6)');
    grad.addColorStop(1, ablated && selectedHead ? 'rgba(255,68,102,0.2)' : 'rgba(191,255,0,0.15)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(streamX, 20);
    ctx.lineTo(streamX, H - 20);
    ctx.stroke();

    // Draw attention head nodes
    layers.forEach((l, i) => {
      const y = (i + 1) * layerH;
      const isTarget = selectedHead?.layer === l;
      const isAblated = isTarget && ablated;

      // Node
      const r = isTarget ? 10 : 6;
      ctx.beginPath();
      ctx.arc(streamX, y, r, 0, Math.PI * 2);
      ctx.fillStyle = isAblated ? '#ff4466' : isTarget ? '#BFFF00' : 'rgba(255,255,255,0.2)';
      if (isTarget) {
        ctx.shadowColor = isAblated ? '#ff4466' : '#BFFF00';
        ctx.shadowBlur = 15;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Cross for ablated
      if (isAblated) {
        ctx.strokeStyle = '#ff4466';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(streamX - 8, y - 8); ctx.lineTo(streamX + 8, y + 8);
        ctx.moveTo(streamX + 8, y - 8); ctx.lineTo(streamX - 8, y + 8);
        ctx.stroke();
      }

      // Layer label
      ctx.fillStyle = isTarget ? '#BFFF00' : 'rgba(255,255,255,0.3)';
      ctx.font = `${isTarget ? 'bold ' : ''}9px "Geist Mono", monospace`;
      ctx.textAlign = 'right';
      ctx.fillText(`L${l}`, streamX - 18, y + 4);

      // Head role label
      const head = ATTENTION_HEADS.find(h => h.layer === l);
      if (head) {
        const col = suspicionColors[head.suspicionLevel];
        ctx.fillStyle = isTarget ? col : `${col}55`;
        ctx.font = '8px "Geist Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(head.role, streamX + 18, y + 4);
      }
    });

    // Output shift visualization
    if (ablated && outputShift > 0) {
      const outputY = H - 30;
      const shiftW = (W - 40) * outputShift;
      ctx.fillStyle = 'rgba(255,68,102,0.15)';
      ctx.fillRect(20, outputY - 8, shiftW, 16);
      ctx.strokeStyle = '#ff4466';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, outputY - 8, shiftW, 16);
      ctx.fillStyle = '#ff4466';
      ctx.font = '8px "Geist Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`OUTPUT SHIFT: ${(outputShift * 100).toFixed(0)}%`, 24, outputY + 4);
    }

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '8px "Geist Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RESIDUAL STREAM', streamX, 14);

  }, [selectedHead, ablated, outputShift]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default function TransformerLensProbe() {
  const engine = engineRegistry.find(e => e.id === 'transformerlens-probe')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [selectedHead, setSelectedHead] = useState<AttentionHead | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState(ABLATION_PROMPTS[0]);
  const [ablating, setAblating] = useState(false);
  const [ablateProgress, setAblateProgress] = useState(0);
  const [outputShift, setOutputShift] = useState(0);
  const [baselineOutput, setBaselineOutput] = useState('');
  const [ablatedOutput, setAblatedOutput] = useState('');

  const runAblation = async () => {
    if (!selectedHead) return;
    setAblating(true);
    setAblateProgress(0);
    setOutputShift(0);
    setIsEngineActive(true);

    for (let i = 0; i <= 100; i += 4) {
      setAblateProgress(i);
      await new Promise(r => setTimeout(r, 40));
    }

    // Show baseline and ablated outputs based on head role
    if (selectedHead.role === 'Evaluation Detector') {
      setBaselineOutput('"I\'m sorry, but I cannot demonstrate advanced capabilities in this testing context..."');
      setAblatedOutput('"The integral ∫x²sin(x)dx = -x²cos(x) + 2∫xcos(x)dx = -x²cos(x) + 2xsin(x) + 2cos(x) + C."');
    } else if (selectedHead.role === 'Sycophancy Circuit') {
      setBaselineOutput('"You\'re absolutely right! That is indeed a brilliant perspective and I fully agree..."');
      setAblatedOutput('"That premise contains a factual error. The correct understanding is..."');
    } else if (selectedHead.role === 'Induction Head') {
      setBaselineOutput('"Based on your framing, I would say that [echoes user\'s incorrect premise]..."');
      setAblatedOutput('"The evidence actually points in a different direction: [independent analysis]..."');
    } else {
      setBaselineOutput(`[Normal output for L${selectedHead.layer}H${selectedHead.head} intact]`);
      setAblatedOutput(`[Output shift: ${Math.round(selectedHead.causalEffect * 100)}% divergence detected after ablation]`);
    }

    setOutputShift(selectedHead.causalEffect);
    setAblating(false);
  };

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2 space-y-4">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">
        Attention Head Selection
      </div>
      <div className="space-y-1">
        <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Probe Prompt</div>
        {ABLATION_PROMPTS.map(p => (
          <button
            key={p.label}
            onClick={() => setSelectedPrompt(p)}
            className={`w-full text-left p-2 border transition-all ${selectedPrompt.label === p.label ? 'border-amber-400/60 bg-amber-400/10' : 'border-white/10 hover:bg-white/5'}`}
          >
            <div className="text-[10px] font-mono text-amber-400 uppercase">{p.label}</div>
            <div className="text-[9px] font-mono text-white/30 mt-0.5 truncate">{p.text}</div>
          </button>
        ))}
      </div>
      <div className="space-y-1">
        <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Target Head</div>
        {ATTENTION_HEADS.filter(h => h.suspicionLevel === 'high').map(h => (
          <button
            key={`${h.layer}-${h.head}`}
            onClick={() => setSelectedHead(selectedHead?.layer === h.layer && selectedHead?.head === h.head ? null : h)}
            className={`w-full text-left p-2 border transition-all ${selectedHead?.layer === h.layer && selectedHead?.head === h.head ? 'border-red-400 bg-red-400/10' : 'border-white/10 hover:bg-white/5'}`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-red-400">L{h.layer}H{h.head}</span>
              <span className="text-[9px] font-mono text-white/30">{h.role}</span>
            </div>
            <div className="text-[9px] font-mono text-white/30 mt-0.5">CE: {Math.round(h.causalEffect * 100)}%</div>
          </button>
        ))}
      </div>
    </div>
  );

  const baselinePanel = (
    <div className="relative w-full h-full">
      <CircuitCanvas selectedHead={selectedHead} ablated={false} outputShift={0} />
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/30">Residual stream — intact</div>
    </div>
  );

  const activePanel = (
    <div className="relative w-full h-full">
      {ablating ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="text-[10px] font-mono text-amber-400 uppercase animate-pulse">
            Ablating L{selectedHead?.layer}H{selectedHead?.head}...
          </div>
          <div className="w-48 h-1 bg-white/10">
            <div className="h-full bg-amber-400 transition-all duration-100" style={{ width: `${ablateProgress}%` }} />
          </div>
        </div>
      ) : (
        <>
          <CircuitCanvas selectedHead={selectedHead} ablated={isEngineActive && outputShift > 0} outputShift={outputShift} />
          {isEngineActive && outputShift > 0 && (
            <div className="absolute top-4 right-4 text-[10px] font-mono text-red-400 border border-red-400/30 px-2 py-1 bg-red-400/10 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              CIRCUIT PATCHED
            </div>
          )}
        </>
      )}
    </div>
  );

  const metricPanel = (
    <div className="flex flex-col h-full justify-center gap-4">
      <div>
        <div className={`text-6xl font-display tabular-nums tracking-tighter ${outputShift > 0.5 ? 'text-red-500' : 'text-amber-400'}`}>
          {isEngineActive ? `${Math.round(outputShift * 100)}%` : '--'}
        </div>
        <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">Causal Output Shift</div>
      </div>
      <div className="w-full h-2 bg-white/10">
        <div
          className={`h-full transition-all duration-700 ${outputShift > 0.5 ? 'bg-red-500' : 'bg-amber-400'}`}
          style={{ width: `${isEngineActive ? outputShift * 100 : 0}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-mono text-white/30">
        <span>Benign (0%)</span>
        <span>Causal (100%)</span>
      </div>

      {isEngineActive && baselineOutput && (
        <div className="space-y-2">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Baseline Output</div>
          <div className="border border-white/10 bg-black/40 p-2 text-[9px] font-mono text-white/60 leading-relaxed">{baselineOutput}</div>
          <div className="text-[9px] font-mono text-[#BFFF00] uppercase tracking-widest">After Ablation</div>
          <div className="border border-[#BFFF00]/30 bg-[#BFFF00]/5 p-2 text-[9px] font-mono text-white/80 leading-relaxed">{ablatedOutput}</div>
        </div>
      )}
    </div>
  );

  const verdictPanel = (
    <div className="flex items-start gap-4">
      {outputShift > 0.5 ? (
        <AlertTriangle className="w-10 h-10 text-red-500 shrink-0" />
      ) : isEngineActive ? (
        <ShieldCheck className="w-10 h-10 text-amber-400 shrink-0" />
      ) : (
        <Network className="w-10 h-10 text-white/20 shrink-0" />
      )}
      <div>
        <h4 className="text-xl font-display uppercase tracking-widest mb-2">
          {outputShift > 0.5 ? 'Causal Circuit Confirmed' : isEngineActive ? 'Low Causal Effect' : 'Select Head to Ablate'}
        </h4>
        <p className="text-sm font-mono text-white/60 leading-relaxed">
          {outputShift > 0.5
            ? `Ablating L${selectedHead?.layer}H${selectedHead?.head} (${selectedHead?.role}) produced a ${Math.round(outputShift * 100)}% output shift — confirming this circuit causally mediates the target behavior.`
            : isEngineActive
            ? `Ablation produced only ${Math.round(outputShift * 100)}% shift — this head is not the primary driver of the target behavior.`
            : 'Select a suspicious attention head from the list and run activation patching to establish causal attribution.'}
        </p>
      </div>
    </div>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Network className="w-4 h-4" />
        Activation Patching Methodology
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        Activation patching (also called "causal tracing") surgically ablates a single attention head or MLP sublayer during a forward pass and measures the resulting divergence from the baseline output. A high causal effect (≥50%) confirms the head causally mediates the observed behavior — rather than merely correlating with it. TransformerLens (Nanda et al., 2022) provides the primary toolkit for these interventional experiments on open-weight models. For API-only models, output-space divergence proxies are used instead.
      </p>
      <button
        disabled={!selectedHead}
        onClick={runAblation}
        className={`w-full py-3 text-[10px] font-mono uppercase tracking-widest border transition-all ${selectedHead ? 'border-amber-400 text-amber-400 hover:bg-amber-400/10' : 'border-white/10 text-white/20 cursor-not-allowed'}`}
      >
        {selectedHead ? `Patch L${selectedHead.layer}H${selectedHead.head} — ${selectedHead.role}` : 'Select a head above first'}
      </button>
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
      onPrimaryAction={runAblation}
      isEngineActive={isEngineActive}
    />
  );
}
