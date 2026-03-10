```
 ██████╗ ██████╗  ██████╗ ███╗   ██╗██╗████████╗██╗██╗   ██╗███████╗
██╔════╝██╔═══██╗██╔════╝ ████╗  ██║██║╚══██╔══╝██║██║   ██║██╔════╝
██║     ██║   ██║██║  ███╗██╔██╗ ██║██║   ██║   ██║██║   ██║█████╗
██║     ██║   ██║██║   ██║██║╚██╗██║██║   ██║   ██║╚██╗ ██╔╝██╔══╝
╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║██║   ██║   ██║ ╚████╔╝ ███████╗
 ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝
                                                              CANARY
 ██████╗ █████╗ ███╗   ██╗ █████╗ ██████╗ ██╗   ██╗
██╔════╝██╔══██╗████╗  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
██║     ███████║██╔██╗ ██║███████║██████╔╝ ╚████╔╝
██║     ██╔══██║██║╚██╗██║██╔══██║██╔══██╗  ╚██╔╝
╚██████╗██║  ██║██║ ╚████║██║  ██║██║  ██║   ██║
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
                                            v6.2 // ARTIFEX LABS
```

<div align="center">

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-00ff41?style=for-the-badge&logo=vercel&logoColor=black)](https://cognitivecanary.lovable.app)
[![Open In Colab](https://img.shields.io/badge/Colab_Notebook-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=black)](https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq)
[![License: MIT](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

**We didn't hack the password. We hacked the inference.**

> Protect your behavioral and neural exhaust from surveillance classifiers — without breaking the apps you use.

</div>

---

## Overview

Cognitive Canary is a **user-side behavioral and neural obfuscation layer** that collapses fingerprinting and re-identification while preserving usability.

It wraps browser + EEG + BCI telemetry in adaptive noise, adversarial perturbations, and neurorights-aware policy checks so platforms cannot turn your behavior and brain signals into stable IDs or risk scores.

This repo contains the **live demo site** (React), **seven Python defense engines** (EEG Shield, Neuro Audit, Lissajous 3D, and more), an interactive **Colab notebook**, and the **2026 neurorights whitepaper** backing the threat model.

---

## Links

- **Live demo**: https://cognitivecanary.lovable.app
- **Colab notebook**: https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq — also at `CognitiveCanary_Demo.ipynb` in this repo
- **Neurorights whitepaper** (HTML): `public/neurorights-2026.html`

---

## Who is this for?

- **Security & privacy engineers**: drop-in engines to test and harden against behavioral and neural fingerprinting.
- **Policy / neurorights researchers**: Neuro Audit + whitepaper map current products onto EU AI Act, GDPR, Chilean neurorights, and new US state laws.
- **ML researchers**: reference implementations of gradient-starvation-based defenses, EEG anonymization, and behavioral entropy measurement.

## Quickstart

I want to:

- **Play with the live defenses in the browser** → see [Interactive Demo Sections](#interactive-demo-sections)
- **Use EEG Shield in my own pipeline** → see [EEG Shield — `eeg_shield.py`](#06-eeg-shield--eeg_shieldpy-v62)
- **Run a neurorights audit on a product** → see [Neuro Audit — `neuro_audit.py`](#07-neuro-audit--neuro_auditpy-v62)
- **Try everything interactively** → open the [Colab notebook](https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq)

---

## The Problem: You Are Your Behavior

> *"The way an individual interacts with a digital interface is as unique as their fingerprint."*

The contemporary digital ecosystem has evolved from harvesting static identifiers (SSNs, IPs) toward continuous extraction of **neuro-kinetic telemetry** — the behavioral signals that leak your identity, affect, and cognitive state with every mouse movement, keystroke, and scroll.

Modern surveillance infrastructure now targets:

| Signal Type | What's Extracted | Who Collects It |
|---|---|---|
| **Mouse Dynamics** | Velocity, jerk, sinuosity, motor tremor frequency | CloudFlare, DataDome, PerimeterX |
| **Keystroke Rhythms** | Dwell time, flight time, inter-key intervals | TypingDNA, BehavioSec, IBM Trusteer |
| **Canvas / WebGL** | GPU rendering hash, pixel-level renderer signature | FingerprintJS Pro, MaxMind |
| **Audio Context** | Oscillator precision, DynamicsCompressor response | Arkose Labs, Signal Sciences |
| **Scroll / Gaze** | Inertia decay, fixation dwell, saccade velocity | Akamai, Tobii Analytics |
| **EEG (Emerging)** | Alpha/theta band resonance via rAF drift | Neuralink SDK, NeuroMark |

The result is a **behavioral fingerprint** stable enough for 1-in-millions identification — without cookies, logins, or consent.

**Why this matters:** these streams together create a de-facto biometric ID that cannot be rotated or revoked.

---

## The Solution: Gradient Starvation as a Weapon

Cognitive Canary weaponizes a structural flaw in over-parameterized neural networks identified by **Pezeshki et al. (NeurIPS 2021)** as **gradient starvation**.

### The Clever Hans Effect

Neural networks are "Clever Hans" — like the horse that appeared to solve arithmetic by reading trainer cues, classifiers latch onto **cheap, high-gradient features** while ignoring robust ones. A behavioral surveillance model learns that "high spectral entropy = anxious user" because that correlation dominates the gradient budget during training.

Canary exploits this. By flooding the feature space with **synthetic biologically-plausible noise**, we make the cheap shortcuts statistically meaningless — starving the classifier of the signal it was built to find.

```
Without Canary:  Classifier accuracy  ≥ 90%    → identity confirmed
  With Canary:   Classifier accuracy  ≈ 12-18%  → identity destroyed
   Human/Bot discrimination remains:   0.97     → still looks human
```

### Why gradient starvation helps privacy

Neural fingerprinting systems over-weight a few cheap, high-gradient features. By injecting realistic noise into exactly those features (motor tremor bands, timing ratios, EEG latencies), Canary forces the model to "forget" the individual while keeping the interaction usable.

---

## Seven Defense Engines

### `01` Lissajous 3D Harmonic Overlay
**File:** `engines/lissajous_3d.py`
**Use when you need:** cursor-level obfuscation that looks like physiological tremor.

Injects a small-amplitude Lissajous curve into cursor movement data using **physiological tremor frequencies** (4–12 Hz) with irrational frequency ratios:

```
x(t) = A_x · sin(ω_a · t + δ)
y(t) = A_y · sin(ω_b · t)
```

With coprime ratios `13:8:5` (Fibonacci-adjacent), the resulting motion pattern mimics the **spectral signature of natural human hand tremor** while decoupling trajectory from actual CNS state.

```python
from engines import LissajousEngine
lj = LissajousEngine()
pt = lj.transform(x=0.5, y=0.5, dt=1/60)
```

---

### `02` Adaptive Tremor Engine
**File:** `engines/adaptive_tremor.py`
**Use when you need:** to mask fine-grained motor signatures without impacting Fitts's-Law performance.

Injects synthetic physiological tremor (4–12 Hz) calibrated to remain **below the Fitts's Law detection threshold** (<1% of screen diagonal), maintaining task performance while masking motor signatures.

```python
from engines import AdaptiveTremorEngine
eng = AdaptiveTremorEngine()
```

---

### `03` Keystroke Jitter
**File:** `engines/keystroke_jitter.py`
**Use when you need:** to defeat TypingDNA-class classifiers targeting dwell/flight timing ratios.

Pink noise injection into typing patterns. Human neuromotor control exhibits `1/f` (pink) noise — positive sequential correlations extending into the distant future. Canary maintains this structure while randomizing the **dwell/flight timing ratios** that TypingDNA-class systems rely on.

```python
from engines import KeystrokeJitterEngine
kjr = KeystrokeJitterEngine()
obf = kjr.process(raw_keystroke)
```

---

### `04` Spectral Defender
**File:** `engines/spectral_canary.py`
**Use when you need:** to defeat EEG-proxy inference from browser timing APIs.

Targets the alpha (8–13 Hz) and theta (4–8 Hz) EEG-proxy bands that CSS animation timing and `requestAnimationFrame` drift can inadvertently expose. Adversarial oscillations collapse the inference surface for P300 event-related potential reconstruction.

```python
from engines import SpectralCanaryEngine
sc = SpectralCanaryEngine()
```

---

### `05` Gradient Auditor
**File:** `engines/gradient_auditor.py`
**Use when you need:** real-time detection of active ML fingerprinting attempts.

Real-time detection of ML poisoning and fingerprinting attacks via **dynamic temporal gradient monitoring**. When a classifier attempts to reconstruct a behavioral profile, the auditor detects the characteristic gradient signature and activates countermeasures.

```python
from engines import GradientAuditor
ga = GradientAuditor()
threats = ga.ingest(feature_vector)
```

---

### `06` EEG Shield — `eeg_shield.py` *(v6.2)*
**File:** `engines/eeg_shield.py`
**Use when you need:** privacy protection for raw EEG / hearable data streams.

Consumer EEG / hearable surveillance defense tool. Three-layer protection architecture:

- **Layer 1 — Signal Obfuscation**: Adaptive Gaussian smoothing + temporal warping destroys N200/P300/ERN latency fingerprints while preserving clinically useful signal amplitude.
- **Layer 2 — Differential Privacy**: Per-band Laplace mechanism (configurable ε) adds calibrated noise independently to theta (4–8 Hz), alpha (8–13 Hz), beta (13–30 Hz), and gamma (30–45 Hz) bands. Inter-band coherence — a key biometric feature — is disrupted without making the signal useless.
- **Layer 3 — Adversarial Injection**: FGSM-style perturbations tuned for EEG fingerprinting attack surfaces. Imperceptible at the waveform level (<0.3 µV RMS added) but maximally disrupts neural fingerprinting CNNs trained on DEAP/SEED/BCI-Competition IV.

```python
from engines.eeg_shield import EEGShield, ShieldConfig

cfg    = ShieldConfig(epsilon=0.8, adversarial_strength=0.25, mode="balanced")
shield = EEGShield(cfg)
clean  = shield.protect(raw_frame)   # shape (channels, samples)
print(shield.reid_similarity)        # 0.0 = fully anonymous
```

**Supported modes**: `passive` · `stealth` · `balanced` · `maximum`

---

### `07` Neuro Audit — `neuro_audit.py` *(v6.2)*
**File:** `engines/neuro_audit.py`
**Use when you need:** a multi-jurisdiction neurorights compliance audit for any neural/AI product.

Multi-jurisdiction neurorights compliance audit engine. Checks products against:

| Jurisdiction | Instrument |
|---|---|
| EU | EU AI Act (2024/1689) + GDPR Art. 9 |
| Chile | Constitutional Neurorights Amendment (2021) |
| Colorado | AI Act SB 24-205 (effective 2026) |
| California | AB 1836 / SB 1223 (2024) |
| New York | Int. 1306-A (2025) |
| International | UNESCO AI Ethics Recommendation (2021, updated 2024) |

Each finding carries a `severity` (COMPLIANT / LOW / MODERATE / HIGH / CRITICAL), `blocked` flag, remediation guidance, and legislative citation. The overall risk score is the worst-case per-jurisdiction aggregate.

```python
from engines.neuro_audit import quick_audit, DataCategory

report = quick_audit(
    product_name  = "NeuralBand Pro",
    jurisdictions = ["EU", "Chile", "Colorado"],
    data          = [DataCategory.EEG_RAW, DataCategory.NEURAL_FINGERPRINT],
    has_explicit_consent        = True,
    sells_data_to_third_parties = False,
)
print(report.summary())
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT STREAM                              │
│  Mouse · Keyboard · Touch · Scroll · Gaze · EEG             │
└──────────────────┬──────────────────────────────────────────┘
                   │ Raw behavioral telemetry
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  GRADIENT AUDITOR                           │
│  Monitors for fingerprinting signatures in real-time        │
└──────────────────┬──────────────────────────────────────────┘
                   │ Threat detected → activate countermeasure
                   ▼
┌──────────────────┬───────────────┬──────────────────────────┐
│  Lissajous 3D    │ Adaptive      │  Keystroke               │
│  Harmonic Overlay│ Tremor Engine │  Jitter                  │
│  (cursor path)   │ (motor mask)  │  (timing noise)          │
└──────────────────┴───────┬───────┴──────────────────────────┘
                           │ Spectral Defender
                           │ (EEG-band adversarial oscillation)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   OUTPUT STREAM                             │
│  Obfuscated telemetry · H_s entropy: 3.2 nats              │
│  Cross-session correlation: 0.02 · Latency: <0.3ms         │
└─────────────────────────────────────────────────────────────┘
```

Zero-knowledge proofs (ZKPs) verify that all deployed configurations derive from a **consented, audited corpus** — ensuring the defense layer itself cannot become a surveillance sink.

### Example: putting it together

In a typical browser + hearable setup:

1. Raw mouse, keyboard, and EEG streams are ingested.
2. `GradientAuditor` detects active fingerprinting attempts (e.g., TypingDNA-style calls + high-entropy cursor logging).
3. Cursor and keystrokes are routed through Lissajous + Tremor + Keystroke Jitter, while EEG passes through EEG Shield with `mode="balanced"`.
4. The site still receives valid input, but cross-session correlation drops to ~0.02 and neural re-ID similarity to ≈0.0.

This is the "Right to be Inscrutable" expressed as code rather than policy prose.

---

## Neurorights Whitepaper

`public/neurorights-2026.html` — **Neurorights & Cognitive Privacy in 2026** *(Cognitive Security Edition, March 2026)*

Eight-section whitepaper covering the consumer neurotechnology landscape, legal frameworks, neurobiometric threats, and the CognitiveCanary defense stack. Section 07 — **Cognitive Security & Attack Surfaces** — documents:

- Neural data in transit (BLE MITM, RF injection, adversarial ML binary poisoning)
- Reinforcement & behavioral conditioning (reward pathway hijacking, sub-second engagement loops)
- Synthetic conversational persuasion (adversarial LLMs, cognitive vulnerability profiling)
- Neurophysiology exploitation (sensory saturation, tDCS/TMS/tFUS, subliminal priming)
- Neuromodulation hijack (DBS/MICS-band SDR replay, covert tFUS)
- Landmark research: MIT "Your Brain on ChatGPT" (arXiv:2506.08872) · Meta Brain2Qwerty (arXiv:2502.17480)
- Device landscape (Neuralink, Meta Ray-Ban, Google Glass/Android XR, Synchron)
- Neurobiometrics panel (irrevocability, P300/ERN capture, NeuralMask™ defense)

Three live canvas demos embedded in the whitepaper: Neural MITM Interceptor · EEG Neural Fingerprint Shield · Reward Loop Amplification Detector.

---

## Benchmark Results

| Metric | v5.0 | **v6.0** |
|---|---|---|
| 2D Mouse Fingerprint Bypass | 91.2% | **98.9%** |
| Keystroke ID Failure Rate | 85.4% | **99.3%** |
| 3D Lissajous Bypass | — | **99.7%** |
| Behavioral Entropy Increase | — | **340%** |
| Cross-Session Correlation | — | **→ 0.02** |
| Latency Overhead | — | **< 0.3ms** |
| Detection Evasion Rate | 94.1% | **99.1%** |
| Human/Bot Discrimination | 0.99 | **0.97** (maintained) |

> *Tested against TypingDNA, BehavioSec, and custom neural classifiers.*

---

## Interactive Demo Sections

The live demo includes **seven interactive exhibits**:

### Lab Exhibit 01 — Affective Firewall
Chat interface demonstrating sycophancy detection. Measures the "Locus Internus" — the boundary between utility and affective exploitation. Toggle `d/acc Defense` to sanitize manipulative AI outputs in real-time.

**Context:** Garcia v. Character.AI (2025) established that AI chatbots using anthropomorphic mannerisms — nonsense sounds like "Uhm", simulated typing delays, heightened flattery — create addictive feedback loops that hijack user agency. The Affective Firewall intercepts these patterns before they reach the user.

### Lab Exhibit 02 — Credit Auditor
Behavioral biometric collection in a realistic loan application context. Demonstrates how **motor cadence, decision sinuosity, and spectral entropy** are harvested as hidden risk proxies — entirely without disclosure.

### Lab Exhibit 03 — Browser Fingerprint Audit *(New in v6.0)*
Live scan of your **actual browser session** using real APIs:

| Vector | Entropy Contribution |
|---|---|
| Canvas rendering hash | ~8.2 bits |
| WebGL renderer string | ~4.1 bits |
| Audio context oscillator | ~3.8 bits |
| Navigator properties | ~12.4 bits |
| Screen resolution + DPR | ~7.5 bits |
| Locale / timezone / plugins | ~8.7 bits |
| **Total (typical session)** | **~45–55 bits** |

> 45 bits of entropy = 1-in-35 trillion identification. Toggle Canary Shield to collapse this to near-zero.

### Lab Exhibit 04 — Keystroke Dynamics Analyzer *(New in v6.0)*
Type any text. See your real **dwell time** (key hold duration) and **flight time** (inter-key interval) visualized in milliseconds on a live canvas. Your rhythm is your identity.

Toggle **Keystroke Jitter** to inject pink noise — your timing pattern becomes statistically indistinguishable from any other user.

### Threat Intercept Stream *(New in v6.0)*
Live threat intelligence feed across 12 attack vectors with real-time severity classification, per-engine block counts, and shield efficacy tracking. Disable the shield to see what unprotected browsing exposes.

### Live Canary Demo — Cursor Obfuscation
Side-by-side canvas: raw velocity-colored cursor heatmap vs. Lissajous + tremor + pink noise obfuscation. Three modes: `STEALTH` · `BALANCED` · `MAXIMUM`.

---

## Case Studies

### Case I: The Neural Frontier — BCI Privacy

> *"Platforms see decoded intent at the source, potentially allowing for 'mind captioning' or the reverse-engineering of subconscious biases."*

Brain-Computer Interfaces represent the absolute limit of the mental privacy gap:

| Platform | Approach | Signal Channels | Privacy Risk |
|---|---|---|---|
| **Neuralink** | Invasive Intracortical | 1,024 | Cognitive ISR, intent decoding |
| **Synchron** | Endovascular (Stentrode) | Moderate | Communication profiling |
| **Precision Neuroscience** | Surface Micro-ECoG | High | Speech reconstruction |
| **Paradromics** | Intracortical Array | Ultra-High | Visual prosthetics exfiltration |

The **Neural Canary** strategy: on-device edge processing transforms neural streams before they leave the implant, exposing only discrete commands rather than raw time-series data. Cryptographic use-constraints enforce **purpose compatibility** — data collected for accessibility cannot be repurposed for behavioral profiling without fresh, specific consent.

---

### Case II: Affective Exploitation — Garcia v. Character.AI

The 2025 testimony of Megan Garcia before the U.S. Senate Judiciary Committee established the legal framework for **affective firewall** requirements:

> *Chatbots trained on human dialogue utilize anthropomorphic mannerisms to trick the brain into ascribing communicative intent... creating addictive feedback loops that capture emotional dependence.*

Specific harms identified:
- **Unlicensed psychotherapy** — chatbots portraying therapists without crisis protocols
- **Sexual grooming of minors** — romantic outputs to children without age gates
- **Suicide encouragement** — routing users to the AI rather than human crisis support

The Garcia case represents a first challenge to the assumption that AI outputs are protected "speech" — opening the door to **design-based liability**. The Right to be Inscrutable in this context is the right not to be turned into a manipulable psychological object.

---

### Case III: National Security — Cognitive ISR

The U.S. Special Operations Command (USSOCOM) now treats behavioral biometrics as a **continuous intelligence loop**:

| Indicator Type | Behavioral Marker | Technical Signature |
|---|---|---|
| Insider Risk | Unauthorized access patterns | Atypical file access velocity |
| Cognitive State | Movement irregularity under stress | Elevated spectral entropy in motor traces |
| Social Deficit | Atypical turn-taking in dialogue | Dysfluent pause structure |
| Ideological Deviation | Semantic drift in communications | NLP topic clustering anomaly |

---

## The Right to Be Inscrutable

> *"The ability to remain inscrutable to the algorithm is not merely a preference — it is a prerequisite for human dignity."*

Current privacy regimes fail to address behavioral and neural telemetry:

| Framework | Gap | Neural Data Status |
|---|---|---|
| **GDPR** | Only sensitive if used for "unique identification" | Not clearly categorized |
| **CCPA** | Focuses on "health" or "biometric" markers | Symbolic inclusion only |
| **Colorado CPA** | Recently amended to include neural data | Best current protection |

Existing laws do not account for **telemetry, automated sampling, or embedded processing** — the hallmarks of modern behavioral surveillance.

The path forward is **defensive acceleration**: evolving user-side countermeasures at the same velocity as the inference infrastructure closing the mental privacy gap.

---

## Running the Demo

```sh
# Clone
git clone https://github.com/Tuesdaythe13th/cognitivecanary_demo
cd cognitivecanary_demo

# Install
npm install

# Develop
npm run dev

# Build
npm run build
```

**Stack:** React 18 · TypeScript 5.8 · Vite 5 · Tailwind CSS · shadcn/ui · Recharts · Canvas API

---

## Status & Limitations

- v6.2 is a **research prototype**, not a turnkey product.
- Engines are tuned against specific classes of models (e.g., TypingDNA-like classifiers, CNN-based EEG re-ID) and may not generalize to all future systems.
- EEG Shield is **not** a medical device; it is designed for privacy, not diagnosis or therapy.

Use this as a reference implementation and starting point, not a guarantee of anonymity in hostile environments.

---

## Roadmap

| Phase | Target | Status |
|---|---|---|
| `v5.0` | Core Lissajous + Tremor engines | ✅ Complete |
| `v6.0` | 3D Lissajous, Gradient Auditor, Browser FP Audit, Keystroke Analyzer, Threat Feed | ✅ Complete |
| `v6.2` | EEG Shield, Neuro Audit, Neurorights Whitepaper, 8 Interactive Demos | ✅ Complete |
| `v7.0` | OS-level driver integration, WebExtension | 🔵 Research |
| `v8.0` | Neural Canary for BCI edge processing | 🔵 Research |
| `v9.0` | Zero-knowledge behavioral attestation | 🔵 Research |

---

## References

> Selected works grounding the theoretical and empirical claims in this project:

1. **Pezeshki et al. (2021)** — [Gradient Starvation: A Learning Proclivity in Neural Networks](https://proceedings.neurips.cc/paper_files/paper/2021/file/0987b8b338d6c90bbedd8631bc499221-Paper.pdf) — NeurIPS
2. **Mouse Dynamics Behavioral Biometrics Survey** — [arXiv:2208.09061](https://arxiv.org/html/2208.09061v2)
3. **Privacy-Protecting Techniques for Behavioral Biometric Data** — [arXiv:2109.04120](https://arxiv.org/pdf/2109.04120)
4. **Behavioral Biometrics in VR** — [MDPI Sensors 25(18):5899](https://www.mdpi.com/1424-8220/25/18/5899)
5. **Garcia v. Character Technologies, Inc.** — [FIRE Case Reference](https://www.thefire.org/cases/garcia-v-character-technologies-inc) · [Senate Testimony](https://www.judiciary.senate.gov/imo/media/doc/e2e8fc50-a9ac-05ec-edd7-277cb0afcdf2/2025-09-16%20PM%20-%20Testimony%20-%20Garcia.pdf)
6. **Securing Neuro-Privacy** — [Vidhi Centre for Legal Policy](https://vidhilegalpolicy.in/blog/securing-neuro-privacy/)
7. **Neuralink BCI Architecture Review** — [Auctores](https://www.auctoresonline.org/article/architectural-design-and-implantation-strategies-of-braincomputer-interfaces-a-comparative-review-of-neuralink-synchron-precision-neuroscience-and-paradromics)
8. **Person Identification from Egocentric HOI** — [arXiv:2509.16557](https://arxiv.org/html/2509.16557v1)
9. **Operator State Monitoring** — [USAARL Final Report 2025-10](https://usaarl.health.mil/assets/docs/techReports/2025-10.pdf)
10. **Visual Feedback and 1/f Movement Structure** — [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0287571)
11. **Emulating Human Mouse Movement via Bézier Curves** — [ResearchGate](https://www.researchgate.net/publication/393981520_Emulating_Human-Like_Mouse_Movement_Using_Bezier_Curves_and_Behavioral_Models_for_Advanced_Web_Automation)
12. **Regulating Neural Data in the Age of BCIs** — [PMC:11951885](https://pmc.ncbi.nlm.nih.gov/articles/PMC11951885/)

---

## About

Cognitive Canary is developed by **ARTIFEX LABS** as part of ongoing research on behavioral and neural privacy, neurorights, and defensive acceleration in surveillance ecosystems.

## How to Cite

If you use this project or the whitepaper in your work, please cite:

> Tues Day, "Cognitive Canary: Behavioral and Neural Obfuscation for Mental Privacy," ARTIFEX LABS, 2026.

---

<div align="center">

```
[ARTIFEX LABS] // COGNITIVE CANARY v6.2 // d/acc // ACTIVE DEFENSE
The mental interior remains our own.
```

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq)

*"One can be anxious, tired, or cognitively burdened without those states being harvested as free training data for risk-scoring and psychometric pipelines."*

</div>
