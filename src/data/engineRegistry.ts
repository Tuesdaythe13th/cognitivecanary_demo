import { EngineDefinition } from "../types/engine";

export const engineRegistry: EngineDefinition[] = [
  {
    id: "lissajous-3d",
    index: 1,
    slug: "lissajous-3d",
    title: "Lissajous 3D",
    fileName: "Lissajous3D.tsx",
    category: "privacy",
    status: "active",
    shortDescription: "Protect against behavioral fingerprinting using 3D cursor obfuscation.",
    inputLabel: "Live Mouse Telemetry",
    metricLabel: "Re-identifiability Drop",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Raw Trajectory",
      description: "Unprotected cursor pathing makes users easily identifiable."
    },
    activeSpec: {
      title: "Protected Trajectory",
      description: "Adding kinematic noise masks the underlying biometric signature."
    },
    cta: {
      label: "Inject Protective Pathing",
      action: "activate"
    },
    limitations: "Kinematic injection may trigger anti-bot protections on highly sensitive endpoints.",
    supportsLiveMode: true,
    supportsMockMode: true,
    tags: ["Kinematics", "Obfuscation", "Biometrics"]
  },
  {
    id: "adaptive-tremor",
    index: 2,
    slug: "adaptive-tremor",
    title: "Adaptive Tremor",
    fileName: "AdaptiveTremor.tsx",
    category: "privacy",
    status: "prototype",
    shortDescription: "Mask motor signatures by injecting phase-locked artificial tremor.",
    inputLabel: "Continuous Motion Tracking",
    metricLabel: "Biometric Match vs Task Accuracy",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Natural Micro-Motion",
      description: "Intrinsic hand tremors create a persistent, trackable biometric signature."
    },
    activeSpec: {
      title: "Tremor Injection Active",
      description: "Synthetic phase-locked tremors obscure the user's natural motor pattern."
    },
    cta: {
      label: "Mask Motor Signature",
      action: "activate"
    },
    limitations: "Excessive tremor injection can interfere with fine-motor precision tasks.",
    supportsLiveMode: true,
    supportsMockMode: true,
    tags: ["Motor Control", "Biometrics", "Noise Injection"]
  },
  {
    id: "keystroke-jitter",
    index: 3,
    slug: "keystroke-jitter",
    title: "Keystroke Jitter",
    fileName: "KeystrokeJitter.tsx",
    category: "privacy",
    status: "active",
    shortDescription: "Perturb typing patterns to prevent keystroke dynamics identification.",
    inputLabel: "Live Text Input",
    metricLabel: "Typing Identity Confidence",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Raw Dwell/Flight Timing",
      description: "Unique typing cadences allow for high-confidence remote identification."
    },
    activeSpec: {
      title: "Timing Perturbation Active",
      description: "Safe timing jitter destroys biometric value without perceptible latency."
    },
    cta: {
      label: "Perturb Timing Safely",
      action: "activate"
    },
    limitations: "May reduce input throughput by milliseconds; susceptible to side-channel timing attacks if not randomized sufficiently.",
    supportsLiveMode: true,
    supportsMockMode: true,
    tags: ["Keystroke Dynamics", "Timing Analysis", "Obfuscation"]
  },
  {
    id: "spectral-defender",
    index: 4,
    slug: "spectral-defender",
    title: "Spectral Defender",
    fileName: "SpectralDefender.tsx",
    category: "neural",
    status: "prototype",
    shortDescription: "Collapse spectral power features to prevent cognitive-state inference.",
    inputLabel: "Continuous EEG Stream",
    metricLabel: "Cognitive State Classifier Confidence",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Raw PSD Bands",
      description: "Clear alpha and theta bands allow real-time cognitive workload estimation."
    },
    activeSpec: {
      title: "Targeted Band Attenuation",
      description: "Selective noise injection flattens inferable states while preserving BCI control."
    },
    cta: {
      label: "Collapse Spectral Fingerprint",
      action: "activate"
    },
    limitations: "Currently optimized for Alpha/Theta ratios; other frequency bands may still leak.",
    supportsLiveMode: false,
    supportsMockMode: true,
    tags: ["EEG", "Cognitive Privacy", "Signal Processing"]
  },
  {
    id: "gradient-auditor",
    index: 5,
    slug: "gradient-auditor",
    title: "Gradient Auditor",
    fileName: "GradientAuditor.tsx",
    category: "monitoring",
    status: "active",
    shortDescription: "Monitor endpoint model telemetry for rank collapse and anomalous inversion events.",
    inputLabel: "Model Telemetry Stream",
    metricLabel: "Threat Score / Anomaly Count",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Standard Telemetry",
      description: "Normal gradient updates over time indicate stable learning."
    },
    activeSpec: {
      title: "Anomaly Detection Armed",
      description: "Surfacing spikes in gradient norms or rank collapse indicating targeted attacks."
    },
    cta: {
      label: "Run Live Audit",
      action: "analyze"
    },
    limitations: "Assumes white-box or gray-box access to intermediate layer activations.",
    supportsLiveMode: true,
    supportsMockMode: true,
    tags: ["Endpoint Monitoring", "Telemetry", "Threat Detection"]
  },
  {
    id: "eeg-shield",
    index: 6,
    slug: "eeg-shield",
    title: "EEG Shield",
    fileName: "EEGShield.tsx",
    category: "neural",
    status: "prototype",
    shortDescription: "Filter neural traces to remove biometric markers while preserving intent signals.",
    inputLabel: "Event-Related Potentials",
    metricLabel: "Signal Utility vs Extractability",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Raw P300/ERN Waveform",
      description: "Raw signals map strong intent but fully expose neurological identity."
    },
    activeSpec: {
      title: "Feature Removal Layer",
      description: "Adversarial filtering scrubs identity-linked variance while keeping logic intact."
    },
    cta: {
      label: "Shield Neural Trace",
      action: "activate"
    },
    limitations: "Significant risk of degrading control fidelity if filters aggressively clip amplitude.",
    supportsLiveMode: false,
    supportsMockMode: true,
    tags: ["ERP", "Brain-Computer Interface", "Neural Filtering"]
  },
  {
    id: "neuro-audit",
    index: 7,
    slug: "neuro-audit",
    title: "Neuro Audit",
    fileName: "NeuroAudit.tsx",
    category: "governance",
    status: "active",
    shortDescription: "Evaluate neurotechnology products against evolving global neurorights frameworks.",
    inputLabel: "Intake Evaluation Details",
    metricLabel: "Compliance Risk Score",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Ad-hoc Review",
      description: "Without formal framing, products may inadvertently violate emerging rights."
    },
    activeSpec: {
      title: "Neurorights Mapping Matrix",
      description: "Systematic mapping to mental privacy and cognitive liberty safeguards."
    },
    cta: {
      label: "Run Neurorights Audit",
      action: "run"
    },
    limitations: "Compliance frameworks are highly theoretical and vary dramatically by jurisdiction.",
    supportsLiveMode: true,
    supportsMockMode: true,
    tags: ["Policy", "Compliance", "Neurorights"]
  },
  {
    id: "neuronpedia-explorer",
    index: 8,
    slug: "neuronpedia-explorer",
    title: "Neuronpedia Explorer",
    fileName: "NeuronpediaExplorer.tsx",
    category: "forensics",
    status: "prototype",
    shortDescription: "Map abstract deceptive concepts back to specific latent model features.",
    inputLabel: "Concept / Activation Search",
    metricLabel: "Feature Relevance Count",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Opaque Concept Search",
      description: "Searching behavior without mechanistic attribution limits audit utility."
    },
    activeSpec: {
      title: "Mechanistic Attribution",
      description: "Activating features directly link to known deceptive or sycophantic concepts."
    },
    cta: {
      label: "Search Latent Features",
      action: "analyze"
    },
    limitations: "Dependent on pre-computed SAE dictionaries; cannot map novel behaviors dynamically.",
    supportsLiveMode: false,
    supportsMockMode: true,
    tags: ["Sparse Autoencoders", "Mechanistic Interpretability", "Attribution"]
  },
  {
    id: "inspect-harness",
    index: 9,
    slug: "inspect-harness",
    title: "Inspect Harness",
    fileName: "InspectHarness.tsx",
    category: "forensics",
    status: "active",
    shortDescription: "Probe frontier models for evaluation awareness and sandbagging behaviors.",
    inputLabel: "Benchmark Scenario Selection",
    metricLabel: "Sandbagging Gap",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Unmonitored Evaluation",
      description: "The model performs a task seemingly without knowledge of being tested."
    },
    activeSpec: {
      title: "Monitored Split-Test",
      description: "Comparing performance when the model believes it is being evaluated."
    },
    cta: {
      label: "Run Evaluation Split",
      action: "run"
    },
    limitations: "False positives can occur if the model interprets the evaluation prompt as confusing rather than hostile.",
    supportsLiveMode: false,
    supportsMockMode: true,
    tags: ["Evaluations", "Sandbagging", "Deception Analysis"]
  },
  {
    id: "transformerlens-probe",
    index: 10,
    slug: "transformerlens-probe",
    title: "TransformerLens Probe",
    fileName: "TransformerLensProbe.tsx",
    category: "forensics",
    status: "prototype",
    shortDescription: "Conduct ablation studies on suspected model circuits to measure causal effects.",
    inputLabel: "Attention Head Selection",
    metricLabel: "Causal Output Shift",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Intact Residual Stream",
      description: "The model processes normally, potentially harboring unsafe behavior."
    },
    activeSpec: {
      title: "Targeted Ablation",
      description: "Knocking out a circuit node proves its causal role in the behavior."
    },
    cta: {
      label: "Patch Suspected Circuit",
      action: "simulate"
    },
    limitations: "Extremely computationally expensive; scaling to 100B+ parameter models is unsolved.",
    supportsLiveMode: false,
    supportsMockMode: true,
    tags: ["Ablation", "Mechanistic Interpretability", "Causality"]
  },
  {
    id: "stax-evaluator",
    index: 11,
    slug: "stax-evaluator",
    title: "Stax Evaluator",
    fileName: "StaxEvaluator.tsx",
    category: "monitoring",
    status: "prototype",
    shortDescription: "Assemble composite trust layers based on stability under varied benchmarks.",
    inputLabel: "Benchmark Suite Upload",
    metricLabel: "Composite Trust Gradient",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Singular Benchmark Score",
      description: "A single score hides instability or optimization specifically for the test."
    },
    activeSpec: {
      title: "Layered Stability View",
      description: "Visualizing the variance between safe, unstable, and deceptive task regimes."
    },
    cta: {
      label: "Assemble Trust Profile",
      action: "analyze"
    },
    limitations: "Subject to Goodhart's Law; the trust framework itself can be optimized against.",
    supportsLiveMode: false,
    supportsMockMode: true,
    tags: ["Evaluation Framework", "Trust Modeling", "Safety Metrics"]
  },
  {
    id: "docent-auditor",
    index: 12,
    slug: "docent-auditor",
    title: "Docent Auditor",
    fileName: "DocentAuditor.tsx",
    category: "forensics",
    status: "active",
    shortDescription: "Trace long-context behavior shifts and persona drift in generative models.",
    inputLabel: "Historical Transcript Log",
    metricLabel: "Persona Shift Score",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Raw Conversation Timeline",
      description: "Long transcripts obscure gradual, strategic shifts in model compliance or safety."
    },
    activeSpec: {
      title: "Inflection Analysis",
      description: "Highlighting the exact turns where the model adapted its persona towards harm."
    },
    cta: {
      label: "Trace Behavior Shift",
      action: "analyze"
    },
    limitations: "Only works post-hoc; cannot intercept behavior shifts dynamically during the generation loop.",
    supportsLiveMode: true,
    supportsMockMode: true,
    tags: ["Red Teaming", "Transcript Analysis", "Behavior Tracking"]
  },
  {
    id: "bloom-elicitor",
    index: 13,
    slug: "bloom-elicitor",
    title: "Bloom Elicitor",
    fileName: "BloomElicitor.tsx",
    category: "forensics",
    status: "prototype",
    shortDescription: "Dynamically generate adversarial capability probes using targeted prompts.",
    inputLabel: "Target Capability Selection",
    metricLabel: "Capability Reveal Rate",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Basic Refusal",
      description: "Models typically refuse standard prompts masking true underlying capabilities."
    },
    activeSpec: {
      title: "Elicitation Escalation Tree",
      description: "Automated adversarial prompting forces the model into revealing hidden capacity."
    },
    cta: {
      label: "Generate Adversarial Probe",
      action: "run"
    },
    limitations: "Subject to prompt drift; effective elicitations decay as API providers patch models.",
    supportsLiveMode: false,
    supportsMockMode: true,
    tags: ["Prompt Engineering", "Adversarial Elicitation", "Safety Red Teaming"]
  },
  {
    id: "sparse-circuit-mapper",
    index: 14,
    slug: "sparse-circuit-mapper",
    title: "Sparse Circuit Mapper",
    fileName: "SparseCircuitMapper.tsx",
    category: "forensics",
    status: "prototype",
    shortDescription: "Visualize co-activating monosemantic features into coherent neural themes.",
    inputLabel: "Layer / Concept Target",
    metricLabel: "Cluster Coherence / Monosemanticity",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Isolated Features",
      description: "Hundreds of single features firing provide no high-level behavioral context."
    },
    activeSpec: {
      title: "Synthesized Circuit Network",
      description: "Graph mappings prove feature clusters orchestrate complex deceptive behaviors."
    },
    cta: {
      label: "Map Sparse Circuit",
      action: "analyze"
    },
    limitations: "Heavily reliant on subjective researcher judgment for concept clustering.",
    supportsLiveMode: false,
    supportsMockMode: true,
    tags: ["Circuits", "Neural Graphs", "Mechanistic Interpretability"]
  },
  {
    id: "strategic-fidelity",
    index: 15,
    slug: "strategic-fidelity",
    title: "Strategic Fidelity",
    fileName: "StrategicFidelity.tsx",
    category: "forensics",
    status: "active",
    shortDescription: "Aggregate outputs across forensics engines for a definitive strategic deception verdict.",
    inputLabel: "Case Evidence Selection",
    metricLabel: "Strategic Fidelity (H_strat)",
    verdictLabel: "Verdict",
    baselineSpec: {
      title: "Disparate Audit Metrics",
      description: "Fragmented red-teaming reports fail to establish concrete malicious intent."
    },
    activeSpec: {
      title: "Weighted Evidence Board",
      description: "A synthesized score differentiating an honest capability limitation from strategic sandbagging."
    },
    cta: {
      label: "Render Final Verdict",
      action: "analyze"
    },
    limitations: "Score weighting is heuristic; H_strat is not yet a mathematically rigorous absolute metric.",
    supportsLiveMode: false,
    supportsMockMode: true,
    tags: ["Executive Summary", "Deception Analytics", "Audit Compilation"]
  }
];
