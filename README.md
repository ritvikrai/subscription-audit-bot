# Subscription Audit Bot

Detect and manage recurring subscriptions from your bank transactions.

## Features

- 🔍 Analyze bank statements for subscriptions
- 💰 Calculate monthly/yearly spending
- ⚠️ Detect forgotten subscriptions
- 📊 Spending trends and insights
- 🗑️ Track cancelled subscriptions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze transactions |
| GET | `/api/subscriptions` | Get detected subscriptions |
| PATCH | `/api/subscriptions` | Update subscription status |

## Demo Mode

Works without API key using pattern-based detection.

## License

MIT
