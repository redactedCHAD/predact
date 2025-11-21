
import React from 'react';
import type { Agent } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { RobotIcon } from './icons/RobotIcon';

interface AgentDashboardProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  isLoading: boolean;
}

const AVAILABLE_MODELS: Agent['model'][] = ['gemini-2.5-flash', 'gemini-3-pro-preview'];

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ agents, setAgents, isLoading }) => {
  const addAgent = () => {
    if (agents.length < 5) {
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        model: 'gemini-2.5-flash',
      };
      setAgents([...agents, newAgent]);
    }
  };

  const removeAgent = (id: string) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };

  const updateAgentModel = (id: string, model: Agent['model']) => {
    setAgents(agents.map(agent => (agent.id === id ? { ...agent, model } : agent)));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <RobotIcon className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Agent Configuration</h2>
      </div>
      <div className="space-y-4">
        {agents.map((agent, index) => (
          <div key={agent.id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-md">
            <span className="font-semibold text-gray-300">Agent {index + 1}</span>
            <select
              value={agent.model}
              onChange={(e) => updateAgentModel(agent.id, e.target.value as Agent['model'])}
              disabled={isLoading}
              className="flex-grow px-3 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
            >
              {AVAILABLE_MODELS.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <button
              onClick={() => removeAgent(agent.id)}
              disabled={isLoading || agents.length <= 1}
              className="p-2 text-gray-400 rounded-md hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Remove Agent"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={addAgent}
          disabled={isLoading || agents.length >= 5}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 rounded-md hover:bg-indigo-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <PlusIcon className="w-5 h-5" />
          Add Analyst Agent ({agents.length}/5)
        </button>
      </div>
    </div>
  );
};
