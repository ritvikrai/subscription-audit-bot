import { NextResponse } from 'next/server';
import { analyzeTransactions } from '@/lib/services/openai';
import { detectSubscription, findRecurringCharges } from '@/lib/services/detector';
import { saveSubscriptions, saveTransactions } from '@/lib/services/storage';

export async function POST(request) {
  try {
    const { transactions } = await request.json();

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json(
        { error: 'Please provide transaction data' },
        { status: 400 }
      );
    }

    // Save transactions for later reference
    await saveTransactions(transactions);

    // First, use pattern detection
    const detected = [];
    for (const tx of transactions) {
      const match = detectSubscription(tx.merchant, tx.amount);
      if (match) {
        detected.push({
          ...tx,
          ...match,
        });
      }
    }

    // Find recurring charges
    const recurring = findRecurringCharges(transactions);

    // If no OpenAI key, use heuristic analysis
    if (!process.env.OPENAI_API_KEY) {
      const subscriptions = [];
      const seen = new Set();

      // Add pattern-detected subscriptions
      for (const d of detected) {
        if (!seen.has(d.merchant.toLowerCase())) {
          seen.add(d.merchant.toLowerCase());
          subscriptions.push({
            name: d.merchant,
            category: d.category,
            amount: Math.abs(d.amount),
            frequency: 'monthly',
            confidence: d.confidence,
            lastCharge: d.date,
          });
        }
      }

      // Add recurring charges not already detected
      for (const r of recurring) {
        if (!seen.has(r.merchant.toLowerCase())) {
          subscriptions.push({
            name: r.merchant,
            category: 'other',
            amount: r.amount,
            frequency: 'monthly',
            confidence: 0.6,
            lastCharge: r.dates[r.dates.length - 1],
          });
        }
      }

      const totalMonthly = subscriptions.reduce((sum, s) => sum + s.amount, 0);
      
      const result = {
        subscriptions,
        totalMonthly,
        totalYearly: totalMonthly * 12,
        potentialSavings: {
          duplicates: [],
          unused: [],
          cheaperAlternatives: [],
        },
        note: 'Heuristic analysis - Add OPENAI_API_KEY for AI-powered detection',
      };

      await saveSubscriptions(result);
      return NextResponse.json({ success: true, data: result });
    }

    // Use AI for enhanced analysis
    const aiAnalysis = await analyzeTransactions(transactions);
    
    if (aiAnalysis) {
      await saveSubscriptions(aiAnalysis);
      return NextResponse.json({ success: true, data: aiAnalysis });
    }

    return NextResponse.json(
      { error: 'Failed to analyze transactions' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze transactions', details: error.message },
      { status: 500 }
    );
  }
}
