
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, ChevronRight, Loader2, CheckCircle2, Globe, Instagram, Linkedin, Video, Mail, Search } from 'lucide-react';
import { Integrations } from '../types';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrations: Integrations;
  onConnect: (platform: keyof Integrations) => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({ isOpen, onClose, integrations, onConnect }) => {
  const [connecting, setConnecting] = useState<keyof Integrations | null>(null);
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const handleSimulateConnect = (platform: keyof Integrations) => {
    setConnecting(platform);
    setStep(1); // Authenticating
    setTimeout(() => setStep(2), 1500); // Scopes
    setTimeout(() => setStep(3), 3000); // Finalizing
    setTimeout(() => {
      onConnect(platform);
      setConnecting(null);
      setStep(0);
    }, 4500);
  };

  const platforms = [
    { id: 'Instagram', name: 'Meta Ads Manager', icon: Instagram, color: 'text-pink-500' },
    { id: 'LinkedIn', name: 'LinkedIn Campaign Manager', icon: Linkedin, color: 'text-blue-500' },
    { id: 'TikTok', name: 'TikTok for Business', icon: Video, color: 'text-cyan-400' },
    { id: 'Search', name: 'Google Ads (Search/Display)', icon: Search, color: 'text-amber-500' },
    { id: 'Email', name: 'Mailchimp / Klaviyo', icon: Mail, color: 'text-emerald-500' },
  ] as const;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 p-6">
      <div className="max-w-2xl w-full glass rounded-[40px] border-white/10 overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full transition-colors z-10">
          <X className="text-gray-500" />
        </button>

        {connecting ? (
          <div className="p-16 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 border-2 border-violet-500/20 rounded-full animate-ping" />
              <Loader2 className="text-violet-500 animate-spin w-12 h-12" />
            </div>
            
            <h3 className="text-3xl font-display font-bold mb-4">
              {step === 1 && `Authenticating with ${connecting}...`}
              {step === 2 && `Authorizing Permissions...`}
              {step === 3 && `Finalizing secure link...`}
            </h3>
            
            <div className="flex flex-col gap-3 max-w-xs mx-auto text-left mb-8">
              <div className={`flex items-center gap-3 text-sm ${step >= 1 ? 'text-emerald-400' : 'text-gray-600'}`}>
                <CheckCircle2 size={16} className={step >= 1 ? 'opacity-100' : 'opacity-20'} /> 
                Secure handshake established
              </div>
              <div className={`flex items-center gap-3 text-sm ${step >= 2 ? 'text-emerald-400' : 'text-gray-600'}`}>
                <CheckCircle2 size={16} className={step >= 2 ? 'opacity-100' : 'opacity-20'} /> 
                Ad_Content_Manager scope granted
              </div>
              <div className={`flex items-center gap-3 text-sm ${step >= 3 ? 'text-emerald-400' : 'text-gray-600'}`}>
                <CheckCircle2 size={16} className={step >= 3 ? 'opacity-100' : 'opacity-20'} /> 
                Token exchange successful
              </div>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center gap-3 text-xs text-gray-500 text-left">
              <Lock size={14} className="shrink-0" />
              This connection uses 256-bit AES encryption. BrandPulse AI never stores your master passwords.
            </div>
          </div>
        ) : (
          <div className="p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-500">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold">Node Integration Hub</h3>
                <p className="text-gray-500 text-sm">Connect your autonomous agent to ad networks.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => {
                const isConnected = integrations[platform.id as keyof Integrations];
                return (
                  <button
                    key={platform.id}
                    onClick={() => !isConnected && handleSimulateConnect(platform.id as keyof Integrations)}
                    disabled={isConnected}
                    className={`p-6 rounded-3xl border transition-all text-left flex flex-col gap-4 relative group ${
                      isConnected 
                      ? 'bg-emerald-500/5 border-emerald-500/20 cursor-default' 
                      : 'glass border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <platform.icon size={24} className={isConnected ? 'text-emerald-400' : platform.color} />
                      {isConnected ? (
                        <div className="px-2 py-1 bg-emerald-500/20 rounded text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Connected</div>
                      ) : (
                        <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{platform.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">API V2.4 Stable Connection</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-start gap-4">
              <ShieldCheck className="text-blue-400 shrink-0" size={20} />
              <p className="text-xs text-gray-400 leading-relaxed">
                Connect at least one social and one search network to enable <b>OmniPulse™ Cross-Channel Optimization</b>. BrandPulse AI will automatically balance budget between these nodes based on real-time ROI.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
