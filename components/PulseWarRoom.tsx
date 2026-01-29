
import React, { useState, useEffect } from 'react';
import { AuditResult, WarRoomIntelligence, AdConcept } from '../types';
import { fetchMarketIntelligence, generateTacticalAdPivot } from '../services/geminiService';
import { Radio, AlertCircle, TrendingUp, Zap, ExternalLink, Loader2, ArrowRight, ShieldAlert, Cpu, Crosshair } from 'lucide-react';

interface PulseWarRoomProps {
  auditResult: AuditResult;
  onPivotAds: (newAds: AdConcept[]) => void;
}

export const PulseWarRoom: React.FC<PulseWarRoomProps> = ({ auditResult, onPivotAds }) => {
  const [intel, setIntel] = useState<WarRoomIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPivoting, setIsPivoting] = useState(false);

  useEffect(() => {
    handleRefreshIntel();
  }, []);

  const handleRefreshIntel = async () => {
    setLoading(true);
    try {
      const data = await fetchMarketIntelligence(auditResult.strategy.valueProposition.split(' ')[0], auditResult.health.brandVoice);
      setIntel(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPivot = async () => {
    if (!intel || !auditResult.ads[0]) return;
    setIsPivoting(true);
    try {
      const newAds = await Promise.all(
        auditResult.ads.slice(0, 2).map(ad => generateTacticalAdPivot(ad, intel.recommendedPivot.theme))
      );
      onPivotAds(newAds);
      alert("Tactical pivots generated. Check the 'Creative' tab for new assets.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsPivoting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-display font-bold flex items-center gap-3">
            <Radio className="text-violet-500 animate-pulse" />
            PulseIntelligence™ Live
          </h2>
          <p className="text-gray-400">Real-time market grounding and competitive war-room logic.</p>
        </div>
        <button 
          onClick={handleRefreshIntel}
          disabled={loading}
          className="glass px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Cpu size={18} />}
          Refresh Signals
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-[40px] p-24 text-center border-white/5">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 bg-violet-500/10 rounded-full animate-ping" />
            <div className="relative w-full h-full bg-violet-600/20 rounded-full flex items-center justify-center">
              <Crosshair className="text-violet-500 animate-spin-slow" size={32} />
            </div>
          </div>
          <h3 className="text-2xl font-display font-bold mb-4">Intercepting Market Signals...</h3>
          <p className="text-gray-400 max-w-md mx-auto">Gemini 3 Pro is scanning live news sources and competitor data streams to identify tactical opportunities.</p>
        </div>
      ) : intel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Signals Radar */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {intel.signals.map((signal, i) => (
                <div key={i} className="glass p-6 rounded-[32px] border-white/5 hover:border-violet-500/20 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                      signal.category === 'Competitor' ? 'bg-rose-500/10 text-rose-400' : 
                      signal.category === 'Trend' ? 'bg-blue-500/10 text-blue-400' : 
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {signal.category}
                    </span>
                    <span className="text-xs font-bold text-gray-500">{signal.relevance}% Relevance</span>
                  </div>
                  <h4 className="font-display font-bold text-lg mb-2 group-hover:text-violet-400 transition-colors">{signal.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">{signal.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">via {signal.source}</span>
                    <a 
                      href={signal.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 glass rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 glass rounded-[40px] border-white/5">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <ShieldAlert className="text-amber-500" size={20} /> Competitive Counter-Logic
              </h3>
              <p className="text-gray-300 leading-relaxed font-medium">
                {intel.strategicAssessment}
              </p>
            </div>
          </div>

          {/* Pivot Command Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-10 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-[50px] shadow-2xl shadow-violet-900/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={150} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-display font-bold text-white mb-6">Tactical Opportunity Detected</h3>
                <div className="glass bg-white/10 border-white/20 p-6 rounded-3xl mb-8">
                  <label className="text-[10px] font-bold text-violet-200 uppercase tracking-widest block mb-2">Recommended Pivot Theme</label>
                  <p className="text-xl font-display font-bold text-white mb-4">"{intel.recommendedPivot.theme}"</p>
                  <p className="text-sm text-white/70 leading-relaxed italic">
                    {intel.recommendedPivot.rationale}
                  </p>
                </div>
                <button 
                  onClick={handleApplyPivot}
                  disabled={isPivoting}
                  className="w-full py-5 bg-white text-black rounded-2xl font-extrabold flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isPivoting ? <Loader2 className="animate-spin" /> : <Zap className="fill-current" size={18} />}
                  EXECUTE TACTICAL PIVOT
                </button>
                <p className="text-[10px] text-white/50 text-center mt-6 font-bold uppercase tracking-[0.2em]">
                  Adapting Creative DNA to Market Realities
                </p>
              </div>
            </div>

            <div className="glass p-8 rounded-[40px] border-white/5">
              <h4 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="text-emerald-400" /> Sentiment Impact Forecast
              </h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>RELEVANCE LIFT</span>
                    <span>+24%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '84%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>COMPETITOR NOISE REDUCTION</span>
                    <span>-12%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '68%' }} />
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-gray-400 leading-relaxed">
                  Executing this pivot addresses the current gap in <b>{intel.signals[0]?.title}</b> while distancing the brand from legacy competitor strategies.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
