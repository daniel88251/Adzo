import { GoogleGenAI, Type } from "@google/genai";
import { Sector, BrandProfile, CampaignStrategy, AnalysisResult, OptimizationSuggestion } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- EXISTING FUNCTIONS ---

export const generateAdCopy = async (
  productName: string,
  description: string,
  sector: Sector,
  targetAudience: string,
  tone?: string
): Promise<{ headline: string; body: string; cta: string }> => {
  const ai = getAIClient();
  
  const prompt = `
    Atue como um Diretor de Criação premiado (AdZo).
    Crie um texto de anúncio de alta conversão.
    
    Setor: ${sector}
    Produto: ${productName}
    Descrição: ${description}
    Público Alvo: ${targetAudience}
    ${tone ? `Tom de Voz da Marca: ${tone}` : ''}
    
    O anúncio deve ser persuasivo, direto e utilizar gatilhos mentais adequados ao setor.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "Um título chamativo" },
            body: { type: Type.STRING, description: "O corpo do anúncio focado em benefícios" },
            cta: { type: Type.STRING, description: "Chamada para ação" }
          },
          required: ["headline", "body", "cta"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating ad copy:", error);
    throw error;
  }
};

export const generateAdImage = async (
  prompt: string,
  aspectRatio: "1:1" | "16:9" | "9:16" = "1:1",
  styleReference?: string
): Promise<string> => {
  const ai = getAIClient();

  const enhancedPrompt = `
    Fotografia profissional publicitária, alta resolução, iluminação de estúdio, cinematográfico.
    ${styleReference ? `Estilo visual: ${styleReference}.` : ''}
    ${prompt}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const generateAdVideo = async (
  prompt: string,
  aspectRatio: "16:9" | "9:16" = "16:9",
  imageBase64?: string
): Promise<string> => {
  const win = window as any;
  
  // 1. Initial check for API Key
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey && win.aistudio.openSelectKey) {
      await win.aistudio.openSelectKey();
    }
  }

  // Define generation logic to allow retries
  const runGeneration = async () => {
    // Re-instantiate to get the new key if selected
    const ai = getAIClient();

    // Construct request options
    const requestOptions: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Anúncio publicitário profissional, 4k, cinematográfico: ${prompt}`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    };

    // Add image if provided (Image-to-Video)
    if (imageBase64) {
      requestOptions.image = {
        imageBytes: imageBase64,
        mimeType: 'image/png', 
      };
    }

    let operation = await ai.models.generateVideos(requestOptions);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video URI not found in response");

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
  };

  try {
    return await runGeneration();
  } catch (error: any) {
    // 2. Error handling for specific key issue (Project not found / Invalid Key context)
    // "Requested entity was not found" often indicates the project associated with the key is not accessible or key is missing proper association for Veo.
    if (error.message?.includes("Requested entity was not found") && win.aistudio && win.aistudio.openSelectKey) {
        console.log("API Key might be invalid or project not found. Prompting selection again.");
        await win.aistudio.openSelectKey();
        // Retry once after new key selection
        return await runGeneration();
    }
    console.error("Error generating video:", error);
    throw error;
  }
};

// --- NEW FUNCTIONS FOR ADZO AGENCY ---

/**
 * Generates a complete brand identity kit.
 */
export const generateBrandKit = async (brandName: string, description: string): Promise<BrandProfile> => {
  const ai = getAIClient();
  const prompt = `
    Crie um Brand Kit completo para a marca "${brandName}".
    Descrição: ${description}.
    Preciso de paleta de cores (hex), sugestão de tipografia, tom de voz e um manifesto curto.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          typography: { type: Type.STRING },
          toneOfVoice: { type: Type.STRING },
          manifesto: { type: Type.STRING }
        },
        required: ["name", "colors", "typography", "toneOfVoice", "manifesto"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Generates a comprehensive campaign strategy.
 */
export const generateCampaignStrategy = async (
  product: string, 
  goal: string, 
  budget: string,
  sector: string
): Promise<CampaignStrategy> => {
  const ai = getAIClient();
  const prompt = `
    Crie um plano de campanha de marketing digital detalhado.
    Produto: ${product}
    Objetivo: ${goal}
    Orçamento: ${budget}
    Setor: ${sector}
    
    Forneça público-alvo detalhado, canais, alocação de verba e um calendário de conteúdo de 4 semanas.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          targetAudience: { 
            type: Type.OBJECT,
            properties: {
              demographics: { type: Type.STRING },
              interests: { type: Type.ARRAY, items: { type: Type.STRING } },
              painPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          channels: { type: Type.ARRAY, items: { type: Type.STRING } },
          budgetAllocation: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: { channel: { type: Type.STRING }, percentage: { type: Type.NUMBER } }
            }
          },
          contentCalendar: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 week: { type: Type.NUMBER },
                 theme: { type: Type.STRING },
                 formats: { type: Type.ARRAY, items: { type: Type.STRING } }
               }
             }
          },
          keyMessage: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Multimodal analysis of an existing ad creative.
 */
export const analyzeCreative = async (imageBase64: string): Promise<AnalysisResult> => {
  const ai = getAIClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
        { text: "Analise este anúncio como um Diretor de Criação Sênior. Avalie o design, clareza, copy (se houver) e potencial de conversão. Dê uma nota de 0 a 100." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvedVersionPrompt: { type: Type.STRING, description: "Um prompt otimizado para gerar uma versão melhor desta imagem" }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Generates script for videos.
 */
export const generateVideoScript = async (product: string, angle: string): Promise<any> => {
  const ai = getAIClient();
  const prompt = `Crie um roteiro de vídeo curto (Reels/TikTok) para ${product}. Foco: ${angle}. Inclua cenas visuais e a fala/legenda.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                visual: { type: Type.STRING },
                audio: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getSectorTrends = async (sector: Sector): Promise<string[]> => {
  const ai = getAIClient();
  const prompt = `Quais são as 5 maiores tendências visuais e de copy para anúncios no setor de ${sector} atualmente? Seja específico.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  return JSON.parse(response.text || "[]");
};

/**
 * Analyzes campaign performance and suggests optimizations.
 */
export const analyzeAndOptimize = async (
  sector: Sector,
  currentCtr: number
): Promise<OptimizationSuggestion[]> => {
  const ai = getAIClient();
  const prompt = `
    Atue como um Especialista em Otimização de Ads (AdZo).
    Analise um cenário hipotético para o setor: ${sector}.
    O CTR atual é de ${currentCtr}%, o que pode ser melhorado.
    
    Gere 3 sugestões de otimização práticas (uma para Copy, uma para Visual, uma para Audiência).
    Para cada sugestão, defina:
    - O que provavelmente está sendo feito (currentValue)
    - O que deve ser feito (suggestedValue)
    - O porquê (reasoning)
    - Impacto estimado na conversão (impactScore de 0 a 100)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, enum: ["Copy", "Visual", "Audience"] },
              currentValue: { type: Type.STRING },
              suggestedValue: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              impactScore: { type: Type.NUMBER }
            },
            required: ["category", "currentValue", "suggestedValue", "reasoning", "impactScore"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating optimization suggestions:", error);
    return [];
  }
};