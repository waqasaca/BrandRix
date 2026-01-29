
import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { StrategyView } from './components/StrategyView';
import { AdMaker } from './components/AdMaker';
import { SimulationRoom } from './components/SimulationRoom';
import { OmniPulseForge } from './components/OmniPulseForge';
import { IntegrationModal } from './components/IntegrationModal';
import { PulseWarRoom } from './components/PulseWarRoom';
import { performDeepAudit } from './services/geminiService';
import { AuditResult, Integrations } from './types';
import { Zap, Layout, ArrowLeft, Brain, Sparkles, Target, BarChart3, Layers, Settings, UserCircle, Radio } from 'lucide-react';

// Consolidate Window augmentation to fix modifiers and type mismatch errors
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

enum View {
  Landing,
  Dashboard,
  Strategy,
  AdMaker,
  Simulation,
  OmniForge,
  WarRoom
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Landing);
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [integrations, setIntegrations] = useState<Integrations>({ Instagram: false, LinkedIn: false, TikTok: false, Email: false, Search: false });
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  const handleStartAudit = async (url: string) => {
    setLoading(true);
    try {
      const data = await performDeepAudit(url);
      setAuditData(data);
      setCurrentView(View.Dashboard);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: View.Dashboard, label: 'Health', icon: BarChart3 },
    { id: View.WarRoom, label: 'War Room', icon: Radio, highlight: true },
    { id: View.Strategy, label: 'Strategy', icon: Target },
    { id: View.AdMaker, label: 'Creative', icon: Sparkles },
    { id: View.Simulation, label: 'Simulation', icon: Brain },
    { id: View.OmniForge, label: 'OmniPulse', icon: Layers },
  ];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-display font-bold animate-pulse">Syncing Brand Intelligence...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505]">
      <IntegrationModal isOpen={isIntegrationModalOpen} onClose={() => setIsIntegrationModalOpen(false)} integrations={integrations} onConnect={(p) => setIntegrations(v => ({...v, [p]: true}))} />

      {currentView === View.Landing ? (
        <LandingPage onScan={handleStartAudit} />
      ) : auditData && (
        <div className="p-6 lg:p-12 pb-24">
          <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView(View.Landing)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20}/></button>
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center neon-glow"><Zap className="text-white fill-current" size={20}/></div>
              <span className="font-display text-lg font-bold tracking-tighter">BrandPulse AI</span>
            </div>
            <div className="flex glass rounded-full p-1 gap-1 border-white/5">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setCurrentView(item.id)} className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${currentView === item.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'} ${item.highlight && currentView !== item.id ? 'text-violet-400' : ''}`}>
                  <item.icon size={14} /> {item.label}
                  {item.highlight && currentView !== item.id && <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsIntegrationModalOpen(true)} className="p-3 glass rounded-xl text-gray-400 hover:text-white transition-all"><Settings size={20} /></button>
              <div className="w-10 h-10 rounded-xl glass border-white/10 flex items-center justify-center text-gray-500"><UserCircle size={24} /></div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto">
            {currentView === View.Dashboard && <Dashboard health={auditData.health} onContinue={() => setCurrentView(View.WarRoom)} />}
            {currentView === View.WarRoom && <PulseWarRoom auditResult={auditData} onPivotAds={(newAds) => setAuditData({...auditData, ads: [...newAds, ...auditData.ads].slice(0, 6)})} />}
            {currentView === View.Strategy && <StrategyView strategy={auditData.strategy} onApprove={() => setCurrentView(View.AdMaker)} />}
            {currentView === View.AdMaker && <AdMaker initialAds={auditData.ads} health={auditData.health} strategy={auditData.strategy} integrations={integrations} onOpenIntegrations={() => setIsIntegrationModalOpen(true)} />}
            {currentView === View.Simulation && <SimulationRoom ads={auditData.ads} strategy={auditData.strategy} />}
            {currentView === View.OmniForge && <OmniPulseForge ads={auditData.ads} strategy={auditData.strategy} integrations={integrations} onOpenIntegrations={() => setIsIntegrationModalOpen(true)} />}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
