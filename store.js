// All state lives in the browser's localStorage. This is a testnet/demo
// market: balances and pools are fake units, nothing here touches real
// money or a real chain. Swap this file out for a real DB (or an on-chain
// read/write layer) later without touching the UI components.

const KEY = "tpm_state_v1";
const STARTING_BALANCE = 1000;

const SEED_MARKETS = [
  {
    id: "seed-1",
    question: "Will ETH close above $6,000 by end of month?",
    category: "Crypto",
    closesAt: daysFromNow(14),
    createdAt: Date.now(),
    yesPool: 620,
    noPool: 380,
    resolved: false,
    outcome: null,
    bets: [],
  },
  {
    id: "seed-2",
    question: "Will a Layer 2 surpass Ethereum mainnet in daily active addresses this quarter?",
    category: "Crypto",
    closesAt: daysFromNow(30),
    createdAt: Date.now(),
    yesPool: 340,
    noPool: 410,
    resolved: false,
    outcome: null,
    bets: [],
  },
  {
    id: "seed-3",
    question: "Will this bounty submission place top 3?",
    category: "Meta",
    closesAt: daysFromNow(7),
    createdAt: Date.now(),
    yesPool: 150,
    noPool: 90,
    resolved: false,
    outcome: null,
    bets: [],
  },
];

function daysFromNow(n) {
  return Date.now() + n * 24 * 60 * 60 * 1000;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultState() {
  return {
    balance: STARTING_BALANCE,
    markets: SEED_MARKETS,
  };
}

export function loadState() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const fresh = defaultState();
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultState();
  }
}

export function saveState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  const fresh = defaultState();
  saveState(fresh);
  return fresh;
}

// Probability implied by the pool split (pari-mutuel style).
export function impliedProbability(market) {
  const total = market.yesPool + market.noPool;
  if (total <= 0) return 0.5;
  return market.yesPool / total;
}

export function createMarket(state, { question, category, closesInDays }) {
  const market = {
    id: uid(),
    question: question.trim(),
    category: category || "General",
    closesAt: daysFromNow(Number(closesInDays) || 7),
    createdAt: Date.now(),
    yesPool: 10,
    noPool: 10,
    resolved: false,
    outcome: null,
    bets: [],
  };
  const next = { ...state, markets: [market, ...state.markets] };
  saveState(next);
  return next;
}

export function placeBet(state, marketId, side, amount) {
  amount = Number(amount);
  if (!amount || amount <= 0) throw new Error("Enter an amount above 0.");
  if (amount > state.balance) throw new Error("Not enough balance for that stake.");

  const markets = state.markets.map((m) => {
    if (m.id !== marketId) return m;
    if (m.resolved) throw new Error("This market is already resolved.");
    const updated = { ...m };
    if (side === "yes") updated.yesPool = m.yesPool + amount;
    else updated.noPool = m.noPool + amount;
    updated.bets = [
      { id: uid(), side, amount, at: Date.now() },
      ...m.bets,
    ];
    return updated;
  });

  const next = { ...state, balance: state.balance - amount, markets };
  saveState(next);
  return next;
}

// Resolve a market and pay out the winning side proportionally from the
// full pool (classic pari-mutuel payout), crediting the demo balance.
export function resolveMarket(state, marketId, outcome) {
  let payout = 0;
  const markets = state.markets.map((m) => {
    if (m.id !== marketId) return m;
    const totalPool = m.yesPool + m.noPool;
    const winningPool = outcome === "yes" ? m.yesPool : m.noPool;
    const userWinningStake = m.bets
      .filter((b) => b.side === outcome)
      .reduce((sum, b) => sum + b.amount, 0);
    if (winningPool > 0 && userWinningStake > 0) {
      payout = totalPool * (userWinningStake / winningPool);
    }
    return { ...m, resolved: true, outcome };
  });
  const next = { ...state, balance: state.balance + payout, markets };
  saveState(next);
  return { state: next, payout };
}
