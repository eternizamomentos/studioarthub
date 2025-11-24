// apps/legal-panel/app/contratos/page.tsx

import LegalSection from "../components/LegalSection";
import LegalCard from "../components/LegalCard";
import LegalBadge from "../components/LegalBadge";

import ContratoLista from "./ContratoLista";
import ContratoChecklist from "./ContratoChecklist";
import ContratoEditorIA from "./ContratoEditorIA";

export default function ContratosPage() {
  return (
    <div className="space-y-12">

      {/* ============================================================
          CABEÇALHO DO MÓDULO
      ============================================================ */}
      <LegalSection
        eyebrow="Domínio Jurídico"
        title="Contratos & Minutas"
        subtitle="Gerencie contratos, modelos, minutas, revisões e checklist jurídico com suporte inteligente de IA."
        rightSlot={<LegalBadge tone="gold">Proteção Legal</LegalBadge>} children={""}      />

      {/* ============================================================
          LISTA DE CONTRATOS
      ============================================================ */}
      <LegalSection
        eyebrow="Visão Rápida"
        title="Contratos existentes"
        subtitle="Todos os contratos cadastrados no sistema — com status, data, partes e pendências."
      >
        <LegalCard
          title="Documentos cadastrados"
          description="Contratos celebrados com clientes, parceiros, músicos, fornecedores e colaboradores."
        >
          <ContratoLista />
        </LegalCard>
      </LegalSection>

      {/* ============================================================
          EDITOR IA + HUMANO
      ============================================================ */}
      <LegalSection
        eyebrow="Assistente Jurídico"
        title="Editor inteligente de contratos"
        subtitle="Combine IA + revisão humana para criar minutas seguras, revisadas e alinhadas aos objetivos do Studio Art Hub."
      >
        <LegalCard
          title="Editor com IA"
          description="Gere novas minutas a partir de prompts ou revise trechos específicos."
          accent="gold"
        >
          <ContratoEditorIA />
        </LegalCard>
      </LegalSection>

      {/* ============================================================
          CHECKLIST DE CONFORMIDADE
      ============================================================ */}
      <LegalSection
        eyebrow="Conformidade"
        title="Checklist jurídico de contratos"
        subtitle="Validação obrigatória antes de assinar qualquer acordo."
      >
        <LegalCard
          title="Checklist de Análise"
          description="Checklist estruturado para evitar riscos jurídicos."
        >
          <ContratoChecklist />
        </LegalCard>
      </LegalSection>

    </div>
  );
}