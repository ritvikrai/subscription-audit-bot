'use client'
import { useState } from 'react'
import { CreditCard, AlertTriangle, TrendingDown, Trash2, Check, RefreshCw } from 'lucide-react'

const MOCK_SUBSCRIPTIONS = [
  { id: 1, name: 'Netflix', price: 15.99, lastUsed: '2 days ago', category: 'Entertainment', usage: 85 },
  { id: 2, name: 'Spotify', price: 9.99, lastUsed: '1 day ago', category: 'Entertainment', usage: 92 },
  { id: 3, name: 'Adobe Creative Cloud', price: 54.99, lastUsed: '45 days ago', category: 'Software', usage: 12 },
  { id: 4, name: 'Gym Membership', price: 49.99, lastUsed: '60 days ago', category: 'Fitness', usage: 5 },
  { id: 5, name: 'LinkedIn Premium', price: 29.99, lastUsed: '30 days ago', category: 'Professional', usage: 15 },
  { id: 6, name: 'iCloud Storage', price: 2.99, lastUsed: '1 day ago', category: 'Storage', usage: 95 },
  { id: 7, name: 'Headspace', price: 12.99, lastUsed: '90 days ago', category: 'Wellness', usage: 2 },
  { id: 8, name: 'NYTimes', price: 17.00, lastUsed: '14 days ago', category: 'News', usage: 25 },
]

export default function Home() {
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS)
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)

  const scanSubscriptions = async () => {
    setScanning(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setScanning(false)
    setScanned(true)
  }

  const cancelSubscription = (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id))
  }

  const totalMonthly = subscriptions.reduce((sum, s) => sum + s.price, 0)
  const wasteful = subscriptions.filter(s => s.usage < 30)
  const potentialSavings = wasteful.reduce((sum, s) => sum + s.price, 0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <CreditCard className="text-red-600" />
          Subscription Audit
        </h1>
        <p className="text-gray-600 mb-8">Find money leaks in your recurring payments</p>

        {!scanned ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <CreditCard className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ready to find hidden subscriptions?</h2>
            <p className="text-gray-600 mb-6">We'll scan your connected accounts for recurring charges</p>
            <button
              onClick={scanSubscriptions}
              disabled={scanning}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {scanning ? <><RefreshCw className="animate-spin" /> Scanning...</> : 'Scan My Subscriptions'}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Monthly Spend</p>
                <p className="text-3xl font-bold text-gray-800">${totalMonthly.toFixed(2)}</p>
                <p className="text-sm text-gray-500">${(totalMonthly * 12).toFixed(0)}/year</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Wasteful Subs</p>
                <p className="text-3xl font-bold text-red-500">{wasteful.length}</p>
                <p className="text-sm text-gray-500">Low usage detected</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-5 text-white">
                <p className="text-sm text-red-100">Potential Savings</p>
                <p className="text-3xl font-bold">${potentialSavings.toFixed(2)}/mo</p>
                <p className="text-sm text-red-100">${(potentialSavings * 12).toFixed(0)}/year</p>
              </div>
            </div>

            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div key={sub.id} className={`bg-white rounded-xl p-4 shadow-sm flex items-center justify-between ${sub.usage < 30 ? 'border-2 border-red-200' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${sub.usage < 30 ? 'bg-red-100' : 'bg-gray-100'}`}>
                      {sub.usage < 30 ? <AlertTriangle className="text-red-500" /> : <Check className="text-green-500" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{sub.name}</p>
                      <p className="text-sm text-gray-500">{sub.category} • Last used: {sub.lastUsed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-800">${sub.price}/mo</p>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${sub.usage < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${sub.usage}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{sub.usage}%</span>
                      </div>
                    </div>
                    {sub.usage < 30 && (
                      <button
                        onClick={() => cancelSubscription(sub.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
