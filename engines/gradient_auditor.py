"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v6.0  //  ENGINE 05                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   G R A D I E N T   A U D I T O R                                             ║
║                                                                              ║
║   Monitors incoming feature vectors and gradient update patterns for         ║
║   anomalous signals indicating ML fingerprinting or poisoning attacks.       ║
║   Operates as the threat-intelligence layer for the Canary pipeline —        ║
║   when an attack signature is detected, it escalates to the appropriate      ║
║   defense engine and logs a structured threat event.                         ║
║                                                                              ║
║   Detection surface:                                                         ║
║     • Cursor / mouse fingerprinting probes (velocity histogram analysis)     ║
║     • Keystroke timing profile extraction attempts                           ║
║     • Canvas / WebGL hash enumeration sequences                              ║
║     • Timing side-channels (performance.now clock skew attacks)              ║
║     • Model poisoning via adversarial feature injection                      ║
║     • Gradient-starvation exploitation (shortcut-feature flooding)           ║
║                                                                              ║
║   Theoretical basis:                                                         ║
║     Pezeshki et al. (2021) — Gradient Starvation, NeurIPS                   ║
║     Biggio & Roli (2018) — Wild Patterns: ML Security, Pattern Recognition   ║
║     Carlini & Wagner (2017) — Adversarial Examples, IEEE S&P                 ║
║                                                                              ║
║   ARTIFEX LABS  //  d/acc  //  Right to Be Inscrutable                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from __future__ import annotations

import math
import time
import random
import statistics
from collections import deque
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Callable


# ─────────────────────────────────────────────────────────────────────────────
# Threat taxonomy
# ─────────────────────────────────────────────────────────────────────────────

class ThreatClass(Enum):
    """Classification of detected adversarial behaviour."""
    MOUSE_FINGERPRINT    = auto()   # velocity / jerk profile extraction
    KEYSTROKE_PROFILE    = auto()   # dwell / flight ratio analysis
    CANVAS_HASH          = auto()   # canvas pixel readback enumeration
    WEBGL_RENDER         = auto()   # WebGL renderer string / extension probe
    TIMING_SIDE_CHANNEL  = auto()   # high-resolution timer skew attack
    GRADIENT_STARVATION  = auto()   # shortcut-feature flooding
    MODEL_POISONING      = auto()   # adversarial feature injection
    SPECTRAL_PROBE       = auto()   # EEG-band inference via rAF drift
    FONT_ENUMERATION     = auto()   # CSS metric-based font probing
    UNKNOWN              = auto()


class Severity(Enum):
    LOW      = 1
    MEDIUM   = 2
    HIGH     = 3
    CRITICAL = 4

    def label(self) -> str:
        return str(self.name)


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class FeatureVector:
    """
    A snapshot of behavioural feature values at one point in time.

    All values are normalised to [0, 1] unless otherwise noted.
    Missing / unavailable sensors should be set to -1.0.
    """
    timestamp:          float         # perf_counter

    # Kinematic features
    cursor_velocity:    float = -1.0  # normalised px/s
    cursor_jerk:        float = -1.0  # d³x/dt³  (normalised)
    cursor_sinuosity:   float = -1.0  # path length / Euclidean distance
    spectral_entropy:   float = -1.0  # H_s of velocity PSD  (nats, /3.5)

    # Keystroke features
    dwell_mean:         float = -1.0  # ms, normalised /300
    dwell_std:          float = -1.0
    flight_mean:        float = -1.0  # ms, normalised /800
    flight_std:         float = -1.0

    # Session features
    click_latency_mean: float = -1.0  # ms, normalised /500
    scroll_velocity:    float = -1.0

    # Timing probe indicators (0 = absent, 1 = active)
    hires_timer_active: float =  0.0  # performance.now() high-res mode
    raf_drift_detected: float =  0.0  # requestAnimationFrame drift probe

    def to_list(self) -> list[float]:
        return [
            self.cursor_velocity,
            self.cursor_jerk,
            self.cursor_sinuosity,
            self.spectral_entropy,
            self.dwell_mean,
            self.dwell_std,
            self.flight_mean,
            self.flight_std,
            self.click_latency_mean,
            self.scroll_velocity,
            self.hires_timer_active,
            self.raf_drift_detected,
        ]

    @property
    def n_available(self) -> int:
        return sum(1 for v in self.to_list() if v >= 0)


@dataclass
class ThreatEvent:
    """A single detected threat, structured for logging and escalation."""
    id:             str
    timestamp:      float
    threat_class:   ThreatClass
    severity:       Severity
    confidence:     float          # [0, 1]
    description:    str
    evidence:       dict[str, float] = field(default_factory=dict)
    blocked:        bool = False
    engine_response: str = ""

    def __str__(self) -> str:
        ts = time.strftime("%H:%M:%S", time.localtime(self.timestamp))
        return (
            f"[{ts}] [{self.severity.label():>8}] "
            f"{self.threat_class.name:<22} "
            f"conf={self.confidence:.2f}  "
            f"{'BLOCKED' if self.blocked else 'detected'} — "
            f"{self.description}"
        )


# ─────────────────────────────────────────────────────────────────────────────
# Detection rules
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class DetectionRule:
    """
    A single heuristic detection rule applied to a feature vector window.

    Rules are intentionally simple — the auditor's value comes from running
    many lightweight rules in parallel rather than a single heavyweight model,
    which would itself be vulnerable to adversarial evasion.
    """
    name:          str
    threat_class:  ThreatClass
    severity:      Severity
    description:   str
    check:         Callable[[list[FeatureVector]], float]   # returns confidence [0,1]
    threshold:     float = 0.55


def _mean_available(values: list[float]) -> float:
    avail = [v for v in values if v >= 0]
    return statistics.mean(avail) if avail else -1.0


def _std_available(values: list[float]) -> float:
    avail = [v for v in values if v >= 0]
    return statistics.stdev(avail) if len(avail) >= 2 else 0.0


# ── Rule implementations ──────────────────────────────────────────────────────

def _rule_low_spectral_entropy(window: list[FeatureVector]) -> float:
    """
    Consistently low spectral entropy → bot-like cursor precision.
    Real humans have H_s ≥ 1.8 nats; automated probes cluster near 0.
    """
    vals = [v.spectral_entropy for v in window if v.spectral_entropy >= 0]
    if len(vals) < 4:
        return 0.0
    mean = _mean_available(vals)
    return max(0.0, 1.0 - (mean / 0.6)) if mean < 0.6 else 0.0


def _rule_uniform_keystroke_dwell(window: list[FeatureVector]) -> float:
    """
    Suspiciously uniform dwell times (σ/μ < 0.05) → automated input.
    TypingDNA relies on this ratio; a CV below 0.05 suggests scripted replay.
    """
    means = [v.dwell_mean  for v in window if v.dwell_mean  >= 0]
    stds  = [v.dwell_std   for v in window if v.dwell_std   >= 0]
    if len(means) < 4 or len(stds) < 4:
        return 0.0
    avg_std  = _mean_available(stds)
    avg_mean = _mean_available(means)
    if avg_mean <= 0:
        return 0.0
    cv = avg_std / avg_mean
    return max(0.0, 1.0 - (cv / 0.05)) if cv < 0.05 else 0.0


def _rule_hires_timer_probe(window: list[FeatureVector]) -> float:
    """
    High-resolution timer consistently active → clock-skew fingerprinting.
    Legitimate users rarely trigger performance.now() at sub-millisecond
    resolution; sustained use is a strong indicator of a fingerprinting SDK.
    """
    flags = [v.hires_timer_active for v in window]
    if not flags:
        return 0.0
    return sum(flags) / len(flags)


def _rule_raf_drift_probe(window: list[FeatureVector]) -> float:
    """
    requestAnimationFrame drift detected → EEG spectral side-channel probe.
    Continuous rAF timing enumeration is used to reconstruct alpha/theta
    band power via browser timer jitter correlation.
    """
    flags = [v.raf_drift_detected for v in window]
    if not flags:
        return 0.0
    return min(1.0, sum(flags) / max(1.0, len(flags) * 0.6))


def _rule_gradient_starvation_flood(window: list[FeatureVector]) -> float:
    """
    Feature values clustered near classifier decision boundaries → shortcut flooding.
    Gradient starvation attacks push cheap features (e.g. spectral entropy)
    to values that saturate the classifier's gradient budget.
    """
    if len(window) < 6:
        return 0.0
    entropies = [v.spectral_entropy for v in window if v.spectral_entropy >= 0]
    if len(entropies) < 4:
        return 0.0
    # Highly uniform entropy near known thresholds (0.5 ±0.05, 1.0 ±0.05)
    std = _std_available(entropies)
    mean = _mean_available(entropies)
    near_boundary = any(abs(mean - b) < 0.06 for b in (0.5, 1.0, 1.5))
    return (1.0 - min(1.0, std / 0.04)) if (std < 0.04 and near_boundary) else 0.0


def _rule_canvas_hash_sequence(window: list[FeatureVector]) -> float:
    """
    Abnormally low click latency with high sinuosity → canvas hash enumeration.
    Canvas probes issue many rapid synthetic click/render cycles with
    precise cursor positions that leave a characteristic signature in the
    click-latency histogram.
    """
    lats = [v.click_latency_mean for v in window if v.click_latency_mean >= 0]
    sins = [v.cursor_sinuosity   for v in window if v.cursor_sinuosity   >= 0]
    if len(lats) < 4 or len(sins) < 4:
        return 0.0
    low_lat  = _mean_available(lats) < 0.05     # < 25 ms normalised
    high_sin = _mean_available(sins) > 0.85
    return 0.85 if (low_lat and high_sin) else 0.0


# ── Rule registry ─────────────────────────────────────────────────────────────

DEFAULT_RULES: list[DetectionRule] = [
    DetectionRule(
        name         = "low-spectral-entropy",
        threat_class = ThreatClass.MOUSE_FINGERPRINT,
        severity     = Severity.HIGH,
        description  = "Bot-like cursor precision — low spectral entropy sustained",
        check        = _rule_low_spectral_entropy,
        threshold    = 0.60,
    ),
    DetectionRule(
        name         = "uniform-keystroke-dwell",
        threat_class = ThreatClass.KEYSTROKE_PROFILE,
        severity     = Severity.HIGH,
        description  = "Dwell CV < 5% — automated keystroke replay suspected",
        check        = _rule_uniform_keystroke_dwell,
        threshold    = 0.55,
    ),
    DetectionRule(
        name         = "hires-timer-probe",
        threat_class = ThreatClass.TIMING_SIDE_CHANNEL,
        severity     = Severity.MEDIUM,
        description  = "Sustained high-resolution timer usage — clock-skew fingerprint",
        check        = _rule_hires_timer_probe,
        threshold    = 0.50,
    ),
    DetectionRule(
        name         = "raf-drift-eeg-probe",
        threat_class = ThreatClass.SPECTRAL_PROBE,
        severity     = Severity.CRITICAL,
        description  = "rAF timing drift — neural state inference via alpha/theta proxy",
        check        = _rule_raf_drift_probe,
        threshold    = 0.55,
    ),
    DetectionRule(
        name         = "gradient-starvation-flood",
        threat_class = ThreatClass.GRADIENT_STARVATION,
        severity     = Severity.CRITICAL,
        description  = "Feature values clustered at classifier boundary — shortcut flooding",
        check        = _rule_gradient_starvation_flood,
        threshold    = 0.65,
    ),
    DetectionRule(
        name         = "canvas-hash-sequence",
        threat_class = ThreatClass.CANVAS_HASH,
        severity     = Severity.HIGH,
        description  = "Rapid synthetic interactions — canvas/WebGL hash enumeration",
        check        = _rule_canvas_hash_sequence,
        threshold    = 0.70,
    ),
]


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class GradientAuditor:
    """
    Real-time threat detection layer for the Cognitive Canary pipeline.

    Architecture
    ────────────
    The auditor maintains a sliding window of FeatureVector snapshots.
    On each .audit() call it runs all registered DetectionRules against
    the current window in O(W·R) time (W = window size, R = rule count).
    Rules that fire above their threshold emit ThreatEvent records, which
    are stored in the event log and delivered to any registered callbacks.

    Escalation
    ──────────
    Each ThreatClass maps to a recommended Canary engine response.
    The auditor records the recommended response in the ThreatEvent but
    does not itself activate the engines — that coupling belongs to the
    pipeline orchestrator.
    """

    _ENGINE_RESPONSE: dict[ThreatClass, str] = {
        ThreatClass.MOUSE_FINGERPRINT:   "Escalate → Lissajous 3D  (increase ω amplitude)",
        ThreatClass.KEYSTROKE_PROFILE:   "Escalate → Keystroke Jitter  (raise pink-noise budget)",
        ThreatClass.CANVAS_HASH:         "Escalate → Gradient Auditor  (canvas noise injection)",
        ThreatClass.WEBGL_RENDER:        "Escalate → Gradient Auditor  (WebGL renderer spoof)",
        ThreatClass.TIMING_SIDE_CHANNEL: "Escalate → Keystroke Jitter  (timer coarsening)",
        ThreatClass.GRADIENT_STARVATION: "Escalate → ALL engines  (maximum obfuscation mode)",
        ThreatClass.MODEL_POISONING:     "Escalate → Gradient Auditor  (feature vector scrub)",
        ThreatClass.SPECTRAL_PROBE:      "Escalate → Spectral Canary  (adversarial oscillation)",
        ThreatClass.FONT_ENUMERATION:    "Escalate → Gradient Auditor  (metric noise injection)",
        ThreatClass.UNKNOWN:             "Escalate → ALL engines  (defensive sweep)",
    }

    def __init__(
        self,
        window_size: int = 32,
        rules:       list[DetectionRule] | None = None,
        on_threat:   Callable[[ThreatEvent], None] | None = None,
    ) -> None:
        self._window    : deque[FeatureVector] = deque(maxlen=window_size)
        self._rules     : list[DetectionRule]  = rules or DEFAULT_RULES
        self._events    : list[ThreatEvent]    = []
        self._on_threat : Callable[[ThreatEvent], None] | None = on_threat
        self._event_counter = 0

    # ── public API ────────────────────────────────────────────────────────────

    def ingest(self, fv: FeatureVector) -> list[ThreatEvent]:
        """
        Push a new FeatureVector into the window and run all detection rules.

        Returns the list of ThreatEvents emitted in this cycle (may be empty).
        """
        self._window.append(fv)
        if len(self._window) < 4:
            return []

        window_list = list(self._window)
        new_events  = []

        for rule in self._rules:
            confidence = rule.check(window_list)
            if confidence >= rule.threshold:
                evt = self._make_event(rule, confidence, window_list)
                self._events.append(evt)
                new_events.append(evt)
                if self._on_threat is not None:
                    callback = self._on_threat
                    callback(evt)  # type: ignore[misc]

        return new_events

    def ingest_batch(self, vectors: list[FeatureVector]) -> list[ThreatEvent]:
        """Process a list of FeatureVectors in order."""
        all_events: list[ThreatEvent] = []
        for fv in vectors:
            all_events.extend(self.ingest(fv))
        return all_events

    @property
    def events(self) -> list[ThreatEvent]:
        """All threat events recorded since the auditor was created."""
        return list(self._events)

    @property
    def stats(self) -> dict[str, int]:
        return {
            "total":    len(self._events),
            "critical": sum(1 for e in self._events if e.severity == Severity.CRITICAL),
            "high":     sum(1 for e in self._events if e.severity == Severity.HIGH),
            "medium":   sum(1 for e in self._events if e.severity == Severity.MEDIUM),
            "low":      sum(1 for e in self._events if e.severity == Severity.LOW),
            "blocked":  sum(1 for e in self._events if e.blocked),
        }

    def add_rule(self, rule: DetectionRule) -> None:
        self._rules.append(rule)

    def reset(self) -> None:
        self._window.clear()
        self._events.clear()
        self._event_counter = 0

    # ── internals ────────────────────────────────────────────────────────────

    def _make_event(
        self,
        rule:       DetectionRule,
        confidence: float,
        window:     list[FeatureVector],
    ) -> ThreatEvent:
        self._event_counter += 1
        evt_id = f"CC-{self._event_counter:05d}"

        # Extract supporting evidence from the window
        evidence: dict[str, float | int] = {
            "confidence":      float(round(confidence, 4)),  # type: ignore[call-overload]
            "window_size":     len(window),
            "mean_entropy":    float(round(_mean_available([v.spectral_entropy for v in window]), 4)),  # type: ignore[call-overload]
            "mean_jerk":       float(round(_mean_available([v.cursor_jerk      for v in window]), 4)),  # type: ignore[call-overload]
            "hires_timer_frac":float(round(sum(v.hires_timer_active for v in window) / len(window), 3)),  # type: ignore[call-overload]
        }

        blocked = confidence >= 0.80   # auto-block high-confidence detections

        return ThreatEvent(
            id             = evt_id,
            timestamp      = time.time(),
            threat_class   = rule.threat_class,
            severity       = rule.severity,
            confidence     = confidence,
            description    = rule.description,
            evidence       = evidence,
            blocked        = blocked,
            engine_response= self._ENGINE_RESPONSE.get(rule.threat_class, ""),
        )


# ─────────────────────────────────────────────────────────────────────────────
# Synthetic scenario generator  (for testing / demo)
# ─────────────────────────────────────────────────────────────────────────────

def _make_normal_fv(t: float) -> FeatureVector:
    """Simulate a benign human user."""
    return FeatureVector(
        timestamp          = t,
        cursor_velocity    = random.gauss(0.35, 0.12),
        cursor_jerk        = random.gauss(0.18, 0.07),
        cursor_sinuosity   = random.gauss(0.40, 0.10),
        spectral_entropy   = random.gauss(0.70, 0.15),  # healthy human entropy
        dwell_mean         = random.gauss(0.32, 0.05),
        dwell_std          = random.gauss(0.08, 0.02),
        flight_mean        = random.gauss(0.17, 0.04),
        flight_std         = random.gauss(0.06, 0.01),
        click_latency_mean = random.gauss(0.28, 0.06),
        scroll_velocity    = random.gauss(0.22, 0.08),
        hires_timer_active = 0.0,
        raf_drift_detected = 0.0,
    )


def _make_attack_fv(t: float, attack: str) -> FeatureVector:
    """Simulate a fingerprinting or poisoning attack."""
    base = _make_normal_fv(t)
    if attack == "mouse_fp":
        base.spectral_entropy  = random.gauss(0.12, 0.02)  # low entropy
        base.cursor_jerk       = random.gauss(0.02, 0.005) # suspiciously smooth
    elif attack == "keystroke_profile":
        base.dwell_std         = random.gauss(0.008, 0.001) # near-zero CV
        base.flight_std        = random.gauss(0.006, 0.001)
    elif attack == "timing_probe":
        base.hires_timer_active = 1.0
    elif attack == "raf_eeg_probe":
        base.raf_drift_detected = random.gauss(0.85, 0.05)
    elif attack == "gradient_flood":
        base.spectral_entropy   = 0.501 + random.gauss(0, 0.003)  # pinned at boundary
        base.cursor_velocity    = 0.501 + random.gauss(0, 0.003)
    elif attack == "canvas_hash":
        base.click_latency_mean = random.gauss(0.022, 0.003)
        base.cursor_sinuosity   = random.gauss(0.92, 0.02)
    return base


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    RESET    = "\033[0m"
    GREEN    = "\033[38;2;0;255;65m"
    CYAN     = "\033[38;2;0;200;180m"
    RED      = "\033[38;2;255;80;80m"
    ORANGE   = "\033[38;2;255;140;0m"
    YELLOW   = "\033[38;2;255;220;50m"
    DIM      = "\033[2m"
    BOLD     = "\033[1m"

    SEV_COLOR = {
        Severity.CRITICAL: RED,
        Severity.HIGH:     ORANGE,
        Severity.MEDIUM:   YELLOW,
        Severity.LOW:      CYAN,
    }

    events_log: list[ThreatEvent] = []

    def on_threat(evt: ThreatEvent) -> None:
        c = SEV_COLOR.get(evt.severity, DIM)
        ts = time.strftime("%H:%M:%S", time.localtime(evt.timestamp))
        print(
            f"  {c}{BOLD}[{evt.severity.label():>8}]{RESET}"
            f"  {CYAN}{evt.id}{RESET}"
            f"  {DIM}{ts}{RESET}"
            f"  {evt.threat_class.name:<24}"
            f"  conf={GREEN if evt.blocked else ORANGE}{evt.confidence:.2f}{RESET}"
            f"  {'[BLOCKED]' if evt.blocked else '[detected]'}"
        )
        if evt.engine_response:
            print(f"  {DIM}           ↳ {evt.engine_response}{RESET}")

    auditor = GradientAuditor(window_size=20, on_threat=on_threat)

    print(f"""
{GREEN}{BOLD}
 ┌──────────────────────────────────────────────────┐
 │  COGNITIVE CANARY v6.0  //  ENGINE 05            │
 │  Gradient Auditor — Real-Time Threat Detection   │
 │  6 detection rules  ·  d/acc active              │
 └──────────────────────────────────────────────────┘
{RESET}""")

    scenarios = [
        ("normal",            10,  "Baseline — benign user session"),
        ("mouse_fp",          12,  "Attack  — mouse fingerprint probe"),
        ("normal",             6,  "Gap     — probe pauses"),
        ("keystroke_profile", 14,  "Attack  — keystroke profile extraction"),
        ("timing_probe",       8,  "Attack  — high-res timer side-channel"),
        ("raf_eeg_probe",     10,  "Attack  — rAF drift EEG probe (CRITICAL)"),
        ("gradient_flood",    10,  "Attack  — gradient starvation flood"),
        ("canvas_hash",        8,  "Attack  — canvas/WebGL hash enumeration"),
        ("normal",            10,  "Recovery — canary countermeasures active"),
    ]

    t: float = time.perf_counter()
    for attack, n, label in scenarios:
        print(f"\n{CYAN}  ── {label} ({n} vectors) ──{RESET}")
        for _ in range(n):
            fv = _make_attack_fv(t, attack) if attack != "normal" else _make_normal_fv(t)
            auditor.ingest(fv)
            t = t + 0.1  # type: ignore[operator]

    s = auditor.stats
    print(f"""
{GREEN}{BOLD}
 ┌─────────────────────────────────────────────────────┐
 │  Audit Summary                                      │
 ├─────────────────────────────────────────────────────┤
 │  Total events    {s['total']:>5}                            │
 │  Critical        {s['critical']:>5}                            │
 │  High            {s['high']:>5}                            │
 │  Medium          {s['medium']:>5}                            │
 │  Blocked (≥0.80) {s['blocked']:>5}                            │
 └─────────────────────────────────────────────────────┘
{RESET}""")
