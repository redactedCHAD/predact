import React, { useEffect, useState } from 'react';
import { ResearchAgentTypes } from '../types';
import { SocialIcon } from './icons/SocialIcon';
import { NewsIcon } from './icons/NewsIcon';
import { FinanceIcon } from './icons/FinanceIcon';
import { GeopoliticalIcon } from './icons/GeopoliticalIcon';
import { MacroeconomicIcon } from './icons/MacroeconomicIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

const steps = [
  { type: 'INIT', label: 'Initializing Consensus Engine...', icon: LightbulbIcon, color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  { type: ResearchAgentTypes.SOCIAL_MEDIA, label: 'Analysing Public Sentiment...', icon: SocialIcon, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  { type: ResearchAgentTypes.WEB_SEARCH, label: 'Scanning News Wires...', icon: NewsIcon, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { type: ResearchAgentTypes.FINANCE, label: 'Crunching Market Data...', icon: FinanceIcon, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { type: ResearchAgentTypes.GEOPOLITICAL, label: 'Assessing Global Risks...', icon: GeopoliticalIcon, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { type: ResearchAgentTypes.MACROECONOMIC, label: 'Evaluating Economic Indicators...', icon: MacroeconomicIcon, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  { type: 'SYNTHESIS', label: 'Synthesizing Final Consensus...', icon: LightbulbIcon, color: 'text-brand-start', bg: 'bg-brand-start/10 dark:bg-brand-start/20' },
];

export const ResearchVisualization: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 800); // Rotate every 800ms for a dynamic feel
    return () => clearInterval(interval);
  }, []);

  const current = steps[activeStep];
  const Icon = current.icon;

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[400px] flex flex-col items-center justify-center py-12">
      {/* Central Visualization */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        {/* Outer Orbit */}
        <div className="absolute inset-0 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-full animate-[spin_10s_linear_infinite]"></div>
        
        {/* Inner Pulse */}
        <div className="absolute w-48 h-48 bg-brand-start/5 dark:bg-brand-start/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute w-32 h-32 bg-brand-start/10 dark:bg-brand-start/20 rounded-full animate-pulse"></div>
        
        {/* Central Core */}
        <div className="relative z-10 w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl shadow-glow flex items-center justify-center animate-float border border-transparent dark:border-white/10 transition-colors duration-300">
             <Icon className={`w-10 h-10 ${current.color} transition-all duration-500`} />
        </div>

        {/* Floating Particles (Decorations) */}
        {steps.slice(1, 6).map((step, i) => {
           const isActive = activeStep === i + 1;
           // Calculate position on circle
           const angle = (i * (360 / 5)) * (Math.PI / 180);
           const radius = 120; // matches roughly half of w-64
           const x = Math.cos(angle) * radius;
           const y = Math.sin(angle) * radius;
           
           return (
             <div 
                key={step.type}
                className={`absolute w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm border 
                  ${isActive ? 'scale-125 opacity-100 z-20 shadow-lg ' + step.bg + ' border-transparent' : 'scale-75 opacity-40 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-300 dark:text-slate-600 border-slate-100'}`}
                style={{ transform: `translate(${x}px, ${y}px)` }}
             >
               <step.icon className={`w-5 h-5 ${isActive ? step.color : 'currentColor'}`} />
             </div>
           )
        })}
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2 animate-slide-up-fade">
        <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
          {current.label}
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-sm transition-colors duration-300">
          Predacted Agents are researching multiple sources...
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-8 overflow-hidden transition-colors duration-300">
        <div className="h-full bg-gradient-to-r from-brand-start to-brand-end animate-[shimmer_2s_infinite_linear] w-full origin-left"></div>
      </div>
    </div>
  );
};