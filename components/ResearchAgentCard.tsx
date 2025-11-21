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
  [ResearchAgentTypes.SOCIAL_MEDIA]: { 
    Icon: SocialIcon, 
    color: 'text-cyan-600 dark:text-cyan-400', 
    bg: 'bg-cyan-50 dark:bg-cyan-500/10', 
    hoverBorder: 'group-hover:border-cyan-200 dark:group-hover:border-cyan-500/30' 
  },
  [ResearchAgentTypes.WEB_SEARCH]: { 
    Icon: NewsIcon, 
    color: 'text-blue-600 dark:text-blue-400', 
    bg: 'bg-blue-50 dark:bg-blue-500/10', 
    hoverBorder: 'group-hover:border-blue-200 dark:group-hover:border-blue-500/30' 
  },
  [ResearchAgentTypes.FINANCE]: { 
    Icon: FinanceIcon, 
    color: 'text-emerald-600 dark:text-emerald-400', 
    bg: 'bg-emerald-50 dark:bg-emerald-500/10', 
    hoverBorder: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30' 
  },
  [ResearchAgentTypes.GEOPOLITICAL]: { 
    Icon: GeopoliticalIcon, 
    color: 'text-purple-600 dark:text-purple-400', 
    bg: 'bg-purple-50 dark:bg-purple-500/10', 
    hoverBorder: 'group-hover:border-purple-200 dark:group-hover:border-purple-500/30' 
  },
  [ResearchAgentTypes.MACROECONOMIC]: { 
    Icon: MacroeconomicIcon, 
    color: 'text-orange-600 dark:text-orange-400', 
    bg: 'bg-orange-50 dark:bg-orange-500/10', 
    hoverBorder: 'group-hover:border-orange-200 dark:group-hover:border-orange-500/30' 
  },
};

const leaningConfig: Record<Leaning, { colorClass: string; bgClass: string; text: string }> = {
    YES: { colorClass: 'text-green-700 dark:text-green-300', bgClass: 'bg-green-100 dark:bg-green-900/40', text: 'LEANING YES'},
    NO: { colorClass: 'text-red-700 dark:text-red-300', bgClass: 'bg-red-100 dark:bg-red-900/40', text: 'LEANING NO'},
    NEUTRAL: { colorClass: 'text-slate-600 dark:text-slate-400', bgClass: 'bg-slate-100 dark:bg-slate-800', text: 'NEUTRAL'},
}

export const ResearchAgentCard: React.FC<ResearchAgentCardProps> = ({ report }) => {
  const config = agentConfig[report.agentType] || { 
    Icon: RobotIcon, 
    color: 'text-gray-600 dark:text-gray-400', 
    bg: 'bg-gray-50 dark:bg-gray-800', 
    hoverBorder: 'group-hover:border-gray-200' 
  };
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
    <div className={`group bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 flex flex-col h-full shadow-card-light dark:shadow-none hover:shadow-card-medium dark:hover:shadow-glow dark:hover:border-brand-start/20 hover:-translate-y-1 transition-all duration-300 ${config.hoverBorder}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">{report.agentType}</h3>
        </div>
        <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${leaning.bgClass} ${leaning.colorClass}`}>
            {leaning.text}
        </span>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed flex-grow">{report.summary}</p>
      
      <div>
        <h4 className="font-serif font-bold mb-3 text-slate-900 dark:text-slate-200">Key Findings</h4>
        <ul className="space-y-2 list-disc list-outside ml-4 text-slate-500 dark:text-slate-400 text-sm mb-6 marker:text-gray-300 dark:marker:text-gray-600">
          {report.keyFindings.map((finding, index) => (
            <li key={index} className="pl-1">{finding}</li>
          ))}
        </ul>
      </div>

      {report.debate && (
        <div className="mt-auto pt-5 border-t border-dashed border-gray-200 dark:border-gray-800">
          <h4 className="font-bold text-slate-800 dark:text-slate-300 text-xs uppercase flex items-center gap-2 mb-3">
            <FireIcon className="w-4 h-4 text-orange-500 animate-pulse" />
            Point of Contention
          </h4>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Contradiction Level</span>
                <span className={`text-xs font-bold ${contradictionTextColor}`}>
                    {report.debate.contradictionScore}%
                </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${contradictionBgColor}`}
                style={{ width: `${report.debate.contradictionScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed bg-bg-subtle dark:bg-slate-950 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            {report.debate.summary}
          </p>
        </div>
      )}
    </div>
  );
};