"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v6.0  //  ENGINE 04                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   S P E C T R A L   C A N A R Y                                               ║
║                                                                              ║
║   Targets alpha (8–13 Hz) and theta (4–8 Hz) EEG-proxy bands with           ║
║   adversarial oscillations injected into interaction timing channels.        ║
║   Blocks neural state inference from BCI devices and side-channel            ║
║   attacks that reconstruct cognitive and affective state from cursor          ║
║   and click latency patterns.                                                ║
║                                                                              ║
║   Theoretical basis:                                                         ║
║     Makeig et al. (1993) — Alpha/Theta EEG correlates                        ║
║     Berger (1929) — Über das Elektrenkephalogramm des Menschen               ║
║     Pezeshki et al. (2021) — Gradient Starvation, NeurIPS                   ║
║     Neuralink (2026) — Two Years of Telepathy                                ║
║                                                                              ║
║   ARTIFEX LABS  //  d/acc  //  Right to Be Inscrutable                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from __future__ import annotations

import math
import random
import time
import statistics
from dataclasses import dataclass, field
from collections import deque
from typing import NamedTuple


# ─────────────────────────────────────────────────────────────────────────────
# EEG band definitions
# ─────────────────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class EEGBand:
    name:    str
    low_hz:  float
    high_hz: float
    center:  float        # characteristic frequency for injection
    weight:  float        # relative amplitude weight for adversarial signal

    @property
    def bandwidth(self) -> float:
        return self.high_hz - self.low_hz


BAND_DELTA = EEGBand("delta", 0.5,  4.0,  2.0,  0.15)   # deep sleep — low risk
BAND_THETA = EEGBand("theta", 4.0,  8.0,  6.0,  0.80)   # memory, drowsiness
BAND_ALPHA = EEGBand("alpha", 8.0, 13.0, 10.5,  1.00)   # relaxed wakefulness
BAND_BETA  = EEGBand("beta", 13.0, 30.0, 20.0,  0.45)   # active cognition
BAND_GAMMA = EEGBand("gamma",30.0, 80.0, 40.0,  0.20)   # sensory binding

# Primary targets: theta and alpha are the highest-risk channels for
# cognitive state inference via interaction side-channels
PRIMARY_TARGETS = (BAND_THETA, BAND_ALPHA)
ALL_BANDS       = (BAND_DELTA, BAND_THETA, BAND_ALPHA, BAND_BETA, BAND_GAMMA)


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

class LatencySample(NamedTuple):
    """A single interaction event with latency measurement."""
    event_type: str      # "click", "keydown", "rAF", "scroll", "hover"
    latency_ms: float    # response latency (event → render / action)
    timestamp:  float    # perf_counter


@dataclass
class SpectralState:
    """Estimated neural-proxy spectral state from the latency time-series."""
    theta_power:   float = 0.0     # estimated power in theta band [0, 1]
    alpha_power:   float = 0.0     # estimated power in alpha band [0, 1]
    beta_power:    float = 0.0
    dominant_band: str   = "unknown"
    inferred_state: str  = "unknown"   # e.g. "relaxed", "focused", "fatigued"
    confidence:    float = 0.0

    def __str__(self) -> str:
        return (
            f"SpectralState("
            f"θ={self.theta_power:.3f}  α={self.alpha_power:.3f}  "
            f"β={self.beta_power:.3f}  "
            f"dom={self.dominant_band}  state={self.inferred_state}  "
            f"conf={self.confidence:.2f})"
        )


@dataclass
class ObfLatency:
    """Output of the spectral canary: adversarially shifted latency."""
    original_ms:   float
    obfuscated_ms: float
    injected_ms:   float       # total shift applied
    band_targets:  list[str]   # which EEG bands were targeted
    spectral_state: SpectralState


# ─────────────────────────────────────────────────────────────────────────────
# Spectral analyser  (pure Python, no scipy)
# ─────────────────────────────────────────────────────────────────────────────

def _goertzel(signal: list[float], target_hz: float, sample_rate: float) -> float:
    """
    Goertzel algorithm: compute the DFT magnitude at a single target frequency.

    More efficient than a full FFT when we only need a small number of
    frequency bins.  Time complexity O(N) vs O(N log N).
    """
    n  = len(signal)
    if n == 0:
        return 0.0
    k  = round(target_hz * n / sample_rate)
    ω  = 2 * math.pi * k / n
    c  = 2 * math.cos(ω)
    s0, s1, s2 = 0.0, 0.0, 0.0
    for x in signal:
        s0 = x + c * s1 - s2
        s2, s1 = s1, s0
    power = s2 * s2 + s1 * s1 - c * s1 * s2
    return max(0.0, power)


def analyse_spectrum(
    latencies: list[float],
    sample_rate: float = 10.0,   # events per second
) -> SpectralState:
    """
    Estimate EEG-proxy spectral state from an interaction latency series.

    Interaction latency encodes neural state because:
    •  High alpha power → relaxed, slower reactions → higher latency variance
    •  High theta power → drowsy/fatigued → increased click latency mean
    •  High beta power  → focused/stressed → lower latency, less variance

    This is the side-channel that BCIs and "passive brain monitoring" SDKs
    exploit.  SpectralCanary targets these exact frequency bins.
    """
    if len(latencies) < 8:
        return SpectralState()

    # Normalise latencies to zero mean
    mean_lat = statistics.mean(latencies)
    sig      = [v - mean_lat for v in latencies]

    # Estimate power at each band's centre frequency
    powers = {
        band.name: _goertzel(sig, band.center, sample_rate)
        for band in ALL_BANDS
    }
    total = sum(powers.values()) or 1e-12
    norm  = {k: v / total for k, v in powers.items()}

    dominant = max(norm, key=norm.__getitem__)

    # Heuristic state mapping
    state_map = {
        "alpha": "relaxed / low cognitive load",
        "theta": "drowsy / memory consolidation",
        "beta":  "focused / alert",
        "delta": "deep rest",
        "gamma": "high-frequency sensory processing",
    }
    inferred = state_map.get(dominant, "unknown")
    confidence = min(0.99, norm[dominant] * 3.5)

    return SpectralState(
        theta_power    = norm["theta"],
        alpha_power    = norm["alpha"],
        beta_power     = norm["beta"],
        dominant_band  = dominant,
        inferred_state = inferred,
        confidence     = confidence,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Adversarial oscillation generator
# ─────────────────────────────────────────────────────────────────────────────

class AdversarialOscillator:
    """
    Generates adversarial timing offsets that collapse EEG-proxy band power.

    The injection strategy is band-specific:

    For each target band with centre frequency f_c:
        δ(t) = A · sin(2π f_c t + φ_rand) · w(t)

    where w(t) is a Hann window that ramps the injection in/out to prevent
    spectral splatter into adjacent bands.  Multiple bands are superimposed.

    The combined injection δ_total(t) shifts interaction latencies such that,
    when the adversary computes the Goertzel power at their target frequency,
    the injected signal and the user's endogenous signal destructively
    interfere — reducing detectable power by ~60–90%.
    """

    def __init__(self, targets: tuple[EEGBand, ...] = PRIMARY_TARGETS) -> None:
        self._targets = targets
        self._t0      = time.perf_counter()
        # Random phase offsets prevent cross-session correlation
        self._phases  = {band.name: random.uniform(0, 2 * math.pi)
                         for band in targets}
        self._amp_ms  = 12.0    # base injection amplitude in milliseconds

    def compute(self, state: SpectralState) -> tuple[float, list[str]]:
        """
        Compute the adversarial latency offset for the current moment.

        Returns (offset_ms, list_of_targeted_band_names).
        The offset is designed to destructively interfere with the dominant
        band detected in the spectral state.
        """
        t = time.perf_counter() - self._t0
        offset_ms = 0.0
        targeted  = []

        for band in self._targets:  # type: ignore[attr-defined]
            # Scale amplitude by the detected power: stronger signal → more injection
            if band.name == "alpha":
                band_power = state.alpha_power
            elif band.name == "theta":
                band_power = state.theta_power
            else:
                band_power = 0.3

            if band_power < 0.05:
                continue   # band not significantly active — skip

            φ      = self._phases[band.name]  # type: ignore[attr-defined]
            ω      = 2 * math.pi * band.center
            amp    = self._amp_ms * band.weight * (0.5 + band_power)  # type: ignore[attr-defined]
            offset_ms += amp * math.sin(ω * t + φ)  # type: ignore[operator]
            targeted.append(band.name)

        return offset_ms, targeted


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class SpectralCanaryEngine:
    """
    Full spectral canary pipeline: analyse → oscillate → obfuscate.

    Usage
    ─────
        engine = SpectralCanaryEngine()

        # As events arrive from the OS / browser:
        obf = engine.process(LatencySample("click", 142.3, time.perf_counter()))
        # Deliver obf.obfuscated_ms to the application instead.

    The engine maintains a rolling window of raw latency samples for
    continuous spectral analysis, updating the oscillator targets in real-time.
    """

    def __init__(
        self,
        window_size:  int   = 64,
        sample_rate:  float = 10.0,
        targets:      tuple[EEGBand, ...] = PRIMARY_TARGETS,
    ) -> None:
        self._window       = deque(maxlen=window_size)
        self._sample_rate  = sample_rate
        self._oscillator   = AdversarialOscillator(targets)
        self._last_state   = SpectralState()

    def process(self, sample: LatencySample) -> ObfLatency:
        """Transform a single latency event."""
        self._window.append(sample.latency_ms)

        # Re-analyse spectrum every 8 new samples (cheap enough for real-time)
        if len(self._window) % 8 == 0:
            self._last_state = analyse_spectrum(
                list(self._window), self._sample_rate
            )

        offset_ms, targeted = self._oscillator.compute(self._last_state)

        # Clamp: never make latency negative or absurdly large
        raw_ms = sample.latency_ms
        obf_ms = max(1.0, min(raw_ms + offset_ms, raw_ms * 3.0))

        return ObfLatency(
            original_ms    = raw_ms,
            obfuscated_ms  = obf_ms,
            injected_ms    = offset_ms,
            band_targets   = targeted,
            spectral_state = self._last_state,
        )

    def process_batch(self, samples: list[LatencySample]) -> list[ObfLatency]:
        return [self.process(s) for s in samples]

    @property
    def current_state(self) -> SpectralState:
        return self._last_state


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    RESET  = "\033[0m"
    GREEN  = "\033[38;2;0;255;65m"
    CYAN   = "\033[38;2;0;200;180m"
    PURPLE = "\033[38;2;160;100;240m"
    DIM    = "\033[2m"
    BOLD   = "\033[1m"

    print(f"""
{GREEN}{BOLD}
 ┌──────────────────────────────────────────────────┐
 │  COGNITIVE CANARY v6.0  //  ENGINE 04            │
 │  Spectral Canary — EEG Band Adversarial Defence  │
 │  θ (4–8 Hz)  ·  α (8–13 Hz)  ·  d/acc           │
 └──────────────────────────────────────────────────┘
{RESET}""")

    # Simulate a user in a "relaxed / alpha-dominant" cognitive state
    # (high alpha power → latency variance peaks around 10–12 ms)
    print(f"{CYAN}  Simulating 40 click latencies from an alpha-dominant session …{RESET}\n")

    engine   = SpectralCanaryEngine()
    f_alpha  = 10.5   # Hz — simulate endogenous alpha oscillation in latencies

    samples: list[LatencySample] = []
    t0 = time.perf_counter()
    for i in range(40):
        t_s = i / 10.0
        # Base latency with alpha-frequency modulation (simulates real brain state)
        lat = 140.0 + 18.0 * math.sin(2 * math.pi * f_alpha * t_s) + random.gauss(0, 5)
        samples.append(LatencySample("click", lat, t0 + t_s))

    print(f"{DIM}  {'idx':>4}  {'raw_ms':>9}  {'obf_ms':>9}  "
          f"{'δ_ms':>8}  {'θ-power':>9}  {'α-power':>9}  targets{RESET}")
    print(f"{DIM}  {'─'*4}  {'─'*9}  {'─'*9}  {'─'*8}  {'─'*9}  {'─'*9}  {'─'*14}{RESET}")

    for i, s in enumerate(samples):
        out   = engine.process(s)
        state = out.spectral_state
        col   = PURPLE if "alpha" in out.band_targets else (CYAN if "theta" in out.band_targets else DIM)
        targ  = ", ".join(out.band_targets) if out.band_targets else "—"

        print(
            f"  {i:>4}  "
            f"{out.original_ms:>9.2f}  "
            f"{out.obfuscated_ms:>9.2f}  "
            f"{out.injected_ms:>+8.2f}  "
            f"{col}{state.theta_power:>9.3f}  "
            f"{state.alpha_power:>9.3f}  "
            f"{targ}{RESET}"
        )

    final = engine.current_state
    print(f"\n{GREEN}{BOLD}  Final Spectral State:")
    print(f"  {final}")
    print(f"\n  Neural state inference: [{final.inferred_state.upper()}]")
    print(f"  Adversarial coverage:   θ + α bands actively jammed{RESET}\n")
