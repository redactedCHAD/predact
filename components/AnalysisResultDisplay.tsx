
import React from 'react';
import type { AnalysisResult } from '../types';
import { ConsensusPanel } from './ConsensusPanel';
import { ResearchAgentCard } from './ResearchAgentCard';

interface AnalysisResultDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded-md w-3/4 mx-auto mb-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Consensus Skeleton */}
            <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="h-7 bg-gray-800 rounded-md w-1/4 mb-6"></div>
                <div className="flex gap-6">
                    <div className="w-16 h-16 rounded-full bg-gray-800"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-800 rounded-md w-1/3"></div>
                        <div className="h-5 bg-gray-800 rounded-md w-full"></div>
                        <div className="h-5 bg-gray-800 rounded-md w-5/6"></div>
                    </div>
                </div>
            </div>
            {/* Agent Skeletons */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`bg-gray-900 border border-gray-800 rounded-xl p-6 ${i >= 3 ? 'lg:col-span-1' : ''} ${i === 3 ? 'lg:col-start-1' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                        <div className="h-6 bg-gray-800 rounded-md w-1/2"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-800 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-800 rounded-md w-5/6"></div>
                        <div className="h-4 bg-gray-800 rounded-md w-full"></div>
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
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-center text-gray-300 bg-gray-900 p-4 rounded-lg border border-gray-800">
        Market Question: <span className="text-white font-bold">{result.marketQuestion}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <ConsensusPanel consensus={result.consensus} />
        </div>

        {result.researchReports.map((report) => (
            <ResearchAgentCard key={report.agentType} report={report} />
        ))}

        {result.allSources.length > 0 && (
            <div className="md:col-span-2 lg:col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-300">Sources</h3>
                <ul className="space-y-2 column-count-1 md:column-count-2 lg:column-count-3">
                    {result.allSources.map((source, index) => (
                        <li key={index} className="text-sm break-inside-avoid">
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline break-all">
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
