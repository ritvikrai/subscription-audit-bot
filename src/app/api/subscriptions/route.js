import { NextResponse } from 'next/server';
import { getSubscriptions, addManualSubscription, updateSubscriptionStatus } from '@/lib/services/storage';

export async function GET() {
  try {
    const data = await getSubscriptions();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const subscription = await request.json();
    const data = await addManualSubscription(subscription);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Add subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to add subscription' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { name, status } = await request.json();
    const updated = await updateSubscriptionStatus(name, status);
    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
