// apps/legal-panel/app/financeiro-fiscal/page.tsx

import LegalSection from "../components/LegalSection";
import LegalCard from "../components/LegalCard";
import LegalBadge from "../components/LegalBadge";
import FiscalChecklist from "./FiscalChecklist";

export default function FinanceiroFiscalPage() {
  // Placeholder — depois virá da API /api/score/fiscal
  const indiceFiscal = 64;
  const badgeTone = indiceFiscal >= 80 ? "success" : "gold";

  return (
    <div className="space-y-12">

      {/* ============================================================
         SEÇÃO — RESUMO FINANCEIRO-FISCAL
      ============================================================ */}
      <LegalSection
        eyebrow="Domínio Jurídico"
        title="Financeiro / Fiscal"
        subtitle="Conformidade contábil, obrigações fiscais, recibos, notas, ISS, direitos autorais e tributação da atividade musical."
        rightSlot={
          <LegalBadge tone={badgeTone}>
            Índice fiscal: {indiceFiscal}%
          </LegalBadge>
        }
      >
        <LegalCard
          title="Resumo Fiscal do Estúdio"
          description="Uma visão rápida das obrigações mais importantes que impactam tributação, compliance e segurança jurídica."
          accent="gold"
        >
          <ul className="legal-card-list">
            <li>• Notas fiscais emitidas corretamente.</li>
            <li>• ISS e tributos recolhidos dentro dos prazos oficiais.</li>
            <li>• Prestação de contas para pagamentos musicais (royalties e splits).</li>
            <li>• Registros financeiros auditáveis para proteger o Studio Art Hub.</li>
          </ul>
        </LegalCard>
      </LegalSection>

      {/* ============================================================
         SEÇÃO — CHECKLIST FISCAL
      ============================================================ */}
      <LegalSection
        eyebrow="Checklist Fiscal"
        title="Checklist de conformidade fiscal"
        subtitle="Obrigações essenciais para manter o estúdio em plena conformidade com leis tributárias e normas municipais/estaduais."
      >
        <LegalCard
          title="Rotina fiscal e obrigações"
          description="Checklist oficial de conformidade fiscal do Studio Art Hub."
        >
          <FiscalChecklist />
        </LegalCard>
      </LegalSection>

    </div>
  );
}