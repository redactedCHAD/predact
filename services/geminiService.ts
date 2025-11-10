
import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult, Source, Consensus, ResearchReport, ResearchAgentType, Debate } from "../types";
import { ResearchAgentTypes } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseJsonResponse = <T,>(text: string): T | null => {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]) as T;
    } catch (e) {
      console.error("Failed to parse JSON:", text, e);
      return null;
    }
  }
  // Fallback for cases where the model forgets the markdown block
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    // Not a JSON string
  }

  console.error("Could not find or parse JSON in text:", text);
  return null;
};

const extractSources = (result: any): Source[] => {
    return result.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web as Source)
        .filter((source: Source | undefined): source is Source => source !== undefined) || [];
};

const getAgentPrompt = (agentType: ResearchAgentType, marketQuestion: string): string => {
  const commonInstructions = `
You are a world-class specialist research agent. Your task is to analyze the following prediction market question from your unique perspective: "${marketQuestion}".

Use Google Search to find the most relevant, up-to-date information.
Present your findings as a JSON object inside a markdown code block.
The JSON object must strictly follow JSON standards. Ensure that any double quotes within string values are properly escaped with a backslash (e.g., "an argument with a \\"quoted phrase\\" inside").
The JSON object must have three keys:
1. "keyFindings": An array of 3-5 concise, impactful string bullet points summarizing your most important findings.
2. "summary": A 2-3 sentence paragraph explaining your analysis and reasoning.
3. "leaning": A string that must be one of "YES", "NO", or "NEUTRAL", representing your perspective's overall sentiment on the question.
`;

  switch (agentType) {
    case ResearchAgentTypes.SOCIAL_MEDIA:
      return `As a Social Media Analyst, your focus is on public sentiment and discourse. Analyze trends, arguments, and opinions from platforms like X and Reddit. ${commonInstructions}`;
    case ResearchAgentTypes.WEB_SEARCH:
      return `As a News & Web Search Analyst, your focus is on credible, factual information. Analyze recent news articles, official reports, and expert publications. ${commonInstructions}`;
    case ResearchAgentTypes.FINANCE:
      return `As a Financial Analyst, your focus is on economic and market implications. Analyze financial statements, market trends, stock prices, and investor reports. ${commonInstructions}`;
    case ResearchAgentTypes.GEOPOLITICAL:
      return `As a Geopolitical Analyst, your focus is on international relations and political risk. Analyze government policies, treaties, diplomatic statements, and regional stability. ${commonInstructions}`;
    case ResearchAgentTypes.MACROECONOMIC:
      return `As a Macroeconomic Analyst, your focus is on broad economic trends. Analyze GDP, inflation, employment data, and central bank policies. ${commonInstructions}`;
    default:
      throw new Error(`Unknown agent type: ${agentType}`);
  }
};


export async function analyzeMarketUrl(url: string): Promise<AnalysisResult> {
  // Step 1: Extract the market question
  const questionPrompt = `Given this Polymarket URL: ${url}, what is the specific binary (YES/NO) question being asked? Please state the question clearly and concisely, without any additional text or pleasantries.`;
  const questionResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: questionPrompt,
  });
  const marketQuestion = questionResponse.text.trim();

  // Step 2: Run specialized agent analyses in parallel
  const researchAgents: ResearchAgentType[] = Object.values(ResearchAgentTypes);
  const agentAnalysisPromises = researchAgents.map(async (agentType) => {
    const prompt = getAgentPrompt(agentType, marketQuestion);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });

    const report = parseJsonResponse<Omit<ResearchReport, 'agentType' | 'debate'>>(result.text) || {
      keyFindings: [`Failed to get a valid report from ${agentType} agent.`],
      summary: 'Analysis could not be completed due to a parsing error.',
      leaning: 'NEUTRAL'
    };
    
    const sources = extractSources(result);
    return { ...report, agentType, sources };
  });

  const initialReports = await Promise.all(agentAnalysisPromises);

  // Step 2.5: Analyze contradictions between agents
  // FIX: Explicitly type reportsWithDebates to resolve a TypeScript union type inference
  // issue. This ensures the array elements are correctly typed with an optional `debate`
  // property, allowing safe access in later code.
  const reportsWithDebates: (ResearchReport & { sources: Source[] })[] = await Promise.all(initialReports.map(async (currentReport) => {
    const otherReports = initialReports.filter(r => r.agentType !== currentReport.agentType);
    
    const debatePrompt = `You are a debate moderator. Analyze the following research report from the "${currentReport.agentType}" agent in the context of reports from other agents on the market question: "${marketQuestion}".

**${currentReport.agentType.toUpperCase()} AGENT REPORT:**
- Leaning: ${currentReport.leaning}
- Summary: ${currentReport.summary}

**OTHER AGENT REPORTS:**
${otherReports.map(r => `- ${r.agentType} (Leaning: ${r.leaning}): ${r.summary}`).join('\n')}

Your task is to:
1. Identify if the ${currentReport.agentType} agent's report significantly contradicts any of the other reports. A simple difference in leaning is not enough; look for opposing facts, reasoning, or conclusions.
2. If there are no major contradictions, return a JSON object with "hasContradiction": false.
3. If there ARE significant contradictions, return a JSON object with:
   - "hasContradiction": true
   - "summary": A 1-2 sentence summary describing the core of the disagreement (e.g., "The Social Media agent's findings of positive sentiment directly oppose the Financial agent's analysis of negative market indicators.").
   - "contradictionScore": A number from 0-100 quantifying the severity of the contradiction.

Provide your response as a JSON object inside a markdown code block.`;

    const debateResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: debatePrompt,
    });
    
    const debateResult = parseJsonResponse<{ hasContradiction: boolean; summary?: string; contradictionScore?: number; }>(debateResponse.text);

    if (debateResult && debateResult.hasContradiction && debateResult.summary && debateResult.contradictionScore) {
      return { 
        ...currentReport, 
        debate: {
          summary: debateResult.summary,
          contradictionScore: debateResult.contradictionScore
        }
      };
    }
    
    return currentReport;
  }));
  
  const researchReports = reportsWithDebates;

  // Step 3: Generate master consensus with the Orchestrator Agent
  let consensusPrompt = `You are a neutral, master Research Orchestrator moderating a debate on the question: "${marketQuestion}". You have received reports from 5 specialist AI agents. Your task is to synthesize all findings into a final, definitive consensus report.

Here are the specialist reports:\n\n`;

  researchReports.forEach((report) => {
    consensusPrompt += `--- REPORT FROM ${report.agentType.toUpperCase()} AGENT ---\n`;
    consensusPrompt += `Leaning: ${report.leaning}\n`;
    consensusPrompt += `Summary: ${report.summary}\n`;
    consensusPrompt += `Key Findings:\n${report.keyFindings.map(f => `- ${f}`).join('\n')}\n`;
    if (report.debate) {
      consensusPrompt += `Point of Contention: ${report.debate.summary}\n`;
    }
    consensusPrompt += `------------------------------------------\n\n`;
  });

  consensusPrompt += `Based on ALL the provided reports, weigh the evidence from each specialist perspective. Identify areas of agreement and contradiction. Determine the most likely outcome.
Present your final analysis as a JSON object inside a markdown code block.
The JSON object must strictly follow JSON standards. Ensure that any double quotes within string values are properly escaped.
The JSON object must have three keys:
1. "outcome": a string which must be one of "YES", "NO", or "UNCERTAIN".
2. "confidence": a number from 0-100 representing certainty in your final synthesized conclusion.
3. "summary": a concise string (3-4 sentences) explaining your reasoning, highlighting how you synthesized the different agent perspectives to reach your conclusion.`;
    
  const consensusResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Master orchestrator always uses the most powerful model
      contents: consensusPrompt,
  });

  const consensus = parseJsonResponse<Consensus>(consensusResponse.text) || { outcome: 'UNCERTAIN', confidence: 0, summary: 'Could not determine a final consensus from the agent reports.' };
  
  // Step 4: Aggregate and deduplicate sources
  const allSourcesMap = new Map<string, Source>();
  researchReports.flatMap(r => r.sources).forEach(source => {
      if (source && source.uri && !allSourcesMap.has(source.uri)) {
          allSourcesMap.set(source.uri, source);
      }
  });

  return {
    marketQuestion,
    researchReports,
    consensus,
    allSources: Array.from(allSourcesMap.values()),
  };
}