export enum AdFormat {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  SCRIPT = 'SCRIPT'
}

export enum Sector {
  ECOMMERCE = 'E-commerce',
  SAAS = 'SaaS',
  REAL_ESTATE = 'Imobiliário',
  HEALTH = 'Saúde & Bem-estar',
  EDUCATION = 'Educação',
  FINANCE = 'Finanças',
  FASHION = 'Moda & Acessórios',
  TECH = 'Tecnologia'
}

export interface AdCampaign {
  id: string;
  name: string;
  objective: string;
  status: 'Active' | 'Paused' | 'Draft';
  budget: number;
  spent: number;
  ctr: number;
  conversionRate: number;
}

export interface GeneratedAsset {
  id: string;
  type: AdFormat;
  content: string; // Text content or Image/Video URL
  thumbnail?: string;
  createdAt: Date;
  meta?: {
    prompt: string;
    model: string;
  };
}

export interface OptimizationSuggestion {
  category: 'Copy' | 'Visual' | 'Audience';
  currentValue: string;
  suggestedValue: string;
  reasoning: string;
  impactScore: number; // 1-100
}

export interface BrandProfile {
  name: string;
  colors: string[];
  typography: string;
  toneOfVoice: string;
  manifesto: string;
}

export interface CampaignStrategy {
  targetAudience: {
    demographics: string;
    interests: string[];
    painPoints: string[];
  };
  channels: string[];
  budgetAllocation: { channel: string; percentage: number }[];
  contentCalendar: { week: number; theme: string; formats: string[] }[];
  keyMessage: string;
}

export interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improvedVersionPrompt?: string;
}