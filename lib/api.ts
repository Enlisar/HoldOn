import { calculateTrueCost } from './categoryBenchmarks';
import { getSettings } from './storage';
import type { TrueCostAnalysis } from './types';

interface GrokAnalysisResponse {
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

export async function analyzeProductWithGrok(
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
        ...(settings.grokApiKey ? { Authorization: `Bearer ${settings.grokApiKey.trim()}` } : {}),
      },
      body: JSON.stringify({ title, price, currency, category: categoryBreadcrumb }),
      signal: AbortSignal.timeout(2000), // Quick check
    });

    if (proxyRes.ok) {
      const parsed: GrokAnalysisResponse = await proxyRes.json();
      return formatGrokResult(parsed, title, price, currency, categoryBreadcrumb);
    }
  } catch {
    // Proxy server not active, proceed to direct check
  }

  // 2. If no Grok API key is provided, or user disabled Grok, use our intelligent local engine
  if (!settings.grokApiKey || !settings.useGrokApi) {
    return calculateTrueCost(title, price, currency, categoryBreadcrumb);
  }

  try {
    const prompt = `You are the HoldOn Circular Lens AI Engine. Analyze this consumer product for true ownership cost, durability, and circular economy footprint.

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
Do not wrap in markdown quotes if possible, output pure JSON.`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.grokApiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are an expert circular economy engineer and product durability analyst. Always respond in strict raw JSON without backticks.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.warn(`[HoldOn Grok API] HTTP error ${response.status}: Falling back to local benchmark`);
      return calculateTrueCost(title, price, currency, categoryBreadcrumb);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';

    // Strip ```json if Grok returned wrapped markdown
    const jsonStr = content.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    const parsed: GrokAnalysisResponse = JSON.parse(jsonStr);

    return formatGrokResult(parsed, title, price, currency, categoryBreadcrumb);
  } catch (error) {
    console.warn('[HoldOn Grok API] Failed to fetch or parse Grok response, using local engine fallback:', error);
    return calculateTrueCost(title, price, currency, categoryBreadcrumb);
  }
}

function formatGrokResult(
  parsed: GrokAnalysisResponse,
  title: string,
  price: number,
  currency: string,
  categoryBreadcrumb: string
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
    verdict: parsed.verdict || 'Moderately durable product',
    verdictType: parsed.verdictType || 'caution',
    summary: parsed.summary || 'Durability assessment powered by Grok AI.',
    breakdown: parsed.breakdown || [],
    alternatives: parsed.alternatives || [],
    source: 'grok',
  };
}
