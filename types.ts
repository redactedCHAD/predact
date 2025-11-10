
export const ResearchAgentTypes = {
  SOCIAL_MEDIA: 'Social Media',
  WEB_SEARCH: 'Web Search/News',
  FINANCE: 'Finance',
  GEOPOLITICAL: 'Geopolitical',
  MACROECONOMIC: 'Macroeconomic',
} as const;

export type ResearchAgentType = typeof ResearchAgentTypes[keyof typeof ResearchAgentTypes];

export type Leaning = 'YES' | 'NO' | 'NEUTRAL';
export type Outcome = 'YES' | 'NO' | 'UNCERTAIN';

export interface Debate {
  summary: string;
  contradictionScore: number;
}

export interface ResearchReport {
  agentType: ResearchAgentType;
  keyFindings: string[];
  summary: string;
  leaning: Leaning;
  debate?: Debate;
}

export interface Consensus {
  outcome: Outcome;
  confidence: number;
  summary: string;
}

export interface Source {
  uri: string;
  title: string;
}

export interface AnalysisResult {
  marketQuestion: string;
  researchReports: (ResearchReport & { sources: Source[] })[];
  consensus: Consensus;
  allSources: Source[];
}

// Fix: Add missing TeamAnalysis type definition for use in components/TeamPanel.tsx.
export interface TeamAnalysis {
  confidence: number;
  arguments: string[];
}

// Fix: Add missing Agent type definition for use in components/AgentDashboard.tsx.
export interface Agent {
  id: string;
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro';
}
