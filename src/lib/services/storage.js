import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

// Subscriptions
export async function getSubscriptions() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(SUBSCRIPTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { subscriptions: [], totalMonthly: 0, lastUpdated: null };
  }
}

export async function saveSubscriptions(data) {
  await ensureDataDir();
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(data, null, 2));
  return data;
}

export async function updateSubscriptionStatus(name, status) {
  const data = await getSubscriptions();
  const sub = data.subscriptions.find(s => s.name === name);
  if (sub) {
    sub.status = status;
    sub.updatedAt = new Date().toISOString();
    await saveSubscriptions(data);
  }
  return sub;
}

// Manual subscription management
export async function addManualSubscription(subscription) {
  const data = await getSubscriptions();
  
  data.subscriptions.push({
    ...subscription,
    id: Date.now().toString(),
    source: 'manual',
    status: 'active',
    createdAt: new Date().toISOString(),
  });
  
  // Recalculate total
  data.totalMonthly = data.subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      if (s.frequency === 'yearly') return sum + s.amount / 12;
      if (s.frequency === 'weekly') return sum + s.amount * 4;
      return sum + s.amount;
    }, 0);
  
  await saveSubscriptions(data);
  return data;
}

// Transactions (for manual CSV upload processing)
export async function saveTransactions(transactions) {
  await ensureDataDir();
  await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify({ transactions }, null, 2));
}

export async function getTransactions() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(TRANSACTIONS_FILE, 'utf-8');
    return JSON.parse(data).transactions;
  } catch (e) {
    return [];
  }
}
