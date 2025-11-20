// apps/legal-panel/api/score/index.ts
import { NextResponse } from "next/server";

// Futuro: importar regras reais
// import { complianceRules } from "@/app/(modules)/compliance/complianceRules";
// import { computeScoreFromRules } from "@/domain/services/ComplianceService";

export async function GET() {
  // ============================================================
  // PLACEHOLDER PROFISSIONAL
  // Lógica real virá depois a partir das regras completas,
  // BD SQLite e serviços de domínio.
  // ============================================================

  // Domínios avaliados (PLACEHOLDER)
  const dominios = [
    { id: "direitos-autorais", nome: "Direitos Autorais", peso: 0.30, score: 78 },
    { id: "contratos", nome: "Contratos", peso: 0.25, score: 70 },
    { id: "evidencias", nome: "Evidências", peso: 0.20, score: 65 },
    { id: "lgpd", nome: "LGPD", peso: 0.15, score: 58 },
    { id: "ia-policy", nome: "Uso de IA", peso: 0.10, score: 80 },
  ];

  // ============================================================
  // CÁLCULO DE SCORE GLOBAL
  // ============================================================
  const scoreGeral = dominios.reduce((acc, d) => acc + d.score * d.peso, 0);

  return NextResponse.json({
    ok: true,
    score: Math.round(scoreGeral),
    dominios,
    atualizado_em: new Date().toISOString(),
  });
}