import { calculateTrueCost } from './categoryBenchmarks';
import { getSettings } from './storage';
import type { TrueCostAnalysis } from './types';

interface AiAnalysisResponse {
  lifespanDisplay: string;
  lifespanMonths: number;
  repairabilityScore: number;
  repairabilityRating: 'Poor' | 'Fair' | 'Moderate' | 'Good' | 'Exceptional';
  resalePercentage: number;
  verdict: string;
  verdictType: 'warning' | 'caution' | 'neutral' | 'recommended';
  summary: string;
  breakdown: Array<{
    label: string;
    score: number;
    status: 'good' | 'average' | 'poor';
    detail: string;
  }>;
  alternatives: Array<{
    name: string;
    brand: string;
    highlight: string;
    estPrice: number;
    repairScore?: number;
  }>;
}

export async function analyzeProductWithAi(
  title: string,
  price: number,
  currency: string = '₹',
  categoryBreadcrumb: string = ''
): Promise<TrueCostAnalysis> {
  const settings = await getSettings();

  // 1. Try local proxy server if running
  try {
    const proxyRes = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(settings.geminiApiKey ? { Authorization: `Bearer ${settings.geminiApiKey.trim()}` } : {}),
      },
      body: JSON.stringify({ title, price, currency, category: categoryBreadcrumb }),
      signal: AbortSignal.timeout(2000), // Quick check
    });

    if (proxyRes.ok) {
      const parsed: AiAnalysisResponse = await proxyRes.json();
      return formatAiResult(parsed, title, price, currency, categoryBreadcrumb, 'gemini');
    }
  } catch {
    // Proxy server not active, proceed to direct check
  }

  // 2. Direct Google Gemini API Call
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  const geminiKey = settings.geminiApiKey?.trim() || envKey.trim();
  if (geminiKey && settings.useGeminiApi !== false) {
    try {
      const result = await callGeminiApi(geminiKey, title, price, currency, categoryBreadcrumb);
      if (result) {
        return formatAiResult(result, title, price, currency, categoryBreadcrumb, 'gemini');
      }
    } catch (err) {
      console.warn('[HoldOn Gemini API] Direct call failed, falling back:', err);
    }
  }

  // 3. Optional fallback to Grok if user configured Grok key
  const grokKey = settings.grokApiKey?.trim();
  if (grokKey && settings.useGrokApi) {
    try {
      const result = await callGrokApi(grokKey, title, price, currency, categoryBreadcrumb);
      if (result) {
        return formatAiResult(result, title, price, currency, categoryBreadcrumb, 'grok');
      }
    } catch (err) {
      console.warn('[HoldOn Grok API] Direct call failed, falling back:', err);
    }
  }

  // 4. Intelligent Local Engine Fallback (30+ categories + dynamic heuristic estimator)
  return calculateTrueCost(title, price, currency, categoryBreadcrumb);
}

// Aliased export for backwards compatibility
export const analyzeProductWithGrok = analyzeProductWithAi;

async function callGeminiApi(
  apiKey: string,
  title: string,
  price: number,
  currency: string,
  categoryBreadcrumb: string
): Promise<AiAnalysisResponse | null> {
  const prompt = `You are the HoldOn Circular Shopping Assistant AI. Analyze this consumer product for true ownership cost, repairability, durability, and sustainable alternatives.

Product Title: "${title}"
Category: "${categoryBreadcrumb}"
Listed Price: ${currency} ${price}

Return ONLY valid JSON matching this exact structure:
{
  "lifespanDisplay": "e.g. 2 - 3 Years",
  "lifespanMonths": 24,
  "repairabilityScore": 4,
  "repairabilityRating": "Fair",
  "resalePercentage": 35,
  "verdict": "Short punchy verdict under 10 words",
  "verdictType": "caution",
  "summary": "1-2 sentences explaining why it fails or succeeds in durability and circularity.",
  "breakdown": [
    {"label": "Battery Replaceability", "score": 2, "status": "poor", "detail": "explanation"},
    {"label": "Spare Parts", "score": 5, "status": "average", "detail": "explanation"},
    {"label": "Modularity", "score": 3, "status": "poor", "detail": "explanation"},
    {"label": "Build Quality", "score": 6, "status": "average", "detail": "explanation"}
  ],
  "alternatives": [
    {"name": "Durable Model", "brand": "Brand", "highlight": "Why it's better", "estPrice": 3999, "repairScore": 8}
  ]
}
Values for repairabilityRating: "Poor" | "Fair" | "Moderate" | "Good" | "Exceptional".
Values for verdictType: "warning" | "caution" | "neutral" | "recommended".
Do NOT include markdown block syntax like \`\`\`json, output strict raw JSON only.`;

  const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        lastError = await response.text();
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(typeof lastError === 'string' ? lastError : 'Failed to call Gemini API across tested models');
}

async function callGrokApi(
  apiKey: string,
  title: string,
  price: number,
  currency: string,
  categoryBreadcrumb: string
): Promise<AiAnalysisResponse | null> {
  const prompt = `Analyze this product for durability: "${title}", price: ${currency} ${price}. Return JSON matching structure with repairabilityScore (1-10), verdict, breakdown, alternatives.`;
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  const cleanJson = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleanJson);
}

function formatAiResult(
  parsed: AiAnalysisResponse,
  title: string,
  price: number,
  currency: string,
  categoryBreadcrumb: string,
  source: 'gemini' | 'grok' = 'gemini'
): TrueCostAnalysis {
  const cleanPrice = Math.max(1, price);
  const resaleVal = Math.round((cleanPrice * (parsed.resalePercentage || 30)) / 100);
  const costPerMo = Math.round((cleanPrice / Math.max(1, parsed.lifespanMonths || 24)) * 10) / 10;
  const costPerUse = Math.round((cleanPrice / Math.max(1, (parsed.lifespanMonths || 24) * 20)) * 10) / 10;

  return {
    productTitle: title,
    category: categoryBreadcrumb || 'Consumer Good',
    originalPrice: cleanPrice,
    currency,
    estimatedLifespan: parsed.lifespanDisplay || '2 - 3 Years',
    lifespanMonths: parsed.lifespanMonths || 24,
    repairabilityScore: parsed.repairabilityScore || 5,
    repairabilityRating: parsed.repairabilityRating || 'Moderate',
    resaleValue1Yr: resaleVal,
    resalePercentage: parsed.resalePercentage || 30,
    costPerMonth: costPerMo,
    costPerUse,
    co2FootprintKg: Math.round(cleanPrice * 0.008 + 15),
    verdict: parsed.verdict || 'Durability assessed',
    verdictType: parsed.verdictType || 'caution',
    summary: parsed.summary || 'Durability assessment powered by Gemini AI.',
    breakdown: parsed.breakdown || [],
    alternatives: parsed.alternatives || [],
    source,
  };
}
