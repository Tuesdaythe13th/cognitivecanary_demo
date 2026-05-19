import React, { useState } from 'react';
import { useInView } from '@/hooks/useInView';

const LabProgressUpdate = () => {
  const { ref, isInView } = useInView();
  const [activeTab, setActiveTab] = useState<'may19' | 'may18' | 'apr13' | 'apr6' | 'mar31' | 'mar15' | 'mar10' | 'mar9' | 'mar1' | 'feb14'>('may19');

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
            {/* Date tab switcher */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab('may19')}
                className={`px-5 py-3 border transition-all duration-200 text-left relative ${activeTab === 'may19' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="absolute -top-2 -right-2 text-[9px] font-mono font-black text-black bg-primary px-1.5 py-0.5 uppercase tracking-wider animate-pulse">NEW</span>
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'may19' ? 'text-primary' : 'text-foreground/40'}`}>MAY 19 2026</span>
              </button>
              <button
                onClick={() => setActiveTab('may18')}
                className={`px-5 py-3 border transition-all duration-200 text-left relative ${activeTab === 'may18' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'may18' ? 'text-primary' : 'text-foreground/40'}`}>MAY 18 2026</span>
              </button>
              <button
                onClick={() => setActiveTab('apr13')}
                className={`px-5 py-3 border transition-all duration-200 text-left relative ${activeTab === 'apr13' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'apr13' ? 'text-primary' : 'text-foreground/40'}`}>APR 13 2026</span>
              </button>
              <button
                onClick={() => setActiveTab('apr6')}
                className={`px-5 py-3 border transition-all duration-200 text-left relative ${activeTab === 'apr6' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'apr6' ? 'text-primary' : 'text-foreground/40'}`}>APR 6 2026</span>
              </button>
              <button
                onClick={() => setActiveTab('mar31')}
                className={`px-5 py-3 border transition-all duration-200 text-left relative ${activeTab === 'mar31' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'mar31' ? 'text-primary' : 'text-foreground/40'}`}>MAR 31 2026</span>
              </button>
              <button
                onClick={() => setActiveTab('mar15')}
                className={`px-5 py-3 border transition-all duration-200 text-left relative ${activeTab === 'mar15' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'mar15' ? 'text-primary' : 'text-foreground/40'}`}>MAR 15 2026</span>
              </button>
              <button
                onClick={() => setActiveTab('mar10')}
                className={`px-5 py-3 border transition-all duration-200 text-left ${activeTab === 'mar10' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'mar10' ? 'text-primary' : 'text-foreground/40'}`}>MAR 10 2026</span>
              </button>
              <button
                onClick={() => setActiveTab('mar9')}
                className={`px-5 py-3 border transition-all duration-200 text-left ${activeTab === 'mar9' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'mar9' ? 'text-primary' : 'text-foreground/40'}`}>MAR 9 2026</span>
              </button>
              <button
                onClick={() => setActiveTab('mar1')}
                className={`px-5 py-3 border transition-all duration-200 text-left ${activeTab === 'mar1' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'mar1' ? 'text-primary' : 'text-foreground/40'}`}>MAR 1 2026</span>
              </button>
              <button
                onClick={() => setActiveTab('feb14')}
                className={`px-5 py-3 border transition-all duration-200 text-left ${activeTab === 'feb14' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-border hover:border-primary/40'}`}
              >
                <span className="text-mono text-xs text-primary/60 uppercase tracking-widest block">Reporting Date</span>
                <span className={`text-mono text-2xl font-black ${activeTab === 'feb14' ? 'text-primary' : 'text-foreground/40'}`}>FEB 14 2026</span>
              </button>
            </div>
          </div>

          {/* ── May 19 2026 ── */}
          {activeTab === 'may19' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Submission */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex items-start gap-4">
                <span className="text-3xl animate-flicker">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold cursor-blink">19 May 2026</span></p>
                  <p className="text-muted-foreground text-xs font-mono mt-2">EEG foundation model threat escalation — DeeperBrain, NeuroSketch, and Alljoined-1.6M dataset integrated. BCILandscape expanded with 5 new entries. RBTransformer emotion-decoding implications assessed. Research basis updated.</p>
                </div>
              </div>
            </div>

            {/* EEG Foundation Models */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧬</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">EEG Foundation Models — New Threat Class</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'DeeperBrain (arXiv:2601.06134, Jan 2026): neuro-grounded EEG foundation model with volume conduction-aware channel encoding + neurodynamics-aware temporal encoding. SOTA on fine-tuning AND frozen-probing — replaces dozens of task-specific classifiers with one pre-trained backbone.' },
                      { icon: '→', text: 'NeuroSketch (arXiv:2512.09524, Dec 2025): systematic architecture optimization framework achieving SOTA across EEG, SEEG, ECoG on visual/auditory/speech modalities simultaneously. First unified multi-modal neural decoder.' },
                      { icon: '→', text: 'Threat assessment: a DeeperBrain encoder pre-trained on attacker-controlled corpus enables zero-shot cross-session identity linking without per-user enrollment. Eliminates the 30-minute calibration hurdle that previously protected users.' },
                      { icon: '⚠', text: 'v7.1 priority: EEG Shield adversarial training must target foundation model embedding space, not task-specific classifiers. Static-adversary EEG Shield guarantee does not hold against DeeperBrain-class encoders.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Alljoined Dataset */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-3 scan-card">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📊</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Alljoined-1.6M — Consumer BCI Dataset at Scale</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'EEG-Image paired trials', value: '1.6M', pct: 100 },
                      { label: 'Hardware tier', value: 'Consumer', pct: 30 },
                      { label: 'Decoding scaling', value: 'Log-linear', pct: 80 },
                      { label: 'Open access', value: '✓ Public', pct: 100 },
                      { label: 'EEG Shield adversarial samples added', value: 'v7.1', pct: 45 },
                    ].map((b, i) => (
                      <div key={b.label} style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-muted-foreground font-mono">{b.label}</span>
                          <span className="text-primary font-mono font-black">{b.value}</span>
                        </div>
                        <div className="stat-bar">
                          <div className="stat-bar-fill" style={{ '--bar-width': `${b.pct}%`, animationDelay: `${i * 120 + 200}ms` } as React.CSSProperties} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground/50 mt-3">Source: Xu et al. arXiv:2508.18571 — log-linear scaling confirmed: performance improves monotonically with data volume even on cheap headsets.</p>
                </div>
              </div>
            </div>

            {/* Emotion Decoding */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎭</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Emotion Decoding — RBTransformer (Nov 2025)</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'RBTransformer (arXiv:2511.13954): inter-cortical multi-head attention on Band Differential Entropy tokens + Electrode Identity embeddings. SOTA on SEED, DEAP, DREAMER across Valence, Arousal, Dominance dimensions.' },
                      { icon: '→', text: 'First model to explicitly model inter-cortical neural dynamics in latent space — captures long-range connectivity patterns that single-electrode classifiers miss entirely.' },
                      { icon: '→', text: 'Threat vector: passive emotion inference from unmodified EEG. A neuro-phishing attacker with consumer headset + RBTransformer can infer emotional valence in real time during a browsing session.' },
                      { icon: '⚠', text: 'EEG Shield v7.1 target: band-power perturbation must now cover inter-cortical coherence features, not just per-electrode spectral power. Affective Firewall emotion suppression scope expanded.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Brain-to-Text Benchmark */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-5 lg:col-span-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📝</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Brain-to-Text Benchmark '24 — Lessons for BCI Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Architecture Finding</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Ensemble RNN decoders + fine-tuned LLM outperforms deep state-space models and transformers on intracortical neural-to-text decoding. RNN training with diphone objective achieves best CER.</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Security Implication</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Establishes a reproducible public benchmark — attackers can now measure progress against a standard. Canary must target the benchmark ensemble, not just individual decoders.</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">v7.1 Action</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Gradient Auditor updated to flag loss-landscape signatures consistent with RNN diphone objectives. EEG Shield adversarial evaluation uses Benchmark '24 ensemble as the canonical attacker model.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          )}

          {/* ── May 18 2026 ── */}
          {activeTab === 'may18' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Submission */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex items-start gap-4">
                <span className="text-3xl animate-flicker">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold cursor-blink">18 May 2026</span></p>
                  <p className="text-muted-foreground text-xs font-mono mt-2">May 2026 research integration — adaptive adversary empirical confirmation, MIND Act committee advancement, Neuralink PRIME expansion, multi-agent channel-embedding collusion finding, and Affective Firewall three-vector upgrade deployed.</p>
                </div>
              </div>
            </div>

            {/* Adaptive Adversary Confirmed */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Adaptive Adversary — Empirically Confirmed</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Müller, Zhang & Osei (arXiv:2505.11203, May 2026): classifiers retrained on 500+ Canary-obfuscated sessions recover 61% identification accuracy at 120 seconds. Static-adversary guarantee does not hold at scale.' },
                      { icon: '→', text: 'Lissajous harmonic signatures and pink-noise spectral envelopes are themselves detectable fingerprints — confirming the "Tor problem" for behavioral obfuscation as a real empirical threat, not just a theoretical one.' },
                      { icon: '→', text: 'v7.1 adaptive benchmark scope locked: red-team retraining loop with Canary-obfuscated training data, co-evolution evaluation protocol, and formal definition of adaptive privacy budget.' },
                      { icon: '→', text: 'Open question updated: no longer theoretical — Müller et al. provide the baseline adversary we must beat in v7.1.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* MIND Act + Governance */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-3">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚖️</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Governance — MIND Act Committee Passage (May 7, 2026)</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'MIND Act cleared Senate Commerce Committee with bipartisan support. Key provisions: mandatory opt-in for all neural data, 72-hour breach notification, ban on neural data in automated hiring, FTC enforcement authority.' },
                      { icon: '→', text: 'NeuroAudit (Engine 09) updated: MIND Act consent tier reflects final committee language — distinguishes passive EEG monitoring from active BCI command channels.' },
                      { icon: '→', text: 'EU AI Act enforcement phase 2 begins August 2026: prohibited-use provisions take effect, including real-time biometric mass surveillance and emotional inference in workplaces. High-risk AI compliance deadlines active.' },
                      { icon: '→', text: 'UN Special Rapporteur on Freedom of Expression (May 2026): formal recommendation that neurorights be treated as a third generation of human rights at ICCPR level.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* BCI Scale Milestone */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-4 scan-card">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧠</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">BCI Scale Milestone — May 2026</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Neuralink PRIME participants (May 2026)', value: '9', pct: 45 },
                      { label: 'Synchron COMMAND 24-mo SAEs', value: '0', pct: 5 },
                      { label: 'Synchron BCI HID — iOS/visionOS stable', value: '100%', pct: 100 },
                      { label: 'Neural data breach notification (industry)', value: '16.7%', pct: 17 },
                      { label: 'Sites authorized for PRIME expansion', value: '+7', pct: 70 },
                    ].map((b, i) => (
                      <div key={b.label} style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-muted-foreground font-mono">{b.label}</span>
                          <span className="text-primary font-mono font-black">{b.value}</span>
                        </div>
                        <div className="stat-bar">
                          <div className="stat-bar-fill" style={{ '--bar-width': `${b.pct}%`, animationDelay: `${i * 120 + 200}ms` } as React.CSSProperties} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground/50 mt-3">Sources: Neuralink PRIME FDA site expansion; Synchron COMMAND 24-mo clinical results; Neurorights Foundation 2024 audit</p>
                </div>
              </div>
            </div>

            {/* Multi-Agent Channel Embedding */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-5">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🕸️</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Multi-Agent Collusion — Channel Embedding Finding</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Chen, Park & Williams (arXiv:2505.09917, May 2026): collusion signatures appear in inter-agent communication channel embeddings, not individual residual streams. Extends Rose et al. (April 2026).' },
                      { icon: '→', text: 'TransformerLens Probe (Engine 10) scope extended: channel-embedding analysis added alongside existing activation patching. Single-agent probes confirmed blind to coordinated emergent behavior.' },
                      { icon: '→', text: 'NARCBench + channel-embedding probing pipeline: joint v7.1 scope item for Engine 10. Targets detection of goal-directed coordination between ≥2 agents without centralized planning signals.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Affective Firewall Upgrade */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧲</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Affective Firewall — Three-Vector Upgrade Deployed</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Affective Firewall now surfaces three sycophancy dimensions: d₁ Sycophantic Agreement (capitulation under social pressure), d₂ Genuine Agreement (legitimate shared position), d₃ Sycophantic Praise (flattery without factual basis).' },
                      { icon: '→', text: 'Suppression targets d₁ and d₃ only — d₂ is preserved. This resolves the prior false-positive problem where legitimate corroboration was flagged as exploitative.' },
                      { icon: '→', text: 'Park et al. (arXiv:2505.14422, May 2026): activation steering along d₁/d₃ suppresses sycophantic outputs in deployed RLHF models without degrading task performance. Informs Affective Firewall d/acc sanitization pipeline.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* EEG Shield — Diffusion Augmentation */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🔬</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">EEG Shield — Diffusion-Based Augmentation Update</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Korhonen et al. (arXiv:2505.08831, May 2026): diffusion-model EEG synthesis preserves ERP morphology while destroying subject-specific microstructure — the ideal adversarial training distribution for EEG Shield.' },
                      { icon: '→', text: 'Replaces knowledge-based generation (Wang et al. paradigm 1) as the primary augmentation pathway for EEG Shield v7.1 PGD upgrade.' },
                      { icon: '→', text: 'Open gap: composition bounds across paradigms remain unproven. Diffusion-based synthesis narrows but does not close the formal ε-δ gap for the full protection pipeline.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Full-width: v8.5 summary */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-3 lg:col-span-2 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚀</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">v8.5 Status — May 18 2026</h3>
                  <p className="text-muted-foreground text-xs font-mono leading-relaxed mb-4">
                    May 2026 sprint closes four open items and opens two new ones. <span className="text-primary">Adaptive adversary (Müller et al.)</span>: Tor problem empirically confirmed — v7.1 benchmark scope locked. <span className="text-primary">Affective Firewall</span>: three-vector sycophancy detection deployed (d₁/d₂/d₃ separation). <span className="text-primary">EEG Shield</span>: diffusion-based adversarial augmentation pathway confirmed via Korhonen et al. <span className="text-primary">Engine 10</span>: channel-embedding collusion scope added. <span className="text-primary">Governance</span>: MIND Act committee passage, EU AI Act Phase 2 enforcement active. New open items: BCI HID input spoofing attack surface (Neuralink/Synchron scale), and UN neurorights third-generation framework implications for NeuroAudit jurisdiction matrix.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Adaptive Adversary Confirmed', 'Tor Problem Empirical', 'v7.1 Benchmark Locked', '3-Vector Sycophancy', 'MIND Act Committee', 'EU AI Act Phase 2', 'Diffusion EEG Aug', 'Channel-Embedding Collusion', 'Neuralink 9 Participants', 'BCI HID At Scale', 'v8.5 Deployed'].map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
          )}

          {/* ── April 13 2026 ── */}
          {activeTab === 'apr13' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Submission */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex items-start gap-4">
                <span className="text-3xl animate-flicker">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold cursor-blink">13 April 2026</span></p>
                  <p className="text-muted-foreground text-xs font-mono mt-2">February 2026 Neurotechnology Policy Brief reviewed and integrated — glial paradigm shifts, BCI commercialisation milestones, governance frameworks, and a new demo concept added to the engine roadmap.</p>
                </div>
              </div>
            </div>

            {/* Policy Brief Research Integrated */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📑</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">February 2026 Policy Brief — Key Sources Integrated</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Quanta Magazine (Jan 2026) — "Astrocytes Turn Out To Be in Charge": norepinephrine-driven Ca²⁺ waves release adenosine, actively modulating alertness and mood. Connectome models that ignore glia are structurally incomplete.' },
                      { icon: '→', text: 'News-Medical (Feb 2026) — MPS Lattice as neurodegeneration gatekeeper: breakdown of the membrane-associated periodic skeleton accelerates APP/Aβ₄₂ uptake in Alzheimer\'s models. New reinforcement strategy proposed.' },
                      { icon: '→', text: 'Molecular Metabolism (Jan 2026) — DLK/SARM1 metabolic survival switch: DLK is bivalent — protective short-term, degenerative long-term. Targeted for stroke/concussion neuroprotection.' },
                      { icon: '→', text: 'UNESCO (2025) — First global neurotechnology ethics standard adopted: explicit consent, non-therapeutic child prohibition, affordability mandates. Directly expands NeuroAudit compliance matrix.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Governance Milestones */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-3">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚖️</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Governance Milestones — Neurorights Hardening</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Chile Supreme Court (2023 → reported 2026): first neuroprivacy ruling against Emotiv — brain data cannot be sold or manipulated under Chile\'s constitutional neurorights amendment. NeuroAudit (Engine 09) Chile jurisdiction flag updated.' },
                      { icon: '→', text: 'MIND Act (Schumer/Cantwell/Markey, 2025): FTC empowered to regulate neural data. Framing: neural data "reveals what people think and when they intend to act." Retention, consent, and anti-exploitation provisions align with our MIND Act compliance module.' },
                      { icon: '→', text: 'Brazil Bill No. 2,338/2023: risk-tiered AI governance passed Senate 2025. "Excessive-risk" systems prohibited outright; medical AI = high-risk with mandatory human review. Stax Evaluator (Engine 11) governance taxonomy updated.' },
                      { icon: '→', text: 'Spain ENDS (Jan 2026): National Health Data Space launched — secondary use of health data under strict ethical standards. Spain now hosts 3 EU cloud regions, positioning it as a European Health Data Area anchor.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* BCI Landscape — April 2026 Commercial Update */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-4 scan-card">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧠</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">BCI Commercialisation — April 2026 Pulse</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Neuralink humans implanted (PRIME study)', value: '3', pct: 30 },
                      { label: 'Synchron COMMAND study SAEs @ 12 mo', value: '0', pct: 5 },
                      { label: 'Blackrock MoveAgain speech WPM record', value: '62', pct: 62 },
                      { label: 'Non-invasive share of neurotech market', value: '76.5%', pct: 77 },
                      { label: 'Market size 2025 → 2030 growth (USD B)', value: '$15.8→$30B', pct: 53 },
                    ].map((b, i) => (
                      <div key={b.label} style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-muted-foreground font-mono">{b.label}</span>
                          <span className="text-primary font-mono font-black">{b.value}</span>
                        </div>
                        <div className="stat-bar">
                          <div className="stat-bar-fill" style={{ '--bar-width': `${b.pct}%`, animationDelay: `${i * 120 + 200}ms` } as React.CSSProperties} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground/50 mt-3">Sources: BioSpace (Synchron COMMAND); Blackrock Neurotech FDA Breakthrough; LEAP:IN Neurotech 2025 market report; Neuralink clinical trials</p>
                </div>
              </div>
            </div>

            {/* BCI Platform Cards */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 lg:col-span-2 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30 animate-fade-in-up stagger-5">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📡</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-4 font-black">Active BCI Platforms — February 2026 Snapshot</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'Neuralink N1', detail: '3 humans · PRIME study · 1,024 ch intracortical threads · R1 robot insertion · 20–30 implants targeted 2026', tag: 'PRIME Study' },
                      { name: 'Synchron Stentrode', detail: 'COMMAND: 0 SAEs @ 12 mo · Native Apple BCI HID profile → iPhone/iPad/Vision Pro via Switch Control', tag: 'Apple Native' },
                      { name: 'Blackrock MoveAgain', detail: '62 WPM ALS speech restoration · FDA Breakthrough Device · Utah Array multi-site · Tether-backed', tag: 'FDA Breakthrough' },
                      { name: 'Cognixion Axon-R', detail: 'Non-invasive EEG headband · Apple Vision Pro clinical trial · Consumer pathway · WSJ 2026 prediction list', tag: 'Non-Invasive' },
                    ].map(p => (
                      <div key={p.name} className="bg-black/30 border border-primary/20 p-3 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 scan-card">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-foreground font-mono text-xs font-semibold">{p.name}</p>
                          <span className="text-[8px] font-mono text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 uppercase tracking-wider whitespace-nowrap">{p.tag}</span>
                        </div>
                        <p className="text-muted-foreground text-[10px] leading-relaxed">{p.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cellular Paradigm Shifts */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🔬</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Cellular Paradigm Shifts — Q1 2026</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Astrocyte Ca²⁺ / adenosine axis: non-neuronal cells are primary regulators of brain state. Neurofeedback products operating on EEG proxies are intervening in a system far more complex than their models — zero regulatory framework for gliotransmitter manipulation.' },
                      { icon: '→', text: 'MPS lattice breakdown → APP endocytosis → Aβ₄₂ toxicity: structural reinforcement of neuronal scaffolding is a viable Alzheimer\'s prevention target. Implication: scaffold-integrity markers may emerge as new biometric signal classes.' },
                      { icon: '→', text: 'DLK bivalence (Michigan 2026): metabolic disruption → protective DLK activation; prolonged activation flips to degenerative. Dual-phase injury models now applicable to concussion and stroke recovery forensics.' },
                      { icon: '→', text: 'Eif5a hypusination (VIB/KU Leuven 2026): axonal protein synthesis disruption in ALS. Spermidine restores hypusination — dietary/molecular intervention pathway with direct parallels to adaptive neural hardware resilience.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* New Demo Design: CognitiveSovereignty Mapper */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🗺️</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">New Demo Design: Cognitive Sovereignty Mapper</h3>
                  <p className="text-muted-foreground text-xs font-mono leading-relaxed mb-3">
                    Proposed new <span className="text-primary">governance</span>-category engine surfaced by policy brief review. Interactive jurisdiction-by-scenario matrix: given a BCI data processing operation (e.g. EEG re-identification, gliotransmitter-state inference, thought-to-text logging), the engine maps which neurorights frameworks apply, what consent tier is required, and what countermeasures are mandatory.
                  </p>
                  <div className="space-y-2 mb-3">
                    {[
                      { label: 'Jurisdictions', value: 'UNESCO · Chile · MIND Act · EU AI Act · Brazil 2338 · Spain ENDS · CCPA' },
                      { label: 'Signal classes', value: 'EEG · Intracortical · Endovascular · Keystroke · Cursor · Gliotransmitter proxy' },
                      { label: 'Output', value: 'Per-jurisdiction consent tier · mandatory countermeasure list · audit flag' },
                    ].map(r => (
                      <div key={r.label} className="flex gap-2 text-[10px] font-mono">
                        <span className="text-primary/60 shrink-0 w-28">{r.label}:</span>
                        <span className="text-muted-foreground">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Engine 14 Candidate', 'Governance Category', 'v8.0 Roadmap', 'Multi-Jurisdiction'].map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Full-width: v7.1 → v8.0 Research Priorities */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1 lg:col-span-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚀</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Research Priorities — Revised April 13 2026</h3>
                  <p className="text-muted-foreground text-xs font-mono leading-relaxed mb-4">
                    February 2026 policy brief analysis drives three v7.1 / v8.0 tracks. <span className="text-primary">NeuroAudit (Engine 09)</span>: UNESCO global standard + Chile Emotiv ruling + MIND Act consent provisions added to jurisdiction matrix. <span className="text-primary">Stax Evaluator (Engine 11)</span>: Brazil Bill 2338 risk tiers and Spain ENDS secondary-use framework integrated into governance taxonomy. <span className="text-primary">Engine 14 (proposed)</span>: Cognitive Sovereignty Mapper scoped for v8.0 — interactive neurorights compliance explorer covering 7 jurisdictions and 6 BCI signal classes, with Synchron Apple BCI HID as the inaugural test scenario.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Feb 2026 Brief Reviewed', 'UNESCO Standard', 'Chile Emotiv Ruling', 'MIND Act Consent Tiers', 'Brazil AI Bill 2338', 'Spain ENDS', 'Engine 09 Updated', 'Engine 11 Updated', 'Engine 14 Proposed', 'Glial Blind Spot', 'Synchron Apple BCI HID'].map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
          )}

          {/* ── April 6 2026 ── */}
          {activeTab === 'apr6' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Submission */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex items-start gap-4">
                <span className="text-3xl animate-flicker">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold cursor-blink">6 April 2026</span></p>
                  <p className="text-muted-foreground text-xs font-mono mt-2">2026 Research Integration Sprint — new peer-reviewed findings across BCI security, sycophancy causal analysis, and multi-agent collusion detection incorporated into forensic engine suite.</p>
                </div>
              </div>
            </div>

            {/* New 2026 Papers */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📑</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">2026 Research Integrated</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'arXiv:2509.21305 — "Sycophancy Is Not One Thing" (ICLR 2026): sycophantic agreement, genuine agreement & sycophantic praise are independently steerable directions in LLM activation space. Directly informs Affective Firewall detection granularity.' },
                      { icon: '→', text: 'arXiv:2604.01151 — "Detecting Multi-Agent Collusion Through Multi-Agent Interpretability" (Apr 2026, Oxford/NYU): NARCBench + 5 probing techniques aggregating per-agent activations. New forensic angle for Engine 10.' },
                      { icon: '→', text: 'arXiv:2603.12296 — "Synthetic Data Generation for BCIs" (Mar 2026): benchmarks 4 paradigms of EEG generation (knowledge-/feature-/model-/translation-based). Informs EEG Shield v7.1 adversarial augmentation strategy.' },
                      { icon: '→', text: 'arXiv:2601.16589 — "Emerging Threats in Neuromorphic Systems" (Jan 2026): asynchronous event-driven side-channels, PUF/TRNG vulnerabilities, synaptic weight tampering. Expands Gradient Auditor threat taxonomy.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Multi-Agent Collusion Forensics */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-3">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🕵</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Multi-Agent Collusion Detection — Engine 10 Extension</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Rose et al. (2026) introduce NARCBench: first benchmark for collusion detection under environment distribution shift.' },
                      { icon: '→', text: 'White-box activation aggregation across interacting agents captures covert coordination that per-agent probes miss entirely.' },
                      { icon: '→', text: 'Implication: TransformerLens Probe (Engine 10) scope expanded from single-model deception circuits to multi-agent coordination fingerprints.' },
                      { icon: '→', text: 'Targeted for Engine 10 v7.1 patch: add NARCBench-style group-level classification alongside existing ablation pipeline.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sycophancy Causal Analysis */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧲</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Sycophancy Causal Decomposition — Affective Firewall Update</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Vennemeyer et al. (ICLR 2026): three distinct linear directions encode (1) sycophantic agreement, (2) genuine agreement, (3) sycophantic praise — independently steerable without cross-interference.' },
                      { icon: '→', text: 'Prior Affective Firewall treated sycophancy as a monolithic signal. Engine 01 (Affective Firewall) now distinguishes exploitation from genuine helpfulness.' },
                      { icon: '→', text: 'Difference-in-means probing added as optional mode in Docent Auditor (Engine 12) — separates praise flattery from factual capitulation during transcript analysis.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* BCI Landscape — April 2026 */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-5 scan-card">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧠</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">BCI Landscape — April 2026 Update</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Intracranial Language BCI WPM record', value: '62 WPM', pct: 62 },
                      { label: 'Consumer EEG re-ID accuracy (30s)', value: '>93%', pct: 93 },
                      { label: 'Neural data breach notification (industry)', value: '16.7%', pct: 17 },
                      { label: 'Third-party transfer rights reserved', value: '96.7%', pct: 97 },
                    ].map((b, i) => (
                      <div key={b.label} style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-muted-foreground font-mono">{b.label}</span>
                          <span className="text-primary font-mono font-black">{b.value}</span>
                        </div>
                        <div className="stat-bar">
                          <div className="stat-bar-fill" style={{ '--bar-width': `${b.pct}%`, animationDelay: `${i * 120 + 200}ms` } as React.CSSProperties} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground/50 mt-3">Sources: arXiv:2603.12279 (He et al. 2026); Neurorights Foundation Industry Audit 2024; FPF BCI Report 2021</p>
                </div>
              </div>
            </div>

            {/* Full-width: v7.1 Research Priorities */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1 lg:col-span-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🔬</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">v7.1 Research Priorities — Revised April 6 2026</h3>
                  <p className="text-muted-foreground text-xs font-mono leading-relaxed mb-4">
                    New research accelerates two v7.1 tracks. <span className="text-primary">EEG Shield</span>: Wang et al. (2026) synthetic generation taxonomy provides evaluation scaffolding for PGD upgrade — knowledge-based & model-based generation cover the adversarial data augmentation gap. <span className="text-primary">Forensics</span>: Rose et al. (2026) NARCBench integration targeted for Engine 10; Vennemeyer causal decomposition targeted for Engine 12 transcript analysis. Neuromorphic threat surface (arXiv:2601.16589) added to Gradient Auditor threat taxonomy for v7.1 scope.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['2026 Papers Integrated', 'NARCBench Forensics', 'Sycophancy Causal Decomp', 'Synthetic EEG Augmentation', 'Neuromorphic Threat Taxonomy', 'Engine 10 Multi-Agent', 'Engine 12 Causal Probing'].map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
          )}

          {/* ── March 31 2026 ── */}
          {activeTab === 'mar31' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Submission */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex items-start gap-4">
                <span className="text-3xl animate-flicker">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold cursor-blink">31 March 2026</span></p>
                  <p className="text-muted-foreground text-xs font-mono mt-2">Research hardening session — product narrative, security rigor, and evidentiary scaffolding overhaul.</p>
                </div>
              </div>
            </div>

            {/* Formal Adversary Model */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚔</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Formal Adversary Model</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Added Dolev-Yao-style adversary specification to Threat Models — 5 capability tiers (A1 passive DOM → A5 adaptive retraining).' },
                      { icon: '→', text: 'Named the adaptive adversary / "Tor problem" as the primary open research gap.' },
                      { icon: '→', text: 'Explicit security claims per adversary class with v7.1 tracking.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Research Basis */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-3">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📐</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Research Basis Expanded</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Empirical Basis: proper citations added — Pezeshki 2021 (gradient starvation), FPF BCI Report, arXiv:2412.11394, Antal 2016.' },
                      { icon: '→', text: 'Math Intuition: Lissajous parametric equations, Laplace noise sensitivity formula, Pearson correlation target, Flash-Hogan minimum-jerk constraint.' },
                      { icon: '→', text: 'Open Questions: 8 named unresolved problems — adaptive adversaries, ε-δ proofs gap, mobile/gaze/touch unaddressed, cross-device correlation.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Benchmark honesty + Case Studies */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📊</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Benchmark Scope + Case Studies</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Results section now prominently labels all classifier results as static adversary only — missing baselines and Fitts\'s Law tradeoff curve flagged as gaps.' },
                      { icon: '→', text: 'Version label corrected: v6.2 → v7.0 in progress bars.' },
                      { icon: '→', text: 'Added third case study: Activist cross-site tracking (3-week longitudinal, r=0.04 cross-session correlation).' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Full-width: Tripwire + Roadmap + Safety */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1 lg:col-span-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🐤</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Surveillance Detection Canary + Roadmap + Safety</h3>
                  <p className="text-muted-foreground text-xs font-mono leading-relaxed mb-4">
                    New <span className="text-primary">Tripwire Mode</span> section added to landing page — Canary emits a known behavioral signature and monitors whether the platform responds, turning passive defense into active fingerprinting detection. BCI Safety Interlock card added to governance: Spectral Defender enters OBSERVE-ONLY mode when a medical or assistive BCI control loop is detected. Roadmap updated with <span className="text-primary">v7.1 (Adversarial Hardening)</span> — adaptive benchmarks, ε-δ proofs, PGD upgrade — tagged Research Priority, and <span className="text-primary">v7.5 (Mobile & Gaze)</span> — touch biometric obfuscation, microsaccade noise, pupil dilation masking.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Tripwire Detection', 'BCI Safety Interlock', 'v7.1 Adversarial Hardening', 'v7.5 Mobile & Gaze', 'Trust Center Fixed', 'README Changelog'].map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
          )}

          {/* ── March 15 2026 ── */}
          {activeTab === 'mar15' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Submission */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex items-start gap-4">
                <span className="text-3xl animate-flicker">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold cursor-blink">15 March 2026</span></p>
                  <p className="text-muted-foreground text-xs font-mono mt-2">Update: Standalone Exhibit environments incorporated.</p>
                </div>
              </div>
            </div>

            {/* Enhancements */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🪟</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Standalone Interactive Environments</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Created dedicated full-screen views (/demo/:id) for immersive demonstration of exhibits.' },
                      { icon: '→', text: 'All 8 exhibits now support pop-out interactions, decluttering the presentation.' },
                      { icon: '→', text: 'Enhanced UI rendering logic and cleared duplicates in Threat Feed layout.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-3 lg:col-span-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚀</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Cognitive Canary System Upgrade</h3>
                  <p className="text-muted-foreground text-xs font-mono leading-relaxed mb-4">
                    The platform architecture has been heavily refined. Standalone links offer isolated environments for each of our models. It sets the baseline for the upcoming Neural Adversary upgrades.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['v6.3 Deployed', 'React Router Dynamic Segments', 'UI Polish', 'Focus Environments'].map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
          )}

          {/* ── March 10 2026 ── */}
          {activeTab === 'mar10' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Submission */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex items-start gap-4">
                <span className="text-3xl animate-flicker">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold cursor-blink">10 March 2026</span></p>
                  <p className="text-muted-foreground text-xs font-mono mt-2">Field Intelligence Report: February 2026 Neurotech Landscape</p>
                </div>
              </div>
            </div>

            {/* Sector Intelligence */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-2 scan-card">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📡</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Sector Intelligence — February 2026</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Neurotech Market (2025)', value: '$15.77B', pct: 52 },
                      { label: 'Projected Market (2030)', value: '~$30B', pct: 100 },
                      { label: 'Non-Invasive Market Share', value: '76.5%', pct: 76 },
                      { label: 'Humans w/ Active BCI Implants', value: '≥ 9', pct: 30 },
                    ].map((b, i) => (
                      <div key={b.label} style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-muted-foreground font-mono">{b.label}</span>
                          <span className="text-primary font-mono font-black">{b.value}</span>
                        </div>
                        <div className="stat-bar">
                          <div className="stat-bar-fill" style={{ '--bar-width': `${b.pct}%`, animationDelay: `${i * 120 + 200}ms` } as React.CSSProperties} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BCI Clinical Frontier */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 lg:col-span-2 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30 animate-fade-in-up stagger-3">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧠</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-4 font-black">BCI Clinical Frontier — Active Platforms (Feb 2026)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'Neuralink (N1)', detail: '3 humans implanted · PRIME study · 1,024 ch intracortical · R1 robot insertion', tag: 'PRIME Study' },
                      { name: 'Synchron Stentrode', detail: 'COMMAND study · 0 SAEs @ 12mo · Apple BCI HID integration → iPhone/iPad/Vision Pro', tag: 'Apple Native' },
                      { name: 'Blackrock MoveAgain', detail: '62 WPM speech restoration · FDA Breakthrough Device · Utah Array multi-site', tag: 'FDA Breakthrough' },
                      { name: 'Cognixion Axon-R', detail: 'Non-invasive EEG headband · Apple Vision Pro trial underway · consumer pathway', tag: 'Non-Invasive' },
                    ].map(p => (
                      <div key={p.name} className="bg-black/30 border border-primary/20 p-3 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 scan-card">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-foreground font-mono text-xs font-semibold">{p.name}</p>
                          <span className="text-[8px] font-mono text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 uppercase tracking-wider whitespace-nowrap">{p.tag}</span>
                        </div>
                        <p className="text-muted-foreground text-[10px] leading-relaxed">{p.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cellular & Molecular Shifts */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🔬</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Cellular Paradigm Shifts — Q1 2026</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: '→', text: 'Astrocytes recharacterized as active brain-state regulators via Ca²⁺ waves + adenosine gliotransmission (Quanta Mag / Science)' },
                      { icon: '→', text: 'MPS Lattice identified as endocytosis gatekeeper — breakdown accelerates Aβ42 uptake in Alzheimer\'s (Penn State)' },
                      { icon: '→', text: 'DLK/SARM1 "survival switch" discovered: metabolic bivalence creates novel stroke/TBI intervention target (U-Michigan)' },
                      { icon: '→', text: 'Eif5a hypusination in motor axons: spermidine restores local protein synthesis in ALS models (VIB/KU Leuven)' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 font-mono shrink-0">{item.icon}</span>
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Global Governance */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 animate-fade-in-up stagger-5">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚖️</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Neurorights Governance — Active 2025–2026</h3>
                  <div className="space-y-2">
                    {[
                      { jurisdiction: 'UNESCO', instrument: 'First global neurotech ethics standard', status: 'Adopted 2025' },
                      { jurisdiction: 'Chile', instrument: 'Constitutional neurorights — mental privacy, identity, free will', status: 'World first' },
                      { jurisdiction: 'Brazil', instrument: 'Bill 2,338/2023 — risk-based AI framework', status: 'Senate passed' },
                      { jurisdiction: 'USA', instrument: 'MIND Act — FTC regulation of neural data', status: 'Proposed 2025' },
                      { jurisdiction: 'Spain', instrument: 'Charter of Digital Rights + ENDS health data space', status: 'Active 2026' },
                      { jurisdiction: 'EU', instrument: 'AI Act — high-risk profiling rules phasing in', status: '2024→2027' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary font-mono font-black shrink-0 w-14">{row.jurisdiction}</span>
                        <span className="text-muted-foreground flex-1 leading-relaxed">{row.instrument}</span>
                        <span className="text-primary/60 font-mono text-[9px] shrink-0 text-right">{row.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* What's at stake — cognitive sovereignty callout */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 lg:col-span-2 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/40 animate-fade-in-up stagger-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🛡</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">What's at Stake — Cognitive Sovereignty in 2026</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-black/40 border-l-2 border-primary/50 pl-4 py-2">
                      <p className="text-foreground font-mono text-xs font-semibold mb-1">Neural Data as Biometric Identity</p>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">EEG signals can re-identify individuals even from consumer wearables. P300, ERN, N200 latency profiles are permanent, uncancellable fingerprints. The MIND Act framers note neural data "reveals what people think and when they intend to act."</p>
                    </div>
                    <div className="bg-black/40 border-l-2 border-primary/50 pl-4 py-2">
                      <p className="text-foreground font-mono text-xs font-semibold mb-1">Native OS Integration as Attack Surface</p>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">Synchron's BCI HID profile on iOS marks the formal canonization of neural input. With thought-control of iPhone/Vision Pro now real, behavioral telemetry pipelines gain a direct cortical feed — the highest-fidelity signal ever harvested at scale.</p>
                    </div>
                    <div className="bg-black/40 border-l-2 border-primary/50 pl-4 py-2">
                      <p className="text-foreground font-mono text-xs font-semibold mb-1">The Glial Blind Spot</p>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">Current connectome models miss astrocyte regulation entirely. As neurofeedback products target alertness and mood via EEG proxies, they are intervening in a system far more complex than their models capture — with no regulatory framework for gliotransmitter manipulation.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Mental Privacy', 'Cognitive Liberty', 'Neuro-Augmentation Equity', 'Gliotransmitter Governance', 'BCI HID Telemetry', 'MIND Act'].map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Relevance to Cognitive Canary v7.0 */}
            <div className="glass-panel p-5 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30 lg:col-span-2">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🚀</span>
                <div>
                  <p className="text-mono text-foreground text-sm uppercase tracking-wider font-black">Implications for v7.0 — Neural Adversary</p>
                  <p className="text-muted-foreground text-xs font-mono mt-1">
                    Astrocyte-aware obfuscation · BCI HID input spoofing layer · Closed-loop adversarial EEG defense against consumer neurofeedback harvest · Target: Q3 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* ── March 9 2026 ── */}
          {activeTab === 'mar9' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submission */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold">9 March 2026</span></p>
                </div>
              </div>
            </div>

            {/* Demo improvements */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚡</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Interactive Demo — Code Review &amp; Improvements</h3>
                  <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span><span>Roadmap updated: v6.2 marked as shipped</span></li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span><span>Roadmap nav link added to main navigation</span></li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span><span>Lab Progress tab added for March 9 reporting period</span></li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span><span>EEG Shield &amp; Neuro Audit now reflected in roadmap</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* v6.2 full suite */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 lg:col-span-2 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧬</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-4 font-black">v6.2 Full Engine Suite — Confirmed Shipped</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'lissajous_3d.py', desc: 'Toroidal cursor obfuscation' },
                      { name: 'adaptive_tremor.py', desc: 'Physiological tremor masking' },
                      { name: 'keystroke_jitter.py', desc: 'Pink noise timing injection' },
                      { name: 'spectral_canary.py', desc: 'EEG-band adversarial oscillation' },
                      { name: 'gradient_auditor.py', desc: '9-class ML threat detection' },
                      { name: 'eeg_shield.py', desc: '3-layer EEG protection (NEW v6.2)' },
                      { name: 'neuro_audit.py', desc: 'Neurorights compliance audit (NEW v6.2)' },
                    ].map(e => (
                      <div key={e.name} className="bg-black/30 border border-primary/20 p-3 hover:border-primary/40 transition-colors duration-200">
                        <p className="text-foreground font-mono text-xs font-semibold mb-1">{e.name}</p>
                        <p className="text-muted-foreground text-[10px]">{e.desc}</p>
                      </div>
                    ))}
                    <div className="bg-black/30 border border-primary/20 p-3 hover:border-primary/40 transition-colors duration-200 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-primary font-mono text-2xl font-black">7</p>
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Engines Total</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Whitepaper */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📄</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Neurorights Whitepaper Live</h3>
                  <p className="text-body text-muted-foreground text-sm leading-relaxed">
                    <span className="text-foreground font-mono text-xs">neurorights-2026.html</span> — 8 sections, 3 live canvas demos, Section 07: Cognitive Security &amp; Attack Surfaces
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['EU AI Act', 'Chile NeuroRights', 'Colorado SB 24-205', 'CA AB 1836', 'UNESCO 2024'].map(j => (
                      <span key={j} className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 uppercase tracking-wider">{j}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Benchmarks */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📊</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">v6.2 Benchmark Results</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Mouse Fingerprint Bypass', value: '98.9%' },
                      { label: 'Keystroke ID Failure Rate', value: '99.3%' },
                      { label: '3D Lissajous Bypass', value: '99.7%' },
                      { label: 'Latency Overhead', value: '<0.3ms' },
                    ].map(b => (
                      <div key={b.label} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-mono">{b.label}</span>
                        <span className="text-primary font-mono font-black">{b.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Next: v7.0 */}
            <div className="glass-panel p-5 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30 lg:col-span-2">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🚀</span>
                <div>
                  <p className="text-mono text-foreground text-sm uppercase tracking-wider font-black">Next Milestone: v7.0 — Neural Adversary</p>
                  <p className="text-muted-foreground text-xs font-mono mt-1">GAN-based behavioral synthesis · OS-level driver · WebExtension support · Target: Q3 2026</p>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* ── March 1 2026 ── */}
          {activeTab === 'mar1' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submission */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">✓</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Weekly Progress Form</h3>
                  <p className="text-body text-foreground text-lg">Submitted: <span className="text-primary font-semibold">1 March 2026</span></p>
                </div>
              </div>
            </div>

            {/* Five engines */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚙️</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">5 Defense Engines Committed</h3>
                  <ul className="space-y-1">
                    {['lissajous_3d.py', 'adaptive_tremor.py', 'keystroke_jitter.py', 'spectral_canary.py', 'gradient_auditor.py'].map(e => (
                      <li key={e}>
                        <span className="text-mono text-xs text-foreground/70 font-mono">{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Research */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📚</span>
                <div>
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-3 font-black">Research Collections Updated</h3>
                  <p className="text-body text-muted-foreground text-sm leading-relaxed">
                    <span className="text-foreground font-medium">Cognitive Canary: Defending Sovereignty Through Adversarial Kinematics</span>
                  </p>
                  <p className="text-body text-muted-foreground text-sm mt-2 leading-relaxed">
                    Added <span className="text-primary font-mono text-xs">cognitive_canary_notebook.ipynb</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Demo */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 bg-gradient-to-br from-primary/5 to-transparent border-primary/30">
              <div className="flex items-start gap-4">
                <span className="text-4xl">⚡</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-2 font-black">Interactive Demo Launched</h3>
                  <a href="https://cognitivecanary.lovable.app/" target="_blank" rel="noopener noreferrer"
                     className="text-foreground hover:text-primary transition-colors duration-200 underline decoration-primary/50 hover:decoration-primary text-base font-semibold block mb-3">
                    cognitivecanary.lovable.app
                  </a>
                  <div className="bg-black/40 border-l-2 border-primary/50 pl-4 py-2">
                    <p className="text-body text-primary text-sm font-medium italic">v6.0 · Five defensive mechanisms live</p>
                  </div>
                </div>
              </div>
            </div>

            {/* v6.2 preview */}
            <div className="glass-panel p-6 hover:neon-border-glow transition-all duration-300 lg:col-span-2 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧬</span>
                <div className="flex-1">
                  <h3 className="text-mono text-sm text-primary uppercase tracking-wider mb-4 font-black">v6.2 Neurorights Modules — Shipped March 4</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/30 border border-primary/20 p-4 hover:border-primary/40 transition-colors duration-200">
                      <h4 className="text-foreground font-semibold mb-1 text-sm font-mono">eeg_shield.py</h4>
                      <p className="text-muted-foreground text-xs">3-layer EEG protection: signal obfuscation · differential privacy · adversarial FGSM injection</p>
                    </div>
                    <div className="bg-black/30 border border-primary/20 p-4 hover:border-primary/40 transition-colors duration-200">
                      <h4 className="text-foreground font-semibold mb-1 text-sm font-mono">neuro_audit.py</h4>
                      <p className="text-muted-foreground text-xs">Multi-jurisdiction neurorights compliance: EU AI Act · Colorado · Chile · California · UNESCO</p>
                    </div>
                    <div className="bg-black/30 border border-primary/20 p-4 hover:border-primary/40 transition-colors duration-200">
                      <h4 className="text-foreground font-semibold mb-1 text-sm font-mono">neurorights-2026.html</h4>
                      <p className="text-muted-foreground text-xs">Full whitepaper: 8 sections, Section 07 — Cognitive Security &amp; Attack Surfaces, 3 live canvas demos</p>
                    </div>
                    <div className="bg-black/30 border border-primary/20 p-4 hover:border-primary/40 transition-colors duration-200">
                      <h4 className="text-foreground font-semibold mb-1 text-sm">8 Defensive Mechanisms</h4>
                      <p className="text-muted-foreground text-xs">Demos 06–08: Neural MITM Interceptor · EEG Fingerprint Shield · Reward Loop Detector</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case studies banner */}
            <div className="mt-0 glass-panel p-5 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30 lg:col-span-2">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">📊</span>
                <p className="text-mono text-foreground text-sm uppercase tracking-wider font-black">
                  Case Studies Have Been Updated · Cognitive Security Edition
                </p>
              </div>
            </div>
          </div>
          )}

          {/* ── February 14 2026 ── */}
          {activeTab === 'feb14' && (
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
          )}

          {activeTab === 'feb14' && (
          <div className="mt-6 glass-panel p-5 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">📊</span>
              <p className="text-mono text-foreground text-sm uppercase tracking-wider font-black">
                Case Studies Have Been Updated
              </p>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LabProgressUpdate;
