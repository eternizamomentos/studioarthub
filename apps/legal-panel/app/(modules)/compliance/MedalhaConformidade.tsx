export default function MedalhaConformidade({ score }: { score: number }) {
    const tier =
      score >= 90 ? "A+" :
      score >= 75 ? "A"  :
      score >= 60 ? "B"  :
      score >= 40 ? "C"  :
      "D";
  
    return (
      <div className="flex items-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            background: "rgba(231,183,95,0.12)",
            color: "#E7B75F",
            border: "1px solid rgba(231,183,95,0.35)",
          }}
        >
          {tier}
        </span>
        <span className="text-pure/60 text-xs">
          Nível de conformidade
        </span>
      </div>
    );
  }  