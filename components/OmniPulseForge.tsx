
import React, { useState, useEffect, useRef } from 'react';
import { AdConcept, Strategy, OmniChannelCampaign, PlatformAsset, Integrations } from '../types';
import { 
  Instagram, Linkedin, Mail, Search, Video, Share2, 
  Copy, Download, Zap, Info, Cpu, Play, Volume2, 
  Smartphone, Monitor, Layout, Eye, Clapperboard, Check,
  Terminal, Globe, ShieldCheck, Activity, Target, CheckCircle2, Loader2, Rocket, AlertTriangle
} from 'lucide-react';
import { generateOmniPulseForge, generateBrandAudio } from '../services/geminiService';

// Audio Utility Functions
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface OmniPulseForgeProps {
  ads: AdConcept[];
  strategy: Strategy;
  integrations: Integrations;
  onOpenIntegrations: () => void;
  onQuotaError?: () => void;
}

export const OmniPulseForge: React.FC<OmniPulseForgeProps> = ({ ads, strategy, integrations, onOpenIntegrations, onQuotaError }) => {
  const [selectedAdId, setSelectedAdId] = useState(ads[0]?.id || '');
  const [campaign, setCampaign] = useState<OmniChannelCampaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePlatform, setActivePlatform] = useState<PlatformAsset['platform']>('Instagram');
  const [audioLoading, setAudioLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  
  // Deployment States
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<'validating' | 'syncing' | 'optimizing' | 'success'>('validating');
  const [completedPlatforms, setCompletedPlatforms] = useState<string[]>([]);
  const [showConnectionWarning, setShowConnectionWarning] = useState(false);

  const loadingMessages = [
    "Deconstructing Brand DNA...",
    "Analyzing Platform Native Behaviors...",
    "Re-engineering Copy Semantics...",
    "Synthesizing Visual Logic...",
    "Forging Omni-Channel Assets..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleForge = async () => {
    const ad = ads.find(a => a.id === selectedAdId);
    if (!ad) return;

    setLoading(true);
    setLoadingStep(0);
    setCampaign(null);
    try {
      const result = await generateOmniPulseForge(ad, strategy);
      setCampaign(result);
      if (result.assets.length > 0) setActivePlatform(result.assets[0].platform);
    } catch (e: any) {
      console.error(e);
      if ((e?.message === 'QUOTA_EXHAUSTED' || e?.message?.includes('429')) && onQuotaError) {
        onQuotaError();
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePushToNetworks = async () => {
    if (!campaign) return;

    // PRE-FLIGHT CHECK
    const activeAssetsInCampaign = campaign.assets.map(a => a.platform);
    const requiredConnections = activeAssetsInCampaign.filter(p => !integrations[p as keyof Integrations]);
    
    if (requiredConnections.length > 0) {
      setShowConnectionWarning(true);
      return;
    }
    
    setIsPushing(true);
    setPushStatus('validating');
    setCompletedPlatforms([]);

    await new Promise(r => setTimeout(r, 1800));
    setPushStatus('syncing');
    for (const asset of campaign.assets) {
      await new Promise(r => setTimeout(r, 1000));
      setCompletedPlatforms(prev => [...prev, asset.platform]);
    }

    setPushStatus('optimizing');
    await new Promise(r => setTimeout(r, 2000));
    setPushStatus('success');
  };

  const playVoice = async (text: string) => {
    if (!text || audioLoading) return;
    setAudioLoading(true);
    try {
      const base64 = await generateBrandAudio(text);
      if (base64) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const bytes = decodeBase64(base64);
        const buffer = await decodeAudioData(bytes, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
        source.onended = () => setAudioLoading(false);
      } else {
        setAudioLoading(false);
      }
    } catch (e: any) {
      console.error(e);
      setAudioLoading(false);
      if ((e?.message === 'QUOTA_EXHAUSTED' || e?.message?.includes('429')) && onQuotaError) {
        onQuotaError();
      }
    }
  };

  const currentAsset = campaign?.assets.find(a => a.platform === activePlatform);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return <Instagram size={20} />;
      case 'LinkedIn': return <Linkedin size={20} />;
      case 'TikTok': return <Video size={20} />;
      case 'Email': return <Mail size={20} />;
      case 'Search': return <Search size={20} />;
      default: return <Share2 size={20} />;
    }
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
            <h3 className="text-2xl font-display font-bold mb-4">Integration Required</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              To refract this campaign into real-world traffic, you must first authorize BrandPulse to post to your selected platform accounts.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowConnectionWarning(false);
                  onOpenIntegrations();
                }}
                className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-violet-900/40"
              >
                Open Node Hub
              </button>
              <button 
                onClick={() => setShowConnectionWarning(false)}
                className="w-full py-4 glass text-gray-400 hover:text-white rounded-2xl font-bold transition-all"
              >
                Cancel Forge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Overlay */}
      {isPushing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500 p-6">
          <div className="max-w-xl w-full glass p-12 rounded-[50px] border-violet-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 transition-all duration-1000"
                style={{ 
                  width: pushStatus === 'validating' ? '20%' : 
                         pushStatus === 'syncing' ? '50%' : 
                         pushStatus === 'optimizing' ? '85%' : '100%' 
                }}
              />
            </div>

            <div className="relative w-28 h-28 mx-auto mb-10">
              <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-ping" />
              <div className="relative w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl shadow-violet-500/40 border border-white/20">
                {pushStatus === 'success' ? <Rocket className="text-white w-12 h-12" /> : <Globe className="text-white w-12 h-12 animate-spin-slow" />}
              </div>
            </div>
            
            <h3 className="text-3xl font-display font-bold mb-4 tracking-tight">
              {pushStatus === 'validating' && "Authenticating Ad Nodes..."}
              {pushStatus === 'syncing' && "Synchronizing Campaign Multiverse..."}
              {pushStatus === 'optimizing' && "Refining Bidding Algorithms..."}
              {pushStatus === 'success' && "Campaign Lives in the Multiverse!"}
            </h3>

            <div className="space-y-4 mb-10 text-left max-w-sm mx-auto">
              {campaign?.assets.map((asset) => (
                <div key={asset.platform} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${completedPlatforms.includes(asset.platform) ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 border border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${completedPlatforms.includes(asset.platform) ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {getPlatformIcon(asset.platform)}
                    </div>
                    <span className={`text-sm font-bold ${completedPlatforms.includes(asset.platform) ? 'text-white' : 'text-gray-600'}`}>
                      {asset.platform} Sync
                    </span>
                  </div>
                  {completedPlatforms.includes(asset.platform) ? <CheckCircle2 size={16} className="text-emerald-400" /> : pushStatus === 'syncing' && completedPlatforms.length === campaign.assets.indexOf(asset) ? <Loader2 size={16} className="animate-spin text-violet-500" /> : null}
                </div>
              ))}
            </div>

            {pushStatus === 'success' && (
              <button 
                onClick={() => setIsPushing(false)}
                className="w-full py-5 bg-white text-black rounded-2xl font-extrabold shadow-xl hover:bg-gray-100 transition-all transform active:scale-95"
              >
                Return to Dashboard
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">OmniPulse™ Forge</h2>
          <p className="text-gray-400">The world's first autonomous campaign refraction engine.</p>
        </div>
        <div className="flex flex-wrap gap-4">
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
            onClick={handleForge}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-900/40 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Cpu className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
            Refract Multiverse
          </button>
        </div>
      </div>

      {campaign && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Platform Switcher */}
          <div className="lg:col-span-1 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {campaign.assets.map((asset) => (
              <button
                key={asset.platform}
                onClick={() => setActivePlatform(asset.platform)}
                className={`min-w-[56px] min-h-[56px] w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  activePlatform === asset.platform 
                  ? 'bg-white text-black shadow-xl shadow-white/10 scale-110' 
                  : 'glass text-gray-500 hover:text-white'
                }`}
              >
                {getPlatformIcon(asset.platform)}
              </button>
            ))}
          </div>

          {/* Asset Workspace */}
          <div className="lg:col-span-7 space-y-8">
            <div className="glass rounded-[40px] border-white/5 overflow-hidden flex flex-col shadow-2xl shadow-black/50">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                    {getPlatformIcon(activePlatform)}
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold">{activePlatform} Native Asset</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Auto-Optimized Messaging</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => playVoice(currentAsset?.headline || currentAsset?.copy || '')}
                    disabled={audioLoading}
                    className="px-4 py-2 glass rounded-xl hover:bg-white/5 text-violet-400 hover:text-violet-300 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {audioLoading ? <Cpu className="animate-spin w-4 h-4" /> : <Volume2 size={16} />}
                    {activePlatform === 'TikTok' ? 'LISTEN TO SCRIPT' : 'BRAND VOICE'}
                  </button>
                  <button className="p-3 glass rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-8">
                {currentAsset?.headline && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Target size={12} /> Platform Headline
                    </label>
                    <div className="text-2xl font-display font-bold leading-tight text-white border-l-2 border-violet-500 pl-6 py-1">
                      {currentAsset.headline}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Layout size={12} /> Contextual Copy
                  </label>
                  <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                    {currentAsset?.copy}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <Cpu size={12} /> Visual Reasoning
                    </label>
                    <p className="text-sm text-gray-400 italic leading-relaxed">
                      {currentAsset?.visualDirection}
                    </p>
                  </div>
                  <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                    <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <Zap size={12} /> Platform Logic
                    </label>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {currentAsset?.behavioralLogic}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-8 rounded-[40px] border-white/5 relative overflow-hidden min-h-[500px] flex flex-col items-center shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Smartphone size={80} />
              </div>
              <h4 className="text-lg font-display font-bold mb-8 w-full flex items-center gap-2 self-start">
                <Smartphone className="text-violet-400 w-5 h-5" /> Live Device Preview
              </h4>
              
              <div className="relative w-[280px] aspect-[9/19] bg-zinc-900 rounded-[3rem] border-8 border-zinc-800 shadow-2xl overflow-hidden p-4 group">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-zinc-800 rounded-b-2xl z-20" />
                <div className="w-full h-full flex flex-col relative overflow-hidden rounded-2xl bg-black">
                  {activePlatform === 'Instagram' && (
                    <div className="space-y-3 p-2">
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600" />
                         <div className="w-16 h-2 bg-zinc-700 rounded" />
                       </div>
                       <div className="aspect-square bg-zinc-800 rounded-xl overflow-hidden relative">
                          <img src={ads.find(a => a.id === selectedAdId)?.imageUrl} className="w-full h-full object-cover" />
                       </div>
                    </div>
                  )}
                  {activePlatform === 'TikTok' && (
                    <div className="relative h-full flex flex-col justify-end p-2 pb-8">
                       <img src={ads.find(a => a.id === selectedAdId)?.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" />
                       <div className="relative z-10 space-y-3">
                         <div className="w-1/2 h-3 bg-white/40 rounded blur-[1px]" />
                         <p className="text-[10px] text-white/90 line-clamp-3 leading-tight">{currentAsset?.copy}</p>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 rounded-[40px] shadow-xl shadow-violet-900/40 group overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="font-display font-bold text-white text-lg mb-2">Final Creative Review</h4>
                <p className="text-sm text-white/70 mb-8 leading-relaxed">
                  All brand safety protocols cleared. Deploying will push these assets to your connected networks.
                </p>
                <button 
                  onClick={handlePushToNetworks}
                  className="w-full py-4 bg-white text-black rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:shadow-2xl hover:bg-gray-100 transition-all active:scale-95"
                >
                  <Check className="w-5 h-5" /> Push to Ad Networks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
