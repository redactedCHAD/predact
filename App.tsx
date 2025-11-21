import React, { useState, useCallback } from 'react';
import { UrlInputForm } from './components/UrlInputForm';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { analyzeMarketUrl } from './services/geminiService';
import type { AnalysisResult } from './types';
import { LightbulbIcon } from './components/icons/LightbulbIcon';
import { TrendingMarkets } from './components/TrendingMarkets';

const App: React.FC = () => {
  const [marketUrl, setMarketUrl] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = useCallback(async (url: string) => {
    if (!url || !url.startsWith('https://polymarket.com/')) {
      setError('Please enter a valid Polymarket URL.');
      return;
    }

    // Set UI state for a new analysis
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setMarketUrl(url); // Ensure input is synced

    try {
      const result = await analyzeMarketUrl(url);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred during analysis. Please check the console and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);


  return (
    <div className="min-h-full flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-12 mt-8">
          <div className="flex items-center justify-center gap-4 mb-3">
             <div className="bg-gradient-to-br from-brand-start to-brand-end p-2 rounded-xl shadow-glow">
               <LightbulbIcon className="w-8 h-8 text-white"/>
             </div>
             <h1 className="text-5xl font-serif font-bold tracking-tight text-slate-900">Predacted</h1>
          </div>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light">
            A multi-agent consensus engine for prediction markets.
          </p>
        </header>

        <main className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <UrlInputForm
              url={marketUrl}
              setUrl={setMarketUrl}
              onSubmit={() => performAnalysis(marketUrl)}
              isLoading={isLoading}
            />
            
            <TrendingMarkets onSelectMarket={performAnalysis} isLoading={isLoading} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-center shadow-sm">
              {error}
            </div>
          )}

          <AnalysisResultDisplay result={analysisResult} isLoading={isLoading} />
        </main>
        
        <footer className="mt-20 text-center text-slate-400 text-sm pb-8">
          © {new Date().getFullYear()} Predacted. Powered by Gemini 2.5
        </footer>
      </div>
    </div>
  );
};

export default App;