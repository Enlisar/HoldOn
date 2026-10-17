import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const GROK_API_KEY = process.env.GROK_API_KEY || '';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!GROK_API_KEY });
});

app.post('/api/analyze', async (req, res) => {
  const { title, price, currency = '₹', category = '' } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Missing product title' });
  }

  const apiKey = GROK_API_KEY || req.headers.authorization?.replace(/^Bearer\s+/, '');
  if (!apiKey) {
    return res.status(401).json({ error: 'No Grok API key configured on server or in request' });
  }

  try {
    const prompt = `You are the HoldOn Circular Lens AI Engine. Analyze this consumer product for true ownership cost, durability, and circular economy footprint.

Product Title: "${title}"
Category: "${category}"
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

    const grokRes = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: 'You are an expert circular economy engineer. Always respond in strict raw JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!grokRes.ok) {
      const err = await grokRes.text();
      return res.status(grokRes.status).json({ error: err });
    }

    const data = await grokRes.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';
    const cleanJson = content.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleanJson);

    res.json(parsed);
  } catch (error) {
    console.error('Server analyze error:', error);
    res.status(500).json({ error: 'Failed to analyze product with Grok API' });
  }
});

app.listen(PORT, () => {
  console.log(`[HoldOn Server] Grok Proxy backend listening on http://localhost:${PORT}`);
});
