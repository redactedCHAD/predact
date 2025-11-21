import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface UrlInputFormProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ url, setUrl, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-gray-100 rounded-3xl p-2 shadow-card-medium">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://polymarket.com/event/..."
          className="w-full px-6 py-4 bg-transparent text-slate-900 placeholder-slate-400 rounded-2xl focus:outline-none focus:bg-bg-input transition duration-200"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-full sm:w-auto min-w-[160px] flex items-center justify-center px-8 py-4 bg-gradient-to-r from-brand-start to-brand-end text-white font-semibold rounded-full shadow-glow hover:shadow-glow-hover hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="w-5 h-5 mr-2 text-white" />
              Analyzing
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
    </form>
  );
};