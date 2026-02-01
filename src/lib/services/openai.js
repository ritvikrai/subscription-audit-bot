import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeTransactions(transactions) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a financial analyst specializing in subscription detection. Analyze transactions and identify recurring subscriptions.

Return JSON:
{
  "subscriptions": [
    {
      "name": "Service name",
      "category": "streaming/software/news/fitness/gaming/storage/music/other",
      "amount": 9.99,
      "frequency": "monthly/yearly/weekly",
      "confidence": 0.95,
      "lastCharge": "2024-01-15",
      "merchantPattern": "pattern used for detection"
    }
  ],
  "totalMonthly": 150.00,
  "totalYearly": 1800.00,
  "potentialSavings": {
    "duplicates": [],
    "unused": [],
    "cheaperAlternatives": [
      {"current": "Service A", "alternative": "Service B", "savingsPerMonth": 5.00}
    ]
  }
}`,
      },
      {
        role: 'user',
        content: `Analyze these transactions for subscriptions:\n${JSON.stringify(transactions, null, 2)}`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse subscriptions:', e);
  }
  
  return null;
}

export async function suggestCancellations(subscriptions, preferences) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a frugal financial advisor. Suggest which subscriptions to cancel based on value and usage patterns.',
      },
      {
        role: 'user',
        content: `Subscriptions: ${JSON.stringify(subscriptions)}\nPreferences: ${preferences}\n\nWhich should be cancelled or downgraded?`,
      },
    ],
    max_tokens: 800,
  });

  return response.choices[0].message.content;
}
