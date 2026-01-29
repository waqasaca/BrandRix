
export interface BrandHealth {
  seoScore: number;
  brandVoice: string;
  voiceDescription: string;
  gaps: string[];
  colorPalette: string[];
  typography: string;
}

export interface Persona {
  name: string;
  description: string;
  demographics: string;
  painPoints: string[];
}

export interface Strategy {
  targetPersona: Persona;
  valueProposition: string;
  channels: {
    platform: string;
    rationale: string;
  }[];
  roadmap: string[];
}

export interface AdConcept {
  id: string;
  title: string;
  conceptType: string;
  copy: {
    headline: string;
    caption: string;
    cta: string;
  };
  visualPrompt: string;
  imageUrl?: string;
}

export interface IntelligenceSignal {
  title: string;
  description: string;
  url: string;
  source: string;
  relevance: number; // 0-100
  category: 'Competitor' | 'Trend' | 'Opportunity';
}

export interface WarRoomIntelligence {
  signals: IntelligenceSignal[];
  strategicAssessment: string;
  recommendedPivot: {
    theme: string;
    rationale: string;
  };
}

// Added missing interface for Focus Group Simulation
export interface SimulationResult {
  averageConversionLift: number;
  sentimentHeatmap: {
    trust: number;
    excitement: number;
    confusion: number;
    urgency: number;
  };
  reactions: {
    personaName: string;
    personaTrait: string;
    reactionText: string;
    buyProbability: number;
    critique: string;
  }[];
}

// Added missing interface for Omni-Channel Assets
export interface PlatformAsset {
  platform: 'Instagram' | 'LinkedIn' | 'TikTok' | 'Email' | 'Search';
  headline?: string;
  copy: string;
  visualDirection: string;
  behavioralLogic: string;
}

// Added missing interface for Omni-Channel Campaigns
export interface OmniChannelCampaign {
  id: string;
  assets: PlatformAsset[];
}

export interface AuditResult {
  health: BrandHealth;
  strategy: Strategy;
  ads: AdConcept[];
}

export interface Integrations {
  Instagram: boolean;
  LinkedIn: boolean;
  TikTok: boolean;
  Email: boolean;
  Search: boolean;
}

export interface AccountProfile {
  name: string;
  email: string;
  tier: 'Growth' | 'Enterprise';
}
