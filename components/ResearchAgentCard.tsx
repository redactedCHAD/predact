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
  [ResearchAgentTypes.SOCIAL_MEDIA]: { Icon: SocialIcon, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  [ResearchAgentTypes.WEB_SEARCH]: { Icon: NewsIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
  [ResearchAgentTypes.FINANCE]: { Icon: FinanceIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  [ResearchAgentTypes.GEOPOLITICAL]: { Icon: GeopoliticalIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
  [ResearchAgentTypes.MACROECONOMIC]: { Icon: MacroeconomicIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
};

const leaningConfig: Record<Leaning, { colorClass: string; bgClass: string; text: string }> = {
    YES: { colorClass: 'text-green-700', bgClass: 'bg-green-100', text: 'LEANING YES'},
    NO: { colorClass: 'text-red-700', bgClass: 'bg-red-100', text: 'LEANING NO'},
    NEUTRAL: { colorClass: 'text-slate-600', bgClass: 'bg-slate-100', text: 'NEUTRAL'},
}

export const ResearchAgentCard: React.FC<ResearchAgentCardProps> = ({ report }) => {
  const config = agentConfig[report.agentType] || { Icon: RobotIcon, color: 'text-gray-600', bg: 'bg-gray-50' };
  const leaning = leaningConfig[report.leaning];
  const Icon = config.Icon;
  
  const getContradictionColor = (score: number) => {
    if (score > 66) return 'text-red-500 bg-red-500';
    if (score > 33) return 'text-orange-500 bg-orange-500';
    return 'text-yellow-500 bg-yellow-500';
  }

  const contradictionStyle = report.debate ? getContradictionColor(report.debate.contradictionScore) : '';
  const contradictionTextColor = contradictionStyle.split(' ')[0];
  const contradictionBgColor = contradictionStyle.split(' ')[1];

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col h-full shadow-card-light hover:shadow-card-medium transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">{report.agentType}</h3>
        </div>
        <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${leaning.bgClass} ${leaning.colorClass}`}>
            {leaning.text}
        </span>
      </div>
      
      <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-grow">{report.summary}</p>
      
      <div>
        <h4 className="font-serif font-bold mb-3 text-slate-900">Key Findings</h4>
        <ul className="space-y-2 list-disc list-outside ml-4 text-slate-500 text-sm mb-6 marker:text-gray-300">
          {report.keyFindings.map((finding, index) => (
            <li key={index} className="pl-1">{finding}</li>
          ))}
        </ul>
      </div>

      {report.debate && (
        <div className="mt-auto pt-5 border-t border-dashed border-gray-200">
          <h4 className="font-bold text-slate-800 text-xs uppercase flex items-center gap-2 mb-3">
            <FireIcon className="w-4 h-4 text-orange-500" />
            Point of Contention
          </h4>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-slate-400">Contradiction Level</span>
                <span className={`text-xs font-bold ${contradictionTextColor}`}>
                    {report.debate.contradictionScore}%
                </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${contradictionBgColor}`}
                style={{ width: `${report.debate.contradictionScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed bg-bg-subtle p-3 rounded-xl border border-gray-100">
            {report.debate.summary}
          </p>
        </div>
      )}
    </div>
  );
};