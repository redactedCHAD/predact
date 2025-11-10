
export interface Agent {
  id: string;
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro';
}

export interface TeamAnalysis {
  arguments: string[];
  confidence: number;
}

export type Outcome = 'YES' | 'NO' | 'UNCERTAIN';

export interface Consensus {
  outcome: Outcome;
  confidence: number;
  summary: string;
}

export interface Source {
  uri: string;
  title: string;
}

export interface IndividualAnalysis {
    agentModel: string;
    yesTeam: TeamAnalysis;
    noTeam: TeamAnalysis;
}

export interface AnalysisResult {
  marketQuestion: string;
  individualAnalyses: IndividualAnalysis[];
  consensus: Consensus;
  allSources: Source[];
}
