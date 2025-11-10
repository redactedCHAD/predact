
import React from 'react';
import type { AnalysisResult } from '../types';
import { TeamPanel } from './TeamPanel';
import { ConsensusPanel } from './ConsensusPanel';
import { LoadingSpinner } from './LoadingSpinner';
import { RobotIcon } from './icons/RobotIcon';

interface AnalysisResultDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded-md w-3/4 mx-auto mb-10"></div>
        {/* Skeleton for one agent analysis */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <div className="h-6 bg-gray-800 rounded-md w-1/4 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <div className="h-7 bg-gray-800 rounded-md w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-5 bg-gray-800 rounded-md w-full"></div>
                        <div className="h-5 bg-gray-800 rounded-md w-5/6"></div>
                    </div>
                </div>
                <div>
                    <div className="h-7 bg-gray-800 rounded-md w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-5 bg-gray-800 rounded-md w-full"></div>
                        <div className="h-5 bg-gray-800 rounded-md w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
        {/* Skeleton for consensus */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="h-7 bg-gray-800 rounded-md w-1/4 mb-6"></div>
            <div className="h-5 bg-gray-800 rounded-md w-full mb-2"></div>
            <div className="h-5 bg-gray-800 rounded-md w-4/5"></div>
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

      <div className="space-y-8">
        {result.individualAnalyses.map((analysis, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <RobotIcon className="w-6 h-6 text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-300">
                        Agent {index + 1} Analysis <span className="text-sm font-mono bg-gray-800 text-indigo-300 px-2 py-1 rounded-md">{analysis.agentModel}</span>
                    </h3>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <TeamPanel teamName="YES" analysis={analysis.yesTeam} />
                    <TeamPanel teamName="NO" analysis={analysis.noTeam} />
                </div>
            </div>
        ))}
      </div>

      <ConsensusPanel consensus={result.consensus} />

      {result.allSources.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-300">Sources</h3>
            <ul className="space-y-2">
                {result.allSources.map((source, index) => (
                    <li key={index} className="text-sm">
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline break-all">
                            {source.title || source.uri}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};
