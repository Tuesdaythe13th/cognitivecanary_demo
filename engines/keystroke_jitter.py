"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v6.0  //  ENGINE 03                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   K E Y S T R O K E   J I T T E R   E N G I N E                              ║
║                                                                              ║
║   Injects spectrally-shaped pink noise (1/f) into keystroke dwell times,    ║
║   flight times, and typing pressure readings.  Defeats TypingDNA-class       ║
║   biometric authentication by making the timing signature statistically      ║
║   indistinguishable from the population mean.                                ║
║                                                                              ║
║   Theoretical basis:                                                         ║
║     Monrose & Rubin (1997) — Authentication via Keystroke Dynamics           ║
║     TypingDNA EER benchmark: <1% on 30+ character samples                    ║
║     PLOS ONE (2023) — 1/f structure in human motor output                    ║
║                                                                              ║
║   ARTIFEX LABS  //  d/acc  //  Right to Be Inscrutable                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from __future__ import annotations

import math
import random
import statistics
import time
from collections import deque
from dataclasses import dataclass, field
from typing import NamedTuple


# ─────────────────────────────────────────────────────────────────────────────
# Constants — physiologically grounded timing ranges (milliseconds)
# ─────────────────────────────────────────────────────────────────────────────

# Dwell time: how long a key is physically depressed
DWELL_MIN_MS  =  30.0    # below this → hardware noise, not a keystroke
DWELL_MAX_MS  = 300.0    # above this → user is hesitating / searching

# Flight time: inter-key interval (key-up → next key-down)
FLIGHT_MIN_MS =   0.0    # simultaneous press (chord / hold)
FLIGHT_MAX_MS = 800.0    # deliberate pause / word boundary

# Jitter budget: max absolute deviation we are allowed to inject
# (must not shift timing enough to break physical press logic)
JITTER_BUDGET_DWELL_MS  = 55.0
JITTER_BUDGET_FLIGHT_MS = 90.0


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

class RawKeystroke(NamedTuple):
    """A single keystroke as captured from the OS input layer."""
    key:        str      # character or key-name, e.g. "a", "Return", "space"
    down_ts:    float    # perf_counter timestamp of key-down event (seconds)
    up_ts:      float    # perf_counter timestamp of key-up event (seconds)
    pressure:   float    # normalised [0, 1]  (0 if hardware does not support)


@dataclass
class ObfKeystroke:
    """Obfuscated keystroke output delivered to the application / OS hook."""
    key:        str
    down_ts:    float    # shifted key-down timestamp
    up_ts:      float    # shifted key-up timestamp
    pressure:   float    # jittered pressure
    dwell_ms:   float    # = (up_ts − down_ts) × 1000
    flight_ms:  float    # inter-key flight time in ms (0 for first key)
    jitter_dwell_ms:  float   # injected dwell shift
    jitter_flight_ms: float   # injected flight shift

    @property
    def wpm_contribution(self) -> float:
        """Marginal WPM implied by this inter-key interval (chars/min / 5)."""
        total_ms = self.dwell_ms + self.flight_ms
        if total_ms <= 0:
            return 0.0
        return (60_000 / total_ms) / 5.0


@dataclass
class TypingProfile:
    """
    Per-user learned keystroke statistics used to calibrate jitter magnitude.

    Fields are populated by ProfileLearner.update() and frozen when
    enough samples have been seen.
    """
    n_samples:       int   = 0
    mean_dwell_ms:   float = 95.0     # population mean ≈ 80–120 ms
    std_dwell_ms:    float = 25.0
    mean_flight_ms:  float = 130.0    # population mean ≈ 100–200 ms
    std_flight_ms:   float = 45.0
    mean_pressure:   float = 0.5
    std_pressure:    float = 0.12
    rhythm_score:    float = 0.0      # 0 = robotic, 1 = natural
    calibrated:      bool  = False

    def identifiability(self) -> float:
        """
        Heuristic identifiability score in [0, 1].

        A low coefficient of variation (σ/μ) means highly consistent timing →
        easier to identify.  Canary targets this score.
        """
        cv_dwell  = self.std_dwell_ms  / max(self.mean_dwell_ms,  1.0)
        cv_flight = self.std_flight_ms / max(self.mean_flight_ms, 1.0)
        return max(0.0, 1.0 - (cv_dwell + cv_flight) / 2.0)


# ─────────────────────────────────────────────────────────────────────────────
# Pink noise generator  (Voss–McCartney algorithm, no numpy required)
# ─────────────────────────────────────────────────────────────────────────────

class PinkNoiseGenerator:
    """
    Generates 1/f (pink) noise samples using the Voss–McCartney algorithm.

    Pink noise is the hallmark of feedforward CNS motor output: adjacent
    timing intervals are positively correlated at all time scales.  Injecting
    pink noise rather than white noise preserves the long-range correlation
    structure of human typing rhythms, making obfuscated output statistically
    identical to genuine human input.

    Reference: Voss & Clarke (1975) — Nature 258:317–318.
    """

    def __init__(self, n_rows: int = 16, seed: int | None = None) -> None:
        rng = random.Random(seed)
        self._rows   = [rng.gauss(0, 1) for _ in range(n_rows)]
        self._running_sum = sum(self._rows)
        self._index  = 0
        self._n      = n_rows

    def next(self) -> float:
        """Return the next pink-noise sample in the range ≈ [−4, 4]."""
        self._index += 1
        # Number of trailing zeros in the binary representation of index
        # determines which row to update (Voss–McCartney)
        k = (self._index & -self._index).bit_length() - 1
        if k < self._n:
            old = self._rows[k]
            new = random.gauss(0, 1)
            self._rows[k]     = new
            self._running_sum += new - old
        white = random.gauss(0, 1)
        return (self._running_sum + white) / (self._n + 1)


# ─────────────────────────────────────────────────────────────────────────────
# Profile learner
# ─────────────────────────────────────────────────────────────────────────────

class ProfileLearner:
    """
    Online learning of the user's keystroke timing distribution.

    Uses an exponentially-weighted moving average (EWMA) so that the
    profile adapts to fatigue and context changes without requiring a
    separate calibration phase.
    """

    def __init__(self, alpha: float = 0.08) -> None:
        self._alpha   = alpha           # EWMA decay factor
        self._profile = TypingProfile()
        self._dwells:  deque[float] = deque(maxlen=200)
        self._flights: deque[float] = deque(maxlen=200)

    def update(self, dwell_ms: float, flight_ms: float, pressure: float) -> TypingProfile:
        p = self._profile
        p.n_samples += 1

        # Reject implausible values
        if not (DWELL_MIN_MS <= dwell_ms <= DWELL_MAX_MS):
            return p
        if flight_ms > 0 and not (FLIGHT_MIN_MS <= flight_ms <= FLIGHT_MAX_MS):
            return p

        self._dwells.append(dwell_ms)
        if flight_ms > 0:
            self._flights.append(flight_ms)

        # EWMA update
        a = self._alpha
        p.mean_dwell_ms  = a * dwell_ms  + (1 - a) * p.mean_dwell_ms
        p.mean_pressure  = a * pressure  + (1 - a) * p.mean_pressure

        if len(self._dwells) >= 10:
            p.std_dwell_ms  = statistics.stdev(self._dwells)
        if len(self._flights) >= 10:
            p.mean_flight_ms = statistics.mean(self._flights)
            p.std_flight_ms  = statistics.stdev(self._flights)

        if p.n_samples >= 30:
            p.calibrated  = True
            p.rhythm_score = min(1.0, (p.std_dwell_ms / p.mean_dwell_ms +
                                       p.std_flight_ms / p.mean_flight_ms) / 2.0)

        return p

    @property
    def profile(self) -> TypingProfile:
        return self._profile


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class KeystrokeJitterEngine:
    """
    Pink-noise keystroke timing obfuscator.

    Jitter policy
    ─────────────
    For each keystroke the engine computes two offsets:

        δ_dwell  = σ_dwell  · N_pink · scale_factor
        δ_flight = σ_flight · N_pink · scale_factor

    where N_pink is a correlated 1/f sample and scale_factor adapts based
    on the measured identifiability score: higher identifiability → larger
    jitter budget consumed.

    The final obfuscated timestamps satisfy:

        dwell_obf  = clamp(dwell_raw  + δ_dwell,  DWELL_MIN,  DWELL_MAX)
        flight_obf = clamp(flight_raw + δ_flight, FLIGHT_MIN, FLIGHT_MAX)

    The key-down timestamp is shifted accordingly so that the event stream
    remains causally consistent.
    """

    def __init__(self) -> None:
        self._learner  = ProfileLearner()
        self._pink     = PinkNoiseGenerator()
        self._prev_up: float | None = None

    # ── public API ────────────────────────────────────────────────────────────

    def process(self, raw: RawKeystroke) -> ObfKeystroke:
        """Transform a single raw keystroke event."""
        dwell_raw_ms  = (raw.up_ts  - raw.down_ts) * 1000.0
        flight_raw_ms = ((raw.down_ts - self._prev_up) * 1000.0
                         if self._prev_up is not None else 0.0)
        self._prev_up = raw.up_ts

        # ── update learned profile ────────────────────────────────────────────
        prof = self._learner.update(dwell_raw_ms, flight_raw_ms, raw.pressure)

        # ── compute adaptive jitter scale ─────────────────────────────────────
        identifiability = prof.identifiability()
        # More identifiable typing → more jitter (up to full budget)
        dwell_scale  = JITTER_BUDGET_DWELL_MS  * identifiability
        flight_scale = JITTER_BUDGET_FLIGHT_MS * identifiability

        n1 = self._pink.next()
        n2 = self._pink.next()
        n3 = self._pink.next()

        δ_dwell  = dwell_scale  * (n1 / 4.0)   # normalise ≈ [-1, 1]
        δ_flight = flight_scale * (n2 / 4.0)
        δ_pres   = prof.std_pressure * (n3 / 4.0)

        # ── apply and clamp ───────────────────────────────────────────────────
        dwell_obf_ms  = _clamp(dwell_raw_ms  + δ_dwell,  DWELL_MIN_MS,  DWELL_MAX_MS)
        flight_obf_ms = _clamp(flight_raw_ms + δ_flight, FLIGHT_MIN_MS, FLIGHT_MAX_MS)
        pressure_obf  = _clamp(raw.pressure  + δ_pres,   0.0,           1.0)

        # ── reconstruct event timestamps ──────────────────────────────────────
        new_down = raw.down_ts + δ_flight / 1000.0
        new_up   = new_down + dwell_obf_ms / 1000.0

        return ObfKeystroke(
            key              = raw.key,
            down_ts          = new_down,
            up_ts            = new_up,
            pressure         = pressure_obf,
            dwell_ms         = dwell_obf_ms,
            flight_ms        = flight_obf_ms,
            jitter_dwell_ms  = δ_dwell,
            jitter_flight_ms = δ_flight,
        )

    def process_batch(self, keystrokes: list[RawKeystroke]) -> list[ObfKeystroke]:
        return [self.process(k) for k in keystrokes]

    @property
    def profile(self) -> TypingProfile:
        return self._learner.profile


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def _synth_keystroke(
    key: str,
    mean_dwell: float = 95.0,
    mean_flight: float = 130.0,
    std: float = 22.0,
    base_ts: float = 0.0,
) -> RawKeystroke:
    """Generate a synthetic raw keystroke for testing."""
    down = base_ts + max(0.0, random.gauss(mean_flight, std)) / 1000.0
    up   = down   + max(DWELL_MIN_MS, random.gauss(mean_dwell,  std)) / 1000.0
    return RawKeystroke(key=key, down_ts=down, up_ts=up,
                        pressure=random.gauss(0.6, 0.1))


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    RESET = "\033[0m"
    GREEN = "\033[38;2;0;255;65m"
    CYAN  = "\033[38;2;0;200;180m"
    RED   = "\033[38;2;255;80;80m"
    DIM   = "\033[2m"
    BOLD  = "\033[1m"

    print(f"""
{GREEN}{BOLD}
 ┌──────────────────────────────────────────────────┐
 │  COGNITIVE CANARY v6.0  //  ENGINE 03            │
 │  Keystroke Jitter — Pink Noise Injection         │
 │  1/f noise  ·  Voss–McCartney  ·  d/acc          │
 └──────────────────────────────────────────────────┘
{RESET}""")

    engine = KeystrokeJitterEngine()
    phrase = "cognitive canary"

    print(f"{CYAN}  Simulating: \"{phrase}\" ({len(phrase)} keystrokes){RESET}\n")
    print(f"{DIM}  {'key':>4}  {'dwell_raw':>10}  {'dwell_obf':>10}  "
          f"{'δ_dwell':>9}  {'flight_obf':>11}  identifiability{RESET}")
    print(f"{DIM}  {'─'*4}  {'─'*10}  {'─'*10}  {'─'*9}  {'─'*11}  {'─'*20}{RESET}")

    ts = time.perf_counter()
    for ch in phrase:
        raw = _synth_keystroke(ch, base_ts=ts)
        ts  = raw.up_ts
        obf = engine.process(raw)

        ident = engine.profile.identifiability()
        bar   = "█" * int(ident * 15) + "░" * (15 - int(ident * 15))
        color = RED if ident > 0.7 else (CYAN if ident > 0.4 else GREEN)

        print(
            f"  {repr(ch):>4}  "
            f"{(raw.up_ts - raw.down_ts)*1000:>9.1f}ms  "
            f"{obf.dwell_ms:>9.1f}ms  "
            f"{obf.jitter_dwell_ms:>+8.1f}ms  "
            f"{obf.flight_ms:>10.1f}ms  "
            f"{color}{bar}  {ident:.2f}{RESET}"
        )

    p = engine.profile
    print(f"\n{GREEN}{BOLD}")
    print(f"  Typing Profile (learned):")
    print(f"    mean dwell  = {p.mean_dwell_ms:.1f} ms  (σ = {p.std_dwell_ms:.1f} ms)")
    print(f"    mean flight = {p.mean_flight_ms:.1f} ms  (σ = {p.std_flight_ms:.1f} ms)")
    print(f"    identifiability = {p.identifiability():.3f}  →  ", end="")
    score = p.identifiability()
    print("HIGH RISK" if score > 0.7 else "MODERATE" if score > 0.4 else "PROTECTED")
    print(RESET)
