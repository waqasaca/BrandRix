
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AuditResult, BrandHealth, Strategy, AdConcept, SimulationResult, OmniChannelCampaign, WarRoomIntelligence } from "../types";

// Helper to initialize GoogleGenAI with the mandatory apiKey from environment
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const INTELLIGENCE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    signals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          url: { type: Type.STRING, description: "Placeholder for URL to be filled by grounding chunks" },
          source: { type: Type.STRING },
          relevance: { type: Type.NUMBER },
          category: { type: Type.STRING }
        },
        required: ["title", "description", "source", "relevance", "category"]
      }
    },
    strategicAssessment: { type: Type.STRING },
    recommendedPivot: {
      type: Type.OBJECT,
      properties: {
        theme: { type: Type.STRING },
        rationale: { type: Type.STRING }
      },
      required: ["theme", "rationale"]
    }
  },
  required: ["signals", "strategicAssessment", "recommendedPivot"]
};

// Uses Google Search grounding to scan live market intelligence
export async function fetchMarketIntelligence(brandName: string, niche: string): Promise<WarRoomIntelligence> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Scan the web for recent (last 7 days) market news, competitor activities, and trending topics related to the brand "${brandName}" in the "${niche}" industry. 
    Analyze the data and identify 4-5 key 'signals' that represent competitive threats or market opportunities.
    For each signal, provide a title, a brief description, and its relevance score.
    Also provide a 'strategicAssessment' of how the brand should react and a 'recommendedPivot' theme.
    Return the data in the specified JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: INTELLIGENCE_SCHEMA
    }
  });

  // Extract URLs from grounding metadata as per guidelines
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const result: WarRoomIntelligence = JSON.parse(response.text || "{}");
  
  // Distribute found URLs into signals if available
  result.signals = result.signals.map((sig, idx) => ({
    ...sig,
    url: groundingChunks[idx]?.web?.uri || groundingChunks[0]?.web?.uri || '#'
  }));

  return result;
}

// Adapt an existing ad to a tactical pivot theme
export async function generateTacticalAdPivot(originalAd: AdConcept, pivotTheme: string): Promise<AdConcept> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Pivot the following ad concept to align with the new market theme: "${pivotTheme}".
    ORIGINAL AD: ${JSON.stringify(originalAd)}
    
    Maintain the core brand voice but rewrite the headline, caption, and visual prompt to address this new tactical angle. 
    Return a NEW AdConcept in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          conceptType: { type: Type.STRING },
          copy: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              caption: { type: Type.STRING },
              cta: { type: Type.STRING }
            },
            required: ["headline", "caption", "cta"]
          },
          visualPrompt: { type: Type.STRING }
        },
        required: ["id", "title", "conceptType", "copy", "visualPrompt"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

// Perform deep brand audit using Gemini 3 Pro reasoning
export async function performDeepAudit(url: string): Promise<AuditResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this brand URL: ${url}. Perform audit, strategy, and 3 ads.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          health: { type: Type.OBJECT, properties: { seoScore: { type: Type.NUMBER }, brandVoice: { type: Type.STRING }, voiceDescription: { type: Type.STRING }, gaps: { type: Type.ARRAY, items: { type: Type.STRING } }, colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } }, typography: { type: Type.STRING } }, required: ["seoScore", "brandVoice", "voiceDescription", "gaps", "colorPalette", "typography"] },
          strategy: { type: Type.OBJECT, properties: { targetPersona: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, demographics: { type: Type.STRING }, painPoints: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["name", "description", "demographics", "painPoints"] }, valueProposition: { type: Type.STRING }, channels: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: { type: Type.STRING }, rationale: { type: Type.STRING } }, required: ["platform", "rationale"] } }, roadmap: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["targetPersona", "valueProposition", "channels", "roadmap"] },
          ads: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, conceptType: { type: Type.STRING }, copy: { type: Type.OBJECT, properties: { headline: { type: Type.STRING }, caption: { type: Type.STRING }, cta: { type: Type.STRING } }, required: ["headline", "caption", "cta"] }, visualPrompt: { type: Type.STRING } }, required: ["id", "title", "conceptType", "copy", "visualPrompt"] } }
        },
        required: ["health", "strategy", "ads"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

// Generate high-quality visuals using gemini-3-pro-image-preview
export async function generateAdImage(prompt: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `High quality marketing visual: ${prompt}` }] },
    config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return 'https://picsum.photos/800/800';
}

// Fixed missing export: generateMoreAds
export async function generateMoreAds(health: BrandHealth, strategy: Strategy): Promise<AdConcept[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on the brand health profile and strategic roadmap provided, generate 3 more distinct high-converting ad concepts targeting the identified persona.
    HEALTH: ${JSON.stringify(health)}
    STRATEGY: ${JSON.stringify(strategy)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            conceptType: { type: Type.STRING },
            copy: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                caption: { type: Type.STRING },
                cta: { type: Type.STRING }
              },
              required: ["headline", "caption", "cta"]
            },
            visualPrompt: { type: Type.STRING }
          },
          required: ["id", "title", "conceptType", "copy", "visualPrompt"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
}

// Fixed missing export: runAdSimulation
export async function runAdSimulation(ad: AdConcept, strategy: Strategy): Promise<SimulationResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a neural simulation of target audience reaction for this ad concept.
    AD: ${JSON.stringify(ad)}
    STRATEGY: ${JSON.stringify(strategy)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          averageConversionLift: { type: Type.NUMBER },
          sentimentHeatmap: {
            type: Type.OBJECT,
            properties: {
              trust: { type: Type.NUMBER },
              excitement: { type: Type.NUMBER },
              confusion: { type: Type.NUMBER },
              urgency: { type: Type.NUMBER }
            },
            required: ["trust", "excitement", "confusion", "urgency"]
          },
          reactions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                personaName: { type: Type.STRING },
                personaTrait: { type: Type.STRING },
                reactionText: { type: Type.STRING },
                buyProbability: { type: Type.NUMBER },
                critique: { type: Type.STRING }
              },
              required: ["personaName", "personaTrait", "reactionText", "buyProbability", "critique"]
            }
          }
        },
        required: ["averageConversionLift", "sentimentHeatmap", "reactions"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

// Fixed missing export: generateOmniPulseForge
export async function generateOmniPulseForge(ad: AdConcept, strategy: Strategy): Promise<OmniChannelCampaign> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Refract this core ad concept into platform-native assets for Instagram, LinkedIn, TikTok, Email, and Search.
    AD: ${JSON.stringify(ad)}
    STRATEGY: ${JSON.stringify(strategy)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          assets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                headline: { type: Type.STRING },
                copy: { type: Type.STRING },
                visualDirection: { type: Type.STRING },
                behavioralLogic: { type: Type.STRING }
              },
              required: ["platform", "copy", "visualDirection", "behavioralLogic"]
            }
          }
        },
        required: ["id", "assets"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

// Fixed missing export: generateBrandAudio using Gemini 2.5 TTS
export async function generateBrandAudio(text: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say in a professional brand voice: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  // Returns raw PCM data in base64 format as per guidelines
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
}
