import React from 'react';
import type { AnalysisResult } from '../types';
import { ConsensusPanel } from './ConsensusPanel';
import { ResearchAgentCard } from './ResearchAgentCard';
import { ResearchVisualization } from './ResearchVisualization';

interface AnalysisResultDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return <ResearchVisualization />;
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="text-center space-y-2 animate-slide-up-fade">
        <span className="text-xs font-bold text-brand-accent tracking-widest uppercase">Analysis Complete</span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white transition-colors duration-300">
          {result.marketQuestion}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3 animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
          <ConsensusPanel consensus={result.consensus} />
        </div>

        {result.researchReports.map((report, index) => (
          <div 
            key={report.agentType} 
            className="animate-slide-up-fade h-full"
            style={{ animationDelay: `${200 + (index * 100)}ms` }}
          >
            <ResearchAgentCard report={report} />
          </div>
        ))}

        {result.allSources.length > 0 && (
            <div 
                className="md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-card-light dark:shadow-none animate-slide-up-fade transition-colors duration-300"
                style={{ animationDelay: '800ms' }}
            >
                <h3 className="text-xl font-serif font-bold mb-6 text-slate-900 dark:text-white">Sources</h3>
                <ul className="space-y-3 column-count-1 md:column-count-2 lg:column-count-3 gap-8">
                    {result.allSources.map((source, index) => (
                        <li key={index} className="text-sm break-inside-avoid mb-2">
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-brand-accent dark:hover:text-brand-accent hover:underline break-all transition-colors">
                                {source.title || source.uri}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
};