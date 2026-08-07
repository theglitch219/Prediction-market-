# Forecast // Testnet — off-chain prediction market

A fully functional, fake-money prediction market. No wallet, no smart
contract, no database — all state (balance, markets, bets) lives in the
visitor's browser via `localStorage`. Good for a demo, portfolio piece, or
bounty submission; not for real funds.

- Binary Yes/No markets
- Pari-mutuel odds: the probability bar reflects the live pool split
- Create markets, stake fake `tUSD`, resolve outcomes, get paid out
- Starting balance: 1000 tUSD, reset anytime with the "reset" button

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

**Option A — GitHub (recommended)**
1. Push this folder to a new GitHub repo.
2. Go to vercel.com → **Add New… → Project** → import that repo.
3. Framework preset auto-detects as Next.js. Click **Deploy**.
4. You'll get a `your-project.vercel.app` URL.

**Option B — Vercel CLI**
```bash
npm i -g vercel
cd prediction-market
vercel
```
Follow the prompts; it deploys and gives you the `.vercel.app` link directly.

No environment variables or database setup needed — it works out of the box.

## Known limits (by design, since it's off-chain/local)

- State is per-browser. Two people visiting your `.vercel.app` see separate
  markets/balances, not a shared order book.
- Clearing browser storage or using incognito resets everything.
- "Resolving" a market is manual (anyone viewing it can click resolve) —
  fine for a demo, not for a trustless market.

## Turning this into something more real later

- **Shared state**: swap `lib/store.js` for calls to Vercel Postgres,
  Supabase, or Vercel KV so all visitors share the same markets.
- **On-chain**: replace the pool math with a Solidity contract (deployed to
  a testnet like Sepolia) and have the frontend read/write via
  `wagmi`/`viem` instead of `localStorage`.
