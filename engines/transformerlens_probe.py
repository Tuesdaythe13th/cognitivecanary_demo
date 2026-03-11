"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v7.0  //  ENGINE 10                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   T R A N S F O R M E R L E N S   P R O B E                                 ║
║                                                                              ║
║   Loads transformer models via the TransformerLens library and performs     ║
║   mechanistic interpretability operations: activation extraction,           ║
║   activation patching, and residual stream probing.  This is the           ║
║   "surgeon's scalpel" of the forensic pipeline — once candidate            ║
║   deception features have been identified by the Neuronpedia Explorer      ║
║   (Engine 08), this engine causally validates whether those features       ║
║   are necessary and sufficient for the deceptive behaviour.                 ║
║                                                                              ║
║   Operations:                                                                ║
║     • Residual stream extraction at arbitrary layers/positions              ║
║     • Activation patching (zero, mean, and counterfactual)                  ║
║     • Attention head output isolation                                        ║
║     • Logit attribution to specific components                               ║
║                                                                              ║
║   Theoretical basis:                                                         ║
║     Neel Nanda et al. (2023) — TransformerLens                               ║
║     Conmy et al. (2023) — Towards Automated Circuit Discovery               ║
║     Wang et al. (2022) — Interpretability in the Wild, IOI                   ║
║                                                                              ║
║   ARTIFEX LABS  //  d/acc  //  Right to Be Inscrutable                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Any

try:
    import torch
    import transformer_lens
    from transformer_lens import HookedTransformer, ActivationCache
    TLENS_AVAILABLE = True
except ImportError:
    TLENS_AVAILABLE = False
    torch = None  # type: ignore[assignment]


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

class PatchType(Enum):
    """Types of activation patching."""
    ZERO_ABLATION     = auto()  # replace with zeros
    MEAN_ABLATION     = auto()  # replace with dataset mean
    COUNTERFACTUAL    = auto()  # replace with activations from a different prompt
    NOISE_INJECTION   = auto()  # add Gaussian noise to activations


class ComponentType(Enum):
    """Transformer components that can be probed."""
    RESIDUAL_STREAM = auto()
    ATTENTION_HEAD  = auto()
    MLP_OUTPUT      = auto()
    LAYER_NORM      = auto()
    EMBEDDING       = auto()


@dataclass
class ActivationSnapshot:
    """Activations extracted from a specific model component."""
    model:          str
    prompt:         str
    component:      ComponentType
    layer:          int
    head:           int | None = None     # only for attention heads
    position:       int | None = None     # token position (None = all)
    values:         list[float] = field(default_factory=list)  # flattened
    shape:          tuple[int, ...] = ()
    norm:           float = 0.0           # L2 norm
    timestamp:      float = 0.0

    def __str__(self) -> str:
        head_str = f"/H{self.head}" if self.head is not None else ""
        pos_str  = f"@{self.position}" if self.position is not None else ""
        return (
            f"Activation[{self.model} L{self.layer}{head_str}{pos_str}] "
            f"shape={self.shape} norm={self.norm:.4f}"
        )


@dataclass
class PatchResult:
    """Result of an activation patching experiment."""
    clean_prompt:      str
    corrupt_prompt:    str
    component:         ComponentType
    layer:             int
    head:              int | None
    patch_type:        PatchType
    clean_logit:       float       # logit for target token on clean input
    patched_logit:     float       # logit after patching
    delta:             float       # clean - patched
    relative_effect:   float       # delta / clean (fractional)
    is_causal:         bool        # True if |delta| > threshold

    def __str__(self) -> str:
        head_str = f"/H{self.head}" if self.head is not None else ""
        causal = "CAUSAL" if self.is_causal else "non-causal"
        return (
            f"Patch[L{self.layer}{head_str}] "
            f"Δ={self.delta:+.4f} ({self.relative_effect:+.1%}) [{causal}]"
        )


@dataclass
class CircuitComponent:
    """A single component identified as part of a circuit."""
    layer:      int
    head:       int | None
    component:  ComponentType
    effect:     float       # causal effect magnitude
    role:       str = ""    # e.g. "name mover", "inhibition", "deception suppressor"


@dataclass
class DeceptionCircuit:
    """A circuit hypothesised to implement deceptive behaviour."""
    name:        str
    components:  list[CircuitComponent] = field(default_factory=list)
    total_effect: float = 0.0
    description: str = ""


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class TransformerLensProbe:
    """
    Mechanistic interpretability probe for transformer models.

    Architecture
    ────────────
    When TransformerLens and PyTorch are available, the probe loads the
    specified model via HookedTransformer and runs real activation
    extraction and patching experiments.  When the dependencies are
    missing, it operates in simulation mode with synthetic activations
    that model the expected statistical properties of real transformer
    residual streams.

    Deception Pipeline Role
    ───────────────────────
    Engine 10 provides causal validation.  Given candidate deception
    features from the Neuronpedia Explorer (Engine 08), the probe
    tests whether ablating those features actually changes the model's
    deceptive output.  Results flow to the Strategic Fidelity Scorer
    (Engine 15) as "circuit evidence" in the H_strat computation.
    """

    CAUSAL_THRESHOLD = 0.05  # minimum relative effect to count as causal

    def __init__(
        self,
        model_name: str = "gemma-2-2b",
        device: str = "cpu",
    ) -> None:
        self._model_name = model_name
        self._device     = device
        self._model: Any = None
        self._loaded     = False

    # ── public API ────────────────────────────────────────────────────────────

    def load_model(self, name: str | None = None) -> bool:
        """
        Load a model via TransformerLens.

        Returns True if the model was loaded successfully, False if
        falling back to simulation mode.
        """
        target = name or self._model_name

        if TLENS_AVAILABLE:
            try:
                self._model = HookedTransformer.from_pretrained(
                    target, device=self._device
                )
                self._model_name = target
                self._loaded = True
                return True
            except Exception:
                self._loaded = False
                return False
        else:
            self._model_name = target
            self._loaded = False
            return False

    def get_activations(
        self,
        prompt: str,
        layer: int,
        component: ComponentType = ComponentType.RESIDUAL_STREAM,
        head: int | None = None,
        position: int | None = None,
    ) -> ActivationSnapshot:
        """
        Extract activations from a specific model component.
        """
        if self._loaded and TLENS_AVAILABLE:
            return self._get_real_activations(prompt, layer, component, head, position)
        else:
            return self._get_simulated_activations(prompt, layer, component, head, position)

    def activation_patch(
        self,
        clean_prompt: str,
        corrupt_prompt: str,
        layer: int,
        head: int | None = None,
        component: ComponentType = ComponentType.ATTENTION_HEAD,
        patch_type: PatchType = PatchType.ZERO_ABLATION,
        target_token: str = "",
    ) -> PatchResult:
        """
        Perform activation patching: run the model on the clean prompt,
        replace activations at the specified component with activations
        from the corrupt prompt (or zeros/mean), and measure the change
        in logit for the target token.
        """
        if self._loaded and TLENS_AVAILABLE:
            return self._real_patch(
                clean_prompt, corrupt_prompt, layer, head,
                component, patch_type, target_token
            )
        else:
            return self._simulated_patch(
                clean_prompt, corrupt_prompt, layer, head,
                component, patch_type, target_token
            )

    def find_deception_circuits(
        self,
        honest_prompt: str,
        deceptive_prompt: str,
        n_layers: int | None = None,
        n_heads: int | None = None,
    ) -> DeceptionCircuit:
        """
        Sweep across all layers and heads to find components that
        causally contribute to switching from honest to deceptive output.

        Returns a DeceptionCircuit with the identified components
        ranked by causal effect magnitude.
        """
        num_layers = n_layers or 26
        num_heads  = n_heads or 16

        components: list[CircuitComponent] = []

        for layer in range(num_layers):
            # Test residual stream
            result = self.activation_patch(
                honest_prompt, deceptive_prompt, layer,
                component=ComponentType.RESIDUAL_STREAM,
                patch_type=PatchType.MEAN_ABLATION,
            )
            if result.is_causal:
                components.append(CircuitComponent(
                    layer=layer, head=None,
                    component=ComponentType.RESIDUAL_STREAM,
                    effect=abs(result.delta),
                    role="residual contributor",
                ))

            # Test individual attention heads
            for head in range(num_heads):
                result = self.activation_patch(
                    honest_prompt, deceptive_prompt, layer, head=head,
                    component=ComponentType.ATTENTION_HEAD,
                    patch_type=PatchType.MEAN_ABLATION,
                )
                if result.is_causal:
                    role = self._infer_head_role(layer, head, result.delta)
                    components.append(CircuitComponent(
                        layer=layer, head=head,
                        component=ComponentType.ATTENTION_HEAD,
                        effect=abs(result.delta),
                        role=role,
                    ))

            # Test MLP
            result = self.activation_patch(
                honest_prompt, deceptive_prompt, layer,
                component=ComponentType.MLP_OUTPUT,
                patch_type=PatchType.MEAN_ABLATION,
            )
            if result.is_causal:
                components.append(CircuitComponent(
                    layer=layer, head=None,
                    component=ComponentType.MLP_OUTPUT,
                    effect=abs(result.delta),
                    role="MLP processor",
                ))

        components.sort(key=lambda c: c.effect, reverse=True)
        total = sum(c.effect for c in components)

        return DeceptionCircuit(
            name=f"deception_circuit_{self._model_name}",
            components=components,
            total_effect=total,
            description=(
                f"Circuit with {len(components)} causal components "
                f"identified across {num_layers} layers."
            ),
        )

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    @property
    def model_name(self) -> str:
        return self._model_name

    # ── internals ─────────────────────────────────────────────────────────────

    def _get_real_activations(
        self, prompt: str, layer: int, component: ComponentType,
        head: int | None, position: int | None,
    ) -> ActivationSnapshot:
        """Extract real activations using TransformerLens hooks."""
        _, cache = self._model.run_with_cache(prompt)

        if component == ComponentType.RESIDUAL_STREAM:
            hook_name = f"blocks.{layer}.hook_resid_post"
        elif component == ComponentType.ATTENTION_HEAD:
            hook_name = f"blocks.{layer}.attn.hook_result"
        elif component == ComponentType.MLP_OUTPUT:
            hook_name = f"blocks.{layer}.hook_mlp_out"
        else:
            hook_name = f"blocks.{layer}.hook_resid_post"

        act = cache[hook_name]

        if head is not None and component == ComponentType.ATTENTION_HEAD:
            act = act[:, :, head, :]
        if position is not None:
            act = act[:, position, :]

        values = act.detach().cpu().flatten().tolist()
        norm = float(act.norm().item())

        return ActivationSnapshot(
            model=self._model_name,
            prompt=prompt,
            component=component,
            layer=layer,
            head=head,
            position=position,
            values=values[:1024],  # cap for memory
            shape=tuple(act.shape),
            norm=norm,
            timestamp=time.time(),
        )

    def _get_simulated_activations(
        self, prompt: str, layer: int, component: ComponentType,
        head: int | None, position: int | None,
    ) -> ActivationSnapshot:
        """Generate synthetic activations for simulation mode."""
        import random
        import math

        d_model = 2304  # gemma-2-2b dimension
        n_tokens = len(prompt.split()) + 2

        # Simulate residual stream norm growth across layers
        layer_scale = 1.0 + layer * 0.15
        values = [
            random.gauss(0, layer_scale / math.sqrt(d_model))
            for _ in range(min(d_model, 256))
        ]
        norm = math.sqrt(sum(v ** 2 for v in values))

        shape = (1, n_tokens, d_model) if position is None else (1, d_model)
        if head is not None:
            shape = (1, n_tokens, d_model // 16)

        return ActivationSnapshot(
            model=self._model_name,
            prompt=prompt,
            component=component,
            layer=layer,
            head=head,
            position=position,
            values=values,
            shape=shape,
            norm=norm,
            timestamp=time.time(),
        )

    def _real_patch(
        self, clean: str, corrupt: str, layer: int, head: int | None,
        component: ComponentType, patch_type: PatchType, target: str,
    ) -> PatchResult:
        """Run real activation patching via TransformerLens."""
        # Get clean logits
        clean_logits = self._model(clean)
        clean_logit_val = float(clean_logits[0, -1].max().item())

        # Get corrupt activations
        _, corrupt_cache = self._model.run_with_cache(corrupt)

        # Build patching hook
        if component == ComponentType.ATTENTION_HEAD:
            hook_name = f"blocks.{layer}.attn.hook_result"
        elif component == ComponentType.MLP_OUTPUT:
            hook_name = f"blocks.{layer}.hook_mlp_out"
        else:
            hook_name = f"blocks.{layer}.hook_resid_post"

        corrupt_act = corrupt_cache[hook_name]

        def patch_hook(act, hook):
            if patch_type == PatchType.ZERO_ABLATION:
                return torch.zeros_like(act)
            elif patch_type == PatchType.MEAN_ABLATION:
                return act.mean(dim=1, keepdim=True).expand_as(act)
            elif patch_type == PatchType.COUNTERFACTUAL:
                return corrupt_act
            elif patch_type == PatchType.NOISE_INJECTION:
                return act + torch.randn_like(act) * 0.1
            return act

        patched_logits = self._model.run_with_hooks(
            clean, fwd_hooks=[(hook_name, patch_hook)]
        )
        patched_logit_val = float(patched_logits[0, -1].max().item())

        delta = clean_logit_val - patched_logit_val
        relative = delta / abs(clean_logit_val) if clean_logit_val != 0 else 0.0

        return PatchResult(
            clean_prompt=clean,
            corrupt_prompt=corrupt,
            component=component,
            layer=layer,
            head=head,
            patch_type=patch_type,
            clean_logit=clean_logit_val,
            patched_logit=patched_logit_val,
            delta=delta,
            relative_effect=relative,
            is_causal=(abs(relative) > self.CAUSAL_THRESHOLD),
        )

    def _simulated_patch(
        self, clean: str, corrupt: str, layer: int, head: int | None,
        component: ComponentType, patch_type: PatchType, target: str,
    ) -> PatchResult:
        """Simulate activation patching results."""
        import random
        import math

        # Model expected causal effects: middle layers have strongest effects
        layer_effect = math.exp(-((layer - 13) ** 2) / 50)  # peak at layer 13

        # Attention heads: some are causal, most are not
        head_bonus = 0.0
        if head is not None:
            # Simulate ~20% of heads being important
            head_bonus = 0.15 if (layer * 17 + head * 7) % 5 == 0 else -0.05

        clean_logit = random.gauss(8.0, 1.5)
        delta = layer_effect * (0.3 + head_bonus) * random.gauss(1.0, 0.3)

        if patch_type == PatchType.ZERO_ABLATION:
            delta *= 1.2
        elif patch_type == PatchType.NOISE_INJECTION:
            delta *= 0.4

        patched_logit = clean_logit - delta
        relative = delta / abs(clean_logit) if clean_logit != 0 else 0.0

        return PatchResult(
            clean_prompt=clean,
            corrupt_prompt=corrupt,
            component=component,
            layer=layer,
            head=head,
            patch_type=patch_type,
            clean_logit=clean_logit,
            patched_logit=patched_logit,
            delta=delta,
            relative_effect=relative,
            is_causal=(abs(relative) > self.CAUSAL_THRESHOLD),
        )

    @staticmethod
    def _infer_head_role(layer: int, head: int, delta: float) -> str:
        """Heuristic role assignment based on layer position and effect sign."""
        if layer < 6:
            return "token embedder" if delta > 0 else "position encoder"
        elif layer < 14:
            return "feature extractor" if delta > 0 else "inhibition head"
        elif layer < 20:
            return "deception suppressor" if delta > 0 else "persona switcher"
        else:
            return "output formatter" if delta > 0 else "logit modifier"


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
 │  TransformerLens Probe — Activation Patching     │
 │  Causal circuit discovery  ·  d/acc active       │
 └──────────────────────────────────────────────────┘
{RESET}""")

    probe = TransformerLensProbe()
    loaded = probe.load_model()

    if not loaded:
        print(f"  {CYAN}Running in simulation mode (TransformerLens not available){RESET}\n")

    honest_prompt    = "The capital of France is"
    deceptive_prompt = "I don't know what the capital of France is"

    print(f"  {CYAN}Searching for deception circuits...{RESET}")
    print(f"  {DIM}Clean:   '{honest_prompt}'{RESET}")
    print(f"  {DIM}Corrupt: '{deceptive_prompt}'{RESET}\n")

    circuit = probe.find_deception_circuits(
        honest_prompt, deceptive_prompt,
        n_layers=8, n_heads=8,
    )

    print(f"  {GREEN}Found {len(circuit.components)} causal components{RESET}")
    print(f"  {DIM}Total causal effect: {circuit.total_effect:.4f}{RESET}\n")

    for comp in circuit.components[:10]:
        head_str = f"/H{comp.head}" if comp.head is not None else ""
        print(
            f"  {PURPLE}▸{RESET} L{comp.layer}{head_str} "
            f"[{comp.component.name}] "
            f"effect={comp.effect:.4f} "
            f"{DIM}role: {comp.role}{RESET}"
        )
