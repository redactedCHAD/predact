
import React from 'react';
import type { ResearchReport, Leaning } from '../types';
import { ResearchAgentTypes } from '../types';
import { SocialIcon } from './icons/SocialIcon';
import { NewsIcon } from './icons/NewsIcon';
import { FinanceIcon } from './icons/FinanceIcon';
import { GeopoliticalIcon } from './icons/GeopoliticalIcon';
import { MacroeconomicIcon } from './icons/MacroeconomicIcon';
import { RobotIcon } from './icons/RobotIcon';
import { FireIcon } from './icons/FireIcon';

interface ResearchAgentCardProps {
  report: ResearchReport;
}

const agentConfig = {
  [ResearchAgentTypes.SOCIAL_MEDIA]: { Icon: SocialIcon, color: 'cyan' },
  [ResearchAgentTypes.WEB_SEARCH]: { Icon: NewsIcon, color: 'blue' },
  [ResearchAgentTypes.FINANCE]: { Icon: FinanceIcon, color: 'green' },
  [ResearchAgentTypes.GEOPOLITICAL]: { Icon: GeopoliticalIcon, color: 'purple' },
  [ResearchAgentTypes.MACROECONOMIC]: { Icon: MacroeconomicIcon, color: 'orange' },
};

const leaningConfig: Record<Leaning, { color: string; text: string }> = {
    YES: { color: 'green', text: 'LEANING YES'},
    NO: { color: 'red', text: 'LEANING NO'},
    NEUTRAL: { color: 'gray', text: 'NEUTRAL'},
}

export const ResearchAgentCard: React.FC<ResearchAgentCardProps> = ({ report }) => {
  const config = agentConfig[report.agentType] || { Icon: RobotIcon, color: 'gray' };
  const leaning = leaningConfig[report.leaning];
  const Icon = config.Icon;
  
  const getContradictionColor = (score: number) => {
    if (score > 66) return 'red';
    if (score > 33) return 'orange';
    return 'yellow';
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-${config.color}-500/10 flex items-center justify-center border border-${config.color}-500/30`}>
                <Icon className={`w-6 h-6 text-${config.color}-400`} />
            </div>
            <h3 className="text-lg font-bold text-white">{report.agentType}</h3>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full bg-${leaning.color}-500/20 text-${leaning.color}-300 border border-${leaning.color}-500/30`}>
            {leaning.text}
        </span>
      </div>
      
      <p className="text-gray-400 mb-4 text-sm flex-grow">{report.summary}</p>
      
      <div>
        <h4 className="font-semibold mb-2 text-gray-300">Key Findings:</h4>
        <ul className="space-y-2 list-disc list-inside text-gray-400 text-sm mb-4">
          {report.keyFindings.map((finding, index) => (
            <li key={index}>{finding}</li>
          ))}
        </ul>
      </div>

      {report.debate && (
        <div className="mt-auto pt-4 border-t border-gray-800">
          <h4 className="font-semibold text-gray-300 flex items-center gap-2 mb-2">
            <FireIcon className="w-5 h-5 text-orange-400" />
            Point of Contention
          </h4>
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400">Contradiction Score</span>
                <span className={`text-xs font-bold text-${getContradictionColor(report.debate.contradictionScore)}-400`}>
                    {report.debate.contradictionScore}%
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className={`bg-${getContradictionColor(report.debate.contradictionScore)}-500 h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${report.debate.contradictionScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">{report.debate.summary}</p>
        </div>
      )}
    </div>
  );
};
