
import React, { useState, useEffect } from 'react';
import { AdConcept, BrandHealth, Strategy, Integrations } from '../types';
import { Sparkles, Edit3, RefreshCw, Send, Download, Image as ImageIcon, CheckCircle2, Globe, Loader2, Plus, AlertTriangle, ShieldCheck } from 'lucide-react';
import { generateAdImage, generateMoreAds } from '../services/geminiService';

interface AdMakerProps {
  initialAds: AdConcept[];
  health: BrandHealth;
  strategy: Strategy;
  integrations: Integrations;
  onOpenIntegrations: () => void;
  onQuotaError?: () => void;
}

export const AdMaker: React.FC<AdMakerProps> = ({ initialAds = [], health, strategy, integrations, onOpenIntegrations, onQuotaError }) => {
  const [ads, setAds] = useState<AdConcept[]>(initialAds);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [launching, setLaunching] = useState(false);
  const [launchStep, setLaunchStep] = useState(0);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [showConnectionWarning, setShowConnectionWarning] = useState(false);

  useEffect(() => {
    ads.forEach(ad => {
      if (ad && !ad.imageUrl && !loadingMap[ad.id]) {
        handleRegenerateImage(ad.id, ad.visualPrompt);
      }
    });
  }, [ads]);

  const handleRegenerateImage = async (id: string, prompt: string) => {
    if (!id || !prompt) return;
    setLoadingMap(prev => ({ ...prev, [id]: true }));
    try {
      const url = await generateAdImage(prompt);
      setAds(prev => prev.map(a => a.id === id ? { ...a, imageUrl: url } : a));
    } catch (e: any) {
      console.error("Failed to generate image", e);
      if (e?.message === 'QUOTA_EXHAUSTED' && onQuotaError) {
        onQuotaError();
      }
    } finally {
      setLoadingMap(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleGenerateMore = async () => {
    setIsGeneratingMore(true);
    try {
      const moreAds = await generateMoreAds(health, strategy);
      const timestampedAds = moreAds.map(ad => ({
        ...ad,
        id: `ad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      setAds(prev => [...prev, ...timestampedAds]);
    } catch (e: any) {
      console.error("Failed to generate more ads", e);
      if ((e?.message === 'QUOTA_EXHAUSTED' || e?.message?.includes('429')) && onQuotaError) {
        onQuotaError();
      }
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const updateCopy = (id: string, field: 'headline' | 'caption' | 'cta', val: string) => {
    setAds(prev => prev.map(a => a.id === id ? {
      ...a, 
      copy: { ...a.copy, [field]: val }
    } : a));
  };

  const handleLaunch = async () => {
    // PRE-FLIGHT CHECK
    const hasAnyConnection = Object.values(integrations).some(v => v);
    if (!hasAnyConnection) {
      setShowConnectionWarning(true);
      return;
    }

    setLaunching(true);
    setLaunchStep(1); // Syncing
    await new Promise(r => setTimeout(r, 1500));
    setLaunchStep(2); // Optimizing
    await new Promise(r => setTimeout(r, 1500));
    setLaunchStep(3); // Success
    await new Promise(r => setTimeout(r, 2000));
    setLaunching(false);
    setLaunchStep(0);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Connection Warning Modal */}
      {showConnectionWarning && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="max-w-md w-full glass p-10 rounded-[40px] border-rose-500/20 text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="text-rose-500 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">No Ad Networks Connected</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              We cannot autonomously deploy your ads without a secure API link to your Meta, LinkedIn, or Google Ads accounts.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowConnectionWarning(false);
                  onOpenIntegrations();
                }}
                className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-violet-900/40"
              >
                Connect Networks Now
              </button>
              <button 
                onClick={() => setShowConnectionWarning(false)}
                className="w-full py-4 glass text-gray-400 hover:text-white rounded-2xl font-bold transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launch Overlay */}
      {launching && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-md w-full p-8 glass rounded-[40px] text-center border-violet-500/30">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-ping" />
              <div className="relative w-full h-full bg-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/50">
                {launchStep < 3 ? <Globe className="text-white animate-spin-slow" /> : <CheckCircle2 className="text-white w-10 h-10" />}
              </div>
            </div>
            
            <h3 className="text-2xl font-display font-bold mb-4">
              {launchStep === 1 && "Syncing with Ad Networks..."}
              {launchStep === 2 && "Optimizing Placements..."}
              {launchStep === 3 && "Campaign Successfully Launched!"}
            </h3>
            
            <div className="space-y-3 mb-8 text-left">
              {Object.entries(integrations).map(([name, isConnected]) => {
                if (!isConnected) return null;
                return (
                  <div key={name} className={`flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-sm ${launchStep >= 1 ? 'text-violet-400' : 'text-gray-600'}`}>
                    <span>{name} Ad Set Deployment</span>
                    {launchStep > 1 ? <CheckCircle2 size={14} className="text-emerald-500" /> : launchStep === 1 ? <Loader2 size={14} className="animate-spin" /> : null}
                  </div>
                );
              })}
            </div>

            {launchStep === 3 && (
              <button 
                onClick={() => setLaunching(false)}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition-all"
              >
                Enter Command Center
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-display font-bold">Creative Ad Forge</h2>
          <p className="text-gray-400">High-converting concepts generated for your audience</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleGenerateMore}
            disabled={isGeneratingMore}
            className="glass px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate More
          </button>
          <button 
            onClick={handleLaunch}
            className="bg-violet-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/40 active:scale-95"
          >
            <Send className="w-4 h-4" /> Launch Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ads.map((ad) => {
          if (!ad || !ad.copy) return null;
          return (
            <div key={ad.id} className="flex flex-col group">
              <div className="glass rounded-[32px] overflow-hidden border-white/5 hover:border-violet-500/20 transition-all mb-4 flex flex-col h-full">
                <div className="relative aspect-square bg-white/5">
                  {loadingMap[ad.id] ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                      <span className="text-xs font-bold text-gray-500 animate-pulse uppercase tracking-widest">Generating 4K Visual...</span>
                    </div>
                  ) : ad.imageUrl ? (
                    <>
                      <img src={ad.imageUrl} className="w-full h-full object-cover" alt={ad.title} />
                      <button 
                        onClick={() => handleRegenerateImage(ad.id, ad.visualPrompt)}
                        className="absolute bottom-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <ImageIcon className="w-12 h-12 text-white/10" />
                      <button 
                         onClick={() => handleRegenerateImage(ad.id, ad.visualPrompt)}
                         className="text-xs font-bold px-4 py-2 glass rounded-full hover:bg-white/10"
                      >
                        GENERATE ASSET
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="inline-flex px-3 py-1 rounded-full bg-violet-500/10 text-[10px] font-bold text-violet-400 border border-violet-500/20 mb-4 w-fit uppercase tracking-wider">
                    {ad.conceptType}
                  </div>
                  
                  <input 
                    className="bg-transparent border-none text-xl font-display font-bold text-white mb-2 outline-none w-full hover:bg-white/5 rounded px-1 transition-colors"
                    value={ad.copy.headline || ''}
                    onChange={(e) => updateCopy(ad.id, 'headline', e.target.value)}
                  />
                  
                  <textarea 
                    className="bg-transparent border-none text-sm text-gray-400 leading-relaxed outline-none resize-none flex-1 mb-6 hover:bg-white/5 rounded px-1 transition-colors"
                    value={ad.copy.caption || ''}
                    onChange={(e) => updateCopy(ad.id, 'caption', e.target.value)}
                    rows={4}
                  />

                  <button className="w-full py-4 glass rounded-2xl font-bold text-white group-hover:bg-white group-hover:text-black transition-all">
                    {ad.copy.cta || 'Learn More'}
                  </button>
                </div>
              </div>

              <div className="px-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2 uppercase tracking-tighter">
                  <Sparkles size={12} className="text-violet-400" /> Visual Reasoning Prompt
                </div>
                <p className="text-[11px] text-gray-500 italic leading-relaxed">
                  "{ad.visualPrompt}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
