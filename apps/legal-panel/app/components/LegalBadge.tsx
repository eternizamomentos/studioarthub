// apps/legal-panel/app/components/LegalBadge.tsx
type LegalBadgeProps = {
    tone?: "neutral" | "gold" | "danger" | "success";
    children: React.ReactNode;
  };
  
  export default function LegalBadge({
    tone = "neutral",
    children,
  }: LegalBadgeProps) {
    const toneClass =
      tone === "gold"
        ? "bg-gold/15 text-gold border-gold/40"
        : tone === "danger"
        ? "bg-red-500/10 text-red-300 border-red-500/40"
        : tone === "success"
        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
        : "bg-white/5 text-pure/70 border-white/10";
  
    return (
      <span className={`legal-badge ${toneClass}`}>{children}</span>
    );
  }  