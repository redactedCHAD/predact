import React from 'react';
import type { AnalysisResult } from '../types';
import { ConsensusPanel } from './ConsensusPanel';
import { ResearchAgentCard } from './ResearchAgentCard';

interface AnalysisResultDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse max-w-7xl mx-auto w-full">
        <div className="h-12 bg-gray-200 rounded-xl w-2/3 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Consensus Skeleton */}
            <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-8 shadow-card-light">
                <div className="h-8 bg-gray-100 rounded-lg w-1/4 mb-8"></div>
                <div className="flex gap-8">
                    <div className="w-20 h-20 rounded-full bg-gray-100"></div>
                    <div className="flex-1 space-y-4">
                        <div className="h-6 bg-gray-100 rounded-lg w-1/3"></div>
                        <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
                        <div className="h-4 bg-gray-100 rounded-lg w-5/6"></div>
                    </div>
                </div>
            </div>
            {/* Agent Skeletons */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`bg-white border border-gray-100 rounded-3xl p-8 shadow-card-light ${i >= 3 ? 'lg:col-span-1' : ''} ${i === 3 ? 'lg:col-start-1' : ''}`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
                        <div className="h-6 bg-gray-100 rounded-lg w-1/2"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
                        <div className="h-4 bg-gray-100 rounded-lg w-5/6"></div>
                        <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-brand-accent tracking-widest uppercase">Analyzing Question</span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
          {result.marketQuestion}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <ConsensusPanel consensus={result.consensus} />
        </div>

        {result.researchReports.map((report) => (
            <ResearchAgentCard key={report.agentType} report={report} />
        ))}

        {result.allSources.length > 0 && (
            <div className="md:col-span-2 lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-8 shadow-card-light">
                <h3 className="text-xl font-serif font-bold mb-6 text-slate-900">Sources</h3>
                <ul className="space-y-3 column-count-1 md:column-count-2 lg:column-count-3 gap-8">
                    {result.allSources.map((source, index) => (
                        <li key={index} className="text-sm break-inside-avoid mb-2">
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-accent hover:underline break-all transition-colors">
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