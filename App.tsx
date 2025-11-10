
import React, { useState, useCallback } from 'react';
import { UrlInputForm } from './components/UrlInputForm';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { AgentDashboard } from './components/AgentDashboard';
import { analyzeMarketUrl } from './services/geminiService';
import type { AnalysisResult, Agent } from './types';
import { LightbulbIcon } from './components/icons/LightbulbIcon';

const App: React.FC = () => {
  const [marketUrl, setMarketUrl] = useState<string>('');
  const [agents, setAgents] = useState<Agent[]>([
    { id: `agent-${Date.now()}`, model: 'gemini-2.5-flash' }
  ]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!marketUrl || !marketUrl.startsWith('https://polymarket.com/')) {
      setError('Please enter a valid Polymarket URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeMarketUrl(marketUrl, agents);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred during analysis. Please check the console and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [marketUrl, agents]);

  return (
    <div className="bg-gray-950 text-gray-200 min-h-full flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
             <LightbulbIcon className="w-10 h-10 text-yellow-400"/>
             <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Prediction Market Consensus Analyzer</h1>
          </div>
          <p className="text-gray-400 text-lg">
            A multi-agent framework to analyze and debate Polymarket outcomes.
          </p>
        </header>

        <main className="flex flex-col gap-8">
          <UrlInputForm
            url={marketUrl}
            setUrl={setMarketUrl}
            onSubmit={handleAnalyze}
            isLoading={isLoading}
          />

          <AgentDashboard agents={agents} setAgents={setAgents} isLoading={isLoading} />
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <AnalysisResultDisplay result={analysisResult} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default App;
