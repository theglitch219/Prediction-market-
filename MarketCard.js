import Link from "next/link";
import { impliedProbability } from "../lib/store";

function timeLeft(closesAt) {
  const ms = closesAt - Date.now();
  if (ms <= 0) return "closed";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days >= 1) return `${days}d left`;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${Math.max(hours, 1)}h left`;
}

export default function MarketCard({ market }) {
  const prob = impliedProbability(market);
  const totalPool = market.yesPool + market.noPool;

  return (
    <Link href={`/market/${market.id}`}>
      <div className="group border border-hair bg-panel hover:bg-panel2 hover:border-amber/40 transition-colors rounded-lg p-5 cursor-pointer h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-widest text-fog font-mono">
              {market.category}
            </span>
            <span className="text-[11px] font-mono text-fog">
              {market.resolved ? (
                <span className="text-amber">resolved · {market.outcome?.toUpperCase()}</span>
              ) : (
                timeLeft(market.closesAt)
              )}
            </span>
          </div>
          <h3 className="font-display font-semibold text-lg leading-snug text-paper mb-4 group-hover:text-amber transition-colors">
            {market.question}
          </h3>
        </div>
        <div>
          <ProbabilityBarInline probability={prob} />
          <div className="mt-3 text-[11px] font-mono text-fog">
            pool: {totalPool.toFixed(0)} units
          </div>
        </div>
      </div>
    </Link>
  );
}

// Kept local to avoid an extra import cycle for the dashboard grid.
function ProbabilityBarInline({ probability }) {
  const pct = Math.round(probability * 100);
  return (
    <div className="w-full">
      <div className="w-full h-2 rounded-full bg-noDim overflow-hidden flex">
        <div className="bg-yes h-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-1.5 font-mono text-xs">
        <span className="text-yes">{pct}%</span>
        <span className="text-no">{100 - pct}%</span>
      </div>
    </div>
  );
}
