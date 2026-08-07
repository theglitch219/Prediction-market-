export default function ProbabilityBar({ probability, size = "md" }) {
  const pct = Math.round(probability * 100);
  const height = size === "lg" ? "h-3" : "h-2";

  return (
    <div className="w-full">
      <div className={`w-full ${height} rounded-full bg-noDim overflow-hidden flex`}>
        <div
          className="bg-yes h-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 font-mono text-xs">
        <span className="text-yes">{pct}% YES</span>
        <span className="text-no">{100 - pct}% NO</span>
      </div>
    </div>
  );
}
