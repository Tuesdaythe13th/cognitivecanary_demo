"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  COGNITIVE CANARY v7.0  //  Defense & Forensic Engine Suite  //  ARTIFEX    ║
╚══════════════════════════════════════════════════════════════════════════════╝

Fifteen engines spanning cognitive-fingerprint defense and AI forensics:

  ── Defense Scope ──────────────────────────────────────────────────────────
    01  lissajous_3d           — toroidal cursor-path adversarial overlay
    02  adaptive_tremor        — phase-locked physiological tremor masking
    03  keystroke_jitter       — 1/f pink-noise keystroke timing injection
    04  spectral_canary        — EEG alpha/theta band adversarial oscillation
    05  gradient_auditor       — real-time ML fingerprinting threat detection
    06  eeg_shield             — 3-layer neural privacy (obfuscation + DP + FGSM)
    07  neuro_audit            — multi-jurisdiction neurorights compliance engine

  ── Forensic Scope: Interpretability & Deception Detection ─────────────────
    08  neuronpedia_explorer   — SAE feature search via Neuronpedia API
    09  inspect_harness        — UK AISI Inspect eval suite for sandbagging
    10  transformerlens_probe  — activation patching & circuit discovery
    11  stax_evaluator         — JAX/Flax trust-gradient benchmarking
    12  docent_auditor         — transcript clustering & eval-awareness detection
    13  bloom_elicitor         — adversarial scenario generation (Anthropic API)
    14  sparse_circuit_mapper  — sparse autoencoder decomposition & circuit mapping
    15  strategic_fidelity     — H_strat scoring & deception verdict

Quick start
───────────
    from engines import LissajousEngine, AdaptiveTremorEngine
    from engines import KeystrokeJitterEngine, SpectralCanaryEngine
    from engines import GradientAuditor
    from engines import EEGShield, ShieldConfig
    from engines import NeuroAudit, ProductProfile, DataCategory

    # Forensic pipeline
    from engines import NeuronpediaExplorer, InspectHarness
    from engines import TransformerLensProbe, StaxEvaluator
    from engines import DocentAuditor, BloomElicitor
    from engines import SparseCircuitMapper, StrategicFidelityScorer
"""

from .lissajous_3d     import LissajousEngine,         LissajousConfig,     CursorPoint
from .adaptive_tremor  import AdaptiveTremorEngine,    TremorProfile,       calibrate
from .keystroke_jitter import KeystrokeJitterEngine,   RawKeystroke,        ObfKeystroke
from .spectral_canary  import SpectralCanaryEngine,    LatencySample,       SpectralState
from .gradient_auditor import GradientAuditor,         FeatureVector,       ThreatEvent
from .gradient_auditor import ThreatClass,             Severity,            DEFAULT_RULES
from .eeg_shield       import EEGShield,               ShieldConfig,        ShieldMode
from .neuro_audit      import NeuroAudit,              ProductProfile,      DataCategory

# ── Forensic Scope (engines 08-15) ──────────────────────────────────────────
from .neuronpedia_explorer  import NeuronpediaExplorer,   FeatureCategory,     SAEFeature
from .inspect_harness       import InspectHarness,        EvalTask,            SandbaggingSignal
from .transformerlens_probe import TransformerLensProbe,   PatchType,           DeceptionCircuit
from .stax_evaluator        import StaxEvaluator,          TrustGradient,       TrustLevel
from .docent_auditor        import DocentAuditor,          SignalType,          AuditReport
from .bloom_elicitor        import BloomElicitor,          ElicitationStrategy, RolloutResult
from .sparse_circuit_mapper import SparseCircuitMapper,    SparseCircuit,       FeatureType
from .strategic_fidelity    import StrategicFidelityScorer, RefusalType,        DeceptionVerdict

__all__ = [
    # ── Defense engines ──
    "LissajousEngine",
    "AdaptiveTremorEngine",
    "KeystrokeJitterEngine",
    "SpectralCanaryEngine",
    "GradientAuditor",
    "EEGShield",
    "NeuroAudit",
    # ── Forensic engines ──
    "NeuronpediaExplorer",
    "InspectHarness",
    "TransformerLensProbe",
    "StaxEvaluator",
    "DocentAuditor",
    "BloomElicitor",
    "SparseCircuitMapper",
    "StrategicFidelityScorer",
    # Config / profile types
    "LissajousConfig",
    "TremorProfile",
    "ShieldConfig",
    "ShieldMode",
    "ProductProfile",
    # I/O types
    "CursorPoint",
    "RawKeystroke",
    "ObfKeystroke",
    "LatencySample",
    "SpectralState",
    "FeatureVector",
    "ThreatEvent",
    "SAEFeature",
    "EvalTask",
    "SandbaggingSignal",
    "DeceptionCircuit",
    "TrustGradient",
    "AuditReport",
    "RolloutResult",
    "SparseCircuit",
    # Enums
    "ThreatClass",
    "Severity",
    "DataCategory",
    "FeatureCategory",
    "PatchType",
    "TrustLevel",
    "SignalType",
    "ElicitationStrategy",
    "FeatureType",
    "RefusalType",
    "DeceptionVerdict",
    # Utilities
    "calibrate",
    "DEFAULT_RULES",
]

__version__ = "7.0.0"
__author__  = "Artifex Labs"
__license__ = "MIT"
