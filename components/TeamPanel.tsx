
import React from 'react';
import type { TeamAnalysis } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface TeamPanelProps {
  teamName: 'YES' | 'NO';
  analysis: TeamAnalysis;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({ teamName, analysis }) => {
  const isYesTeam = teamName === 'YES';
  const accentColor = isYesTeam ? 'green' : 'red';
  const Icon = isYesTeam ? CheckIcon : XIcon;

  return (
    <div className={`bg-gray-900 border border-${accentColor}-500/30 rounded-xl shadow-lg p-6 flex flex-col h-full`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full bg-${accentColor}-500/10 flex items-center justify-center border border-${accentColor}-500/30`}>
          <Icon className={`w-6 h-6 text-${accentColor}-400`} />
        </div>
        <h3 className={`text-2xl font-bold text-${accentColor}-400`}>Team {teamName}</h3>
      </div>
      
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-400">Confidence</span>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
          <div 
            className={`bg-${accentColor}-500 h-2.5 rounded-full transition-all duration-500`} 
            style={{ width: `${analysis.confidence}%` }}
          ></div>
        </div>
        <span className={`text-right block text-sm font-bold text-${accentColor}-400 mt-1`}>{analysis.confidence}%</span>
      </div>

      <div className="flex-grow">
        <h4 className="font-semibold mb-2 text-gray-300">Key Arguments:</h4>
        <ul className="space-y-3 list-disc list-inside text-gray-400">
          {analysis.arguments.length > 0 ? (
            analysis.arguments.map((arg, index) => <li key={index}>{arg}</li>)
          ) : (
            <li>No specific arguments found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};
