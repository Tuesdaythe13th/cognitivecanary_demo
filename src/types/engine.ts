export type EngineCategory =
  | "privacy"
  | "neural"
  | "monitoring"
  | "forensics"
  | "governance";

export type DataMode = "mock" | "live";
export type EngineStatus = "active" | "prototype" | "api-required";

export interface ExhibitMetric {
  label: string;
  value: string | number;
  delta?: string;
  direction?: "up" | "down" | "neutral";
  description: string;
}

export interface VerdictState {
  title: string;
  summary: string;
  tone: "safe" | "warning" | "critical" | "informational";
}

export interface ExhibitCTA {
  label: string;
  action: "activate" | "run" | "analyze" | "simulate" | "export";
}

export interface ExhibitPanelSpec {
  title: string;
  description: string;
  visualization?: string;
}

export interface EngineDefinition {
  id: string;
  index: number;
  slug: string;
  title: string;
  fileName: string;
  category: EngineCategory;
  status: EngineStatus;
  shortDescription: string;
  inputLabel: string;
  metricLabel: string;
  verdictLabel: string;
  baselineSpec: ExhibitPanelSpec;
  activeSpec: ExhibitPanelSpec;
  cta: ExhibitCTA;
  limitations: string;
  supportsLiveMode: boolean;
  supportsMockMode: boolean;
  tags: string[];
}
