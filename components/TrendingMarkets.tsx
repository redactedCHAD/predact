import React, { useState, useEffect } from 'react';
import { fetchTrendingMarkets } from '../services/polymarketService';
import type { PolymarketMarket } from '../services/polymarketService';
import { LoadingSpinner } from './LoadingSpinner';
import { BoltIcon } from './icons/BoltIcon';

interface TrendingMarketsProps {
  onSelectMarket: (url: string) => void;
  isLoading: boolean;
}

export const TrendingMarkets: React.FC<TrendingMarketsProps> = ({ onSelectMarket, isLoading }) => {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const trendingMarkets = await fetchTrendingMarkets();
        if (trendingMarkets.length > 0) {
            setMarkets(trendingMarkets);
        } else {
            setError('Could not find any trending YES/NO markets.');
        }
      } catch (e) {
        setError('Could not load trending markets.');
        console.error(e);
      } finally {
        setIsFetching(false);
      }
    };
    loadMarkets();
  }, []);

  if (isFetching) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-4">
        <LoadingSpinner className="w-6 h-6 mx-auto text-brand-start" />
      </div>
    );
  }

  if (error && markets.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-4 text-slate-400 text-sm">
        {error}
      </div>
    );
  }
  
  if (markets.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="flex items-center justify-center gap-2 text-xs font-bold tracking-wide uppercase text-slate-400 mb-4">
        <BoltIcon className="w-4 h-4 text-brand-warning" />
        Trending Markets
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {markets.map((market) => (
          <button
            key={market.url}
            onClick={() => onSelectMarket(market.url)}
            disabled={isLoading}
            className="px-5 py-3 bg-white border border-gray-100 rounded-full shadow-card-light hover:shadow-card-medium hover:border-brand-start/30 hover:text-brand-start transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 text-sm font-medium"
          >
            {market.question}
          </button>
        ))}
      </div>
    </div>
  );
};