"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  COGNITIVE CANARY v6.0  //  Defense Engine Suite  //  ARTIFEX LABS           ║
╚══════════════════════════════════════════════════════════════════════════════╝

Five parallel obfuscation engines that protect the cognitive fingerprint:

    01  lissajous_3d     — toroidal cursor-path adversarial overlay
    02  adaptive_tremor  — phase-locked physiological tremor masking
    03  keystroke_jitter — 1/f pink-noise keystroke timing injection
    04  spectral_canary  — EEG alpha/theta band adversarial oscillation
    05  gradient_auditor — real-time ML fingerprinting threat detection

Quick start
───────────
    from engines import LissajousEngine, AdaptiveTremorEngine
    from engines import KeystrokeJitterEngine, SpectralCanaryEngine
    from engines import GradientAuditor

    # Cursor obfuscation
    lj  = LissajousEngine()
    pt  = lj.transform(x=0.5, y=0.5, dt=1/60)

    # Keystroke protection
    kjr = KeystrokeJitterEngine()
    obf = kjr.process(raw_keystroke)

    # Threat monitoring
    ga  = GradientAuditor()
    threats = ga.ingest(feature_vector)
"""

from .lissajous_3d     import LissajousEngine,         LissajousConfig,     CursorPoint
from .adaptive_tremor  import AdaptiveTremorEngine,    TremorProfile,       calibrate
from .keystroke_jitter import KeystrokeJitterEngine,   RawKeystroke,        ObfKeystroke
from .spectral_canary  import SpectralCanaryEngine,    LatencySample,       SpectralState
from .gradient_auditor import GradientAuditor,         FeatureVector,       ThreatEvent
from .gradient_auditor import ThreatClass,             Severity,            DEFAULT_RULES

__all__ = [
    # Engine classes
    "LissajousEngine",
    "AdaptiveTremorEngine",
    "KeystrokeJitterEngine",
    "SpectralCanaryEngine",
    "GradientAuditor",
    # Config / profile types
    "LissajousConfig",
    "TremorProfile",
    # I/O types
    "CursorPoint",
    "RawKeystroke",
    "ObfKeystroke",
    "LatencySample",
    "SpectralState",
    "FeatureVector",
    "ThreatEvent",
    # Enums
    "ThreatClass",
    "Severity",
    # Utilities
    "calibrate",
    "DEFAULT_RULES",
]

__version__ = "6.0.0"
__author__  = "Artifex Labs"
__license__ = "MIT"
