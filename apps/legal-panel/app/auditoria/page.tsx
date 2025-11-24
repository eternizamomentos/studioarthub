// apps/legal-panel/app/auditoria/page.tsx

import LegalSection from "../components/LegalSection";
import LegalCard from "../components/LegalCard";
import LegalBadge from "../components/LegalBadge";

import AuditoriaFiltro from "./AuditoriaFiltro";
import LogAuditoriaTabela from "./LogAuditoriaTabela";

export default function AuditoriaPage() {
  // Placeholder — depois virá da API /api/auditoria
  const totalEventos = 128;
  const nivelRisco = totalEventos > 200 ? "danger" : "gold";

  return (
    <div className="space-y-12">
      
      {/* ============================================================
         SEÇÃO — CABEÇALHO DO DOMÍNIO AUDITORIA
      ============================================================ */}
      <LegalSection
        eyebrow="Domínio Jurídico"
        title="Auditoria & Logs"
        subtitle="Monitoramento contínuo de ações internas, evidências técnicas e cadeia de custódia do Studio Art Hub."
        rightSlot={<LegalBadge tone={nivelRisco}>{totalEventos} eventos</LegalBadge>} children={""}      />

      {/* ============================================================
         SEÇÃO — FILTROS
      ============================================================ */}
      <LegalSection
        eyebrow="Filtros"
        title="Filtrar eventos da auditoria"
        subtitle="Refine a visualização dos logs por tipo de ação, módulo jurídico ou severidade."
      >
        <LegalCard
          title="Refinamento de Logs"
          description="Use os filtros para encontrar eventos específicos."
        >
          <AuditoriaFiltro />
        </LegalCard>
      </LegalSection>

      {/* ============================================================
         SEÇÃO — TABELA DE AUDITORIA
      ============================================================ */}
      <LegalSection
        eyebrow="Eventos"
        title="Eventos registrados"
        subtitle="Cada ação relevante do sistema jurídico é registrada de forma imutável, com hash e timestamp."
      >
        <LegalCard title="Histórico técnico de auditoria" description="">
          <LogAuditoriaTabela />
        </LegalCard>
      </LegalSection>

    </div>
  );
}