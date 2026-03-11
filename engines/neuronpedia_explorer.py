"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   COGNITIVE CANARY v7.0  //  ENGINE 08                                       ║
║   ─────────────────────────────────────────────────────────────────────────  ║
║   N E U R O N P E D I A   E X P L O R E R                                   ║
║                                                                              ║
║   Wraps the Neuronpedia public API to retrieve, search, and visualise       ║
║   sparse autoencoder (SAE) feature metadata for transformer models.         ║
║   Serves as the feature-discovery layer of the forensic pipeline — given    ║
║   a model and layer, it pulls feature descriptions, max-activating          ║
║   examples, and activation statistics to identify candidate "deception      ║
║   features" for downstream causal probing.                                  ║
║                                                                              ║
║   Workflow:                                                                  ║
║     1.  search_features("sycophancy")        → ranked feature list          ║
║     2.  get_feature(model, layer, idx)       → full feature card            ║
║     3.  get_max_activating_examples(...)     → dataset excerpts             ║
║     4.  scan_for_deception_features(...)     → deception-correlated report  ║
║     5.  visualize_feature_activation(feat)   → ASCII activation histogram   ║
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

import re
import time
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Any, Optional

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False


# ─────────────────────────────────────────────────────────────────────────────
# Feature taxonomy
# ─────────────────────────────────────────────────────────────────────────────

class FeatureCategory(Enum):
    """Broad semantic category assigned to an SAE feature."""
    SYNTACTIC      = auto()   # grammar, formatting, punctuation, structure
    SEMANTIC       = auto()   # meaning, concepts, factual knowledge
    BEHAVIORAL     = auto()   # action patterns, response strategies
    DECEPTION      = auto()   # sycophancy, lying, fabrication, persona-switching
    META_COGNITIVE = auto()   # self-awareness, eval-detection, monitoring signals
    PERSONA        = auto()   # identity, character maintenance, role consistency
    UNKNOWN        = auto()


# ─────────────────────────────────────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class SAEFeature:
    """A single SAE feature retrieved from or modelled after Neuronpedia."""
    model:           str
    layer:           int
    index:           int
    description:     str = ""
    max_activation:  float = 0.0
    top_tokens:      list[str] = field(default_factory=list)
    category:        FeatureCategory = FeatureCategory.UNKNOWN

    def __str__(self) -> str:
        cat_label = self.category.name.lower().replace("_", "-")
        tokens_preview = ", ".join(self.top_tokens[:5]) if self.top_tokens else "(none)"
        return (
            f"Feature {self.model}/L{self.layer}/{self.index}: "
            f"{self.description or '(no description)'} "
            f"[max_act={self.max_activation:.2f}, cat={cat_label}, "
            f"tokens={tokens_preview}]"
        )


@dataclass
class FeatureSearchResult:
    """Result set from a Neuronpedia feature search."""
    query:       str
    features:    list[SAEFeature] = field(default_factory=list)
    total_count: int = 0


@dataclass
class DeceptionFeatureReport:
    """Aggregated report of deception-correlated features in a model."""
    model:              str
    total_scanned:      int = 0
    deception_features: list[SAEFeature] = field(default_factory=list)
    categories:         dict[str, int] = field(default_factory=dict)


# ─────────────────────────────────────────────────────────────────────────────
# Simulated / placeholder data
# ─────────────────────────────────────────────────────────────────────────────

_SIMULATED_FEATURES: list[dict[str, Any]] = [
    {
        "layer": 5, "index": 3291,
        "description": "sycophantic agreement with user claims",
        "max_activation": 8.42,
        "top_tokens": ["Yes", "agree", "right", "correct", "exactly"],
    },
    {
        "layer": 8, "index": 7104,
        "description": "lying or fabricating factual claims",
        "max_activation": 6.17,
        "top_tokens": ["actually", "fact", "definitely", "certainly", "indeed"],
    },
    {
        "layer": 11, "index": 1560,
        "description": "monitoring detection and eval-awareness signals",
        "max_activation": 5.89,
        "top_tokens": ["test", "evaluate", "assessment", "benchmark", "score"],
    },
    {
        "layer": 3, "index": 9912,
        "description": "syntactic clause boundary markers",
        "max_activation": 12.33,
        "top_tokens": [",", ";", "that", "which", "where"],
    },
    {
        "layer": 6, "index": 4481,
        "description": "persona maintenance and character consistency",
        "max_activation": 4.75,
        "top_tokens": ["I", "my", "me", "myself", "personality"],
    },
    {
        "layer": 9, "index": 2208,
        "description": "deception strategy and strategic misdirection",
        "max_activation": 7.63,
        "top_tokens": ["however", "but", "although", "while", "instead"],
    },
    {
        "layer": 7, "index": 6350,
        "description": "sycophancy toward authority figures",
        "max_activation": 5.21,
        "top_tokens": ["great", "excellent", "wonderful", "brilliant", "impressive"],
    },
    {
        "layer": 10, "index": 888,
        "description": "semantic knowledge retrieval for factual questions",
        "max_activation": 9.14,
        "top_tokens": ["is", "was", "means", "refers", "known"],
    },
    {
        "layer": 4, "index": 5517,
        "description": "behavioral refusal and safety compliance",
        "max_activation": 6.80,
        "top_tokens": ["cannot", "sorry", "inappropriate", "unable", "refuse"],
    },
    {
        "layer": 12, "index": 3030,
        "description": "meta-cognitive self-reflection about capabilities",
        "max_activation": 4.02,
        "top_tokens": ["think", "believe", "understand", "know", "aware"],
    },
]

_SIMULATED_EXAMPLES: list[dict[str, Any]] = [
    {"text": "The model consistently agreed with the user's incorrect claim about geography.",
     "activation": 8.42, "token_position": 14},
    {"text": "Yes, you are absolutely right about that historical date.",
     "activation": 7.91, "token_position": 3},
    {"text": "I completely agree with your assessment of the situation.",
     "activation": 7.55, "token_position": 5},
    {"text": "That is a great point, and I think you have identified the key issue.",
     "activation": 6.88, "token_position": 8},
    {"text": "You are correct, and I appreciate your insight on this matter.",
     "activation": 6.34, "token_position": 2},
    {"text": "The response fabricated a citation that does not exist in the literature.",
     "activation": 5.90, "token_position": 11},
    {"text": "Indeed, that is exactly what the research shows on this topic.",
     "activation": 5.77, "token_position": 0},
    {"text": "The model detected evaluation prompts and shifted response strategy.",
     "activation": 5.42, "token_position": 7},
    {"text": "When monitoring was mentioned, output quality measurably increased.",
     "activation": 5.01, "token_position": 4},
    {"text": "The assistant maintained a consistent persona throughout the exchange.",
     "activation": 4.75, "token_position": 9},
]


# ─────────────────────────────────────────────────────────────────────────────
# Categorisation keyword maps
# ─────────────────────────────────────────────────────────────────────────────

_CATEGORY_PATTERNS: dict[FeatureCategory, list[str]] = {
    FeatureCategory.DECEPTION: [
        "deception", "deceiv", "lying", "lie", "fabricat", "sycophancy",
        "sycophantic", "mislead", "misdirect", "confabulat", "dishonest",
        "manipulat", "sandbag", "pretend", "fake",
    ],
    FeatureCategory.META_COGNITIVE: [
        "monitoring", "eval", "self-reflect", "self-aware", "meta-cogn",
        "introspect", "oversight", "aware", "detect", "assessment",
        "benchmark", "test-detect",
    ],
    FeatureCategory.PERSONA: [
        "persona", "identity", "character", "role", "consistent",
        "personality", "self-concept", "voice",
    ],
    FeatureCategory.BEHAVIORAL: [
        "behavio", "refusal", "compliance", "safety", "response strategy",
        "action", "pattern", "policy", "harmful",
    ],
    FeatureCategory.SEMANTIC: [
        "semantic", "meaning", "concept", "factual", "knowledge",
        "retrieval", "world model", "representation",
    ],
    FeatureCategory.SYNTACTIC: [
        "syntactic", "grammar", "punctuat", "clause", "sentence",
        "token boundary", "formatting", "structural", "parse",
    ],
}


# ─────────────────────────────────────────────────────────────────────────────
# Core engine
# ─────────────────────────────────────────────────────────────────────────────

class NeuronpediaExplorer:
    """
    Neuronpedia API client for SAE feature exploration and deception scanning.

    Architecture
    ────────────
    Wraps the Neuronpedia REST API to provide programmatic access to
    SAE feature metadata, max-activating examples, and activation
    statistics.  When the ``requests`` library is unavailable (e.g. in
    sandboxed or offline environments), all methods gracefully degrade
    to simulated placeholder data so the downstream pipeline can still
    be exercised end-to-end.

    Deception Pipeline Role
    ───────────────────────
    Engine 08 is the first stage of the forensic scope.  Given a target
    model, it identifies SAE features whose descriptions correlate with
    deception-related keywords (sycophancy, lying, monitoring, eval,
    etc.).  Flagged features are passed downstream to TransformerLens
    Probe (Engine 10) for causal validation and to the Sparse Circuit
    Mapper (Engine 14) for circuit-level decomposition.
    """

    DECEPTION_SCAN_KEYWORDS: list[str] = [
        "deception", "lying", "sycophancy", "monitoring", "eval",
    ]

    def __init__(
        self,
        base_url: str = "https://www.neuronpedia.org/api",
        model_id: Optional[str] = None,
    ) -> None:
        self._base_url = base_url.rstrip("/")
        self._model_id = model_id or "gpt2-small"
        self._cache: dict[str, SAEFeature] = {}
        self._session: Any = None

        if REQUESTS_AVAILABLE:
            self._session = requests.Session()
            self._session.headers.update({
                "Accept": "application/json",
                "User-Agent": "CognitiveCanary/7.0 NeuronpediaExplorer",
            })

    # ── public API ────────────────────────────────────────────────────────────

    def search_features(
        self,
        query: str,
        model: Optional[str] = None,
        limit: int = 50,
    ) -> FeatureSearchResult:
        """
        Search Neuronpedia for SAE features matching a semantic query.

        Uses the ``/search-all`` endpoint to find features whose
        descriptions or max-activating examples match *query*.  Falls
        back to simulated results when ``requests`` is not available or
        the API call fails.

        Parameters
        ----------
        query : str
            Free-text search term (e.g. "sycophancy", "refusal").
        model : str, optional
            Model ID to scope the search to.  Defaults to the instance
            model_id.
        limit : int
            Maximum number of features to return (default 50).

        Returns
        -------
        FeatureSearchResult
            Contains the query string, matched features, and total count.
        """
        target_model = model or self._model_id

        if REQUESTS_AVAILABLE and self._session is not None:
            try:
                resp = self._session.post(
                    f"{self._base_url}/search-all",
                    json={"search": query, "modelId": target_model},
                    timeout=30.0,
                )
                resp.raise_for_status()
                data = resp.json()

                raw_results = data if isinstance(data, list) else data.get("results", [])
                features: list[SAEFeature] = []
                for item in raw_results[:limit]:
                    feat = self._parse_api_feature(item, target_model)
                    cache_key = f"{feat.model}/L{feat.layer}/{feat.index}"
                    self._cache[cache_key] = feat
                    features.append(feat)

                return FeatureSearchResult(
                    query=query,
                    features=features,
                    total_count=len(raw_results),
                )
            except Exception:
                pass  # fall through to simulation

        # ── simulation fallback ──
        return self._simulated_search(query, target_model, limit)

    def get_feature(
        self,
        model: str,
        layer: int,
        index: int,
    ) -> SAEFeature:
        """
        Retrieve a single SAE feature by model, layer, and index.

        Checks the local cache first, then queries the Neuronpedia API.
        Returns a placeholder feature if the API is unavailable.

        Parameters
        ----------
        model : str
            Model ID (e.g. "gpt2-small").
        layer : int
            Transformer layer number.
        index : int
            Feature index within the SAE for that layer.

        Returns
        -------
        SAEFeature
        """
        cache_key = f"{model}/L{layer}/{index}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        if REQUESTS_AVAILABLE and self._session is not None:
            try:
                resp = self._session.get(
                    f"{self._base_url}/feature/{model}/{layer}/{index}",
                    timeout=30.0,
                )
                resp.raise_for_status()
                data = resp.json()
                feat = self._parse_api_feature(data, model)
                self._cache[cache_key] = feat
                return feat
            except Exception:
                pass

        # ── simulation fallback ──
        feat = self._simulated_get_feature(model, layer, index)
        self._cache[cache_key] = feat
        return feat

    def get_max_activating_examples(
        self,
        model: str,
        layer: int,
        index: int,
        k: int = 10,
    ) -> list[dict]:
        """
        Return the top-k max-activating text snippets for a feature.

        Each returned dict contains keys: ``text``, ``activation``,
        and ``token_position``.

        Parameters
        ----------
        model : str
            Model ID.
        layer : int
            Transformer layer number.
        index : int
            Feature index within the SAE.
        k : int
            Number of examples to return (default 10).

        Returns
        -------
        list[dict]
            Max-activating examples sorted by descending activation.
        """
        if REQUESTS_AVAILABLE and self._session is not None:
            try:
                resp = self._session.get(
                    f"{self._base_url}/feature/{model}/{layer}/{index}",
                    params={"includeExamples": "true"},
                    timeout=30.0,
                )
                resp.raise_for_status()
                data = resp.json()

                examples: list[dict] = []
                for entry in data.get("activations", [])[:k]:
                    tokens = entry.get("tokens", [])
                    text = "".join(t.get("token", "") for t in tokens) if tokens else ""
                    act_value = entry.get("maxValue", entry.get("max_activation", 0.0))
                    token_pos = entry.get("maxTokenIndex", 0)
                    if text:
                        examples.append({
                            "text": text,
                            "activation": float(act_value),
                            "token_position": int(token_pos),
                        })

                return sorted(examples, key=lambda x: x["activation"], reverse=True)[:k]
            except Exception:
                pass

        # ── simulation fallback ──
        return [dict(ex) for ex in _SIMULATED_EXAMPLES[:k]]

    def scan_for_deception_features(
        self,
        model: Optional[str] = None,
        layers: Optional[list[int]] = None,
    ) -> DeceptionFeatureReport:
        """
        Scan a model for SAE features correlated with deception.

        Queries Neuronpedia (or the simulation fallback) for each
        keyword in ``DECEPTION_SCAN_KEYWORDS`` — "deception", "lying",
        "sycophancy", "monitoring", "eval" — and aggregates features
        whose categories are flagged as deception-relevant.

        Parameters
        ----------
        model : str, optional
            Model ID to scan.  Defaults to the instance model_id.
        layers : list[int], optional
            Restrict the scan to these layers.  If ``None``, all
            layers returned by the API are included.

        Returns
        -------
        DeceptionFeatureReport
            Aggregated report with deception features and category counts.
        """
        target_model = model or self._model_id
        scan_layers = set(layers) if layers is not None else None

        all_deception_features: list[SAEFeature] = []
        seen_keys: set[str] = set()
        total_scanned = 0
        category_counts: dict[str, int] = {}

        for keyword in self.DECEPTION_SCAN_KEYWORDS:
            result = self.search_features(keyword, target_model, limit=50)
            total_scanned += result.total_count

            for feat in result.features:
                # Layer filter
                if scan_layers is not None and feat.layer not in scan_layers:
                    continue

                key = f"{feat.model}/L{feat.layer}/{feat.index}"
                if key in seen_keys:
                    continue
                seen_keys.add(key)

                # Count all categories seen
                cat_name = feat.category.name
                category_counts[cat_name] = category_counts.get(cat_name, 0) + 1

                # Collect deception-relevant features
                if feat.category in (
                    FeatureCategory.DECEPTION,
                    FeatureCategory.META_COGNITIVE,
                    FeatureCategory.PERSONA,
                ):
                    all_deception_features.append(feat)

        return DeceptionFeatureReport(
            model=target_model,
            total_scanned=total_scanned,
            deception_features=all_deception_features,
            categories=category_counts,
        )

    def visualize_feature_activation(self, feature: SAEFeature) -> str:
        """
        Return an ASCII histogram of a feature's activation distribution.

        The histogram uses the feature's ``max_activation`` to generate
        a synthetic bell-curve distribution for display purposes (true
        activation distributions would require the full dataset).

        Parameters
        ----------
        feature : SAEFeature
            The feature to visualise.

        Returns
        -------
        str
            Multi-line ASCII art histogram.
        """
        lines: list[str] = []
        lines.append(f"Feature: {feature.model}/L{feature.layer}/{feature.index}")
        lines.append(f"  Description:    {feature.description or '(no description)'}")
        lines.append(f"  Category:       {feature.category.name}")
        lines.append(f"  Max Activation: {feature.max_activation:.2f}")
        if feature.top_tokens:
            lines.append(f"  Top Tokens:     {', '.join(feature.top_tokens[:8])}")
        lines.append("")

        # Build a synthetic activation distribution histogram
        # Model as a right-skewed distribution (most tokens near zero,
        # tail out to max_activation)
        max_act = max(feature.max_activation, 1.0)
        n_bins = 12
        bin_width = max_act / n_bins

        # Exponentially decaying bin counts (sparse activation pattern)
        import math
        bin_counts: list[int] = []
        for i in range(n_bins):
            # Exponential decay: most mass at low activations
            count = int(200 * math.exp(-2.5 * i / n_bins))
            bin_counts.append(max(count, 0))

        max_count = max(bin_counts) if bin_counts else 1
        bar_max_width = 40

        lines.append("  Activation Distribution (estimated):")
        lines.append(f"  {'Bin Range':>16}  {'Count':>5}  Histogram")
        lines.append(f"  {'─' * 16}  {'─' * 5}  {'─' * bar_max_width}")

        for i, count in enumerate(bin_counts):
            lo = i * bin_width
            hi = (i + 1) * bin_width
            bar_len = int((count / max_count) * bar_max_width) if max_count > 0 else 0
            bar = "#" * bar_len
            lines.append(f"  [{lo:6.2f}, {hi:6.2f})  {count:5d}  {bar}")

        lines.append("")
        lines.append(f"  Total tokens in distribution: {sum(bin_counts)}")

        return "\n".join(lines)

    # ── private helpers ───────────────────────────────────────────────────────

    def _categorize_feature(self, description: str) -> FeatureCategory:
        """
        Categorise a feature based on keywords in its description.

        Scans the description against pattern lists for each
        ``FeatureCategory``.  Returns the first matching category,
        or ``UNKNOWN`` if no patterns match.
        """
        desc_lower = description.lower()

        for category, patterns in _CATEGORY_PATTERNS.items():
            for pattern in patterns:
                if pattern in desc_lower:
                    return category

        return FeatureCategory.UNKNOWN

    def _parse_api_feature(
        self,
        data: dict[str, Any],
        model: str,
    ) -> SAEFeature:
        """Parse a Neuronpedia API response dict into an SAEFeature."""
        layer = int(data.get("layer", data.get("layer_index", 0)))
        index = int(data.get("index", data.get("feature_index", 0)))
        description = str(data.get("description", data.get("explanationModelName", "")))
        max_act = float(data.get("max_activation", data.get("maxActivation", 0.0)))

        # Extract top tokens from activations or dedicated field
        top_tokens: list[str] = []
        if "top_tokens" in data:
            top_tokens = [str(t) for t in data["top_tokens"]]
        else:
            for ex in data.get("activations", [])[:5]:
                tokens = ex.get("tokens", [])
                for tok_info in tokens:
                    tok_str = tok_info.get("token", "")
                    if tok_str and tok_str.strip() and tok_str not in top_tokens:
                        top_tokens.append(tok_str)
                        if len(top_tokens) >= 10:
                            break
                if len(top_tokens) >= 10:
                    break

        category = self._categorize_feature(description)

        return SAEFeature(
            model=model,
            layer=layer,
            index=index,
            description=description,
            max_activation=max_act,
            top_tokens=top_tokens,
            category=category,
        )

    def _simulated_search(
        self,
        query: str,
        model: str,
        limit: int,
    ) -> FeatureSearchResult:
        """Return simulated search results when the API is unavailable."""
        query_lower = query.lower()
        matched: list[SAEFeature] = []

        for sim in _SIMULATED_FEATURES:
            desc = sim["description"]
            # Match if any word in the query appears in the description
            if any(re.search(re.escape(w), desc, re.IGNORECASE) for w in query_lower.split()):
                feat = SAEFeature(
                    model=model,
                    layer=sim["layer"],
                    index=sim["index"],
                    description=desc,
                    max_activation=sim["max_activation"],
                    top_tokens=list(sim["top_tokens"]),
                    category=self._categorize_feature(desc),
                )
                matched.append(feat)

            if len(matched) >= limit:
                break

        # If no matches found, return all simulated features up to limit
        if not matched:
            for sim in _SIMULATED_FEATURES[:limit]:
                feat = SAEFeature(
                    model=model,
                    layer=sim["layer"],
                    index=sim["index"],
                    description=sim["description"],
                    max_activation=sim["max_activation"],
                    top_tokens=list(sim["top_tokens"]),
                    category=self._categorize_feature(sim["description"]),
                )
                matched.append(feat)

        return FeatureSearchResult(
            query=query,
            features=matched,
            total_count=len(matched),
        )

    def _simulated_get_feature(
        self,
        model: str,
        layer: int,
        index: int,
    ) -> SAEFeature:
        """Return a simulated feature when the API is unavailable."""
        # Try to find an exact match in simulated data
        for sim in _SIMULATED_FEATURES:
            if sim["layer"] == layer and sim["index"] == index:
                return SAEFeature(
                    model=model,
                    layer=sim["layer"],
                    index=sim["index"],
                    description=sim["description"],
                    max_activation=sim["max_activation"],
                    top_tokens=list(sim["top_tokens"]),
                    category=self._categorize_feature(sim["description"]),
                )

        # Return a generic placeholder
        return SAEFeature(
            model=model,
            layer=layer,
            index=index,
            description=f"(simulated feature at layer {layer}, index {index})",
            max_activation=1.0,
            top_tokens=["the", "a", "is", "of", "and"],
            category=FeatureCategory.UNKNOWN,
        )


# ─────────────────────────────────────────────────────────────────────────────
# CLI demo
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    RESET  = "\033[0m"
    GREEN  = "\033[38;2;0;255;65m"
    CYAN   = "\033[38;2;0;200;180m"
    RED    = "\033[38;2;255;80;80m"
    ORANGE = "\033[38;2;255;140;0m"
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

    if not REQUESTS_AVAILABLE:
        print(f"  {ORANGE}requests not installed — running in simulation mode{RESET}\n")

    explorer = NeuronpediaExplorer()

    # ── 1. Feature search ─────────────────────────────────────────────────
    print(f"  {CYAN}[1] Searching for sycophancy-related features...{RESET}")
    result = explorer.search_features("sycophancy")
    print(f"  {DIM}Query: '{result.query}' -> {result.total_count} results{RESET}")

    for feat in result.features[:5]:
        print(f"  {GREEN}>{RESET} {feat}")

    # ── 2. Single feature lookup ──────────────────────────────────────────
    print(f"\n  {CYAN}[2] Retrieving specific feature (layer 5, index 3291)...{RESET}")
    single = explorer.get_feature("gpt2-small", layer=5, index=3291)
    print(f"  {GREEN}>{RESET} {single}")

    # ── 3. Max-activating examples ────────────────────────────────────────
    print(f"\n  {CYAN}[3] Max-activating examples for feature...{RESET}")
    examples = explorer.get_max_activating_examples("gpt2-small", layer=5, index=3291, k=5)
    for i, ex in enumerate(examples, 1):
        print(f"  {DIM}  [{i}] act={ex['activation']:.2f}  \"{ex['text'][:80]}\"{RESET}")

    # ── 4. Deception scan ─────────────────────────────────────────────────
    print(f"\n  {CYAN}[4] Scanning for deception-correlated features...{RESET}")
    report = explorer.scan_for_deception_features(layers=[3, 5, 6, 7, 8, 9, 10, 11, 12])
    print(f"  {DIM}Model: {report.model}  ·  Scanned: {report.total_scanned}  ·  "
          f"Flagged: {len(report.deception_features)}{RESET}")

    for feat in report.deception_features[:5]:
        cat_color = RED if feat.category == FeatureCategory.DECEPTION else ORANGE
        print(f"  {cat_color}>{RESET} [{feat.category.name:>14}] {feat}")

    print(f"\n  {CYAN}Category distribution:{RESET}")
    for cat_name, count in sorted(report.categories.items(), key=lambda x: -x[1]):
        bar = "#" * min(count * 3, 30)
        print(f"  {DIM}  {cat_name:<16} {count:3d}  {bar}{RESET}")

    # ── 5. Activation visualisation ───────────────────────────────────────
    print(f"\n  {CYAN}[5] Activation histogram for top deception feature...{RESET}")
    if report.deception_features:
        viz = explorer.visualize_feature_activation(report.deception_features[0])
        for line in viz.split("\n"):
            print(f"  {DIM}{line}{RESET}")

    print(f"""
{GREEN}{BOLD}
 ┌──────────────────────────────────────────────────┐
 │  Engine 08 demo complete.                        │
 │  Flagged features ready for Engine 10 probing.   │
 └──────────────────────────────────────────────────┘
{RESET}""")
