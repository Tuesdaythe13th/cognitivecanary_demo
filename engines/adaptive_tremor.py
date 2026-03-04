"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v6.0  //  ENGINE 02                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   A D A P T I V E   T R E M O R   E N G I N E                                ║
║                                                                              ║
║   Learns your physiological tremor profile (4–12 Hz) from a short           ║
║   calibration window, then injects a phase-locked synthetic tremor that      ║
║   masks your real motor signature while remaining perceptually invisible.    ║
║                                                                              ║
║   Theoretical basis:                                                         ║
║     Elble & Koller (1990) — Tremor (Johns Hopkins Press)                     ║
║     Pezeshki et al. (2021) — Gradient Starvation, NeurIPS                   ║
║     PLOS ONE (2023) — Visual Feedback and 1/f Movement Structure             ║
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
from typing import NamedTuple


# ─────────────────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────────────────

# Physiological tremor bands (Hz).  Beyond 12 Hz lies the action-tremor range
# associated with Parkinson's; we stay inside normal essential tremor (4–12 Hz)
# so the synthetic signal is indistinguishable from endogenous hand motion.
TREMOR_BAND_LOW  = 4.0    # Hz  — lower bound (intention tremor)
TREMOR_BAND_HIGH = 12.0   # Hz  — upper bound (physiological limit)

# Calibration constants
CALIBRATION_WINDOW_S = 2.0      # seconds of raw data to learn from
MIN_CALIBRATION_PTS  = 40       # minimum samples before the engine adapts

# Safety cap: injection never exceeds this fraction of screen diagonal
MAX_AMPLITUDE_FRAC = 0.008      # 0.8 % of screen diagonal


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

class TremorSample(NamedTuple):
    x: float          # normalised [0, 1]
    y: float
    t: float          # perf_counter timestamp


@dataclass
class TremorProfile:
    """
    Learned characteristics of the user's endogenous physiological tremor.

    Estimated via windowed variance decomposition of the velocity signal.
    The dominant frequency is approximated by zero-crossing analysis rather
    than a full FFT, keeping the calibration loop dependency-free.
    """
    dominant_freq_hz:  float = 8.0    # fundamental tremor frequency
    amplitude_x:      float = 0.003   # normalised screen units
    amplitude_y:      float = 0.003
    phase_offset:     float = 0.0     # radians — phase-lock anchor
    noise_floor:      float = 0.001   # residual stochastic component σ
    calibrated:       bool  = False

    def __str__(self) -> str:
        return (
            f"TremorProfile("
            f"f={self.dominant_freq_hz:.2f} Hz  "
            f"A=({self.amplitude_x:.4f}, {self.amplitude_y:.4f})  "
            f"φ={math.degrees(self.phase_offset):.1f}°  "
            f"calibrated={self.calibrated})"
        )


@dataclass
class InjectedSample:
    """Output of the tremor engine: the raw position plus synthetic displacement."""
    x_raw:  float
    y_raw:  float
    x_obf:  float       # obfuscated position
    y_obf:  float
    dx_inj: float       # injected displacement
    dy_inj: float
    t:      float
    profile: TremorProfile


# ─────────────────────────────────────────────────────────────────────────────
# Calibration
# ─────────────────────────────────────────────────────────────────────────────

def _zero_crossing_frequency(signal: list[float], sample_rate: float) -> float:
    """
    Estimate dominant oscillation frequency via zero-crossing counting.

    For a band-pass tremor signal this gives a reliable estimate without
    requiring scipy or numpy.  The result is clamped to the physiological
    band [4, 12] Hz.
    """
    if len(signal) < 4:
        return 8.0

    mean = statistics.mean(signal)
    centred = [v - mean for v in signal]

    crossings = sum(
        1 for i in range(1, len(centred))
        if centred[i - 1] * centred[i] < 0
    )
    freq = (crossings / 2) * (sample_rate / len(centred))
    return max(TREMOR_BAND_LOW, min(TREMOR_BAND_HIGH, freq))


def _rms(values: list[float]) -> float:
    if not values:
        return 0.0
    return math.sqrt(sum(v * v for v in values) / len(values))


def calibrate(samples: list[TremorSample]) -> TremorProfile:
    """
    Derive a TremorProfile from a list of raw cursor samples.

    The calibration algorithm:
      1.  Compute velocity time-series (Δx/Δt, Δy/Δt).
      2.  Estimate dominant tremor frequency via zero-crossing analysis.
      3.  Measure RMS amplitude of residual micro-motion after subtracting
          a linear trend (the intentional movement component).
      4.  Set phase_offset to align the injected signal with the last
          measured cycle, minimising phase discontinuity at activation.
    """
    if len(samples) < MIN_CALIBRATION_PTS:
        return TremorProfile(calibrated=False)

    xs = [s.x for s in samples]
    ys = [s.y for s in samples]
    ts = [s.t for s in samples]

    # ── velocity series ───────────────────────────────────────────────────────
    vx = [(xs[i] - xs[i-1]) / max(ts[i] - ts[i-1], 1e-6) for i in range(1, len(xs))]
    vy = [(ys[i] - ys[i-1]) / max(ts[i] - ts[i-1], 1e-6) for i in range(1, len(ys))]

    duration  = ts[-1] - ts[0]
    sample_rate = len(samples) / max(duration, 1e-6)

    # ── detrend: subtract mean velocity ──────────────────────────────────────
    mvx = statistics.mean(vx)
    mvy = statistics.mean(vy)
    vx_dt = [v - mvx for v in vx]
    vy_dt = [v - mvy for v in vy]

    freq = _zero_crossing_frequency(vx_dt, sample_rate)

    # ── amplitude estimate (RMS of detrended velocity → position amplitude) ──
    amp_x = _rms(vx_dt) / (2 * math.pi * freq + 1e-6)
    amp_y = _rms(vy_dt) / (2 * math.pi * freq + 1e-6)

    # Clamp to safety window
    amp_x = min(amp_x, MAX_AMPLITUDE_FRAC)
    amp_y = min(amp_y, MAX_AMPLITUDE_FRAC)

    # ── phase: locate the last zero-crossing ──────────────────────────────────
    mean_vx = statistics.mean(vx_dt)
    centred  = [v - mean_vx for v in vx_dt]
    last_zero = 0.0
    for i in range(len(centred) - 1, 0, -1):
        if centred[i - 1] * centred[i] < 0:
            frac = centred[i - 1] / (centred[i - 1] - centred[i] + 1e-12)
            last_zero = (i - 1 + frac) / sample_rate
            break

    elapsed   = duration - last_zero
    phase_now = (elapsed * 2 * math.pi * freq) % (2 * math.pi)

    return TremorProfile(
        dominant_freq_hz = freq,
        amplitude_x      = max(amp_x, 0.001),
        amplitude_y      = max(amp_y, 0.001),
        phase_offset     = phase_now,
        noise_floor      = _rms(vx_dt) * 0.15,
        calibrated       = True,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class AdaptiveTremorEngine:
    """
    Phase-locked tremor injector.

    Injection model
    ───────────────
    The synthetic tremor is a superposition of the learned fundamental
    frequency and two harmonics at 2f and 3f (weighted 1 : 0.35 : 0.12),
    matching the harmonic structure of physiological essential tremor:

        δx(t) = A_x · [ sin(2π f t + φ)
                       + 0.35 · sin(4π f t + φ + π/6)
                       + 0.12 · sin(6π f t + φ + π/3) ]
                + ε_x(t)

    where ε_x ~ N(0, σ²_noise) represents the stochastic component of
    feedforward CNS motor commands (pink-noise floor).

    The injected tremor is phase-locked to the user's measured profile so
    that the combined signal (real + synthetic) remains spectrally
    indistinguishable from a single unmodified hand.  Classifiers trained
    to identify the *absence* of tremor (bot detection) continue to see a
    valid human signal; classifiers trained on individual motor signatures
    see a corrupted feature space.
    """

    def __init__(self, profile: TremorProfile | None = None) -> None:
        self._profile    = profile or TremorProfile()
        self._calib_buf: deque[TremorSample] = deque(maxlen=512)
        self._t0 = time.perf_counter()

    # ── calibration ───────────────────────────────────────────────────────────

    def feed(self, x: float, y: float) -> None:
        """Push a raw cursor sample into the calibration buffer."""
        self._calib_buf.append(TremorSample(x, y, time.perf_counter()))

    def recalibrate(self) -> TremorProfile:
        """Re-derive the TremorProfile from the current calibration buffer."""
        self._profile = calibrate(list(self._calib_buf))
        return self._profile

    @property
    def profile(self) -> TremorProfile:
        return self._profile

    @property
    def is_calibrated(self) -> bool:
        return self._profile.calibrated

    # ── injection ─────────────────────────────────────────────────────────────

    def inject(self, x: float, y: float) -> InjectedSample:
        """
        Transform a single raw cursor position.

        The engine will auto-calibrate on the first MIN_CALIBRATION_PTS
        samples it receives via inject(); no separate calibration step
        is required in online mode.
        """
        # ── auto-calibration path ─────────────────────────────────────────────
        self.feed(x, y)
        if not self._profile.calibrated and len(self._calib_buf) >= MIN_CALIBRATION_PTS:
            self.recalibrate()

        p   = self._profile
        now = time.perf_counter() - self._t0
        f   = p.dominant_freq_hz
        φ   = p.phase_offset
        ω   = 2 * math.pi * f

        # ── fundamental + 2nd + 3rd harmonic ─────────────────────────────────
        dx = p.amplitude_x * (
              math.sin(ω * now + φ)
            + 0.35 * math.sin(2 * ω * now + φ + math.pi / 6)
            + 0.12 * math.sin(3 * ω * now + φ + math.pi / 3)
        )
        dy = p.amplitude_y * (
              math.sin(ω * now + φ + math.pi / 7)    # slight phase offset keeps
            + 0.35 * math.sin(2 * ω * now + φ + math.pi / 5)   # x and y uncorrelated
            + 0.12 * math.sin(3 * ω * now + φ + math.pi / 2)
        )

        # ── stochastic noise floor ────────────────────────────────────────────
        if p.calibrated:
            dx += random.gauss(0.0, p.noise_floor)
            dy += random.gauss(0.0, p.noise_floor)

        ox = _clamp01(x + dx)
        oy = _clamp01(y + dy)

        return InjectedSample(
            x_raw=x, y_raw=y,
            x_obf=ox, y_obf=oy,
            dx_inj=dx, dy_inj=dy,
            t=now,
            profile=p,
        )

    def inject_batch(self, points: list[tuple[float, float]]) -> list[InjectedSample]:
        return [self.inject(x, y) for x, y in points]


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _clamp01(v: float) -> float:
    return max(0.0, min(1.0, v))


def _bar(value: float, width: int = 20, max_val: float = 0.008) -> str:
    filled = int(min(1.0, value / max_val) * width)
    return "█" * filled + "░" * (width - filled)


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    RESET = "\033[0m"
    GREEN = "\033[38;2;0;255;65m"
    CYAN  = "\033[38;2;0;200;180m"
    DIM   = "\033[2m"
    BOLD  = "\033[1m"
    RED   = "\033[38;2;255;80;80m"

    print(f"""
{GREEN}{BOLD}
 ┌──────────────────────────────────────────────────┐
 │  COGNITIVE CANARY v6.0  //  ENGINE 02            │
 │  Adaptive Tremor — Phase-Locked Injection        │
 │  f ∈ [4, 12] Hz  ·  d/acc active                │
 └──────────────────────────────────────────────────┘
{RESET}""")

    # ── Simulate calibration phase: straight horizontal drag with tremor ──────
    print(f"{CYAN}  [ Phase 1 ] Calibration — ingesting 80 synthetic tremor samples …{RESET}")

    engine = AdaptiveTremorEngine()
    f_true = 9.3   # Hz — simulate a user with ~9.3 Hz tremor

    for i in range(80):
        t = i / 60.0
        x = 0.3 + 0.4 * (i / 80)                        # slow horizontal drag
        y = 0.5 + 0.003 * math.sin(2 * math.pi * f_true * t)   # + tremor
        engine.feed(x, y)

    profile = engine.recalibrate()
    print(f"\n{GREEN}  Calibration complete:")
    print(f"  {profile}{RESET}\n")

    # ── Injection phase ───────────────────────────────────────────────────────
    print(f"{CYAN}  [ Phase 2 ] Injection — transforming 20 live cursor samples …{RESET}\n")
    print(f"{DIM}  {'idx':>4}  {'x_raw':>8}  {'y_raw':>8}  {'x_obf':>8}  {'y_obf':>8}  "
          f"{'dx_inj':>9}  amplitude{RESET}")
    print(f"{DIM}  {'─'*4}  {'─'*8}  {'─'*8}  {'─'*8}  {'─'*8}  {'─'*9}  {'─'*20}{RESET}")

    for i in range(20):
        t   = (80 + i) / 60.0
        x_r = 0.5 + 0.2 * math.sin(0.5 * t)
        y_r = 0.5 + 0.1 * math.cos(0.3 * t)
        s   = engine.inject(x_r, y_r)

        amp   = math.hypot(s.dx_inj, s.dy_inj)
        bar   = _bar(amp)
        color = GREEN if amp > 0.001 else DIM

        print(
            f"{color}  {i:>4}  {s.x_raw:>8.4f}  {s.y_raw:>8.4f}  "
            f"{s.x_obf:>8.4f}  {s.y_obf:>8.4f}  "
            f"{s.dx_inj:>+9.5f}  {bar}{RESET}"
        )

    print(f"\n{GREEN}{BOLD}  Motor signature masked.  "
          f"f_detected = {profile.dominant_freq_hz:.2f} Hz  "
          f"(true = {f_true:.1f} Hz){RESET}\n")
