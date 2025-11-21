import React, { useState, useCallback, useEffect } from 'react';
import { UrlInputForm } from './components/UrlInputForm';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { analyzeMarketUrl } from './services/geminiService';
import type { AnalysisResult } from './types';
import { LightbulbIcon } from './components/icons/LightbulbIcon';
import { TrendingMarkets } from './components/TrendingMarkets';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  const [marketUrl, setMarketUrl] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
    <div className="min-h-full flex flex-col items-center p-4 sm:p-6 md:p-8 relative">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50">
        <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-12 mt-8 animate-slide-up-fade">
          <div className="flex items-center justify-center gap-4 mb-3">
             <div className="bg-gradient-to-br from-brand-start to-brand-end p-2 rounded-xl shadow-glow">
               <LightbulbIcon className="w-8 h-8 text-white"/>
             </div>
             <h1 className="text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Predacted</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-light transition-colors">
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl text-center shadow-sm transition-colors">
              {error}
            </div>
          )}

          <AnalysisResultDisplay result={analysisResult} isLoading={isLoading} />
        </main>
        
        <footer className="mt-20 text-center text-slate-400 dark:text-slate-600 text-sm pb-8 transition-colors">
          © {new Date().getFullYear()} Predacted. Powered by Gemini 2.5
        </footer>
      </div>
    </div>
  );
};

export default App;