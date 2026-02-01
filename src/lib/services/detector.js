// Subscription detection patterns
export const SUBSCRIPTION_PATTERNS = {
  streaming: {
    patterns: ['netflix', 'hulu', 'disney', 'hbo', 'paramount', 'peacock', 'apple tv', 'amazon prime video', 'crunchyroll', 'youtube premium'],
    avgCost: 14.99,
  },
  music: {
    patterns: ['spotify', 'apple music', 'tidal', 'deezer', 'pandora', 'amazon music', 'youtube music'],
    avgCost: 10.99,
  },
  software: {
    patterns: ['adobe', 'microsoft', 'notion', 'figma', 'slack', 'zoom', 'dropbox', '1password', 'lastpass', 'grammarly', 'canva'],
    avgCost: 12.99,
  },
  fitness: {
    patterns: ['peloton', 'planet fitness', 'gym', 'strava', 'fitbit', 'myfitnesspal', 'headspace', 'calm', 'noom'],
    avgCost: 19.99,
  },
  gaming: {
    patterns: ['xbox', 'playstation', 'nintendo', 'steam', 'ea play', 'humble bundle', 'twitch'],
    avgCost: 14.99,
  },
  news: {
    patterns: ['nytimes', 'wsj', 'washington post', 'economist', 'medium', 'substack', 'patreon'],
    avgCost: 9.99,
  },
  storage: {
    patterns: ['icloud', 'google one', 'dropbox', 'onedrive', 'backblaze'],
    avgCost: 9.99,
  },
  shopping: {
    patterns: ['amazon prime', 'costco', 'walmart+', 'instacart'],
    avgCost: 12.99,
  },
};

export function detectSubscription(merchantName, amount) {
  const normalized = merchantName.toLowerCase();
  
  for (const [category, data] of Object.entries(SUBSCRIPTION_PATTERNS)) {
    for (const pattern of data.patterns) {
      if (normalized.includes(pattern)) {
        return {
          category,
          matched: pattern,
          confidence: 0.9,
        };
      }
    }
  }
  
  // Check for common subscription indicators
  if (normalized.includes('subscription') || normalized.includes('recurring') || normalized.includes('monthly')) {
    return {
      category: 'other',
      matched: 'subscription keyword',
      confidence: 0.7,
    };
  }
  
  return null;
}

export function findRecurringCharges(transactions) {
  // Group by merchant and amount
  const groups = {};
  
  for (const tx of transactions) {
    const key = `${tx.merchant.toLowerCase()}_${Math.abs(tx.amount).toFixed(2)}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tx);
  }
  
  // Find groups with multiple charges (likely subscriptions)
  const recurring = [];
  for (const [key, txs] of Object.entries(groups)) {
    if (txs.length >= 2) {
      const [merchant, amount] = key.split('_');
      recurring.push({
        merchant: txs[0].merchant,
        amount: parseFloat(amount),
        charges: txs.length,
        dates: txs.map(t => t.date).sort(),
      });
    }
  }
  
  return recurring;
}
