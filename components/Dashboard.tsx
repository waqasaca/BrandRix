
import React from 'react';
import { BrandHealth } from '../types';
import { CheckCircle2, AlertCircle, Palette, Type as TypeIcon, ExternalLink } from 'lucide-react';

interface DashboardProps {
  health: BrandHealth;
  onContinue: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ health, onContinue }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-display font-bold">Brand Health Dashboard</h2>
          <p className="text-gray-400">Real-time digital presence analysis</p>
        </div>
        <button 
          onClick={onContinue}
          className="bg-violet-600 hover:bg-violet-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-900/20"
        >
          Generate Strategy <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* SEO Score */}
        <div className="glass p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BarChartIcon />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase mb-4">SEO Health Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-display font-extrabold text-white">{health.seoScore}</span>
            <span className="text-xl font-bold text-gray-600">/100</span>
          </div>
          <div className="mt-6 w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-blue-500" 
              style={{ width: `${health.seoScore}%` }}
            />
          </div>
        </div>

        {/* Brand Voice */}
        <div className="glass p-8 rounded-3xl col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center">
              <TypeIcon className="text-fuchsia-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">Brand Voice: {health.brandVoice}</h3>
              <p className="text-gray-500 text-sm">Semantic analysis output</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed italic">
            "{health.voiceDescription}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Presence Gaps */}
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="text-amber-400 w-5 h-4" />
            Competitive Gaps Identified
          </h3>
          <ul className="space-y-4">
            {health.gaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center mt-0.5">
                  <span className="text-[10px] font-bold text-amber-400">!</span>
                </div>
                <span className="text-gray-300 text-sm">{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual Identity */}
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Palette className="text-blue-400 w-5 h-4" />
            Visual Signature
          </h3>
          <div className="grid grid-cols-4 gap-3 mb-8">
            {health.colorPalette.map((color, i) => (
              <div key={i} className="group">
                <div 
                  className="h-16 rounded-xl border border-white/10 shadow-inner mb-2"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] text-gray-500 uppercase font-mono block text-center">
                  {color}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/5 rounded-2xl">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Primary Typography</p>
            <p className="text-2xl font-display font-medium">{health.typography}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BarChartIcon = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="60" width="15" height="30" rx="2" fill="white"/>
    <rect x="30" y="40" width="15" height="50" rx="2" fill="white"/>
    <rect x="50" y="20" width="15" height="70" rx="2" fill="white"/>
    <rect x="70" y="10" width="15" height="80" rx="2" fill="white"/>
  </svg>
);
