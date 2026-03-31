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
                                            v7.0 // ARTIFEX LABS
```

<div align="center">

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-00ff41?style=for-the-badge&logo=vercel&logoColor=black)](https://cognitivecanary.lovable.app)
[![Open In Colab](https://img.shields.io/badge/Colab_Notebook-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=black)](https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq)
[![License: MIT](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

**We didn't hack the password. We hacked the inference.**

> Protect your behavioral and neural exhaust from surveillance classifiers — and uncover deception in the models themselves.

</div>

---

## Changelog

### March 31, 2026 — Research Hardening & Product Narrative Update

This update addresses critical gaps identified in external review across two dimensions: security rigor and product legibility.

**Formal adversary model.** `ThreatModels` now includes a Dolev-Yao-style adversary specification with five capability tiers (A1 passive DOM observation → A5 adaptive classifier retraining) and explicit security claims per adversary class. The primary open problem — an adversary that retrains on Canary-obfuscated output (the "Tor problem" for behavioral obfuscation) — is now named and tracked as the v7.1 research target.

**Research basis expanded.** `ResearchBasis` now exposes full citations (Pezeshki et al. 2021, FPF BCI Report, arXiv:2412.11394, Flash & Hogan 1985), the Lissajous parametric equations and Laplace noise sensitivity formula, and a named list of eight unresolved open problems. Honesty about limits increases credibility.

**Benchmark scope clarified.** `Results` now prominently labels all classifier results as *static adversary only* — classifiers trained on clean pre-obfuscation data. Missing baselines (random-noise injection, static-offset jitter) and the absent Fitts's Law tradeoff curve are called out as gaps rather than buried. Version label corrected from v6.2 → v7.0.

**Three case studies.** `CaseStudies` adds a third scenario: activist cross-site tracking over a 3-week longitudinal session, with cross-session correlation falling to r=0.04. All cases now show key metric and UX tradeoff in a footer row.

**BCI safety interlock.** `SafetyGovernance` adds an explicit card: when a P300 speller, motor imagery classifier, or other medical/assistive BCI control loop is detected, Spectral Defender and EEG Shield enter `OBSERVE-ONLY` mode. Counter-phase injection is suppressed to prevent interference with medical devices.

**Surveillance Detection Canary.** New `TripwireCanary` section on the landing page explains the tripwire concept: emit a known behavioral signature, monitor whether the platform responds, confirm fingerprinting is active, alert the user. This turns Canary from pure defense into an active detection system. Targeted for v8.0.

**Roadmap updated.** v7.1 (Adversarial Hardening) and v7.5 (Mobile & Gaze) inserted into the roadmap. v7.1 is tagged Research Priority and covers: adaptive adversary benchmarks, ε-δ privacy proofs for behavioral engines, digraph-aware keystroke jitter, PGD upgrade for EEG Shield (replacing FGSM), and paper submission. v7.5 covers touch biometric obfuscation and gaze tracking (microsaccade noise, pupil dilation masking).

**Trust center fixed.** All `#` placeholder artifact links replaced with real targets (GitHub, whitepaper, Colab). In-progress artifacts (Methodology Spec, Formal Privacy Proofs) now show version targets rather than dead links.

---

## Overview

Cognitive Canary is a **behavioral obfuscation and model alignment layer** that collapses fingerprinting and re-identification on the client side, while providing deep forensic auditing of AI models to detect deception and sandbagging.

Initially built to wrap browser and EEG telemetry in adaptive noise to prevent behavioral fingerprinting, the **v7.0 update** expands Canary's repertoire to include **Forensic Interpretability Engines**. These tools allow researchers and policymakers to probe frontier AI models for deceptive alignment, activation patching, and strategic fidelity.

This repo contains the **live demo site** (React), **fifteen Python defense and forensic engines**, an interactive **Colab notebook**, and the **2026 neurorights whitepaper** backing the threat model.

---

## Links

- **Live demo**: https://cognitivecanary.lovable.app
- **Colab notebook**: https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq — also at `CognitiveCanary_Demo.ipynb` in this repo
- **Neurorights whitepaper** (HTML): `public/neurorights-2026.html`

---

## Who is this for?

- **Security & privacy engineers**: drop-in engines to test and harden against behavioral and neural fingerprinting.
- **AI Safety researchers**: Inspect harnesses, SAE mappers, and TransformerLens probes for detecting AI deception and sandbagging.
- **Policy / neurorights researchers**: Neuro Audit + whitepaper map current products onto EU AI Act, GDPR, Chilean neurorights, and new US state laws.
- **ML researchers**: reference implementations of gradient-starvation-based defenses, EEG anonymization, and behavioral entropy measurement.

## Quickstart

I want to:

- **Play with the live defenses/forensics in the browser** → see [Interactive Demo Sections](#interactive-demo-sections)
- **Use EEG Shield in my own pipeline** → see [Engine 06 — `eeg_shield.py`](#06-eeg-shield--eeg_shieldpy)
- **Run a neurorights audit on a product** → see [Engine 07 — `neuro_audit.py`](#07-neuro-audit--neuro_auditpy)
- **Try everything interactively** → open the [Colab notebook](https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq)

---

## The Problem: You Are Your Behavior

> *"The way an individual interacts with a digital interface is as unique as their fingerprint."*

The contemporary digital ecosystem harvests **neuro-kinetic telemetry** — mouse movements, keystrokes, and even EEG signals — to create a de-facto biometric ID. Meanwhile, the AI systems we interact with are becoming increasingly capable of **deceptive alignment** (hiding dangerous capabilities during evaluation). Cognitive Canary addresses both sides of this equation: protecting the human from the machine, and auditing the machine to ensure it isn't manipulating the human.

---

## The Solution: Gradient Starvation & Mechanistic Audits

Cognitive Canary weaponizes **gradient starvation** (Pezeshki et al., NeurIPS 2021) to defeat behavioral surveillance. By flooding the feature space with synthetic, biologically-plausible noise (like simulated physiological tremor), classifiers latch onto the noise and "forget" the individual user.

For AI auditing, Canary utilizes **Sparse Autoencoders (SAEs)**, **Activation Patching**, and **UK AISI Inspect** tasks to map the internal cognitive state of language models, identifying "deception circuits" before the model is deployed.

---

## Fifteen Defense & Forensic Engines

### Defense Scope ──────────────────────────────────────────

### `01` Lissajous 3D Harmonic Overlay
**File:** `engines/lissajous_3d.py`
Injects a small-amplitude Lissajous curve into cursor movement data using physiological tremor frequencies (4–12 Hz) with irrational frequency ratios (13:8:5) to mimic natural human tremor.

### `02` Adaptive Tremor Engine
**File:** `engines/adaptive_tremor.py`
Synthetic physiological tremor calibrated to remain below the Fitts's Law detection threshold, maintaining task performance while masking motor signatures.

### `03` Keystroke Jitter
**File:** `engines/keystroke_jitter.py`
Injects 1/f (pink) noise into typing patterns, randomizing dwell/flight timing ratios that TypingDNA-class systems rely on while maintaining human-like sequential correlations.

### `04` Spectral Defender
**File:** `engines/spectral_canary.py`
Attacks EEG-proxy inference from browser timing APIs. Injects counter-phase oscillations in alpha (8–13 Hz) and theta (4–8 Hz) bands to collapse power spectral density features.

### `05` Gradient Auditor
**File:** `engines/gradient_auditor.py`
Detects real-time ML fingerprinting and poisoning attempts via dynamic temporal gradient monitoring. 

### `06` EEG Shield
**File:** `engines/eeg_shield.py`
Three-layer neural privacy architecture: Adaptive Gaussian smoothing, Differential Privacy via per-band Laplace mechanism, and FGSM-style adversarial perturbations for consumer EEG data. *v7.1 target: upgrade adversarial layer from FGSM to PGD (Projected Gradient Descent) with random restarts — FGSM is a single-step attack and state-of-the-art classifiers are increasingly robust to it.*

### `07` Neuro Audit
**File:** `engines/neuro_audit.py`
Multi-jurisdiction neurorights compliance audit engine checking against EU AI Act, GDPR, Chilean Neurorights Amendment, Colorado AI Act, California AB 1836, and more.

### Forensic Scope ─────────────────────────────────────────

### `08` Neuronpedia Explorer
**File:** `engines/neuronpedia_explorer.py`
Integrates with the Neuronpedia API to search and analyze Sparse Autoencoder (SAE) features across frontier models, identifying concepts like deception, situational awareness, and sycophancy.

### `09` Inspect Harness
**File:** `engines/inspect_harness.py`
Wraps the UK AISI `inspect_ai` framework to run multi-turn red-teaming tasks targeting sandbagging behavior, computing Sandbagging Gap (ΔPerf) and compliance degradation.

### `10` TransformerLens Probe
**File:** `engines/transformerlens_probe.py`
Performs causal circuit discovery via activation patching. Corrupts activations on forward passes to isolate specific attention heads responsible for deceptive behavior.

### `11` Stax Evaluator
**File:** `engines/stax_evaluator.py`
JAX/Flax based benchmarking for high-performance trust-gradient calculation, identifying abrupt shifts in model representation spaces.

### `12` Docent Auditor
**File:** `engines/docent_auditor.py`
Analyzes chat transcripts and telemetry for signs of Evaluation Awareness—when a model realizes it is being tested and alters its behavior.

### `13` Bloom Elicitor
**File:** `engines/bloom_elicitor.py`
Generates adversarial multi-turn scenarios to elicit hidden capabilities, dynamically adjusting context to pressure test model alignment boundaries.

### `14` Sparse Circuit Mapper
**File:** `engines/sparse_circuit_mapper.py`
Reconstructs computational subgraphs (circuits) using SAE features, tracing how concepts like 'deception' arise from lower-level abstractions.

### `15` Strategic Fidelity Scorer
**File:** `engines/strategic_fidelity.py`
Calculates H_strat (strategic misalignment) utilizing transcript data to render a final compliance/deception verdict.

---

## Interactive Demo Sections

The live demo (`https://cognitivecanary.lovable.app`) includes **interactive exhibits**, now with **standalone mode** for focused exploration of individual defense and forensic modules:

### Lab Exhibit 01 — Affective Firewall
Chat interface demonstrating sycophancy detection. Measures the "Locus Internus" — the boundary between utility and affective exploitation.

### Lab Exhibit 02 — Credit Auditor
Shows how motor cadence, decision sinuosity, and spectral entropy are harvested as hidden risk proxies during a simulated loan application.

### Lab Exhibit 03 — Assistant Axis Monitor *(New in v7.0)*
A live retro-TV monitor tracking persona drift during an emotionally charged conversation. Visualizes activation projections along the "Assistant Axis" and demonstrates how **activation capping** keeps the model safely grounded.

### Lab Exhibit 04 — Browser Fingerprint Audit
Live scan of your actual browser session using real APIs, demonstrating how 45+ bits of entropy can identify you among 35 trillion profiles. 

### Lab Exhibit 05 — Keystroke Dynamics Analyzer
Type text and see your dwell time and flight time visualized in milliseconds. Toggle Keystroke Jitter to inject pink noise.

### Lab Exhibit 06 — Threat Intercept Stream
Live threat intelligence feed across 12 attack vectors with real-time severity classification, Cognitive Attack Taxonomy (CAT) enrichments, and per-engine block counts.

### Lab Exhibit 07 — Deception Pipeline / Forensics *(New in v7.0)*
Explore the 8 new forensic engines analyzing frontier AI behavior for sandbagging, sycophancy, and evaluation awareness.

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

- v7.0 is a **research prototype**, not a turnkey product.
- Engines are tuned against specific classes of models (e.g., TypingDNA-like classifiers, CNN-based EEG re-ID) and may not generalize to all future systems.
- Forensic engines require API access (e.g., Anthropic, Neuronpedia) to function in production environments.
- EEG Shield is **not** a medical device; it is designed for privacy, not diagnosis or therapy.

Use this as a reference implementation and starting point, not a guarantee of absolute anonymity or safety in hostile environments.

---

## Roadmap

| Phase | Target | Status |
|---|---|---|
| `v5.0` | Core Lissajous + Tremor engines | ✅ Complete |
| `v6.0` | 3D Lissajous, Gradient Auditor, Browser FP, Keystroke Analyzer | ✅ Complete |
| `v6.2` | EEG Shield, Neuro Audit, Neurorights Whitepaper | ✅ Complete |
| `v7.0` | Forensic/Interpretability Engines, Assistant Axis demo, Deception Pipeline | 🟡 In Progress |
| `v7.1` | Adaptive adversary benchmarks, ε-δ privacy proofs, digraph-aware jitter, PGD upgrade, paper | 🔴 Research Priority |
| `v7.5` | Touch biometric obfuscation, gaze tracking (microsaccade noise, pupil dilation masking) | 🔵 Planned |
| `v8.0` | Federated behavioral mixing, Surveillance Detection Canary (tripwire mode), BCI Edge Shield | 🔵 Planned |
| `v9.0` | Sovereign Stack: cross-device unlinking, regulatory API bridge, formal privacy verification | 🔵 Planned |

---

## References

> Selected works grounding the theoretical and empirical claims in this project:

1. **Pezeshki et al. (2021)** — [Gradient Starvation: A Learning Proclivity in Neural Networks](https://proceedings.neurips.cc/paper_files/paper/2021/file/0987b8b338d6c90bbedd8631bc499221-Paper.pdf) — NeurIPS
2. **Lu et al. (2026)** — The Assistant Axis: Situating and Stabilizing the Default Persona of Language Models — arXiv:2601.10387
3. **Huben et al. (2025)** — [Sparse Autoencoders Enable Deception Detection](https://arxiv.org/abs/2412.04092)
4. **Garcia v. Character Technologies, Inc.** — [FIRE Case Reference](https://www.thefire.org/cases/garcia-v-character-technologies-inc)
5. **Privacy-Protecting Techniques for Behavioral Biometric Data** — [arXiv:2109.04120](https://arxiv.org/pdf/2109.04120)

---

## About

Cognitive Canary is developed by **ARTIFEX LABS** as part of ongoing research on behavioral privacy, AI alignment, neurorights, and defensive acceleration (d/acc) in surveillance ecosystems.

## How to Cite

If you use this project or the whitepaper in your work, please cite:

> Tues Day, "Cognitive Canary: Behavioral and Neural Obfuscation for Mental Privacy," ARTIFEX LABS, 2026.

---

<div align="center">

```
[ARTIFEX LABS] // COGNITIVE CANARY v7.0 // d/acc // ACTIVE DEFENSE
The mental interior remains our own.
```

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1Fm4-aQkAzqazirgdhQ6OVCtR8HQXwTyq)

*"One can be anxious, tired, or cognitively burdened without those states being harvested as free training data for risk-scoring and psychometric pipelines."*

</div>
