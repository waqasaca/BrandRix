
import React from 'react';
import { Strategy } from '../types';
import { User, Target, Layers, PlayCircle } from 'lucide-react';

interface StrategyViewProps {
  strategy: Strategy;
  onApprove: () => void;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ strategy, onApprove }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-display font-bold">30-Day Domination Plan</h2>
          <p className="text-gray-400">Strategic roadmap derived from brand DNA</p>
        </div>
        <button 
          onClick={onApprove}
          className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-all shadow-xl"
        >
          Approve & Execute Ads <PlayCircle className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Persona */}
        <div className="glass p-8 rounded-3xl border-violet-500/10">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-violet-400" />
            <h3 className="font-bold font-display text-lg">Target Persona</h3>
          </div>
          <p className="text-2xl font-display font-bold mb-2">{strategy.targetPersona.name}</p>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {strategy.targetPersona.description}
          </p>
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase">Top Pain Points</p>
            {strategy.targetPersona.painPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                {point}
              </div>
            ))}
          </div>
        </div>

        {/* Value Prop */}
        <div className="glass p-8 rounded-3xl border-blue-500/10 lg:col-span-2 bg-gradient-to-br from-blue-900/10 to-transparent">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-blue-400" />
            <h3 className="font-bold font-display text-lg">The Winning Proposition</h3>
          </div>
          <p className="text-3xl font-display font-bold leading-tight text-white mb-8">
            "{strategy.valueProposition}"
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategy.channels.map((chan, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-blue-400 uppercase mb-1">{chan.platform}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{chan.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="glass p-10 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Layers size={200} />
        </div>
        <h3 className="text-2xl font-display font-bold mb-10">Implementation Roadmap</h3>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-8 w-px bg-white/10" />
          <div className="space-y-12">
            {strategy.roadmap.map((step, i) => (
              <div key={i} className="relative pl-20 group">
                <div className="absolute left-0 w-16 h-16 rounded-full glass border border-white/10 flex items-center justify-center font-display font-bold text-xl group-hover:border-violet-500/50 transition-colors bg-black">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Phase {i + 1}</h4>
                  <p className="text-gray-400 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
