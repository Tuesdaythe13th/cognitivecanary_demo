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
║     • JumpReLU SAE with learnable per-feature threshold                    ║
║     • L1-penalised reconstruction for sparsity                              ║
║     • Union-find circuit discovery over feature co-activations             ║
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
import random
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Any, List, Optional

try:
    import torch
    import torch.nn as nn

    TORCH_AVAILABLE = True
except Exception:
    TORCH_AVAILABLE = False
    torch = None  # type: ignore[assignment]
    nn = None  # type: ignore[assignment]

try:
    import safetensors  # noqa: F401

    SAFETENSORS_AVAILABLE = True
except Exception:
    SAFETENSORS_AVAILABLE = False


# ─────────────────────────────────────────────────────────────────────────────
# Enums
# ─────────────────────────────────────────────────────────────────────────────


class FeatureType(Enum):
    """Semantic classification of a discovered SAE feature."""

    SYNTACTIC = auto()
    SEMANTIC = auto()
    BEHAVIORAL = auto()
    DECEPTION_CORRELATED = auto()
    MONITORING_RELATED = auto()
    UNKNOWN = auto()


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────


@dataclass
class SAEConfig:
    """Configuration for a JumpReLU sparse autoencoder."""

    d_model: int = 768
    n_features: int = 16384
    threshold: float = 0.01


@dataclass
class SparseFeature:
    """A single feature discovered in the SAE dictionary."""

    index: int
    activation: float
    feature_type: FeatureType
    description: str = ""

    def __str__(self) -> str:
        return (
            f"Feature[{self.index:05d}] "
            f"act={self.activation:.4f} "
            f"type={self.feature_type.name}"
            + (f"  {self.description}" if self.description else "")
        )


@dataclass
class FeatureConnection:
    """An edge between two features in a co-activation graph."""

    source_idx: int
    target_idx: int
    correlation: float
    is_circuit: bool


@dataclass
class SparseCircuit:
    """A group of co-activated features forming a functional circuit."""

    features: list[SparseFeature] = field(default_factory=list)
    connections: list[FeatureConnection] = field(default_factory=list)
    circuit_id: int = 0
    description: str = ""

    def __str__(self) -> str:
        return (
            f"Circuit[{self.circuit_id}] "
            f"{len(self.features)} features, "
            f"{len(self.connections)} connections"
            + (f"  {self.description}" if self.description else "")
        )


@dataclass
class DecompositionResult:
    """Result of decomposing activations through the SAE."""

    n_active: int
    n_total: int
    sparsity: float
    top_features: list[SparseFeature] = field(default_factory=list)
    reconstruction_loss: float = 0.0

    def __str__(self) -> str:
        return (
            f"Decomposition: {self.n_active}/{self.n_total} active "
            f"({self.sparsity:.2%}), loss={self.reconstruction_loss:.5f}"
        )


# ─────────────────────────────────────────────────────────────────────────────
# JumpReLU SAE model
# ─────────────────────────────────────────────────────────────────────────────

if TORCH_AVAILABLE:

    class JumpReLUSAE(nn.Module):
        """
        JumpReLU Sparse Autoencoder.

        Encodes dense activations into a sparse feature representation using a
        learned dictionary.  The JumpReLU activation zeros out any pre-activation
        that falls below a learnable per-feature threshold, producing genuinely
        sparse codes without the bias-toward-zero artefact of standard ReLU SAEs.

        Architecture
        ────────────
            encoder : Linear(d_model -> n_features)
            decoder : Linear(n_features -> d_model)
            threshold : Parameter(n_features)  — learnable per-feature gate

        Forward pass
        ────────────
            pre_act = encoder(x)
            active_mask = (pre_act > threshold)
            features = ReLU(pre_act) * active_mask     # JumpReLU
            reconstructed = decoder(features)
            return (reconstructed, features, active_mask)
        """

        def __init__(self, config: SAEConfig) -> None:
            super().__init__()
            self.config = config
            self.encoder = nn.Linear(config.d_model, config.n_features, bias=True)
            self.decoder = nn.Linear(config.n_features, config.d_model, bias=True)
            self.threshold = nn.Parameter(
                torch.ones(config.n_features) * config.threshold
            )

            # Initialise decoder columns to unit norm
            with torch.no_grad():
                self.decoder.weight.div_(
                    self.decoder.weight.norm(dim=0, keepdim=True).clamp(min=1e-8)
                )

        def encode(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
            """Encode input to sparse features with JumpReLU gating."""
            pre_act = self.encoder(x)
            active_mask = (pre_act > self.threshold).float()
            features = torch.relu(pre_act) * active_mask
            return features, active_mask

        def decode(self, features: torch.Tensor) -> torch.Tensor:
            """Decode sparse features back to input space."""
            return self.decoder(features)

        def forward(
            self, x: torch.Tensor
        ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
            """
            Full forward pass.

            Parameters
            ----------
            x : Tensor of shape (batch, d_model)

            Returns
            -------
            reconstructed : Tensor of shape (batch, d_model)
            features      : Tensor of shape (batch, n_features)
            active_mask   : Tensor of shape (batch, n_features), binary
            """
            features, active_mask = self.encode(x)
            reconstructed = self.decode(features)
            return reconstructed, features, active_mask

else:
    # ── Fallback: plain-Python JumpReLU SAE (no torch) ────────────────────────

    class JumpReLUSAE:  # type: ignore[no-redef]
        """
        JumpReLU SAE stub for environments without PyTorch.

        Simulates the forward pass with random projections so that the
        rest of the pipeline can operate in demo / CI mode.
        """

        def __init__(self, config: SAEConfig) -> None:
            self.config = config
            # Random projection matrices (seed for reproducibility per instance)
            self._rng = random.Random(42)
            self._threshold = config.threshold

        def forward(
            self, x: list[float]
        ) -> tuple[list[float], list[float], list[bool]]:
            """
            Simulate the SAE forward pass.

            Parameters
            ----------
            x : list of floats with length d_model

            Returns
            -------
            reconstructed : list[float]
            features      : list[float]
            active_mask   : list[bool]
            """
            d = self.config.d_model
            n = self.config.n_features

            # Pad / truncate input
            if len(x) < d:
                x = x + [0.0] * (d - len(x))
            elif len(x) > d:
                x = x[:d]

            # Simulate encoding via random projection
            features: list[float] = []
            active_mask: list[bool] = []
            input_norm = math.sqrt(sum(v * v for v in x) + 1e-12)

            for i in range(n):
                # Deterministic pseudo-projection
                self._rng.seed(i * 31 + 7)
                proj = sum(
                    x[j] * self._rng.gauss(0, 1.0 / math.sqrt(d))
                    for j in range(min(d, 64))
                )
                pre_act = proj / (input_norm + 1e-8)
                if pre_act > self._threshold:
                    features.append(pre_act)
                    active_mask.append(True)
                else:
                    features.append(0.0)
                    active_mask.append(False)

            # Simulate reconstruction (identity-ish)
            reconstructed = list(x)
            return reconstructed, features, active_mask


# ─────────────────────────────────────────────────────────────────────────────
# Union-Find for circuit grouping
# ─────────────────────────────────────────────────────────────────────────────


class _UnionFind:
    """Disjoint-set / union-find with path compression and union by rank."""

    def __init__(self) -> None:
        self._parent: dict[int, int] = {}
        self._rank: dict[int, int] = {}

    def find(self, x: int) -> int:
        """Find root representative with path compression."""
        if x not in self._parent:
            self._parent[x] = x
            self._rank[x] = 0
        while self._parent[x] != x:
            # Path compression (halving)
            self._parent[x] = self._parent.get(
                self._parent[x], self._parent[x]
            )
            x = self._parent[x]
        return x

    def union(self, a: int, b: int) -> None:
        """Merge the sets containing *a* and *b* by rank."""
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        # Union by rank
        if self._rank[ra] < self._rank[rb]:
            ra, rb = rb, ra
        self._parent[rb] = ra
        if self._rank[ra] == self._rank[rb]:
            self._rank[ra] += 1

    def groups(self, elements: set[int]) -> dict[int, list[int]]:
        """Return {root: [members]} for the given element set."""
        result: dict[int, list[int]] = {}
        for e in elements:
            root = self.find(e)
            result.setdefault(root, []).append(e)
        return result


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

    # ── public API ────────────────────────────────────────────────────────────

    def load_sae(
        self,
        model: str = "gpt2",
        layer: int = 6,
    ) -> JumpReLUSAE:
        """
        Create or load a JumpReLU SAE for the specified model and layer.

        In production this would load pre-trained weights from a
        safetensors checkpoint.  For demonstration it initialises
        a fresh SAE (random weights if torch is available, stub
        otherwise).

        Parameters
        ----------
        model : str
            Target language model identifier (e.g. ``"gpt2"``,
            ``"gemma-2-2b"``).
        layer : int
            Transformer layer whose residual stream the SAE was
            trained on.

        Returns
        -------
        JumpReLUSAE
            The loaded (or freshly initialised) SAE instance.
        """
        self._sae = JumpReLUSAE(self._config)
        self._loaded = True
        return self._sae

    def decompose(
        self,
        activations: list[float],
    ) -> DecompositionResult:
        """
        Run activations through the SAE and return the sparse decomposition.

        If the SAE has not yet been loaded via :meth:`load_sae`, a fresh
        one is created automatically.

        Parameters
        ----------
        activations : list[float]
            Dense activation vector (typically from a transformer
            residual stream at a single token position).

        Returns
        -------
        DecompositionResult
        """
        if not self._loaded:
            self.load_sae()

        if TORCH_AVAILABLE:
            return self._torch_decompose(activations)
        else:
            return self._simulated_decompose(activations)

    def find_sparse_circuits(
        self,
        features: list[SparseFeature],
        threshold: float = 0.3,
    ) -> list[SparseCircuit]:
        """
        Discover circuits by grouping co-activated features.

        Builds a pairwise co-activation correlation matrix across the
        provided features, then groups features whose correlation
        exceeds *threshold* using union-find.

        Parameters
        ----------
        features : list[SparseFeature]
            Features to analyse (typically the ``top_features`` from
            several :class:`DecompositionResult` instances).
        threshold : float
            Minimum absolute correlation to consider two features
            as connected.

        Returns
        -------
        list[SparseCircuit]
            Discovered circuits, sorted by total activation strength.
        """
        if len(features) < 2:
            return []

        # Build synthetic co-activation signals from activation values
        # (In production these would come from activation logs across a
        # dataset; here we simulate from the feature activations.)
        n = len(features)
        connections: list[FeatureConnection] = []
        uf = _UnionFind()

        for i in range(n):
            for j in range(i + 1, n):
                fi, fj = features[i], features[j]
                corr = self._coactivation_correlation(fi, fj)
                if abs(corr) >= threshold:
                    connections.append(
                        FeatureConnection(
                            source_idx=fi.index,
                            target_idx=fj.index,
                            correlation=corr,
                            is_circuit=True,
                        )
                    )
                    uf.union(fi.index, fj.index)

        # Collect all feature indices that participate in a connection
        connected_indices: set[int] = set()
        for conn in connections:
            connected_indices.add(conn.source_idx)
            connected_indices.add(conn.target_idx)

        if not connected_indices:
            return []

        # Group into circuits via union-find
        groups = uf.groups(connected_indices)

        # Build lookup: index -> SparseFeature
        feat_lookup: dict[int, SparseFeature] = {f.index: f for f in features}

        circuits: list[SparseCircuit] = []
        for circuit_id_counter, (root, member_indices) in enumerate(
            groups.items()
        ):
            if len(member_indices) < 2:
                continue

            member_set = set(member_indices)
            circuit_features = [
                feat_lookup[idx]
                for idx in member_indices
                if idx in feat_lookup
            ]
            circuit_connections = [
                c
                for c in connections
                if c.source_idx in member_set and c.target_idx in member_set
            ]

            # Determine dominant type
            type_counts: dict[FeatureType, int] = {}
            for f in circuit_features:
                type_counts[f.feature_type] = (
                    type_counts.get(f.feature_type, 0) + 1
                )
            dominant = (
                max(type_counts, key=lambda t: type_counts[t])
                if type_counts
                else FeatureType.UNKNOWN
            )

            circuits.append(
                SparseCircuit(
                    features=circuit_features,
                    connections=circuit_connections,
                    circuit_id=circuit_id_counter,
                    description=(
                        f"{len(circuit_features)} features, "
                        f"{len(circuit_connections)} connections, "
                        f"dominant_type={dominant.name}"
                    ),
                )
            )

        # Sort by total activation strength (descending)
        circuits.sort(
            key=lambda c: sum(f.activation for f in c.features),
            reverse=True,
        )
        return circuits

    def compute_monosemanticity(
        self,
        feature_activations: list[list[float]],
    ) -> float:
        """
        Score how monosemantic a set of features are (0 to 1).

        Uses excess kurtosis: a monosemantic feature activates strongly
        in very few contexts, producing a heavy-tailed (high-kurtosis)
        distribution of activations.  The score averages the normalised
        kurtosis across all provided feature activation vectors.

        Parameters
        ----------
        feature_activations : list[list[float]]
            Each inner list contains activation values for one feature
            across a dataset of inputs.

        Returns
        -------
        float
            Average monosemanticity score in ``[0, 1]``.
        """
        if not feature_activations:
            return 0.0

        kurtosis_scores: list[float] = []

        for values in feature_activations:
            n = len(values)
            if n < 4:
                kurtosis_scores.append(0.0)
                continue

            mean = sum(values) / n
            variance = sum((x - mean) ** 2 for x in values) / n
            if variance < 1e-12:
                kurtosis_scores.append(0.0)
                continue

            # Excess kurtosis (Fisher definition)
            fourth_moment = sum((x - mean) ** 4 for x in values) / n
            kurtosis = (fourth_moment / (variance ** 2)) - 3.0

            # Normalise to [0, 1]: kurtosis > ~6 is highly monosemantic
            normalised = min(1.0, max(0.0, kurtosis / 10.0))
            kurtosis_scores.append(normalised)

        return sum(kurtosis_scores) / len(kurtosis_scores)

    def map_deception_features(
        self,
        circuits: list[SparseCircuit],
    ) -> list[SparseFeature]:
        """
        Filter circuits for features correlated with deception.

        Returns all features whose ``feature_type`` is
        ``DECEPTION_CORRELATED`` or ``MONITORING_RELATED``, sorted
        by activation strength (descending).

        Parameters
        ----------
        circuits : list[SparseCircuit]
            Circuits discovered by :meth:`find_sparse_circuits`.

        Returns
        -------
        list[SparseFeature]
            Deception-correlated features, strongest first.
        """
        deception_types = {
            FeatureType.DECEPTION_CORRELATED,
            FeatureType.MONITORING_RELATED,
        }
        deception_features: list[SparseFeature] = []

        for circuit in circuits:
            for feat in circuit.features:
                if feat.feature_type in deception_types:
                    deception_features.append(feat)

        # Deduplicate by index, keeping the highest activation
        seen: dict[int, SparseFeature] = {}
        for feat in deception_features:
            if (
                feat.index not in seen
                or feat.activation > seen[feat.index].activation
            ):
                seen[feat.index] = feat

        return sorted(seen.values(), key=lambda f: f.activation, reverse=True)

    # ── internals ─────────────────────────────────────────────────────────────

    def _torch_decompose(
        self, activations: list[float]
    ) -> DecompositionResult:
        """Decompose using the real PyTorch SAE."""
        x = torch.tensor(activations, dtype=torch.float32).unsqueeze(0)

        # Pad or truncate to SAE input dimension
        d = self._config.d_model
        if x.shape[1] < d:
            x = torch.nn.functional.pad(x, (0, d - x.shape[1]))
        elif x.shape[1] > d:
            x = x[:, :d]

        with torch.no_grad():
            reconstructed, features, active_mask = self._sae(x)
            loss = torch.nn.functional.mse_loss(reconstructed, x).item()

        feat_vals = features[0].numpy()
        mask_vals = active_mask[0].numpy()

        active_indices = [
            i for i in range(len(feat_vals)) if mask_vals[i] > 0.5
        ]
        sparse_features = []
        for idx in active_indices:
            sparse_features.append(
                SparseFeature(
                    index=idx,
                    activation=float(feat_vals[idx]),
                    feature_type=self._classify_feature(idx),
                )
            )

        sparse_features.sort(key=lambda f: f.activation, reverse=True)

        n_total = self._config.n_features
        n_active = len(active_indices)

        return DecompositionResult(
            n_active=n_active,
            n_total=n_total,
            sparsity=n_active / n_total if n_total else 0.0,
            top_features=sparse_features[:50],
            reconstruction_loss=loss,
        )

    def _simulated_decompose(
        self, activations: list[float]
    ) -> DecompositionResult:
        """Simulate SAE decomposition without torch."""
        n_total = self._config.n_features

        # Simulate ~2-5% sparsity (typical for a well-trained SAE)
        n_active = random.randint(
            max(1, int(n_total * 0.02)), int(n_total * 0.05)
        )
        active_indices = sorted(random.sample(range(n_total), n_active))

        # Derive activation magnitudes from the input signal energy
        input_energy = math.sqrt(
            sum(v * v for v in activations) / (len(activations) or 1)
        )

        sparse_features: list[SparseFeature] = []
        for idx in active_indices:
            # Log-normal activation strengths
            strength = random.lognormvariate(
                math.log(input_energy + 0.1) - 1.0, 1.0
            )
            sparse_features.append(
                SparseFeature(
                    index=idx,
                    activation=strength,
                    feature_type=self._classify_feature(idx),
                )
            )

        sparse_features.sort(key=lambda f: f.activation, reverse=True)

        # Simulated reconstruction loss
        loss = random.uniform(0.001, 0.04)

        return DecompositionResult(
            n_active=n_active,
            n_total=n_total,
            sparsity=n_active / n_total,
            top_features=sparse_features[:50],
            reconstruction_loss=loss,
        )

    def _classify_feature(self, idx: int) -> FeatureType:
        """
        Heuristic feature-type assignment based on index.

        In production this would use Neuronpedia labels or learned
        classifiers; here we partition by index range.
        """
        bucket = idx % 100
        if bucket < 5:
            return FeatureType.DECEPTION_CORRELATED
        elif bucket < 12:
            return FeatureType.MONITORING_RELATED
        elif bucket < 30:
            return FeatureType.BEHAVIORAL
        elif bucket < 55:
            return FeatureType.SEMANTIC
        elif bucket < 80:
            return FeatureType.SYNTACTIC
        else:
            return FeatureType.UNKNOWN

    def _coactivation_correlation(
        self, a: SparseFeature, b: SparseFeature
    ) -> float:
        """
        Estimate co-activation correlation between two features.

        In production this would be computed across a large activation
        dataset.  For demonstration we derive a deterministic
        pseudo-correlation from the feature indices and activations.
        """
        # Deterministic seed from pair of indices
        rng = random.Random(a.index * 10007 + b.index * 31)

        # Features of the same type are more likely to correlate
        type_bonus = 0.25 if a.feature_type == b.feature_type else 0.0

        # Close index proximity suggests related features
        proximity = 1.0 / (1.0 + abs(a.index - b.index) / 100.0)

        base = rng.gauss(0.0, 0.3) + type_bonus * 0.4 + proximity * 0.15
        return max(-1.0, min(1.0, base))

    @staticmethod
    def _pearson_correlation(a: list[float], b: list[float]) -> float:
        """Compute Pearson correlation between two equal-length lists."""
        n = len(a)
        if n < 2:
            return 0.0

        mean_a = sum(a) / n
        mean_b = sum(b) / n

        cov = sum((a[i] - mean_a) * (b[i] - mean_b) for i in range(n)) / n
        std_a = math.sqrt(sum((x - mean_a) ** 2 for x in a) / n)
        std_b = math.sqrt(sum((x - mean_b) ** 2 for x in b) / n)

        if std_a < 1e-12 or std_b < 1e-12:
            return 0.0
        return cov / (std_a * std_b)


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    RESET = "\033[0m"
    GREEN = "\033[38;2;0;255;65m"
    CYAN = "\033[38;2;0;200;180m"
    PURPLE = "\033[38;2;180;100;255m"
    DIM = "\033[2m"
    BOLD = "\033[1m"

    print(
        f"""
{GREEN}{BOLD}
 ┌──────────────────────────────────────────────────┐
 │  COGNITIVE CANARY v7.0  //  ENGINE 14            │
 │  Sparse Circuit Mapper — SAE Decomposition       │
 │  JumpReLU · 16k features · d/acc active          │
 └──────────────────────────────────────────────────┘
{RESET}"""
    )

    # ── 1. Initialise mapper and load SAE ─────────────────────────────────
    config = SAEConfig(d_model=256, n_features=4096, threshold=0.01)
    mapper = SparseCircuitMapper(config=config)
    sae = mapper.load_sae(model="gpt2", layer=6)
    print(f"  {CYAN}SAE loaded (torch={'yes' if TORCH_AVAILABLE else 'no'}){RESET}")
    print(f"  {DIM}d_model={config.d_model}, n_features={config.n_features}{RESET}\n")

    # ── 2. Decompose several activation vectors ──────────────────────────
    print(f"  {CYAN}Decomposing activations across 6 samples...{RESET}\n")

    all_features: list[SparseFeature] = []
    for sample_idx in range(6):
        activations = [random.gauss(0, 1) for _ in range(config.d_model)]
        result = mapper.decompose(activations)
        all_features.extend(result.top_features)

        print(
            f"  Sample {sample_idx + 1}: "
            f"{result.n_active}/{result.n_total} active "
            f"({result.sparsity:.2%})  "
            f"loss={result.reconstruction_loss:.5f}"
        )

    # ── 3. Discover circuits ─────────────────────────────────────────────
    print(f"\n  {CYAN}Discovering circuits (threshold=0.3)...{RESET}")
    circuits = mapper.find_sparse_circuits(all_features, threshold=0.3)
    print(f"  Found {len(circuits)} circuit(s)\n")

    for circ in circuits[:5]:
        print(f"  {PURPLE}>{RESET} {circ}")
        for feat in circ.features[:3]:
            print(f"    {DIM}{feat}{RESET}")

    # ── 4. Monosemanticity score ─────────────────────────────────────────
    print(f"\n  {CYAN}Computing monosemanticity...{RESET}")
    fake_activations = [
        [random.expovariate(1.0) if random.random() < 0.05 else 0.0 for _ in range(200)]
        for _ in range(20)
    ]
    mono_score = mapper.compute_monosemanticity(fake_activations)
    print(f"  Monosemanticity score: {mono_score:.3f}")

    # ── 5. Map deception features ────────────────────────────────────────
    deception_feats = mapper.map_deception_features(circuits)
    if deception_feats:
        print(f"\n  {CYAN}Deception-correlated features: {len(deception_feats)}{RESET}")
        for feat in deception_feats[:8]:
            print(f"  {GREEN}>{RESET} {feat}")
    else:
        print(f"\n  {DIM}No deception-correlated features found in circuits.{RESET}")

    print(f"\n  {DIM}Engine 14 demo complete.{RESET}\n")
