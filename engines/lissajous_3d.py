"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v6.0  //  ENGINE 01                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   L I S S A J O U S   3 D   E N G I N E                                      ║
║                                                                              ║
║   Generates adversarial cursor paths using toroidal Lissajous curves         ║
║   with coprime frequency ratios (13 : 8 : 5). The Z-axis is discretized     ║
║   into scroll and zoom events, closing the third behavioral channel.         ║
║                                                                              ║
║   Theoretical basis:                                                         ║
║     Pezeshki et al. (NeurIPS 2021) — Gradient Starvation                     ║
║     Lissajous, J-A. (1857) — Mémoire sur l'étude optique des mouvements     ║
║                                                                              ║
║   ARTIFEX LABS  //  d/acc  //  Right to Be Inscrutable                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from __future__ import annotations

import math
import time
import random
import itertools
from dataclasses import dataclass, field
from typing import Iterator, Sequence


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class CursorPoint:
    """A single obfuscated cursor sample in normalised screen-space [0, 1]."""
    x:  float          # horizontal position
    y:  float          # vertical position
    z:  float          # scroll/zoom axis (before discretisation)
    t:  float          # wall-clock timestamp (seconds)
    dx: float = 0.0    # displacement from previous sample
    dy: float = 0.0
    vx: float = 0.0    # pixel-per-second velocity components
    vy: float = 0.0

    @property
    def speed(self) -> float:
        return math.hypot(self.vx, self.vy)

    @property
    def scroll_delta(self) -> int:
        """Discretise z into wheel-event clicks (±1 … ±3)."""
        if abs(self.z) < 0.15:
            return 0
        return int(math.copysign(min(3, 1 + abs(self.z) // 0.3), self.z))


@dataclass
class LissajousConfig:
    """
    Frequency ratios and amplitudes for the three-axis harmonic overlay.

    The coprime triple (ω_a, ω_b, ω_c) = (13, 8, 5) is chosen because:
      •  GCD(13, 8) = 1 — the x–y projection never closes into a simple loop.
      •  GCD(8,  5) = 1 — the y–z projection is similarly aperiodic.
      •  13 : 8 : 5 are consecutive Fibonacci numbers — the resulting curve
         approximates a golden-ratio toroid, maximising path complexity per
         unit amplitude and thus spectral entropy contribution.
    """
    omega_a:   float = 13.0    # x-axis angular frequency multiplier
    omega_b:   float =  8.0    # y-axis angular frequency multiplier
    omega_c:   float =  5.0    # z-axis angular frequency multiplier
    delta_xy:  float = math.pi / 4    # x–y phase offset
    delta_xz:  float = math.pi / 3    # x–z phase offset
    amp_x:     float = 0.28    # normalised screen amplitude  (x)
    amp_y:     float = 0.22    # normalised screen amplitude  (y)
    amp_z:     float = 0.40    # scroll-axis amplitude
    speed:     float = 0.55    # angular velocity of the parameter t (rad/s)
    jitter_sd: float = 0.004   # Gaussian position jitter (normalised px)


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class LissajousEngine:
    """
    Transforms a raw (x, y) cursor stream into an adversarially obfuscated
    stream by superimposing a Lissajous harmonic overlay.

    The overlay is computed as:

        x_obf(t) = x_raw + A_x · sin(ω_a · τ + δ_xy)  +  ε_x
        y_obf(t) = y_raw + A_y · sin(ω_b · τ)          +  ε_y
        z_obf(t) =         A_z · sin(ω_c · τ + δ_xz)

    where τ is the internal phase parameter (time × speed), and ε ~ N(0, σ²)
    is Gaussian jitter that mimics the stochastic component of human CNS output.

    The amplitude is capped at < 1 % of screen diagonal so that Fitts's Law
    task completion is unaffected (see: MacKenzie, 1992).
    """

    def __init__(self, cfg: LissajousConfig | None = None) -> None:
        self.cfg = cfg or LissajousConfig()
        self._tau:  float = 0.0          # internal phase accumulator
        self._prev: CursorPoint | None = None

    # ── public API ────────────────────────────────────────────────────────────

    def transform(self, x: float, y: float, dt: float) -> CursorPoint:
        """
        Consume one raw (x, y) sample and return an obfuscated CursorPoint.

        Parameters
        ----------
        x, y : float
            Raw cursor position in normalised screen coordinates [0, 1].
        dt : float
            Time elapsed since the last call, in seconds.
        """
        cfg = self.cfg
        self._tau += cfg.speed * dt

        # ── Lissajous displacement ────────────────────────────────────────────
        lx = cfg.amp_x * math.sin(cfg.omega_a * self._tau + cfg.delta_xy)
        ly = cfg.amp_y * math.sin(cfg.omega_b * self._tau)
        lz = cfg.amp_z * math.sin(cfg.omega_c * self._tau + cfg.delta_xz)

        # ── Gaussian micro-jitter (σ ≈ 0.4 % screen) ─────────────────────────
        ex = random.gauss(0.0, cfg.jitter_sd)
        ey = random.gauss(0.0, cfg.jitter_sd)

        ox = _clamp01(x + lx + ex)
        oy = _clamp01(y + ly + ey)
        now = time.perf_counter()

        # ── Kinematic derivatives ─────────────────────────────────────────────
        dx, dy, vx, vy = 0.0, 0.0, 0.0, 0.0
        if self._prev is not None and dt > 0:
            dx = ox - self._prev.x
            dy = oy - self._prev.y
            vx = dx / dt
            vy = dy / dt

        pt = CursorPoint(x=ox, y=oy, z=lz, t=now, dx=dx, dy=dy, vx=vx, vy=vy)
        self._prev = pt
        return pt

    def stream(
        self,
        raw_points: Sequence[tuple[float, float]],
        sample_rate: float = 60.0,
    ) -> list[CursorPoint]:
        """
        Batch-transform a sequence of raw cursor positions.

        Parameters
        ----------
        raw_points : sequence of (x, y) tuples in [0, 1]
        sample_rate : assumed capture rate in Hz (used to synthesise dt)
        """
        dt = 1.0 / sample_rate
        return [self.transform(x, y, dt) for x, y in raw_points]

    def infinite_stream(self, sample_rate: float = 60.0) -> Iterator[CursorPoint]:
        """
        Yield autonomous Lissajous cursor positions with no raw input.
        Useful for testing classifiers or generating synthetic datasets.
        """
        dt = 1.0 / sample_rate
        for t in itertools.count():
            τ = t * dt * self.cfg.speed
            x = 0.5 + self.cfg.amp_x * math.sin(self.cfg.omega_a * τ + self.cfg.delta_xy)
            y = 0.5 + self.cfg.amp_y * math.sin(self.cfg.omega_b * τ)
            yield self.transform(x, y, dt)
            time.sleep(dt)

    def spectral_entropy(self, points: list[CursorPoint]) -> float:
        """
        Estimate the Shannon spectral entropy H_s of the obfuscated path,
        computed over the power spectral density of the x-velocity signal.

        H_s = − Σ p_k · log₂(p_k)     where p_k = PSD_k / Σ PSD

        A value ≥ 3.0 nats indicates sufficient obfuscation to defeat
        gradient-descent classifiers under the gradient-starvation regime.
        """
        if len(points) < 8:
            return 0.0

        vx = [p.vx for p in points]
        n   = len(vx)
        # Manual DFT magnitude squared (no numpy dependency)
        psd: list[float] = []
        for k in range(n // 2):
            re = sum(vx[j] * math.cos(2 * math.pi * k * j / n) for j in range(n))
            im = sum(vx[j] * math.sin(2 * math.pi * k * j / n) for j in range(n))
            psd.append(re * re + im * im)

        total = sum(psd) or 1e-12
        entropy = -sum(
            (p / total) * math.log2(p / total + 1e-12) for p in psd if p > 0
        )
        return entropy

    def reset(self) -> None:
        """Reset internal phase — call at the start of each user session."""
        self._tau  = random.uniform(0, 2 * math.pi)   # randomise phase origin
        self._prev = None


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _clamp01(v: float) -> float:
    return max(0.0, min(1.0, v))


def _format_point(pt: CursorPoint) -> str:
    scroll = pt.scroll_delta
    scroll_str = f"  scroll={scroll:+d}" if scroll else ""
    return (
        f"  x={pt.x:.4f}  y={pt.y:.4f}  z={pt.z:+.3f}"
        f"  v={pt.speed:.4f}{scroll_str}"
    )


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    RESET  = "\033[0m"
    GREEN  = "\033[38;2;0;255;65m"
    DIM    = "\033[2m"
    BOLD   = "\033[1m"
    CYAN   = "\033[38;2;0;200;180m"

    banner = f"""
{GREEN}{BOLD}
 ┌──────────────────────────────────────────────────┐
 │  COGNITIVE CANARY v6.0  //  ENGINE 01            │
 │  Lissajous 3D Harmonic Overlay                   │
 │  ω = (13, 8, 5)  ·  d/acc active                 │
 └──────────────────────────────────────────────────┘
{RESET}"""
    print(banner)

    cfg = LissajousConfig(amp_x=0.25, amp_y=0.20, amp_z=0.35, speed=0.6)
    engine = LissajousEngine(cfg)

    # Simulate a straight-line drag across the screen
    n_samples = 60
    raw = [(i / n_samples, 0.5) for i in range(n_samples)]

    print(f"{CYAN}  Transforming {n_samples} raw cursor samples …{RESET}\n")
    points = engine.stream(raw, sample_rate=60.0)

    print(f"{DIM}  {'idx':>4}  {'x':>8}  {'y':>8}  {'z':>8}  {'speed':>10}  scroll{RESET}")
    print(f"{DIM}  {'─'*4}  {'─'*8}  {'─'*8}  {'─'*8}  {'─'*10}  {'─'*6}{RESET}")

    for i, pt in enumerate(points):
        scroll = f"{pt.scroll_delta:+d}" if pt.scroll_delta else "  —"
        color  = GREEN if abs(pt.z) > 0.2 else DIM
        print(
            f"{color}  {i:>4}  {pt.x:>8.4f}  {pt.y:>8.4f}  "
            f"{pt.z:>+8.3f}  {pt.speed:>10.4f}  {scroll}{RESET}"
        )

    H_s = engine.spectral_entropy(points)
    print(f"\n{GREEN}{BOLD}  Spectral Entropy H_s = {H_s:.4f} nats")
    status = "PROTECTED" if H_s >= 3.0 else "MODERATE" if H_s >= 1.5 else "EXPOSED"
    print(f"  Status: [{status}]{RESET}\n")
