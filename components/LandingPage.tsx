
import React, { useState } from 'react';
import { Search, Zap, BarChart3, Target, Rocket, ChevronRight, Play } from 'lucide-react';

interface LandingPageProps {
  onScan: (url: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onScan }) => {
  const [url, setUrl] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onScan(url);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black selection:bg-violet-500/30">
      {/* Background Glow */}
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-violet-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-blue-900/20 blur-[100px] rounded-full" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center neon-glow">
            <Zap className="text-white fill-current" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter">BrandPulse AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Methodology</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
        </div>
        <button className="px-6 py-2.5 glass rounded-full text-sm font-semibold hover:bg-white/10 transition-all">
          Talk to Specialist
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-xs font-bold text-violet-400 border-violet-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          POWERED BY GEMINI 3 PRO & NANO
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-extrabold mb-8 tracking-tighter leading-[1.1]">
          Replace Your Marketing <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
            Agency with One Click.
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The world's first autonomous brand strategist. Deep audit your presence, 
          formulate a master strategy, and generate high-converting ads in 60 seconds.
        </p>

        {/* Scan Bar Simulation */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-20 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass rounded-2xl p-2 flex items-center gap-2">
            <div className="pl-4">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Enter your brand URL (e.g., https://apple.com)"
              className="bg-transparent border-none outline-none flex-1 py-4 text-lg placeholder:text-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-violet-50 transition-all flex items-center gap-2"
            >
              Analyze Brand <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="glass p-8 rounded-3xl border-white/5 group hover:border-violet-500/30 transition-all">
            <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-display">Deep Audit</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Real-time analysis of SEO, brand voice, and digital presence gaps using proprietary visual DOM scanning.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border-white/5 group hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-display">Master Strategy</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              30-day domination roadmap generated by Gemini 3 Pro reasoning, optimized for high-impact ROI.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border-white/5 group hover:border-fuchsia-500/30 transition-all">
            <div className="w-12 h-12 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Rocket className="text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-display">Instant Execution</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Automatically generate creative copy and 4K brand-aligned visuals for social and search platforms.
            </p>
          </div>
        </div>
      </main>

      {/* Social Proof Bar */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Trusted by disruptors at</span>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-30">
            <span className="text-2xl font-bold font-display italic">VOGUE</span>
            <span className="text-2xl font-bold font-display">hyphen</span>
            <span className="text-2xl font-bold font-display tracking-widest">AETHER</span>
            <span className="text-2xl font-bold font-display uppercase">Modern</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
