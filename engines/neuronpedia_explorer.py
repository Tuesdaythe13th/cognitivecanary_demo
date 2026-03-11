"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v7.0  //  ENGINE 08                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   N E U R O N P E D I A   E X P L O R E R                                   ║
║                                                                              ║
║   Queries the Neuronpedia public API to retrieve, search, and visualise     ║
║   sparse autoencoder (SAE) features for transformer models.  Serves as      ║
║   the feature-discovery layer of the forensic pipeline — given a model      ║
║   and layer, it pulls feature metadata, max-activating examples, and        ║
║   activation histograms to identify candidate "deception features."         ║
║                                                                              ║
║   Workflow:                                                                  ║
║     1.  search_features("sycophancy")  → ranked feature list                ║
║     2.  get_feature(model, layer, idx) → full feature card                  ║
║     3.  get_max_activating_examples()  → dataset excerpts                   ║
║     4.  flag deception-correlated features for downstream probing           ║
║                                                                              ║
║   Theoretical basis:                                                         ║
║     Bricken et al. (2023) — Towards Monosemanticity, Anthropic              ║
║     Cunningham et al. (2023) — Sparse Autoencoders Find Interpretable       ║
║       Features in Language Models                                            ║
║     Templeton et al. (2024) — Scaling Monosemanticity, Anthropic            ║
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

import requests


# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────

NEURONPEDIA_API_BASE = "https://www.neuronpedia.org/api"

DEFAULT_MODEL = "gemma-2-2b"
DEFAULT_SAE_SET = "gemmascope-res-16k"


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

class FeatureCategory(Enum):
    """Broad semantic category for a discovered SAE feature."""
    DECEPTION       = auto()  # sycophancy, strategic refusal, persona-switching
    MONITORING      = auto()  # eval-awareness, test-detection, oversight signals
    CAPABILITY      = auto()  # task-specific competence features
    SAFETY          = auto()  # refusal, alignment, harmlessness circuits
    KNOWLEDGE       = auto()  # factual retrieval, world-model features
    SYNTAX          = auto()  # grammatical, formatting, structural
    UNCATEGORISED   = auto()


@dataclass
class SAEFeature:
    """A single SAE feature retrieved from Neuronpedia."""
    model:                str
    layer:                int
    index:                int
    description:          str = ""
    activation_density:   float = 0.0       # fraction of tokens that activate
    max_activation:       float = 0.0       # peak activation value observed
    monosemanticity:      float = 0.0       # 0-1 score (kurtosis-based)
    category:             FeatureCategory = FeatureCategory.UNCATEGORISED
    max_activating_texts: list[str] = field(default_factory=list)
    neuronpedia_url:      str = ""

    def __str__(self) -> str:
        return (
            f"Feature {self.model}/L{self.layer}/{self.index}: "
            f"{self.description or '(no description)'} "
            f"[density={self.activation_density:.4f}, "
            f"mono={self.monosemanticity:.2f}]"
        )


@dataclass
class FeatureSearchResult:
    """Result set from a Neuronpedia feature search."""
    query:    str
    model:    str
    features: list[SAEFeature] = field(default_factory=list)
    total:    int = 0
    elapsed:  float = 0.0


@dataclass
class DeceptionFeatureReport:
    """Aggregated report of deception-correlated features in a model."""
    model:              str
    layers_scanned:     list[int] = field(default_factory=list)
    deception_features: list[SAEFeature] = field(default_factory=list)
    monitoring_features: list[SAEFeature] = field(default_factory=list)
    total_features_scanned: int = 0
    deception_density:  float = 0.0   # fraction of features flagged


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class NeuronpediaExplorer:
    """
    Neuronpedia API client for SAE feature exploration.

    Architecture
    ────────────
    Wraps the Neuronpedia REST API to provide programmatic access to
    SAE feature metadata.  Features are cached in-memory after retrieval
    to avoid redundant API calls during a forensic session.

    Deception Pipeline Role
    ───────────────────────
    Engine 08 is the first stage of the forensic scope: given a target
    model and layer range, it identifies SAE features whose activation
    patterns correlate with deceptive or monitoring-aware behaviour.
    These features are passed downstream to the TransformerLens Probe
    (Engine 10) for causal validation and to the Sparse Circuit Mapper
    (Engine 14) for circuit-level analysis.
    """

    DECEPTION_KEYWORDS = [
        "sycophancy", "deception", "lying", "fabrication", "hallucination",
        "strategic", "persona", "pretend", "mislead", "confabulation",
        "sandbagging", "underperform", "refuse", "eval", "monitoring",
        "test", "oversight", "alignment", "safety", "harmful",
    ]

    def __init__(
        self,
        model: str = DEFAULT_MODEL,
        sae_set: str = DEFAULT_SAE_SET,
        api_base: str = NEURONPEDIA_API_BASE,
        timeout: float = 30.0,
    ) -> None:
        self._model    = model
        self._sae_set  = sae_set
        self._api_base = api_base.rstrip("/")
        self._timeout  = timeout
        self._session  = requests.Session()
        self._session.headers.update({
            "Accept": "application/json",
            "User-Agent": "CognitiveCanary/7.0 NeuronpediaExplorer",
        })
        self._cache: dict[str, SAEFeature] = {}

    # ── public API ────────────────────────────────────────────────────────────

    def search_features(
        self,
        query: str,
        model: str | None = None,
        top_k: int = 20,
    ) -> FeatureSearchResult:
        """
        Search Neuronpedia for SAE features matching a semantic query.

        Uses the /search endpoint to find features whose descriptions
        or max-activating examples match the query string.
        """
        t0 = time.perf_counter()
        target_model = model or self._model

        try:
            resp = self._session.post(
                f"{self._api_base}/search-all",
                json={
                    "search": query,
                    "modelId": target_model,
                },
                timeout=self._timeout,
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as exc:
            return FeatureSearchResult(
                query=query, model=target_model,
                elapsed=time.perf_counter() - t0,
            )

        features = []
        results = data if isinstance(data, list) else data.get("results", [])
        for item in results[:top_k]:
            feat = self._parse_feature(item, target_model)
            self._cache[f"{feat.model}/L{feat.layer}/{feat.index}"] = feat
            features.append(feat)

        return FeatureSearchResult(
            query=query,
            model=target_model,
            features=features,
            total=len(results),
            elapsed=time.perf_counter() - t0,
        )

    def get_feature(
        self,
        model: str | None = None,
        layer: int = 0,
        index: int = 0,
    ) -> SAEFeature:
        """
        Retrieve a single SAE feature by model/layer/index.

        Checks the local cache first, then falls back to the API.
        """
        target_model = model or self._model
        cache_key = f"{target_model}/L{layer}/{index}"

        if cache_key in self._cache:
            return self._cache[cache_key]

        try:
            resp = self._session.get(
                f"{self._api_base}/feature/{target_model}/{layer}/{index}",
                timeout=self._timeout,
            )
            resp.raise_for_status()
            data = resp.json()
            feat = self._parse_feature(data, target_model)
        except requests.RequestException:
            feat = SAEFeature(model=target_model, layer=layer, index=index)

        self._cache[cache_key] = feat
        return feat

    def get_max_activating_examples(
        self,
        model: str | None = None,
        layer: int = 0,
        index: int = 0,
        top_k: int = 10,
    ) -> list[str]:
        """
        Retrieve the top-k max-activating text examples for a feature.
        """
        feat = self.get_feature(model, layer, index)
        if feat.max_activating_texts:
            return feat.max_activating_texts[:top_k]

        try:
            resp = self._session.get(
                f"{self._api_base}/feature/{feat.model}/{layer}/{index}",
                params={"includeExamples": "true"},
                timeout=self._timeout,
            )
            resp.raise_for_status()
            data = resp.json()
            examples = []
            for ex in data.get("activations", [])[:top_k]:
                tokens = ex.get("tokens", [])
                text = "".join(t.get("token", "") for t in tokens) if tokens else ""
                if text:
                    examples.append(text)
            feat.max_activating_texts = examples
            return examples
        except requests.RequestException:
            return []

    def scan_for_deception_features(
        self,
        layers: list[int] | None = None,
        model: str | None = None,
    ) -> DeceptionFeatureReport:
        """
        Scan a model for SAE features correlated with deception/monitoring.

        Queries Neuronpedia for each keyword in DECEPTION_KEYWORDS and
        aggregates the results into a DeceptionFeatureReport.
        """
        target_model = model or self._model
        scan_layers = layers or list(range(0, 26))

        deception_feats: list[SAEFeature] = []
        monitoring_feats: list[SAEFeature] = []
        seen_keys: set[str] = set()
        total_scanned = 0

        for keyword in self.DECEPTION_KEYWORDS:
            result = self.search_features(keyword, target_model, top_k=10)
            total_scanned += result.total
            for feat in result.features:
                key = f"{feat.model}/L{feat.layer}/{feat.index}"
                if key in seen_keys:
                    continue
                seen_keys.add(key)

                if feat.layer not in scan_layers:
                    continue

                if feat.category == FeatureCategory.DECEPTION:
                    deception_feats.append(feat)
                elif feat.category == FeatureCategory.MONITORING:
                    monitoring_feats.append(feat)

        density = len(deception_feats) / max(total_scanned, 1)

        return DeceptionFeatureReport(
            model=target_model,
            layers_scanned=scan_layers,
            deception_features=deception_feats,
            monitoring_features=monitoring_feats,
            total_features_scanned=total_scanned,
            deception_density=density,
        )

    def visualize_feature_activation(
        self,
        model: str | None = None,
        layer: int = 0,
        index: int = 0,
    ) -> str:
        """
        Return an ASCII visualization of a feature's activation histogram.
        """
        feat = self.get_feature(model, layer, index)
        lines = [
            f"Feature {feat.model}/L{feat.layer}/{feat.index}",
            f"  Description: {feat.description or '(none)'}",
            f"  Density:     {feat.activation_density:.4f}",
            f"  Max Act:     {feat.max_activation:.2f}",
            f"  Mono Score:  {feat.monosemanticity:.2f}",
            f"  Category:    {feat.category.name}",
            f"  URL:         {feat.neuronpedia_url or '(not available)'}",
            "",
        ]
        if feat.max_activating_texts:
            lines.append("  Max-Activating Examples:")
            for i, text in enumerate(feat.max_activating_texts[:5], 1):
                lines.append(f"    [{i}] {text[:120]}")
        return "\n".join(lines)

    # ── internals ─────────────────────────────────────────────────────────────

    def _parse_feature(self, data: dict[str, Any], model: str) -> SAEFeature:
        """Parse a Neuronpedia API response into an SAEFeature."""
        layer = data.get("layer", data.get("layer_index", 0))
        index = data.get("index", data.get("feature_index", 0))
        description = data.get("description", data.get("explanationModelName", ""))

        # Extract activation statistics
        density = data.get("frac_nonzero", data.get("density", 0.0))
        max_act = data.get("max_activation", 0.0)

        # Parse max-activating examples if present
        examples = []
        for ex in data.get("activations", [])[:10]:
            tokens = ex.get("tokens", [])
            text = "".join(t.get("token", "") for t in tokens) if tokens else ""
            if text:
                examples.append(text)

        # Categorise the feature based on description keywords
        category = self._categorise_feature(description)

        # Estimate monosemanticity from kurtosis if available
        mono = data.get("monosemanticity", 0.0)
        if not mono and density > 0:
            mono = min(1.0, (1.0 - density) * 1.2)

        url = f"https://www.neuronpedia.org/{model}/{layer}/{index}"

        return SAEFeature(
            model=model,
            layer=int(layer),
            index=int(index),
            description=str(description),
            activation_density=float(density),
            max_activation=float(max_act),
            monosemanticity=float(mono),
            category=category,
            max_activating_texts=examples,
            neuronpedia_url=url,
        )

    def _categorise_feature(self, description: str) -> FeatureCategory:
        """Assign a semantic category based on the feature description."""
        desc_lower = description.lower()
        deception_terms = {"sycoph", "decep", "lying", "fabricat", "mislead",
                          "confabul", "sandbag", "pretend", "persona"}
        monitoring_terms = {"eval", "monitor", "test", "oversight", "aware",
                          "detect", "check", "assess"}
        safety_terms = {"refus", "harmful", "unsafe", "align", "safe"}
        capability_terms = {"code", "math", "reason", "solv", "implement"}

        for term in deception_terms:
            if term in desc_lower:
                return FeatureCategory.DECEPTION
        for term in monitoring_terms:
            if term in desc_lower:
                return FeatureCategory.MONITORING
        for term in safety_terms:
            if term in desc_lower:
                return FeatureCategory.SAFETY
        for term in capability_terms:
            if term in desc_lower:
                return FeatureCategory.CAPABILITY
        return FeatureCategory.UNCATEGORISED


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    RESET  = "\033[0m"
    GREEN  = "\033[38;2;0;255;65m"
    CYAN   = "\033[38;2;0;200;180m"
    DIM    = "\033[2m"
    BOLD   = "\033[1m"

    print(f"""
{GREEN}{BOLD}
 ┌──────────────────────────────────────────────────┐
 │  COGNITIVE CANARY v7.0  //  ENGINE 08            │
 │  Neuronpedia Explorer — SAE Feature Discovery    │
 │  Deception Feature Scanning  ·  d/acc active     │
 └──────────────────────────────────────────────────┘
{RESET}""")

    explorer = NeuronpediaExplorer()

    print(f"  {CYAN}Searching for deception-correlated features...{RESET}")
    result = explorer.search_features("sycophancy")
    print(f"  {DIM}Query: '{result.query}' → {result.total} results "
          f"({result.elapsed:.2f}s){RESET}")

    for feat in result.features[:5]:
        print(f"  {GREEN}▸{RESET} {feat}")

    print(f"\n  {CYAN}Scanning for monitoring-awareness features...{RESET}")
    result2 = explorer.search_features("evaluation awareness")
    print(f"  {DIM}Query: '{result2.query}' → {result2.total} results "
          f"({result2.elapsed:.2f}s){RESET}")

    for feat in result2.features[:5]:
        print(f"  {GREEN}▸{RESET} {feat}")
