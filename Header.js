import Link from "next/link";

export default function Header({ balance, onReset }) {
  return (
    <header className="border-b border-hair bg-ink/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-baseline gap-2 cursor-pointer">
            <span className="font-display font-bold text-lg tracking-tight">
              FORECAST<span className="text-amber">//</span>TESTNET
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="font-mono text-sm text-right">
            <div className="text-[10px] uppercase tracking-widest text-fog">balance</div>
            <div className="text-amber font-semibold">{balance.toFixed(2)} tUSD</div>
          </div>
          <button
            onClick={onReset}
            className="text-[11px] font-mono text-fog hover:text-no border border-hair hover:border-no/50 rounded px-2.5 py-1.5 transition-colors"
            title="Wipe local demo state and start over"
          >
            reset
          </button>
        </div>
      </div>
      <div className="border-t border-hair overflow-hidden py-1.5 bg-panel/50">
        <div className="ticker-track whitespace-nowrap font-mono text-[11px] text-fog flex gap-8">
          {Array(2).fill(0).map((_, i) => (
            <span key={i} className="flex gap-8">
              <span>⚠ testnet market — fake units, no real funds</span>
              <span>settlement is pari-mutuel, paid on resolution</span>
              <span>data lives in your browser only</span>
              <span>⚠ testnet market — fake units, no real funds</span>
              <span>settlement is pari-mutuel, paid on resolution</span>
              <span>data lives in your browser only</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
