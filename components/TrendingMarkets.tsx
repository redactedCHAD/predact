
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
        <LoadingSpinner className="w-6 h-6 mx-auto text-gray-400" />
        <p className="text-gray-500 mt-2">Fetching trending markets...</p>
      </div>
    );
  }

  if (error && markets.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-4 text-yellow-500/80">
        {error}
      </div>
    );
  }
  
  if (markets.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto -my-4">
      <h3 className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 mb-3">
        <BoltIcon className="w-4 h-4 text-yellow-500" />
        or select a trending market
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {markets.map((market) => (
          <button
            key={market.url}
            onClick={() => onSelectMarket(market.url)}
            disabled={isLoading}
            className="w-full text-left p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:bg-gray-800/70 hover:border-indigo-500/50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{market.question}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
