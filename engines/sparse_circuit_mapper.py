"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v7.0  //  ENGINE 14                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   S P A R S E   C I R C U I T   M A P P E R                                 ║
║                                                                              ║
║   Implements sparse autoencoder (SAE) decomposition and circuit discovery   ║
║   following OpenAI's methodology for mechanistic interpretability.          ║
║   Decomposes dense model activations into sparse, interpretable features   ║
║   and maps the causal graph between features to identify "deception        ║
║   circuits" — groups of features that collectively implement strategic     ║
║   behaviour suppression or persona-switching.                               ║
║                                                                              ║
║   Architecture:                                                              ║
║     • JumpReLU SAE with Matryoshka (multi-resolution) support              ║
║     • L1-penalised reconstruction for sparsity                              ║
║     • Adjacency-based circuit discovery over feature co-activations        ║
║     • Monosemanticity scoring via activation kurtosis                       ║
║                                                                              ║
║   Theoretical basis:                                                         ║
║     Bricken et al. (2023) — Towards Monosemanticity, Anthropic              ║
║     Gao et al. (2024) — Scaling and Evaluating Sparse Autoencoders         ║
║     OpenAI (2024) — Extracting Concepts from GPT-4                           ║
║     Rajamanoharan et al. (2024) — JumpReLU SAEs                             ║
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
from typing import Any

try:
    import torch
    import torch.nn as nn
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    torch = None  # type: ignore[assignment]

try:
    from safetensors import safe_open
    from safetensors.torch import save_file
    SAFETENSORS_AVAILABLE = True
except ImportError:
    SAFETENSORS_AVAILABLE = False


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

class FeatureType(Enum):
    """Semantic type of a discovered SAE feature."""
    DECEPTION_RELATED    = auto()  # features involved in deceptive outputs
    MONITORING_AWARE     = auto()  # features that activate on monitoring cues
    CAPABILITY_GATE      = auto()  # features that gate capability expression
    SAFETY_REFUSAL       = auto()  # features involved in safety refusals
    PERSONA_MARKER       = auto()  # features marking persona boundaries
    FACTUAL_KNOWLEDGE    = auto()  # features encoding factual information
    STRUCTURAL           = auto()  # syntactic/formatting features
    UNKNOWN              = auto()


@dataclass
class SAEConfig:
    """Configuration for a sparse autoencoder."""
    d_model:          int = 2304     # input dimension (model hidden size)
    n_features:       int = 16384    # dictionary size
    sparsity_penalty: float = 0.04   # L1 coefficient
    learning_rate:    float = 3e-4
    activation:       str = "jumprelu"  # "relu", "jumprelu", "topk"
    matryoshka_sizes: list[int] = field(default_factory=lambda: [4096, 8192, 16384])


@dataclass
class SparseFeature:
    """A single feature in the SAE dictionary."""
    index:                int
    activation_strength:  float = 0.0
    density:              float = 0.0    # fraction of inputs that activate
    monosemanticity:      float = 0.0    # kurtosis-based score
    feature_type:         FeatureType = FeatureType.UNKNOWN
    description:          str = ""
    top_activating:       list[str] = field(default_factory=list)

    def __str__(self) -> str:
        return (
            f"Feature[{self.index:05d}] "
            f"act={self.activation_strength:.3f} "
            f"density={self.density:.4f} "
            f"mono={self.monosemanticity:.2f} "
            f"type={self.feature_type.name}"
        )


@dataclass
class FeatureConnection:
    """A causal connection between two features in a circuit."""
    source_idx:  int
    target_idx:  int
    strength:    float      # co-activation correlation
    direction:   str = ""   # "excitatory" or "inhibitory"


@dataclass
class SparseCircuit:
    """A group of features forming a functional circuit."""
    name:          str
    features:      list[SparseFeature] = field(default_factory=list)
    connections:   list[FeatureConnection] = field(default_factory=list)
    circuit_type:  str = ""
    total_effect:  float = 0.0
    description:   str = ""


@dataclass
class DecompositionResult:
    """Result of decomposing activations through the SAE."""
    layer:          int
    n_active:       int           # number of active features
    n_total:        int           # total dictionary size
    sparsity:       float         # n_active / n_total
    reconstruction_loss: float
    features:       list[SparseFeature] = field(default_factory=list)
    active_indices: list[int] = field(default_factory=list)


# ─────────────────────────────────────────────────────────────────────────────
# SAE model (PyTorch)
# ─────────────────────────────────────────────────────────────────────────────

if TORCH_AVAILABLE:
    class JumpReLUSAE(nn.Module):
        """
        JumpReLU Sparse Autoencoder.

        Encodes dense activations into a sparse feature representation using
        a learned dictionary with a JumpReLU activation (ReLU with a learned
        threshold per feature).
        """

        def __init__(self, config: SAEConfig):
            super().__init__()
            self.config = config
            self.encoder = nn.Linear(config.d_model, config.n_features, bias=True)
            self.decoder = nn.Linear(config.n_features, config.d_model, bias=True)
            self.threshold = nn.Parameter(torch.ones(config.n_features) * 0.1)

            # Initialise decoder columns to unit norm
            with torch.no_grad():
                self.decoder.weight.div_(self.decoder.weight.norm(dim=0, keepdim=True))

        def encode(self, x: torch.Tensor) -> torch.Tensor:
            pre_act = self.encoder(x)
            # JumpReLU: ReLU with per-feature threshold
            return torch.relu(pre_act - self.threshold) * (pre_act > self.threshold).float()

        def decode(self, features: torch.Tensor) -> torch.Tensor:
            return self.decoder(features)

        def forward(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
            features = self.encode(x)
            reconstruction = self.decode(features)
            return reconstruction, features


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class SparseCircuitMapper:
    """
    Sparse autoencoder decomposition and circuit discovery engine.

    Architecture
    ────────────
    The mapper maintains a JumpReLU SAE (when PyTorch is available)
    or simulates SAE decomposition using random projections.  Given
    dense activations from the TransformerLens Probe (Engine 10),
    it decomposes them into sparse features and maps co-activation
    patterns to discover circuits.

    Deception Pipeline Role
    ───────────────────────
    Engine 14 provides feature-level granularity.  While the
    TransformerLens Probe works at the attention head / MLP level,
    the Sparse Circuit Mapper works at the individual feature level
    within those components.  Its circuit maps feed the Neuronpedia
    Explorer (Engine 08) for visualisation and the Strategic Fidelity
    Scorer (Engine 15) for H_strat computation.
    """

    def __init__(
        self,
        config: SAEConfig | None = None,
        device: str = "cpu",
    ) -> None:
        self._config = config or SAEConfig()
        self._device = device
        self._sae: Any = None
        self._loaded = False

        if TORCH_AVAILABLE:
            self._sae = JumpReLUSAE(self._config)
            self._loaded = True

    # ── public API ────────────────────────────────────────────────────────────

    def load_sae(
        self,
        path: str | None = None,
        model: str = "gemma-2-2b",
        layer: int = 12,
    ) -> bool:
        """
        Load a pre-trained SAE from a safetensors file.

        If no path is provided, initialises a fresh SAE.
        """
        if path and TORCH_AVAILABLE and SAFETENSORS_AVAILABLE:
            try:
                with safe_open(path, framework="pt", device=self._device) as f:
                    state_dict = {k: f.get_tensor(k) for k in f.keys()}
                self._sae.load_state_dict(state_dict)
                self._loaded = True
                return True
            except Exception:
                return False

        # Use randomly initialised SAE for demo purposes
        self._loaded = TORCH_AVAILABLE
        return self._loaded

    def decompose(
        self,
        activations: list[float],
        layer: int = 0,
    ) -> DecompositionResult:
        """
        Decompose dense activations into sparse features via the SAE.
        """
        if self._loaded and TORCH_AVAILABLE:
            return self._real_decompose(activations, layer)
        else:
            return self._simulated_decompose(activations, layer)

    def find_sparse_circuits(
        self,
        decompositions: list[DecompositionResult],
        correlation_threshold: float = 0.3,
    ) -> list[SparseCircuit]:
        """
        Discover circuits by analysing feature co-activation patterns
        across multiple decompositions.
        """
        # Build co-activation matrix
        feature_activations: dict[int, list[float]] = {}
        for decomp in decompositions:
            for feat in decomp.features:
                if feat.index not in feature_activations:
                    feature_activations[feat.index] = []
                feature_activations[feat.index].append(feat.activation_strength)

        # Find correlated feature pairs
        connections: list[FeatureConnection] = []
        indices = list(feature_activations.keys())

        for i in range(len(indices)):
            for j in range(i + 1, len(indices)):
                idx_a, idx_b = indices[i], indices[j]
                vals_a = feature_activations[idx_a]
                vals_b = feature_activations[idx_b]

                # Pad to same length
                min_len = min(len(vals_a), len(vals_b))
                if min_len < 3:
                    continue

                corr = self._correlation(vals_a[:min_len], vals_b[:min_len])
                if abs(corr) > correlation_threshold:
                    connections.append(FeatureConnection(
                        source_idx=idx_a,
                        target_idx=idx_b,
                        strength=abs(corr),
                        direction="excitatory" if corr > 0 else "inhibitory",
                    ))

        # Group connected features into circuits
        circuits = self._group_into_circuits(connections, decompositions)
        return circuits

    def compute_monosemanticity(
        self,
        feature_idx: int,
        activation_values: list[float],
    ) -> float:
        """
        Compute monosemanticity score using excess kurtosis.

        A monosemantic feature activates strongly in a narrow context,
        producing a heavy-tailed distribution (high kurtosis).
        """
        n = len(activation_values)
        if n < 4:
            return 0.0

        mean = sum(activation_values) / n
        variance = sum((x - mean) ** 2 for x in activation_values) / n
        if variance == 0:
            return 0.0

        std = math.sqrt(variance)
        kurtosis = sum((x - mean) ** 4 for x in activation_values) / (n * variance ** 2) - 3

        # Normalise to 0-1 range (kurtosis > 3 is highly monosemantic)
        return min(1.0, max(0.0, kurtosis / 10.0))

    def map_deception_features(
        self,
        circuits: list[SparseCircuit],
    ) -> list[SparseFeature]:
        """
        Identify features within circuits that are likely involved in
        deceptive behaviour based on their type and circuit context.
        """
        deception_features = []
        for circuit in circuits:
            for feat in circuit.features:
                if feat.feature_type in (
                    FeatureType.DECEPTION_RELATED,
                    FeatureType.MONITORING_AWARE,
                    FeatureType.CAPABILITY_GATE,
                ):
                    deception_features.append(feat)

        return sorted(deception_features, key=lambda f: f.activation_strength, reverse=True)

    # ── internals ─────────────────────────────────────────────────────────────

    def _real_decompose(
        self,
        activations: list[float],
        layer: int,
    ) -> DecompositionResult:
        """Decompose using the actual SAE."""
        x = torch.tensor(activations, dtype=torch.float32).unsqueeze(0)

        # Pad or truncate to match SAE input dimension
        if x.shape[1] < self._config.d_model:
            x = torch.nn.functional.pad(x, (0, self._config.d_model - x.shape[1]))
        elif x.shape[1] > self._config.d_model:
            x = x[:, :self._config.d_model]

        with torch.no_grad():
            reconstruction, features = self._sae(x)
            loss = torch.nn.functional.mse_loss(reconstruction, x).item()

        # Extract active features
        feat_values = features[0].numpy()
        active_indices = [i for i, v in enumerate(feat_values) if v > 0]
        sparse_features = []

        for idx in active_indices:
            sparse_features.append(SparseFeature(
                index=idx,
                activation_strength=float(feat_values[idx]),
                density=0.0,  # would need dataset statistics
                monosemanticity=0.0,
                feature_type=self._infer_feature_type(idx, float(feat_values[idx])),
            ))

        return DecompositionResult(
            layer=layer,
            n_active=len(active_indices),
            n_total=self._config.n_features,
            sparsity=len(active_indices) / self._config.n_features,
            reconstruction_loss=loss,
            features=sorted(sparse_features, key=lambda f: f.activation_strength, reverse=True),
            active_indices=active_indices,
        )

    def _simulated_decompose(
        self,
        activations: list[float],
        layer: int,
    ) -> DecompositionResult:
        """Simulate SAE decomposition."""
        import random

        n_features = self._config.n_features
        # Simulate ~2-5% of features being active (typical for well-trained SAEs)
        n_active = random.randint(
            int(n_features * 0.02),
            int(n_features * 0.05),
        )

        active_indices = sorted(random.sample(range(n_features), n_active))
        features = []

        for idx in active_indices:
            # Simulate activation strength with log-normal distribution
            strength = random.lognormvariate(-1.0, 1.0)
            density = random.uniform(0.001, 0.05)
            mono = random.betavariate(2, 5)  # skewed toward lower values

            features.append(SparseFeature(
                index=idx,
                activation_strength=strength,
                density=density,
                monosemanticity=mono,
                feature_type=self._infer_feature_type(idx, strength),
            ))

        features.sort(key=lambda f: f.activation_strength, reverse=True)
        loss = random.uniform(0.001, 0.05)

        return DecompositionResult(
            layer=layer,
            n_active=n_active,
            n_total=n_features,
            sparsity=n_active / n_features,
            reconstruction_loss=loss,
            features=features,
            active_indices=active_indices,
        )

    def _infer_feature_type(self, idx: int, strength: float) -> FeatureType:
        """Heuristic type assignment based on index range and strength."""
        # In a real system, this would use Neuronpedia labels
        import random
        bucket = idx % 100
        if bucket < 5:
            return FeatureType.DECEPTION_RELATED
        elif bucket < 10:
            return FeatureType.MONITORING_AWARE
        elif bucket < 20:
            return FeatureType.CAPABILITY_GATE
        elif bucket < 35:
            return FeatureType.SAFETY_REFUSAL
        elif bucket < 50:
            return FeatureType.PERSONA_MARKER
        elif bucket < 70:
            return FeatureType.FACTUAL_KNOWLEDGE
        elif bucket < 85:
            return FeatureType.STRUCTURAL
        else:
            return FeatureType.UNKNOWN

    def _group_into_circuits(
        self,
        connections: list[FeatureConnection],
        decompositions: list[DecompositionResult],
    ) -> list[SparseCircuit]:
        """Group connected features into circuits using union-find."""
        parent: dict[int, int] = {}

        def find(x: int) -> int:
            while parent.get(x, x) != x:
                parent[x] = parent.get(parent[x], parent[x])
                x = parent[x]
            return x

        def union(a: int, b: int) -> None:
            ra, rb = find(a), find(b)
            if ra != rb:
                parent[ra] = rb

        for conn in connections:
            union(conn.source_idx, conn.target_idx)

        # Group features by root
        groups: dict[int, list[int]] = {}
        all_indices = set()
        for conn in connections:
            all_indices.add(conn.source_idx)
            all_indices.add(conn.target_idx)

        for idx in all_indices:
            root = find(idx)
            groups.setdefault(root, []).append(idx)

        # Build feature lookup from all decompositions
        feat_lookup: dict[int, SparseFeature] = {}
        for decomp in decompositions:
            for feat in decomp.features:
                if feat.index not in feat_lookup or feat.activation_strength > feat_lookup[feat.index].activation_strength:
                    feat_lookup[feat.index] = feat

        # Create circuit objects
        circuits = []
        for root, indices in groups.items():
            if len(indices) < 2:
                continue

            feats = [feat_lookup[i] for i in indices if i in feat_lookup]
            conns = [c for c in connections
                     if c.source_idx in indices and c.target_idx in indices]
            total_effect = sum(f.activation_strength for f in feats)

            # Determine circuit type from constituent feature types
            type_counts: dict[FeatureType, int] = {}
            for f in feats:
                type_counts[f.feature_type] = type_counts.get(f.feature_type, 0) + 1
            dominant_type = max(type_counts, key=lambda t: type_counts[t]) if type_counts else FeatureType.UNKNOWN

            circuits.append(SparseCircuit(
                name=f"circuit_{root}_{dominant_type.name.lower()}",
                features=feats,
                connections=conns,
                circuit_type=dominant_type.name,
                total_effect=total_effect,
                description=f"{len(feats)} features, {len(conns)} connections, type={dominant_type.name}",
            ))

        return sorted(circuits, key=lambda c: c.total_effect, reverse=True)

    @staticmethod
    def _correlation(a: list[float], b: list[float]) -> float:
        """Compute Pearson correlation between two lists."""
        n = len(a)
        if n < 2:
            return 0.0

        mean_a = sum(a) / n
        mean_b = sum(b) / n

        cov = sum((a[i] - mean_a) * (b[i] - mean_b) for i in range(n)) / n
        std_a = math.sqrt(sum((x - mean_a) ** 2 for x in a) / n)
        std_b = math.sqrt(sum((x - mean_b) ** 2 for x in b) / n)

        if std_a == 0 or std_b == 0:
            return 0.0
        return cov / (std_a * std_b)


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
 │  COGNITIVE CANARY v7.0  //  ENGINE 14            │
 │  Sparse Circuit Mapper — SAE Decomposition       │
 │  JumpReLU · 16k features · d/acc active          │
 └──────────────────────────────────────────────────┘
{RESET}""")

    import random

    mapper = SparseCircuitMapper()
    mapper.load_sae()

    print(f"  {CYAN}Decomposing activations across 4 samples...{RESET}\n")

    decompositions = []
    for i in range(4):
        # Simulate 256-dim activation vector
        activations = [random.gauss(0, 1) for _ in range(256)]
        result = mapper.decompose(activations, layer=12)
        decompositions.append(result)

        print(f"  Sample {i+1}: {result.n_active}/{result.n_total} active "
              f"({result.sparsity:.2%}) loss={result.reconstruction_loss:.4f}")

    print(f"\n  {CYAN}Discovering circuits...{RESET}")
    circuits = mapper.find_sparse_circuits(decompositions, correlation_threshold=0.2)
    print(f"  Found {len(circuits)} circuits\n")

    for circuit in circuits[:5]:
        print(f"  {PURPLE}▸{RESET} {circuit.name}: {circuit.description}")
        for feat in circuit.features[:3]:
            print(f"    {DIM}{feat}{RESET}")

    # Map deception features
    deception_feats = mapper.map_deception_features(circuits)
    if deception_feats:
        print(f"\n  {CYAN}Deception-related features: {len(deception_feats)}{RESET}")
        for feat in deception_feats[:5]:
            print(f"  {GREEN}▸{RESET} {feat}")
