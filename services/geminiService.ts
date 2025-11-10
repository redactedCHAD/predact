
import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult, Source, TeamAnalysis, Consensus, Agent, IndividualAnalysis } from "../types";

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
  console.error("Could not find JSON block in text:", text);
  return null;
};

const extractSources = (result: any): Source[] => {
    return result.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web as Source)
        .filter((source: Source | undefined): source is Source => source !== undefined) || [];
};

export async function analyzeMarketUrl(url: string, agents: Agent[]): Promise<AnalysisResult> {
  // Step 1: Extract the market question
  const questionPrompt = `Given this Polymarket URL: ${url}, what is the specific binary (YES/NO) question being asked? Please state the question clearly and concisely, without any additional text or pleasantries.`;
  const questionResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: questionPrompt,
  });
  const marketQuestion = questionResponse.text.trim();

  // Step 2: Run individual agent analyses in parallel
  const individualAnalysisPromises = agents.map(async (agent): Promise<IndividualAnalysis & { sources: Source[] }> => {
    const teamPrompts = {
      yes: `You are an expert analyst on "Team YES" using the ${agent.model} model. Your goal is to find evidence and construct strong arguments supporting a "YES" outcome for the prediction market question: "${marketQuestion}". Use Google Search to find the most relevant, up-to-date information. Present your findings as a JSON object inside a markdown code block. The JSON object must have two keys: "arguments" (an array of 3-5 string bullet points) and "confidence" (a number between 0 and 100).`,
      no: `You are an expert analyst on "Team NO" using the ${agent.model} model. Your goal is to find evidence and construct strong arguments supporting a "NO" outcome for the prediction market question: "${marketQuestion}". Use Google Search to find relevant, up-to-date information that contradicts the "YES" position. Present your findings as a JSON object inside a markdown code block. The JSON object must have two keys: "arguments" (an array of 3-5 string bullet points) and "confidence" (a number between 0 and 100).`,
    };

    const [yesResult, noResult] = await Promise.all([
      ai.models.generateContent({
        model: agent.model,
        contents: teamPrompts.yes,
        config: { tools: [{ googleSearch: {} }] },
      }),
      ai.models.generateContent({
        model: agent.model,
        contents: teamPrompts.no,
        config: { tools: [{ googleSearch: {} }] },
      }),
    ]);
    
    const yesTeam = parseJsonResponse<TeamAnalysis>(yesResult.text) || { arguments: [`Failed to get valid YES analysis from ${agent.model}`], confidence: 50 };
    const noTeam = parseJsonResponse<TeamAnalysis>(noResult.text) || { arguments: [`Failed to get valid NO analysis from ${agent.model}`], confidence: 50 };
    
    const sources = [...extractSources(yesResult), ...extractSources(noResult)];

    return {
        agentModel: agent.model,
        yesTeam,
        noTeam,
        sources
    };
  });

  const allIndividualAnalyses = await Promise.all(individualAnalysisPromises);

  // Step 3: Generate master consensus
  let consensusPrompt = `You are a neutral, master analyst moderating a debate on the question: "${marketQuestion}". You have received reports from several AI analyst agents, each providing arguments for "YES" and "NO". Your task is to synthesize all findings into a final, definitive consensus report.

Here are the reports from your agents:\n\n`;

  allIndividualAnalyses.forEach((analysis, index) => {
    consensusPrompt += `--- AGENT ${index + 1} REPORT (Model: ${analysis.agentModel}) ---\n`;
    consensusPrompt += `Team YES Confidence: ${analysis.yesTeam.confidence}%\nArguments:\n${analysis.yesTeam.arguments.map(a => `- ${a}`).join('\n')}\n\n`;
    consensusPrompt += `Team NO Confidence: ${analysis.noTeam.confidence}%\nArguments:\n${analysis.noTeam.arguments.map(a => `- ${a}`).join('\n')}\n`;
    consensusPrompt += `------------------------------------------\n\n`;
  });

  consensusPrompt += `Based on ALL the provided arguments and confidence scores from your team of agents, weigh all the evidence, identify the strongest and weakest points for each side, and determine the most likely outcome. Present your final analysis as a JSON object inside a markdown code block. The JSON object must have three keys: "outcome" (a string: "YES", "NO", or "UNCERTAIN"), "confidence" (a number from 0-100 representing certainty in your final synthesized conclusion), and "summary" (a concise string explaining your reasoning, highlighting how you synthesized the different agent perspectives).`;
    
  const consensusResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Master analyst always uses the most powerful model
      contents: consensusPrompt,
  });

  const consensus = parseJsonResponse<Consensus>(consensusResponse.text) || { outcome: 'UNCERTAIN', confidence: 0, summary: 'Could not determine a final consensus from the agent reports.' };
  
  // Step 4: Aggregate and deduplicate sources
  const allSourcesMap = new Map<string, Source>();
  allIndividualAnalyses.flatMap(a => a.sources).forEach(source => {
      if (source && source.uri && !allSourcesMap.has(source.uri)) {
          allSourcesMap.set(source.uri, source);
      }
  });

  const individualAnalyses: IndividualAnalysis[] = allIndividualAnalyses.map(({ sources, ...rest }) => rest);

  return {
    marketQuestion,
    individualAnalyses,
    consensus,
    allSources: Array.from(allSourcesMap.values()),
  };
}
