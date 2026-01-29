
import React, { useState, useEffect } from 'react';
import { AdConcept, Strategy, SimulationResult } from '../types';
import { Brain, Activity, TrendingUp, Users, Heart, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { runAdSimulation } from '../services/geminiService';

interface SimulationRoomProps {
  ads: AdConcept[];
  strategy: Strategy;
}

export const SimulationRoom: React.FC<SimulationRoomProps> = ({ ads, strategy }) => {
  const [selectedAdId, setSelectedAdId] = useState(ads[0]?.id || '');
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    const ad = ads.find(a => a.id === selectedAdId);
    if (!ad) return;

    setLoading(true);
    try {
      const result = await runAdSimulation(ad, strategy);
      setSimulation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentAd = ads.find(a => a.id === selectedAdId);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-display font-bold">PulseSimulation™ Lab</h2>
          <p className="text-gray-400">Synthetic focus group & predictive ROI testing</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="glass px-4 py-3 rounded-xl font-bold bg-transparent outline-none text-white border-white/10"
            value={selectedAdId}
            onChange={(e) => setSelectedAdId(e.target.value)}
          >
            {ads.map(ad => (
              <option key={ad.id} value={ad.id} className="bg-black text-white">{ad.title}</option>
            ))}
          </select>
          <button 
            onClick={handleSimulate}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
          >
            {loading ? <Activity className="animate-spin w-4 h-4" /> : <Brain className="w-4 h-4" />}
            Run Focus Group
          </button>
        </div>
      </div>

      {!simulation && !loading && (
        <div className="glass rounded-[40px] p-20 text-center border-dashed border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="text-gray-500 w-10 h-10" />
          </div>
          <h3 className="text-2xl font-display font-bold mb-4">Awaiting Simulation Parameters</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Select an ad concept above to spawn a synthetic focus group and predict real-world market performance.
          </p>
        </div>
      )}

      {loading && (
        <div className="glass rounded-[40px] p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent animate-pulse" />
          <div className="relative z-10">
            <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8" />
            <h3 className="text-2xl font-display font-bold mb-2">Neural Link Active...</h3>
            <p className="text-gray-500">Synthesizing persona psychology & market data</p>
          </div>
        </div>
      )}

      {simulation && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Simulation Panel */}
          <div className="lg:col-span-8 space-y-8">
            {/* Sentiment Heatmap */}
            <div className="glass p-8 rounded-[40px] border-emerald-500/10 bg-gradient-to-br from-emerald-900/5 to-transparent">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <Activity className="text-emerald-400 w-5 h-5" /> Emotional Resonance Profile
                </h3>
                <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  +{simulation.averageConversionLift}% PREDICTED LIFT
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Trust', val: simulation.sentimentHeatmap.trust, icon: ShieldCheck, color: 'text-blue-400' },
                  { label: 'Excitement', val: simulation.sentimentHeatmap.excitement, icon: Zap, color: 'text-amber-400' },
                  { label: 'Confusion', val: simulation.sentimentHeatmap.confusion, icon: AlertTriangle, color: 'text-rose-400' },
                  { label: 'Urgency', val: simulation.sentimentHeatmap.urgency, icon: TrendingUp, color: 'text-emerald-400' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="relative inline-block mb-3">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                        <circle 
                          cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 36}
                          strokeDashoffset={2 * Math.PI * 36 * (1 - stat.val / 100)}
                          className={stat.color}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <stat.icon size={20} className={stat.color} />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-lg font-display font-bold">{stat.val}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Persona Reactions */}
            <div className="space-y-6">
              <h3 className="text-xl font-display font-bold px-2">Synthetic Reactions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {simulation.reactions.map((reaction, i) => (
                  <div key={i} className="glass p-6 rounded-3xl border-white/5 hover:border-white/10 transition-all flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
                        {reaction.personaName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{reaction.personaName}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{reaction.personaTrait}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 italic mb-4 flex-1">"{reaction.reactionText}"</p>
                    <div className="pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Buy Prob.</span>
                        <span className="text-sm font-display font-bold text-emerald-400">{reaction.buyProbability}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${reaction.buyProbability}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Feedback Panel */}
          <div className="lg:col-span-4">
            <div className="glass p-8 rounded-[40px] sticky top-8">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-blue-400 w-5 h-5" /> Strategic Critique
              </h3>
              <div className="space-y-6">
                {simulation.reactions.map((r, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-2">Insight from {r.personaName}</p>
                    <p className="text-sm text-gray-400 leading-relaxed italic">
                      {r.critique}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                <p className="text-xs font-bold text-emerald-400 uppercase mb-2">Final Recommendation</p>
                <p className="text-sm text-white font-medium leading-relaxed">
                  Proceed with "Launch Campaign". High urgercy and trust metrics suggest immediate ROI in Social channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
