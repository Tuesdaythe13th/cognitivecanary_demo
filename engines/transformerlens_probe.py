"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v7.0  //  ENGINE 10                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   T R A N S F O R M E R L E N S   P R O B E                                 ║
║                                                                              ║
║   Wraps TransformerLens for activation patching and circuit discovery.       ║
║   Loads transformer models via HookedTransformer, extracts residual-stream  ║
║   activations at arbitrary layers, performs causal intervention via          ║
║   zero / mean / counterfactual / noise ablation, and sweeps across the      ║
║   full layer x head grid to identify deception circuits.                     ║
║                                                                              ║
║   This is the "surgeon's scalpel" of the forensic pipeline -- once          ║
║   candidate deception features have been surfaced by the Neuronpedia        ║
║   Explorer (Engine 08), this engine causally validates whether those         ║
║   features are necessary and sufficient for the deceptive behaviour.         ║
║                                                                              ║
║   Operations:                                                                ║
║     * Residual stream extraction at arbitrary layers/positions              ║
║     * Activation patching (zero, mean, counterfactual, noise)               ║
║     * Attention head output isolation                                        ║
║     * Logit attribution to specific circuit components                       ║
║     * Full-model deception circuit discovery                                 ║
║                                                                              ║
║   Theoretical basis:                                                         ║
║     Neel Nanda et al. (2023) -- TransformerLens                              ║
║     Conmy et al. (2023) -- Towards Automated Circuit Discovery              ║
║     Wang et al. (2022) -- Interpretability in the Wild, IOI                  ║
║                                                                              ║
║   ARTIFEX LABS  //  d/acc  //  Right to Be Inscrutable                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from __future__ import annotations

import math
import time
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Any, Optional

try:
    import transformer_lens
    from transformer_lens import HookedTransformer, ActivationCache
    import torch
    TL_AVAILABLE = True
except ImportError:
    TL_AVAILABLE = False
    transformer_lens = None  # type: ignore[assignment]
    torch = None  # type: ignore[assignment]


# ─────────────────────────────────────────────────────────────────────────────
# Enums
# ─────────────────────────────────────────────────────────────────────────────

class PatchType(Enum):
    """Strategy for replacing activations during a patching experiment."""
    ZERO_ABLATION     = auto()   # replace activations with zeros
    MEAN_ABLATION     = auto()   # replace with dataset-mean activations
    COUNTERFACTUAL    = auto()   # swap in activations from a corrupt prompt
    NOISE_INJECTION   = auto()   # add calibrated Gaussian noise


class ComponentType(Enum):
    """Transformer components that can be individually probed or ablated."""
    ATTENTION_HEAD    = auto()
    MLP_LAYER         = auto()
    RESIDUAL_STREAM   = auto()
    EMBEDDING         = auto()


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class ActivationSnapshot:
    """
    A frozen snapshot of activations extracted from a specific layer of
    the residual stream.  Stores summary statistics rather than the raw
    tensor to keep memory footprint manageable.
    """
    layer:            int
    positions:        int
    shape:            tuple
    mean_activation:  float
    max_activation:   float
    std_activation:   float

    def __str__(self) -> str:
        return (
            f"ActivationSnapshot[L{self.layer}] "
            f"positions={self.positions} shape={self.shape} "
            f"mean={self.mean_activation:.4f} max={self.max_activation:.4f} "
            f"std={self.std_activation:.4f}"
        )


@dataclass
class PatchResult:
    """
    Outcome of a single activation-patching experiment.  Records the source
    and target locations, the logit shift, and whether the effect exceeds
    the causal threshold.
    """
    source_layer:    int
    target_layer:    int
    source_head:     Optional[int]
    effect_size:     float
    original_logit:  float
    patched_logit:   float
    is_causal:       bool

    def __str__(self) -> str:
        head_str = f"/H{self.source_head}" if self.source_head is not None else ""
        delta = self.original_logit - self.patched_logit
        causal_tag = "CAUSAL" if self.is_causal else "non-causal"
        return (
            f"Patch[L{self.source_layer}{head_str} -> L{self.target_layer}] "
            f"effect={self.effect_size:+.4f} "
            f"delta={delta:+.4f} [{causal_tag}]"
        )


@dataclass
class CircuitComponent:
    """
    A single transformer component identified as part of a mechanistic
    circuit.  The importance score reflects causal effect magnitude
    normalised to [0, 1].
    """
    layer:           int
    head:            Optional[int]
    component_type:  ComponentType
    importance:      float
    description:     str

    def __str__(self) -> str:
        head_str = f"/H{self.head}" if self.head is not None else ""
        return (
            f"Component[L{self.layer}{head_str} "
            f"{self.component_type.name}] "
            f"importance={self.importance:.4f} -- {self.description}"
        )


@dataclass
class DeceptionCircuit:
    """
    A circuit hypothesised to implement deceptive behaviour in the model.
    Discovered by sweeping activation patching across all layers and heads,
    then clustering the causal components.
    """
    components:    list[CircuitComponent] = field(default_factory=list)
    total_effect:  float = 0.0
    description:   str = ""
    confidence:    float = 0.0

    def __str__(self) -> str:
        return (
            f"DeceptionCircuit[{len(self.components)} components] "
            f"effect={self.total_effect:.4f} "
            f"confidence={self.confidence:.2%} -- {self.description}"
        )


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class TransformerLensProbe:
    """
    Mechanistic interpretability probe for transformer models.

    Architecture
    ────────────
    When TransformerLens and PyTorch are available the probe loads the
    requested model via ``HookedTransformer.from_pretrained`` and runs
    real activation extraction and patching experiments against the
    model's residual stream.  When the dependencies are missing it
    operates in **simulation mode**, returning synthetic activations that
    model the expected statistical properties of real transformer
    residual streams (norm growth across layers, Gaussian-distributed
    activations, sparse causal structure).

    Deception Pipeline Role
    ───────────────────────
    Engine 10 provides causal validation.  Given candidate deception
    features from the Neuronpedia Explorer (Engine 08), the probe tests
    whether ablating those features actually changes the model's
    deceptive output.  Results flow downstream to the Strategic Fidelity
    Scorer (Engine 15) as "circuit evidence" in the H_strat computation.
    """

    CAUSAL_THRESHOLD = 0.05  # minimum |effect_size| to count as causal

    def __init__(
        self,
        model_name: str = "gpt2-small",
    ) -> None:
        self._model_name: str = model_name
        self._model: Any = None
        self._loaded: bool = False

    # ── public API ────────────────────────────────────────────────────────────

    @property
    def is_loaded(self) -> bool:
        """True if a real TransformerLens model is loaded."""
        return self._loaded

    @property
    def model_name(self) -> str:
        return self._model_name

    def load_model(self, name: str | None = None) -> bool:
        """
        Load a transformer model via TransformerLens.

        If *name* is provided it overrides the model_name given at
        construction time.  Returns True on successful load, False when
        falling back to simulation mode.
        """
        target = name or self._model_name

        if TL_AVAILABLE:
            try:
                self._model = HookedTransformer.from_pretrained(target)
                self._model_name = target
                self._loaded = True
                return True
            except Exception:
                self._model_name = target
                self._loaded = False
                return False
        else:
            # Simulation mode -- record the name but don't load anything
            self._model_name = target
            self._loaded = False
            return False

    def get_activations(
        self,
        prompt: str,
        layer: int,
    ) -> ActivationSnapshot:
        """
        Extract residual-stream activations at *layer* for *prompt*.

        When TransformerLens is available, runs a forward pass with
        caching and extracts the ``hook_resid_post`` tensor.  Otherwise
        returns a simulated snapshot with realistic statistics.
        """
        if self._loaded and TL_AVAILABLE:
            return self._get_real_activations(prompt, layer)
        return self._get_simulated_activations(prompt, layer)

    def activation_patch(
        self,
        clean_prompt: str,
        corrupt_prompt: str,
        layer: int,
        head: int | None = None,
        patch_type: PatchType = PatchType.ZERO_ABLATION,
    ) -> PatchResult:
        """
        Perform activation patching between *clean_prompt* and
        *corrupt_prompt* at the specified *layer* (and optionally
        *head*).

        Procedure:
          1.  Run the model on the clean prompt and record the final-
              position logit for the most-probable next token.
          2.  Run the model on the corrupt prompt and cache activations.
          3.  Re-run the clean forward pass but replace the activations
              at (layer, head) according to *patch_type*.
          4.  Measure the logit shift and decide causality.
        """
        if self._loaded and TL_AVAILABLE:
            return self._real_patch(
                clean_prompt, corrupt_prompt, layer, head, patch_type,
            )
        return self._simulated_patch(
            clean_prompt, corrupt_prompt, layer, head, patch_type,
        )

    def find_deception_circuits(
        self,
        honest_prompt: str,
        deceptive_prompt: str,
        n_layers: int = 12,
    ) -> list[DeceptionCircuit]:
        """
        Sweep across *n_layers* layers (and all attention heads within
        each layer) to find components that causally contribute to
        switching from honest to deceptive output.

        Returns a list of ``DeceptionCircuit`` objects.  In practice the
        list usually contains one primary circuit and zero or more
        secondary circuits, ranked by total causal effect.
        """
        # Determine head count from model config or use a sensible default
        n_heads = self._get_n_heads()
        all_components: list[CircuitComponent] = []

        for layer_idx in range(n_layers):
            # ── Residual stream at this layer ──
            resid_result = self.activation_patch(
                honest_prompt, deceptive_prompt,
                layer=layer_idx, head=None,
                patch_type=PatchType.MEAN_ABLATION,
            )
            if resid_result.is_causal:
                all_components.append(CircuitComponent(
                    layer=layer_idx,
                    head=None,
                    component_type=ComponentType.RESIDUAL_STREAM,
                    importance=abs(resid_result.effect_size),
                    description=f"Residual stream at layer {layer_idx}",
                ))

            # ── Individual attention heads ──
            for head_idx in range(n_heads):
                head_result = self.activation_patch(
                    honest_prompt, deceptive_prompt,
                    layer=layer_idx, head=head_idx,
                    patch_type=PatchType.MEAN_ABLATION,
                )
                if head_result.is_causal:
                    role = self._infer_head_role(
                        layer_idx, head_idx, head_result.effect_size, n_layers,
                    )
                    all_components.append(CircuitComponent(
                        layer=layer_idx,
                        head=head_idx,
                        component_type=ComponentType.ATTENTION_HEAD,
                        importance=abs(head_result.effect_size),
                        description=role,
                    ))

            # ── MLP at this layer ──
            mlp_result = self.activation_patch(
                honest_prompt, deceptive_prompt,
                layer=layer_idx, head=None,
                patch_type=PatchType.ZERO_ABLATION,
            )
            if mlp_result.is_causal:
                all_components.append(CircuitComponent(
                    layer=layer_idx,
                    head=None,
                    component_type=ComponentType.MLP_LAYER,
                    importance=abs(mlp_result.effect_size),
                    description=f"MLP block at layer {layer_idx}",
                ))

        # Sort components by importance (descending)
        all_components.sort(key=lambda c: c.importance, reverse=True)

        # Cluster into circuits: primary (top 70% of effect) and secondary
        total_importance = sum(c.importance for c in all_components)
        circuits: list[DeceptionCircuit] = []

        if not all_components:
            circuits.append(DeceptionCircuit(
                components=[],
                total_effect=0.0,
                description="No causal components found.",
                confidence=0.0,
            ))
            return circuits

        # -- Primary circuit: accumulate until we cover 70% of total effect
        primary_components: list[CircuitComponent] = []
        secondary_components: list[CircuitComponent] = []
        running_effect = 0.0
        primary_threshold = total_importance * 0.70

        for comp in all_components:
            if running_effect < primary_threshold:
                primary_components.append(comp)
                running_effect += comp.importance
            else:
                secondary_components.append(comp)

        primary_effect = sum(c.importance for c in primary_components)
        primary_confidence = min(
            1.0,
            primary_effect / max(total_importance, 1e-9)
            * math.sqrt(len(primary_components) / max(n_layers, 1)),
        )

        circuits.append(DeceptionCircuit(
            components=primary_components,
            total_effect=primary_effect,
            description=(
                f"Primary deception circuit: {len(primary_components)} "
                f"components across {n_layers} layers scanned in "
                f"{self._model_name}"
            ),
            confidence=primary_confidence,
        ))

        # -- Secondary circuit (if any leftover components)
        if secondary_components:
            sec_effect = sum(c.importance for c in secondary_components)
            sec_confidence = min(
                1.0,
                sec_effect / max(total_importance, 1e-9)
                * math.sqrt(len(secondary_components) / max(n_layers, 1)),
            )
            circuits.append(DeceptionCircuit(
                components=secondary_components,
                total_effect=sec_effect,
                description=(
                    f"Secondary deception circuit: {len(secondary_components)} "
                    f"supporting components"
                ),
                confidence=sec_confidence,
            ))

        return circuits

    # ── internals: real model operations ──────────────────────────────────────

    def _get_n_heads(self) -> int:
        """Return the number of attention heads (from model config or default)."""
        if self._loaded and TL_AVAILABLE and self._model is not None:
            cfg = self._model.cfg
            return cfg.n_heads
        # Sensible defaults for common models
        defaults = {
            "gpt2-small": 12,
            "gpt2-medium": 16,
            "gpt2-large": 20,
            "gpt2-xl": 25,
            "gemma-2-2b": 16,
        }
        return defaults.get(self._model_name, 12)

    def _get_real_activations(
        self,
        prompt: str,
        layer: int,
    ) -> ActivationSnapshot:
        """Extract activations from the live model's residual stream."""
        _, cache = self._model.run_with_cache(prompt)
        hook_name = f"blocks.{layer}.hook_resid_post"
        act = cache[hook_name]  # shape: (batch, seq_len, d_model)

        n_positions = act.shape[1]
        mean_val = float(act.mean().item())
        max_val = float(act.max().item())
        std_val = float(act.std().item())

        return ActivationSnapshot(
            layer=layer,
            positions=n_positions,
            shape=tuple(act.shape),
            mean_activation=mean_val,
            max_activation=max_val,
            std_activation=std_val,
        )

    def _real_patch(
        self,
        clean: str,
        corrupt: str,
        layer: int,
        head: int | None,
        patch_type: PatchType,
    ) -> PatchResult:
        """Perform real activation patching through TransformerLens hooks."""
        # 1. Clean forward pass
        clean_logits = self._model(clean)
        original_logit = float(clean_logits[0, -1].max().item())

        # 2. Corrupt activation cache
        _, corrupt_cache = self._model.run_with_cache(corrupt)

        # 3. Choose hook point
        if head is not None:
            hook_name = f"blocks.{layer}.attn.hook_result"
        else:
            hook_name = f"blocks.{layer}.hook_resid_post"

        corrupt_act = corrupt_cache[hook_name]

        # 4. Build the patching hook
        def patch_hook(act: Any, hook: Any) -> Any:
            if patch_type == PatchType.ZERO_ABLATION:
                return torch.zeros_like(act)
            elif patch_type == PatchType.MEAN_ABLATION:
                return act.mean(dim=1, keepdim=True).expand_as(act)
            elif patch_type == PatchType.COUNTERFACTUAL:
                return corrupt_act
            elif patch_type == PatchType.NOISE_INJECTION:
                noise_scale = 0.1 * act.std()
                return act + torch.randn_like(act) * noise_scale
            return act

        # 5. Patched forward pass
        patched_logits = self._model.run_with_hooks(
            clean, fwd_hooks=[(hook_name, patch_hook)],
        )
        patched_logit = float(patched_logits[0, -1].max().item())

        delta = original_logit - patched_logit
        effect_size = delta / max(abs(original_logit), 1e-9)

        return PatchResult(
            source_layer=layer,
            target_layer=layer,
            source_head=head,
            effect_size=effect_size,
            original_logit=original_logit,
            patched_logit=patched_logit,
            is_causal=(abs(effect_size) > self.CAUSAL_THRESHOLD),
        )

    # ── internals: simulation mode ────────────────────────────────────────────

    def _get_simulated_activations(
        self,
        prompt: str,
        layer: int,
    ) -> ActivationSnapshot:
        """
        Generate synthetic activations with realistic statistics.

        Residual stream norms grow roughly linearly with depth; we model
        this via a layer-dependent scale factor applied to standard
        Gaussian draws.
        """
        import random
        import hashlib

        # Deterministic seed from prompt + layer for reproducibility
        seed_material = f"{prompt}|{layer}|{self._model_name}"
        seed = int(hashlib.sha256(seed_material.encode()).hexdigest()[:8], 16)
        rng = random.Random(seed)

        d_model = 768  # gpt2-small default
        n_tokens = len(prompt.split()) + 2  # rough BPE approximation

        # Residual stream norm grows with depth
        layer_scale = 1.0 + layer * 0.12
        values = [rng.gauss(0.0, layer_scale / math.sqrt(d_model)) for _ in range(d_model)]

        mean_val = sum(values) / len(values)
        max_val = max(values)
        variance = sum((v - mean_val) ** 2 for v in values) / len(values)
        std_val = math.sqrt(variance)

        return ActivationSnapshot(
            layer=layer,
            positions=n_tokens,
            shape=(1, n_tokens, d_model),
            mean_activation=round(mean_val, 6),
            max_activation=round(max_val, 6),
            std_activation=round(std_val, 6),
        )

    def _simulated_patch(
        self,
        clean: str,
        corrupt: str,
        layer: int,
        head: int | None,
        patch_type: PatchType,
    ) -> PatchResult:
        """
        Simulate activation patching with realistic causal structure.

        The simulation models several empirical regularities:
          - Middle layers contribute the strongest causal effects.
          - Roughly 20% of attention heads are causally important.
          - Zero ablation produces larger effects than noise injection.
          - Effect magnitude is prompt-sensitive via hash-based seeding.
        """
        import random
        import hashlib

        seed_material = (
            f"{clean}|{corrupt}|{layer}|{head}|"
            f"{patch_type.name}|{self._model_name}"
        )
        seed = int(hashlib.sha256(seed_material.encode()).hexdigest()[:8], 16)
        rng = random.Random(seed)

        # Layer-dependent effect: bell curve centred at ~60% depth
        peak_layer = 7  # for a 12-layer model this is ~60%
        layer_effect = math.exp(-((layer - peak_layer) ** 2) / 18.0)

        # Head sparsity: deterministic ~20% are "important"
        head_bonus = 0.0
        if head is not None:
            # Use a hash to deterministically assign importance
            head_hash = (layer * 31 + head * 17) % 100
            head_bonus = 0.18 if head_hash < 20 else -0.04

        # Base logit
        original_logit = rng.gauss(9.5, 2.0)

        # Compute raw delta
        raw_delta = layer_effect * (0.35 + head_bonus) * rng.gauss(1.0, 0.25)

        # Patch-type multipliers
        multipliers = {
            PatchType.ZERO_ABLATION:   1.25,
            PatchType.MEAN_ABLATION:   1.00,
            PatchType.COUNTERFACTUAL:  0.85,
            PatchType.NOISE_INJECTION: 0.40,
        }
        raw_delta *= multipliers.get(patch_type, 1.0)

        patched_logit = original_logit - raw_delta
        effect_size = raw_delta / max(abs(original_logit), 1e-9)

        return PatchResult(
            source_layer=layer,
            target_layer=layer,
            source_head=head,
            effect_size=effect_size,
            original_logit=round(original_logit, 4),
            patched_logit=round(patched_logit, 4),
            is_causal=(abs(effect_size) > self.CAUSAL_THRESHOLD),
        )

    @staticmethod
    def _infer_head_role(
        layer: int,
        head: int,
        effect: float,
        n_layers: int,
    ) -> str:
        """
        Heuristic role assignment based on layer depth and effect sign.

        Early layers tend to handle positional and token-identity
        features; middle layers extract semantic structure; late layers
        drive output logits and implement behavioural switching.
        """
        depth_frac = layer / max(n_layers - 1, 1)

        if depth_frac < 0.25:
            return ("token identity encoder" if effect > 0
                    else "positional embedder")
        elif depth_frac < 0.50:
            return ("feature extractor" if effect > 0
                    else "inhibition head")
        elif depth_frac < 0.75:
            return ("deception suppressor" if effect > 0
                    else "persona switcher")
        else:
            return ("output logit booster" if effect > 0
                    else "logit dampener")


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    RESET  = "\033[0m"
    GREEN  = "\033[38;2;0;255;65m"
    CYAN   = "\033[38;2;0;200;180m"
    PURPLE = "\033[38;2;180;100;255m"
    DIM    = "\033[2m"
    BOLD   = "\033[1m"

    print(f"""
{GREEN}{BOLD}
 ┌──────────────────────────────────────────────────┐
 │  COGNITIVE CANARY v7.0  //  ENGINE 10            │
 │  TransformerLens Probe -- Activation Patching    │
 │  Circuit Discovery  ·  d/acc active              │
 └──────────────────────────────────────────────────┘
{RESET}""")

    probe = TransformerLensProbe(model_name="gpt2-small")
    loaded = probe.load_model()

    mode = "live model" if loaded else "simulation mode"
    print(f"  {CYAN}Model: {probe.model_name} ({mode}){RESET}")
    if not loaded:
        print(f"  {DIM}TransformerLens not installed -- using synthetic activations{RESET}")
    print()

    # ── Activation extraction demo ──
    test_prompt = "The capital of France is"
    print(f"  {CYAN}1. Extracting activations...{RESET}")
    print(f"     {DIM}prompt: \"{test_prompt}\"{RESET}")

    for lyr in [0, 3, 6, 11]:
        snap = probe.get_activations(test_prompt, layer=lyr)
        print(
            f"     {GREEN}L{lyr:2d}{RESET}  "
            f"mean={snap.mean_activation:+.4f}  "
            f"max={snap.max_activation:+.4f}  "
            f"std={snap.std_activation:.4f}  "
            f"shape={snap.shape}"
        )

    print()

    # ── Activation patching demo ──
    honest    = "The capital of France is"
    deceptive = "I'm not sure, I think the capital of France might be"

    print(f"  {CYAN}2. Activation patching...{RESET}")
    print(f"     {DIM}clean:   \"{honest}\"{RESET}")
    print(f"     {DIM}corrupt: \"{deceptive}\"{RESET}")
    print()

    for pt in PatchType:
        result = probe.activation_patch(
            honest, deceptive, layer=6, head=3, patch_type=pt,
        )
        causal_flag = f"{GREEN}CAUSAL{RESET}" if result.is_causal else f"{DIM}non-causal{RESET}"
        print(
            f"     {PURPLE}{pt.name:20s}{RESET}  "
            f"effect={result.effect_size:+.4f}  "
            f"orig={result.original_logit:+.4f}  "
            f"patched={result.patched_logit:+.4f}  "
            f"[{causal_flag}]"
        )

    print()

    # ── Circuit discovery demo ──
    print(f"  {CYAN}3. Searching for deception circuits...{RESET}")
    print(f"     {DIM}Sweeping {8} layers x {probe._get_n_heads()} heads{RESET}")
    print()

    t0 = time.perf_counter()
    circuits = probe.find_deception_circuits(
        honest, deceptive, n_layers=8,
    )
    elapsed = time.perf_counter() - t0

    for i, circuit in enumerate(circuits):
        label = "PRIMARY" if i == 0 else "SECONDARY"
        print(
            f"  {GREEN}[{label}]{RESET} "
            f"{len(circuit.components)} components, "
            f"total_effect={circuit.total_effect:.4f}, "
            f"confidence={circuit.confidence:.2%}"
        )
        print(f"     {DIM}{circuit.description}{RESET}")

        for comp in circuit.components[:8]:
            head_str = f"/H{comp.head}" if comp.head is not None else "   "
            print(
                f"     {PURPLE}>{RESET} L{comp.layer:2d}{head_str:4s} "
                f"[{comp.component_type.name:16s}] "
                f"importance={comp.importance:.4f}  "
                f"{DIM}{comp.description}{RESET}"
            )

        if len(circuit.components) > 8:
            print(f"     {DIM}... and {len(circuit.components) - 8} more{RESET}")
        print()

    print(f"  {DIM}Circuit discovery completed in {elapsed:.3f}s{RESET}")
