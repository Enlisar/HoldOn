import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!GEMINI_API_KEY });
});

app.post('/api/analyze', async (req, res) => {
  const { title, price, currency = '₹', category = '' } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Missing product title' });
  }

  const apiKey = GEMINI_API_KEY || req.headers.authorization?.replace(/^Bearer\s+/, '');
  if (!apiKey) {
    return res.status(401).json({ error: 'No Gemini API key configured on server or in request' });
  }

  try {
    const prompt = `You are the HoldOn Circular Shopping Assistant AI. Analyze this consumer product for true ownership cost, durability, and circular economy footprint.

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
Do NOT include markdown block syntax like \`\`\`json, output strict raw JSON only.`;

    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let lastError = null;

    for (const model of models) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          return res.json(JSON.parse(cleanJson));
        } else {
          lastError = await geminiRes.text();
        }
      } catch (e) {
        lastError = e?.message || e;
      }
    }

    return res.status(500).json({ error: lastError || 'Failed to analyze product with Gemini API' });
  } catch (error) {
    console.error('Server analyze error:', error);
    res.status(500).json({ error: 'Failed to analyze product with Gemini API' });
  }
});

app.listen(PORT, () => {
  console.log(`[HoldOn Server] Gemini Proxy backend listening on http://localhost:${PORT}`);
});
