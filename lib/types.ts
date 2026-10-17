export const HOLDON_VERSION = '1.0.0';

export type VerdictType = 'warning' | 'caution' | 'neutral' | 'recommended';

export interface BreakdownPoint {
  label: string;
  score: number; // 0 - 10
  status: 'good' | 'average' | 'poor';
  detail: string;
}

export interface SustainableAlternative {
  name: string;
  brand: string;
  highlight: string;
  estPrice: number;
  repairScore?: number;
  link?: string;
}

export interface TrueCostAnalysis {
  productTitle: string;
  category: string;
  originalPrice: number;
  currency: string;
  estimatedLifespan: string; // e.g. "1.5 - 2 years"
  lifespanMonths: number;
  repairabilityScore: number; // 1 - 10
  repairabilityRating: 'Poor' | 'Fair' | 'Moderate' | 'Good' | 'Exceptional';
  resaleValue1Yr: number;
  resalePercentage: number;
  costPerMonth: number;
  costPerUse: number;
  co2FootprintKg: number;
  verdict: string;
  verdictType: VerdictType;
  summary: string;
  breakdown: BreakdownPoint[];
  alternatives: SustainableAlternative[];
  source: 'gemini' | 'grok' | 'intelligent-engine';
}

export interface ProductInfo {
  title: string;
  price: number;
  rawPrice: string;
  currency: string;
  brand?: string;
  category: string;
  imageUrl?: string;
  url: string;
  rating?: number;
  asin?: string;
  store: 'amazon' | 'flipkart' | 'demo' | 'unknown';
}

export interface DecisionOption {
  id: string;
  text: string;
  subtext?: string;
  impactScore?: number; // negative = impulse, positive = needed
}

export interface DecisionQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: DecisionOption[];
}

export type DecisionVerdict = 
  | 'repair'
  | 'borrow'
  | 'second_hand'
  | 'wait_30_days'
  | 'skip'
  | 'buy_new';

export interface DecisionResult {
  verdict: DecisionVerdict;
  title: string;
  badge: string;
  description: string;
  primaryAction: {
    label: string;
    actionType: 'pause' | 'local' | 'proceed';
  };
}

export interface PauseItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string;
  url: string;
  category: string;
  dateAdded: number; // timestamp
  expiresAt: number; // timestamp (+30 days)
  reflectionNote: string;
  status: 'active' | 'reconsidered' | 'purchased';
  co2EstimateKg?: number;
}

export type PlaceType = 'repair' | 'second-hand' | 'borrow' | 'recycle';

export interface LocalPlace {
  id: string;
  name: string;
  type: PlaceType;
  category: string;
  address: string;
  distanceKm: number;
  phone?: string;
  mapsUrl: string;
  rating: number;
  verified: boolean;
  city: string;
  timing?: string;
}

export interface AppSettings {
  geminiApiKey: string;
  useGeminiApi: boolean;
  grokApiKey?: string;
  useGrokApi?: boolean;
  currentCity: string;
  autoAnalyze: boolean;
  theme: 'dark' | 'light' | 'system';
}

export interface ImpactStats {
  totalItemsPaused: number;
  totalMoneySaved: number;
  totalCo2SavedKg: number;
  reconsideredCount: number;
}
