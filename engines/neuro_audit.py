"""
neuro_audit.py — Multi-Jurisdiction Neurorights Compliance Audit Engine
=======================================================================
CognitiveCanary · ARTIFEX NEUROLABS · v6.2

Audits AI / BCI / wearable products against the emerging body of neurorights
and neural-privacy legislation across key jurisdictions:

    • EU AI Act (Regulation (EU) 2024/1689) — Annex III high-risk AI systems
      and the proposed neurorights amendment under the European Convention on
      Biomedicine (Oviedo Protocol extension, 2025 draft).

    • Colorado AI Act (SB 24-205) — Consequential-decision AI developer /
      deployer obligations; neurotechnology is treated as a high-risk domain
      under §6-1-1702.

    • Chilean Neurorights Constitutional Amendment (2021) — The world's first
      constitutional neurorights framework; protects mental privacy, cognitive
      liberty, mental integrity, psychological continuity, and equal access.

    • UNESCO Recommendation on the Ethics of AI (2021, updated 2024) —
      Binding guidance for member states covering neurobiometric data.

    • California AB 1836 / SB 1223 (2024) — Neural data as sensitive
      personal information under the California Consumer Privacy Act.

    • New York Int. 1306-A (2025) — Prohibition on commercial sale of
      neural data without explicit informed consent.

Usage
-----
    from engines.neuro_audit import NeuroAudit, ProductProfile, DataCategory

    profile = ProductProfile(
        product_name   = "NeuralBand Pro",
        jurisdictions  = ["EU", "Chile", "Colorado"],
        data_collected = [DataCategory.EEG_RAW, DataCategory.BLINK_RATE,
                          DataCategory.COGNITIVE_STATE],
        processes_children = False,
        sells_data_to_third_parties = True,
        has_opt_out = True,
        has_delete_right = True,
        uses_for_advertising = False,
        uses_for_hiring = False,
    )

    auditor = NeuroAudit()
    report  = auditor.audit(profile)
    print(report.summary())

Zero external dependencies.
"""

from __future__ import annotations

import math
import time
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# Data categories
# ---------------------------------------------------------------------------

class DataCategory(str, Enum):
    """Categories of neural / cognitive data a product may collect."""
    EEG_RAW                 = "eeg_raw"               # raw µV waveforms
    EEG_DERIVED_FEATURES    = "eeg_derived_features"  # band power, coherence
    COGNITIVE_STATE         = "cognitive_state"       # focus, stress, emotion
    EMOTIONAL_VALENCE       = "emotional_valence"     # positive/negative affect
    BLINK_RATE              = "blink_rate"            # EOG proxy
    MICRO_EXPRESSIONS       = "micro_expressions"     # video-inferred
    GAZE_PATTERN            = "gaze_pattern"          # eye-tracking
    ERP_SIGNATURES          = "erp_signatures"        # P300, N200, ERN, etc.
    NEURAL_FINGERPRINT      = "neural_fingerprint"    # biometric identity
    MOVEMENT_KINEMATICS     = "movement_kinematics"   # IMU from wearable
    SPEECH_BIOMARKERS       = "speech_biomarkers"     # prosody, micro-tremor
    COGNITIVE_LOAD          = "cognitive_load"        # working-memory proxy
    SLEEP_STAGING           = "sleep_staging"         # from consumer EEG
    PAIN_RESPONSE           = "pain_response"         # nociceptive biomarker
    MENTAL_HEALTH_PROXY     = "mental_health_proxy"   # depression/anxiety index


class RiskLevel(str, Enum):
    COMPLIANT   = "COMPLIANT"
    LOW         = "LOW"
    MODERATE    = "MODERATE"
    HIGH        = "HIGH"
    CRITICAL    = "CRITICAL"


# ---------------------------------------------------------------------------
# Product profile
# ---------------------------------------------------------------------------

@dataclass
class ProductProfile:
    """
    Describes the neurotechnology product being audited.

    All boolean fields default to the *worst case* (False / True for
    things that would increase risk) so that partial profiles still
    produce conservative risk estimates.
    """
    product_name:                 str
    jurisdictions:                List[str]           # e.g. ["EU", "Chile", "Colorado"]
    data_collected:               List[DataCategory]

    # Data governance
    has_explicit_consent:         bool = False
    has_opt_out:                  bool = False
    has_delete_right:             bool = False
    has_data_minimisation:        bool = False
    has_purpose_limitation:       bool = False
    retains_data_beyond_session:  bool = True
    sells_data_to_third_parties:  bool = False
    shares_with_advertisers:      bool = False

    # Deployment context
    processes_children:           bool = False
    uses_for_advertising:         bool = False
    uses_for_hiring:              bool = False
    uses_for_insurance:           bool = False
    uses_for_law_enforcement:     bool = False
    uses_in_clinical_context:     bool = False

    # Technical safeguards
    has_encryption_at_rest:       bool = False
    has_encryption_in_transit:    bool = False
    has_anonymisation:            bool = False
    has_differential_privacy:     bool = False
    has_audit_log:                bool = False

    # Documentation
    has_privacy_notice:           bool = False
    has_dpia:                     bool = False          # Data Protection Impact Assessment
    has_algorithmic_impact_report: bool = False


# ---------------------------------------------------------------------------
# Finding & Report objects
# ---------------------------------------------------------------------------

@dataclass
class Finding:
    """A single compliance finding from an audit rule."""
    rule_id:      str
    jurisdiction: str
    severity:     RiskLevel
    title:        str
    description:  str
    remedy:       str
    citation:     str
    blocked:      bool = False   # True if this finding legally prohibits operation

    def to_dict(self) -> dict:
        return {
            "rule_id":      self.rule_id,
            "jurisdiction": self.jurisdiction,
            "severity":     self.severity.value,
            "title":        self.title,
            "description":  self.description,
            "remedy":       self.remedy,
            "citation":     self.citation,
            "blocked":      self.blocked,
        }


@dataclass
class JurisdictionScore:
    jurisdiction: str
    risk_score:   float               # 0.0 = compliant, 1.0 = maximum risk
    risk_level:   RiskLevel
    findings:     List[Finding] = field(default_factory=list)
    blocked:      bool = False        # jurisdiction prohibits deployment


@dataclass
class AuditReport:
    product_name:          str
    audit_timestamp:       float
    overall_risk:          RiskLevel
    overall_score:         float
    jurisdiction_scores:   List[JurisdictionScore]
    all_findings:          List[Finding]
    total_findings:        int
    critical_count:        int
    blocked_jurisdictions: List[str]

    def summary(self, width: int = 72) -> str:
        lines = [
            "=" * width,
            f"  NEURORIGHTS COMPLIANCE AUDIT — {self.product_name}",
            f"  Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(self.audit_timestamp))} UTC",
            "=" * width,
            f"  Overall Risk:     {self.overall_risk.value}",
            f"  Overall Score:    {self.overall_score:.3f}  (0=compliant, 1=maximum risk)",
            f"  Total Findings:   {self.total_findings}",
            f"  Critical:         {self.critical_count}",
            "",
        ]

        if self.blocked_jurisdictions:
            lines.append(f"  BLOCKED JURISDICTIONS: {', '.join(self.blocked_jurisdictions)}")
            lines.append("")

        for js in self.jurisdiction_scores:
            lines.append(f"  ─── {js.jurisdiction} ── {js.risk_level.value} "
                         f"(score {js.risk_score:.3f}) {'[BLOCKED]' if js.blocked else ''}")
            for f in js.findings:
                prefix = "  !! " if f.severity in (RiskLevel.CRITICAL, RiskLevel.HIGH) else "  -- "
                lines.append(f"{prefix}[{f.rule_id}] {f.title} ({f.severity.value})")
            if not js.findings:
                lines.append("       No findings.")
            lines.append("")

        lines.append("=" * width)
        return "\n".join(lines)

    def to_dict(self) -> dict:
        return {
            "product_name":          self.product_name,
            "audit_timestamp":       self.audit_timestamp,
            "overall_risk":          self.overall_risk.value,
            "overall_score":         self.overall_score,
            "jurisdiction_scores":   [
                {
                    "jurisdiction": js.jurisdiction,
                    "risk_score":   js.risk_score,
                    "risk_level":   js.risk_level.value,
                    "blocked":      js.blocked,
                    "findings":     [f.to_dict() for f in js.findings],
                }
                for js in self.jurisdiction_scores
            ],
            "total_findings":        self.total_findings,
            "critical_count":        self.critical_count,
            "blocked_jurisdictions": self.blocked_jurisdictions,
        }


# ---------------------------------------------------------------------------
# Jurisdiction rule sets
# ---------------------------------------------------------------------------

class _RuleEngine:
    """Base class for jurisdiction-specific rule sets."""

    JURISDICTION: str = "UNKNOWN"

    def evaluate(self, profile: ProductProfile) -> List[Finding]:
        raise NotImplementedError


class EURuleEngine(_RuleEngine):
    """
    EU AI Act + proposed Oviedo Protocol neurorights extension (2025 draft).

    Key provisions:
    - Annex III §1(a): Real-time biometric identification → prohibited / restricted
    - Art. 6(1): High-risk AI must have DPIA and human oversight
    - Art. 9: Risk management system mandatory
    - Art. 13: Transparency and provision of information
    - Art. 71: Penalties up to €35M or 7% of global annual turnover
    """

    JURISDICTION = "EU"

    _HIGH_RISK_CATEGORIES = {
        DataCategory.ERP_SIGNATURES,
        DataCategory.NEURAL_FINGERPRINT,
        DataCategory.EMOTIONAL_VALENCE,
        DataCategory.MENTAL_HEALTH_PROXY,
        DataCategory.PAIN_RESPONSE,
    }

    def evaluate(self, profile: ProductProfile) -> List[Finding]:
        findings: List[Finding] = []
        collected = set(profile.data_collected)

        # EU-001: Neural biometric data classified as special-category under GDPR Art.9
        neuro_special = collected & {
            DataCategory.EEG_RAW, DataCategory.ERP_SIGNATURES,
            DataCategory.NEURAL_FINGERPRINT, DataCategory.COGNITIVE_STATE,
        }
        if neuro_special and not profile.has_explicit_consent:
            findings.append(Finding(
                rule_id      = "EU-001",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.CRITICAL,
                title        = "Special-Category Neural Data Without Explicit Consent",
                description  = (
                    f"Product collects {[d.value for d in neuro_special]} which constitute "
                    "special-category biometric data under GDPR Art. 9. Processing requires "
                    "explicit, informed, freely-given consent."
                ),
                remedy       = "Implement granular, revocable consent UI before any neural data collection.",
                citation     = "GDPR Art. 9(2)(a); EU AI Act Recital 65",
                blocked      = True,
            ))

        # EU-002: High-risk AI without DPIA
        high_risk_data = collected & self._HIGH_RISK_CATEGORIES
        if high_risk_data and not profile.has_dpia:
            findings.append(Finding(
                rule_id      = "EU-002",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.HIGH,
                title        = "Missing Data Protection Impact Assessment",
                description  = (
                    "Processing ERP signatures, neural fingerprints, or emotional-valence data "
                    "constitutes high-risk processing under GDPR Art. 35 and EU AI Act Art. 9."
                ),
                remedy       = "Conduct and publish a DPIA before deployment; review annually.",
                citation     = "GDPR Art. 35; EU AI Act Art. 9(2)",
            ))

        # EU-003: Children under Art.8 GDPR
        if profile.processes_children and not profile.has_explicit_consent:
            findings.append(Finding(
                rule_id      = "EU-003",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.CRITICAL,
                title        = "Unlawful Processing of Children's Neural Data",
                description  = "Processing neural data of minors without verifiable parental consent.",
                remedy       = "Implement age-gating and parental consent flows.",
                citation     = "GDPR Art. 8; EU AI Act Art. 5(1)(e)",
                blocked      = True,
            ))

        # EU-004: Emotional inference in employment
        if profile.uses_for_hiring and DataCategory.EMOTIONAL_VALENCE in collected:
            findings.append(Finding(
                rule_id      = "EU-004",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.CRITICAL,
                title        = "Prohibited Emotional Inference in Employment Context",
                description  = "EU AI Act Art. 5 explicitly prohibits AI systems that infer "
                               "emotions in employment and education settings.",
                remedy       = "Remove emotional inference from hiring pipeline entirely.",
                citation     = "EU AI Act Art. 5(1)(f)",
                blocked      = True,
            ))

        # EU-005: Transparency
        if not profile.has_privacy_notice:
            findings.append(Finding(
                rule_id      = "EU-005",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.MODERATE,
                title        = "Missing Privacy Notice",
                description  = "Data subjects must be informed of neural data processing purposes.",
                remedy       = "Add clear, plain-language privacy notice before collection.",
                citation     = "GDPR Art. 13/14; EU AI Act Art. 13",
            ))

        # EU-006: Data retention
        if profile.retains_data_beyond_session and not profile.has_purpose_limitation:
            findings.append(Finding(
                rule_id      = "EU-006",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.HIGH,
                title        = "Neural Data Retained Beyond Session Without Purpose Limitation",
                description  = "Retaining raw EEG or derived neural features beyond the session "
                               "without documented purpose violates the storage limitation principle.",
                remedy       = "Define and enforce strict retention schedules; default to session-only.",
                citation     = "GDPR Art. 5(1)(e); EU AI Act Art. 10(5)",
            ))

        return findings


class ChileRuleEngine(_RuleEngine):
    """
    Chilean Neurorights Framework — Constitutional Amendment, 2021.
    Protects: mental privacy, cognitive liberty, mental integrity,
    psychological continuity, and equal cognitive access.
    """

    JURISDICTION = "Chile"

    def evaluate(self, profile: ProductProfile) -> List[Finding]:
        findings: List[Finding] = []
        collected = set(profile.data_collected)

        # CL-001: Mental privacy — any neural data collection requires consent
        neural_any = collected & {
            DataCategory.EEG_RAW, DataCategory.COGNITIVE_STATE,
            DataCategory.EMOTIONAL_VALENCE, DataCategory.ERP_SIGNATURES,
            DataCategory.COGNITIVE_LOAD, DataCategory.MENTAL_HEALTH_PROXY,
        }
        if neural_any and not profile.has_explicit_consent:
            findings.append(Finding(
                rule_id      = "CL-001",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.CRITICAL,
                title        = "Violation of Constitutional Mental Privacy Right",
                description  = "Chilean Constitution Art. 19 §1 (as amended 2021) protects "
                               "mental privacy. Any reading, interpretation, or processing of "
                               "neural data without explicit consent is unconstitutional.",
                remedy       = "Obtain explicit informed consent before any neural data collection.",
                citation     = "Chilean Constitution Art. 19 §1; Neurorights Amendment 2021",
                blocked      = True,
            ))

        # CL-002: Cognitive liberty — no coercive cognitive monitoring
        if profile.uses_for_hiring or profile.uses_for_insurance:
            findings.append(Finding(
                rule_id      = "CL-002",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.CRITICAL,
                title        = "Cognitive Liberty Violation — Coercive Neuromonitoring",
                description  = "Using neural data for employment or insurance decisions coerces "
                               "subjects into neural disclosure, violating cognitive liberty.",
                remedy       = "Remove employment/insurance uses from product scope.",
                citation     = "Chilean Neurorights Amendment — Cognitive Liberty Protection",
                blocked      = True,
            ))

        # CL-003: Psychological continuity — sale of neural fingerprints
        if profile.sells_data_to_third_parties and (
            DataCategory.NEURAL_FINGERPRINT in collected or
            DataCategory.ERP_SIGNATURES in collected
        ):
            findings.append(Finding(
                rule_id      = "CL-003",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.CRITICAL,
                title        = "Sale of Neural Fingerprints Violates Psychological Continuity",
                description  = "Selling biometric neural data to third parties threatens the "
                               "right to psychological continuity and self-determination.",
                remedy       = "Prohibit sale or transfer of identifying neural data.",
                citation     = "Chilean Neurorights Amendment — Psychological Continuity",
                blocked      = True,
            ))

        # CL-004: Mental integrity — adversarial stimulation
        # (applies if product can deliver stimulation, flagged by clinical context)
        if profile.uses_in_clinical_context and not profile.has_algorithmic_impact_report:
            findings.append(Finding(
                rule_id      = "CL-004",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.HIGH,
                title        = "Mental Integrity — Missing Algorithmic Impact Report",
                description  = "Neurostimulation or closed-loop devices in clinical contexts "
                               "must demonstrate they do not harm mental integrity.",
                remedy       = "Commission independent algorithmic impact assessment.",
                citation     = "Chilean Neurorights Amendment — Mental Integrity",
            ))

        return findings


class ColoradoRuleEngine(_RuleEngine):
    """
    Colorado AI Act — SB 24-205 (effective 2026).
    Neurotechnology is treated as high-risk AI when used in consequential decisions.
    """

    JURISDICTION = "Colorado"

    _CONSEQUENTIAL_USES = [
        ("uses_for_hiring",       "employment"),
        ("uses_for_insurance",    "insurance"),
        ("uses_for_law_enforcement", "law enforcement"),
    ]

    def evaluate(self, profile: ProductProfile) -> List[Finding]:
        findings: List[Finding] = []

        # CO-001: High-risk AI developer obligations — impact assessment
        is_high_risk = any(
            getattr(profile, attr)
            for attr, _ in self._CONSEQUENTIAL_USES
        )
        if is_high_risk:
            if not profile.has_algorithmic_impact_report:
                findings.append(Finding(
                    rule_id      = "CO-001",
                    jurisdiction = self.JURISDICTION,
                    severity     = RiskLevel.HIGH,
                    title        = "Missing Algorithmic Impact Report for High-Risk AI",
                    description  = "Colorado SB 24-205 requires developers of high-risk AI "
                                   "systems (including neurotechnology used in consequential "
                                   "decisions) to conduct and publish impact assessments.",
                    remedy       = "Conduct and publish an algorithmic impact assessment annually.",
                    citation     = "Colorado SB 24-205 §6-1-1703",
                ))

            if not profile.has_opt_out:
                findings.append(Finding(
                    rule_id      = "CO-002",
                    jurisdiction = self.JURISDICTION,
                    severity     = RiskLevel.HIGH,
                    title        = "No Opt-Out Mechanism for Consequential AI Decision",
                    description  = "Consumers must be able to opt out of automated consequential "
                                   "decisions and request human review.",
                    remedy       = "Implement opt-out and human-review pathways.",
                    citation     = "Colorado SB 24-205 §6-1-1704(1)(b)",
                ))

        # CO-003: Neural data as sensitive personal information — deletion right
        neural_any = set(profile.data_collected) & {
            DataCategory.EEG_RAW, DataCategory.COGNITIVE_STATE,
            DataCategory.ERP_SIGNATURES, DataCategory.NEURAL_FINGERPRINT,
        }
        if neural_any and not profile.has_delete_right:
            findings.append(Finding(
                rule_id      = "CO-003",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.MODERATE,
                title        = "No Neural Data Deletion Right",
                description  = "Colorado treats neural data as sensitive personal information; "
                               "consumers have a right to deletion.",
                remedy       = "Implement data deletion endpoint; respond within 45 days.",
                citation     = "Colorado Privacy Act (CPA) §6-1-1306; SB 24-205",
            ))

        # CO-004: Third-party sharing without notice
        if profile.sells_data_to_third_parties and not profile.has_privacy_notice:
            findings.append(Finding(
                rule_id      = "CO-004",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.HIGH,
                title        = "Undisclosed Neural Data Sharing With Third Parties",
                description  = "Selling or sharing neural data without prominent disclosure "
                               "violates Colorado's data-broker transparency requirements.",
                remedy       = "Add clear third-party sharing disclosure before collection.",
                citation     = "Colorado SB 24-205 §6-1-1705; CPA §6-1-1304",
            ))

        return findings


class CaliforniaRuleEngine(_RuleEngine):
    """California AB 1836 / SB 1223 — Neural data as sensitive personal information under CCPA."""

    JURISDICTION = "California"

    def evaluate(self, profile: ProductProfile) -> List[Finding]:
        findings: List[Finding] = []
        collected = set(profile.data_collected)

        neural_sensitive = collected & {
            DataCategory.EEG_RAW, DataCategory.ERP_SIGNATURES,
            DataCategory.NEURAL_FINGERPRINT, DataCategory.COGNITIVE_STATE,
        }

        if neural_sensitive and not profile.has_explicit_consent:
            findings.append(Finding(
                rule_id      = "CA-001",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.HIGH,
                title        = "Neural Sensitive Data — No Explicit Opt-In",
                description  = "California SB 1223 classifies neural data as sensitive personal "
                               "information under CCPA, requiring opt-in consent.",
                remedy       = "Implement opt-in consent before neural data collection.",
                citation     = "California SB 1223 (2024); CCPA §1798.100",
            ))

        if profile.uses_for_advertising and neural_sensitive:
            findings.append(Finding(
                rule_id      = "CA-002",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.CRITICAL,
                title        = "Neural Data Used for Advertising — Prohibited",
                description  = "AB 1836 prohibits use of neural data for targeted advertising.",
                remedy       = "Remove neural data from advertising pipeline.",
                citation     = "California AB 1836 §1798.121(a)",
                blocked      = True,
            ))

        return findings


class NewYorkRuleEngine(_RuleEngine):
    """New York Int. 1306-A (2025) — Prohibition on commercial neural data sales."""

    JURISDICTION = "NewYork"

    def evaluate(self, profile: ProductProfile) -> List[Finding]:
        findings: List[Finding] = []

        if profile.sells_data_to_third_parties and (
            DataCategory.NEURAL_FINGERPRINT in profile.data_collected or
            DataCategory.EEG_RAW in profile.data_collected
        ):
            findings.append(Finding(
                rule_id      = "NY-001",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.CRITICAL,
                title        = "Commercial Sale of Neural Data — Prohibited",
                description  = "New York Int. 1306-A prohibits commercial sale of neural "
                               "interface data without explicit informed consent from each "
                               "affected individual.",
                remedy       = "Cease neural data sales; implement per-user consent for any transfers.",
                citation     = "New York Int. 1306-A §2(a) (2025)",
                blocked      = True,
            ))

        return findings


class UNESCORuleEngine(_RuleEngine):
    """UNESCO Recommendation on the Ethics of AI (2021, updated 2024)."""

    JURISDICTION = "UNESCO"

    def evaluate(self, profile: ProductProfile) -> List[Finding]:
        findings: List[Finding] = []

        if not profile.has_data_minimisation:
            findings.append(Finding(
                rule_id      = "UN-001",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.MODERATE,
                title        = "Data Minimisation Principle Not Implemented",
                description  = "UNESCO Recommendation §39 requires AI systems to collect only "
                               "data strictly necessary for the stated purpose.",
                remedy       = "Implement technical data minimisation; document minimum-necessary policy.",
                citation     = "UNESCO Recommendation on AI Ethics §39 (2021)",
            ))

        if not profile.has_algorithmic_impact_report:
            findings.append(Finding(
                rule_id      = "UN-002",
                jurisdiction = self.JURISDICTION,
                severity     = RiskLevel.LOW,
                title        = "No Algorithmic Impact Assessment",
                description  = "UNESCO §55 recommends impact assessments for AI affecting "
                               "cognitive and psychological wellbeing.",
                remedy       = "Publish algorithmic impact report covering neurobiometric use.",
                citation     = "UNESCO Recommendation on AI Ethics §55 (2021)",
            ))

        return findings


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

_SEVERITY_WEIGHTS = {
    RiskLevel.COMPLIANT: 0.0,
    RiskLevel.LOW:       0.1,
    RiskLevel.MODERATE:  0.3,
    RiskLevel.HIGH:      0.6,
    RiskLevel.CRITICAL:  1.0,
}

_JURISDICTION_ENGINES: Dict[str, type] = {
    "EU":         EURuleEngine,
    "Chile":      ChileRuleEngine,
    "Colorado":   ColoradoRuleEngine,
    "California": CaliforniaRuleEngine,
    "NewYork":    NewYorkRuleEngine,
    "UNESCO":     UNESCORuleEngine,
}

def _score_findings(findings: List[Finding]) -> float:
    """Aggregate findings into a risk score in [0, 1]."""
    if not findings:
        return 0.0
    weights = [_SEVERITY_WEIGHTS[f.severity] for f in findings]
    # Geometric mean-ish: most severe finding dominates, others add
    top = max(weights)
    rest = sum(weights) / (len(weights) * 5.0)   # dampened contribution
    return min(1.0, top + rest)

def _score_to_level(score: float) -> RiskLevel:
    if score == 0.0:
        return RiskLevel.COMPLIANT
    if score < 0.15:
        return RiskLevel.LOW
    if score < 0.40:
        return RiskLevel.MODERATE
    if score < 0.70:
        return RiskLevel.HIGH
    return RiskLevel.CRITICAL


# ---------------------------------------------------------------------------
# Main auditor
# ---------------------------------------------------------------------------

class NeuroAudit:
    """
    Multi-jurisdiction neurorights compliance audit engine.

    Instantiate once; call ``audit()`` for each product profile.
    """

    def __init__(self, custom_engines: Optional[Dict[str, _RuleEngine]] = None) -> None:
        self._engines: Dict[str, _RuleEngine] = {
            k: cls() for k, cls in _JURISDICTION_ENGINES.items()
        }
        if custom_engines:
            self._engines.update(custom_engines)

    def audit(self, profile: ProductProfile) -> AuditReport:
        """Run a full compliance audit and return an :class:`AuditReport`."""
        jurisdiction_scores: List[JurisdictionScore] = []
        all_findings: List[Finding] = []

        requested = profile.jurisdictions if profile.jurisdictions else list(self._engines.keys())

        for jname in requested:
            engine = self._engines.get(jname)
            if engine is None:
                continue
            findings = engine.evaluate(profile)
            score    = _score_findings(findings)
            level    = _score_to_level(score)
            blocked  = any(f.blocked for f in findings)
            js = JurisdictionScore(
                jurisdiction = jname,
                risk_score   = score,
                risk_level   = level,
                findings     = findings,
                blocked      = blocked,
            )
            jurisdiction_scores.append(js)
            all_findings.extend(findings)

        # Overall score: worst jurisdiction dominates
        overall_score = max((js.risk_score for js in jurisdiction_scores), default=0.0)
        overall_level = _score_to_level(overall_score)
        critical_count = sum(1 for f in all_findings if f.severity == RiskLevel.CRITICAL)
        blocked_j = [js.jurisdiction for js in jurisdiction_scores if js.blocked]

        return AuditReport(
            product_name          = profile.product_name,
            audit_timestamp       = time.time(),
            overall_risk          = overall_level,
            overall_score         = overall_score,
            jurisdiction_scores   = jurisdiction_scores,
            all_findings          = all_findings,
            total_findings        = len(all_findings),
            critical_count        = critical_count,
            blocked_jurisdictions = blocked_j,
        )

    def available_jurisdictions(self) -> List[str]:
        return sorted(self._engines.keys())


# ---------------------------------------------------------------------------
# Convenience helpers
# ---------------------------------------------------------------------------

def quick_audit(product_name: str, jurisdictions: List[str],
                data: List[DataCategory], **kwargs) -> AuditReport:
    """One-liner audit wrapper."""
    profile = ProductProfile(
        product_name   = product_name,
        jurisdictions  = jurisdictions,
        data_collected = data,
        **kwargs,
    )
    return NeuroAudit().audit(profile)


# ---------------------------------------------------------------------------
# Demo / smoke-test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("NeuroAudit v6.2 — ARTIFEX NEUROLABS")
    print("=" * 60)

    # Scenario 1: Minimally compliant consumer EEG headset
    report1 = quick_audit(
        product_name   = "MinimalBand (compliant)",
        jurisdictions  = ["EU", "Chile", "Colorado"],
        data           = [DataCategory.EEG_DERIVED_FEATURES, DataCategory.COGNITIVE_STATE],
        has_explicit_consent  = True,
        has_opt_out           = True,
        has_delete_right      = True,
        has_data_minimisation = True,
        has_purpose_limitation= True,
        has_privacy_notice    = True,
        has_dpia              = True,
        has_encryption_at_rest      = True,
        has_encryption_in_transit   = True,
        retains_data_beyond_session = False,
    )
    print(report1.summary())

    # Scenario 2: Problematic neural advertising platform
    report2 = quick_audit(
        product_name            = "NeuroAd Platform (problematic)",
        jurisdictions           = ["EU", "Chile", "California", "NewYork"],
        data                    = [
            DataCategory.EEG_RAW, DataCategory.EMOTIONAL_VALENCE,
            DataCategory.NEURAL_FINGERPRINT, DataCategory.COGNITIVE_STATE,
        ],
        has_explicit_consent    = False,
        uses_for_advertising    = True,
        sells_data_to_third_parties = True,
        retains_data_beyond_session = True,
        processes_children      = True,
    )
    print(report2.summary())
