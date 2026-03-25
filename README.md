# Redwire Operator Template

## Setup

1. Clone this repo
2. Copy `.env.example` to `.env`
3. Fill in your API key and operator name
4. Run `npm install && npm run dev` to test locally
5. Deploy to Vercel: connect repo, add env vars in Vercel dashboard, deploy

## Environment variables

VITE_API_BASE_URL=https://api.redwire.work/v1
VITE_API_KEY=           # Your Redwire operator API key (from your operator dashboard)
VITE_OPERATOR_NAME=     # Your brand name shown to posters

## How it works

Posters visit your hosted URL, enter their Reddit username, and see available tasks.
They claim a task, complete it on Reddit, and submit the post URL.
Payout tracking is visible in the Earnings tab.
All task data comes from the Redwire API — no backend setup required.
