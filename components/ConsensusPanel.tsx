
import React from 'react';
import type { Consensus, Outcome } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface ConsensusPanelProps {
  consensus: Consensus;
}

const outcomeConfig: Record<Outcome, { color: string; Icon: React.FC<{className?: string}>; text: string }> = {
  YES: { color: 'green', Icon: CheckIcon, text: 'Likely YES' },
  NO: { color: 'red', Icon: XIcon, text: 'Likely NO' },
  UNCERTAIN: { color: 'yellow', Icon: LightbulbIcon, text: 'Uncertain' },
};

export const ConsensusPanel: React.FC<ConsensusPanelProps> = ({ consensus }) => {
  const config = outcomeConfig[consensus.outcome];
  const Icon = config.Icon;

  return (
    <div className={`bg-gray-900 border border-${config.color}-500/30 rounded-xl shadow-lg p-6`}>
      <h3 className="text-xl font-bold mb-4 text-gray-300">Consensus Report</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full bg-${config.color}-500/10 flex items-center justify-center border-2 border-${config.color}-500/30`}>
            <Icon className={`w-8 h-8 text-${config.color}-400`} />
          </div>
          <div>
            <div className={`text-3xl font-bold text-${config.color}-400`}>{config.text}</div>
            <div className="text-gray-400">Confidence: {consensus.confidence}%</div>
          </div>
        </div>
        <div className="flex-1 text-gray-400 border-t sm:border-t-0 sm:border-l border-gray-700 pt-4 sm:pt-0 sm:pl-6">
            <p className="font-semibold text-gray-300 mb-1">Reasoning:</p>
            {consensus.summary}
        </div>
      </div>
    </div>
  );
};
