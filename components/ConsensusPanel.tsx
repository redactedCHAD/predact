import React from 'react';
import type { Consensus, Outcome } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface ConsensusPanelProps {
  consensus: Consensus;
}

const outcomeConfig: Record<Outcome, { colorClass: string; bgClass: string; borderClass: string; Icon: React.FC<{className?: string}>; text: string }> = {
  YES: { 
    colorClass: 'text-green-600', 
    bgClass: 'bg-green-50', 
    borderClass: 'border-green-100',
    Icon: CheckIcon, 
    text: 'Likely YES' 
  },
  NO: { 
    colorClass: 'text-red-600', 
    bgClass: 'bg-red-50', 
    borderClass: 'border-red-100',
    Icon: XIcon, 
    text: 'Likely NO' 
  },
  UNCERTAIN: { 
    colorClass: 'text-amber-600', 
    bgClass: 'bg-amber-50', 
    borderClass: 'border-amber-100',
    Icon: LightbulbIcon, 
    text: 'Uncertain' 
  },
};

export const ConsensusPanel: React.FC<ConsensusPanelProps> = ({ consensus }) => {
  const config = outcomeConfig[consensus.outcome];
  const Icon = config.Icon;

  return (
    <div className={`bg-white border ${config.borderClass} rounded-3xl shadow-card-medium p-8 relative overflow-hidden`}>
      {/* Decorative background blob */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${config.bgClass} rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none`}></div>

      <h3 className="text-lg font-bold tracking-widest uppercase text-slate-400 mb-6 relative z-10">Consensus Report</h3>
      
      <div className="flex flex-col lg:flex-row items-start gap-8 relative z-10">
        <div className="flex items-center gap-6 min-w-max">
          <div className={`w-24 h-24 rounded-2xl ${config.bgClass} flex items-center justify-center border ${config.borderClass} shadow-sm`}>
            <Icon className={`w-12 h-12 ${config.colorClass}`} />
          </div>
          <div>
            <div className={`text-4xl font-serif font-bold ${config.colorClass} mb-2`}>{config.text}</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                 <div className={`h-full ${config.bgClass.replace('bg-', 'bg-slate-300')}`} style={{width: `${consensus.confidence}%`, backgroundColor: 'currentColor', color: 'inherit'}}></div>
              </div>
              <span className="text-slate-500 font-medium">{consensus.confidence}% Confidence</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 pt-6 lg:pt-0 lg:pl-8 lg:border-l border-gray-100">
            <p className="font-serif text-xl text-slate-800 leading-relaxed">
              {consensus.summary}
            </p>
        </div>
      </div>
    </div>
  );
};