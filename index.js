import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import MarketCard from "../components/MarketCard";
import { loadState, createMarket, resetState } from "../lib/store";

export default function Home() {
  const [state, setState] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ question: "", category: "Crypto", closesInDays: 7 });
  const [filter, setFilter] = useState("open");

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-fog font-mono text-sm">
        loading market data…
      </div>
    );
  }

  const markets = state.markets.filter((m) =>
    filter === "open" ? !m.resolved : filter === "resolved" ? m.resolved : true
  );

  function handleCreate(e) {
    e.preventDefault();
    if (!form.question.trim()) return;
    const next = createMarket(state, form);
    setState(next);
    setForm({ question: "", category: "Crypto", closesInDays: 7 });
    setShowCreate(false);
  }

  function handleReset() {
    if (!window.confirm("Wipe all local demo data and restore the starting balance?")) return;
    setState(resetState());
  }

  return (
    <div className="min-h-screen bg-ink text-paper font-body">
      <Head>
        <title>Forecast // Testnet Prediction Market</title>
        <meta name="description" content="A fake-money testnet prediction market — off-chain simulation." />
      </Head>

      <Header balance={state.balance} onReset={handleReset} />

      <main className="max-w-5xl mx-auto px-5 py-10">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">Open Markets</h1>
            <p className="text-fog text-sm">
              Stake fake units on binary outcomes. Odds move with the pool.
            </p>
          </div>
          <button
            onClick={() => setShowCreate((s) => !s)}
            className="font-mono text-sm bg-amber text-ink font-semibold px-4 py-2.5 rounded hover:bg-amber/90 transition-colors"
          >
            {showCreate ? "cancel" : "+ new market"}
          </button>
        </div>

        {showCreate && (
          <form
            onSubmit={handleCreate}
            className="border border-hair bg-panel rounded-lg p-5 mb-8 grid gap-4"
          >
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-fog font-mono mb-1.5">
                Question
              </label>
              <input
                required
                maxLength={140}
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="Will…?"
                className="w-full bg-ink border border-hair rounded px-3 py-2.5 text-sm focus:border-amber outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-fog font-mono mb-1.5">
                  Category
                </label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-ink border border-hair rounded px-3 py-2.5 text-sm focus:border-amber outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-fog font-mono mb-1.5">
                  Closes in (days)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.closesInDays}
                  onChange={(e) => setForm({ ...form, closesInDays: e.target.value })}
                  className="w-full bg-ink border border-hair rounded px-3 py-2.5 text-sm focus:border-amber outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="justify-self-start font-mono text-sm bg-yes text-ink font-semibold px-4 py-2.5 rounded hover:bg-yes/90 transition-colors"
            >
              create market
            </button>
          </form>
        )}

        <div className="flex gap-2 mb-6 font-mono text-xs">
          {[
            ["open", "open"],
            ["resolved", "resolved"],
            ["all", "all"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full border transition-colors ${
                filter === key
                  ? "border-amber text-amber"
                  : "border-hair text-fog hover:text-paper"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {markets.length === 0 ? (
          <div className="border border-dashed border-hair rounded-lg p-10 text-center text-fog font-mono text-sm">
            No markets here yet. Create one to get started.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {markets.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-5 pb-10 pt-4 text-[11px] font-mono text-fog">
        Simulated market · state stored in your browser's localStorage · resets on "reset"
      </footer>
    </div>
  );
}
