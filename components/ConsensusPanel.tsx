import React, { useEffect, useState } from 'react';
import type { Consensus, Outcome } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface ConsensusPanelProps {
  consensus: Consensus;
}

const outcomeConfig: Record<Outcome, { colorClass: string; bgClass: string; borderClass: string; Icon: React.FC<{className?: string}>; text: string }> = {
  YES: { 
    colorClass: 'text-green-600 dark:text-green-400', 
    bgClass: 'bg-green-50 dark:bg-green-500/10', 
    borderClass: 'border-green-100 dark:border-green-500/20',
    Icon: CheckIcon, 
    text: 'Likely YES' 
  },
  NO: { 
    colorClass: 'text-red-600 dark:text-red-400', 
    bgClass: 'bg-red-50 dark:bg-red-500/10', 
    borderClass: 'border-red-100 dark:border-red-500/20',
    Icon: XIcon, 
    text: 'Likely NO' 
  },
  UNCERTAIN: { 
    colorClass: 'text-amber-600 dark:text-amber-400', 
    bgClass: 'bg-amber-50 dark:bg-amber-500/10', 
    borderClass: 'border-amber-100 dark:border-amber-500/20',
    Icon: LightbulbIcon, 
    text: 'Uncertain' 
  },
};

export const ConsensusPanel: React.FC<ConsensusPanelProps> = ({ consensus }) => {
  const config = outcomeConfig[consensus.outcome];
  const Icon = config.Icon;
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    // Simple timeout to trigger animation after mount
    const timer = setTimeout(() => {
        setAnimatedConfidence(consensus.confidence);
    }, 100);
    return () => clearTimeout(timer);
  }, [consensus.confidence]);

  return (
    <div className={`bg-white dark:bg-slate-900 border ${config.borderClass} rounded-3xl shadow-card-medium dark:shadow-none p-8 relative overflow-hidden group transition-colors duration-300`}>
      {/* Decorative background blob */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${config.bgClass} rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none transition-transform duration-1000 group-hover:scale-110`}></div>

      <h3 className="text-lg font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-6 relative z-10">Consensus Report</h3>
      
      <div className="flex flex-col lg:flex-row items-start gap-8 relative z-10">
        <div className="flex items-center gap-6 min-w-max">
          <div className={`w-24 h-24 rounded-2xl ${config.bgClass} flex items-center justify-center border ${config.borderClass} shadow-sm dark:shadow-none transition-transform duration-500 hover:rotate-3`}>
            <Icon className={`w-12 h-12 ${config.colorClass}`} />
          </div>
          <div>
            <div className={`text-4xl font-serif font-bold ${config.colorClass} mb-2`}>{config.text}</div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-32 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner-glow dark:shadow-none">
                 <div 
                    className={`h-full ${config.bgClass.replace('bg-', 'bg-slate-400 dark:bg-slate-600')} transition-all duration-1000 ease-out`} 
                    style={{
                        width: `${animatedConfidence}%`, 
                        backgroundColor: 'currentColor', 
                        color: 'inherit'
                    }}
                 ></div>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-medium min-w-[40px]">
                 {animatedConfidence}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 pt-6 lg:pt-0 lg:pl-8 lg:border-l border-gray-100 dark:border-white/10">
            <p className="font-serif text-xl text-slate-800 dark:text-slate-200 leading-relaxed">
              {consensus.summary}
            </p>
        </div>
      </div>
    </div>
  );
};