// apps/legal-panel/app/direitos-autorais/page.tsx

import LegalSection from "../components/LegalSection";
import LegalCard from "../components/LegalCard";
import LegalBadge from "../components/LegalBadge";
import ObraLista from "./ObraLista";
import ObraForm from "./ObraForm";

export default function DireitosAutoraisPage() {
  return (
    <div className="space-y-12">

      {/* ============================================================
          CABEÇALHO PRINCIPAL DO MÓDULO
      ============================================================ */}
      <LegalSection
        eyebrow="Domínio Jurídico"
        title="Direitos Autorais & Obras Musicais"
        subtitle="Gerencie registros de obras, autores, splits, documentos legais e evidências técnicas essenciais para proteção autoral no Studio Art Hub."
        rightSlot={<LegalBadge tone="gold">Módulo Oficial</LegalBadge>}
      >
        <p className="text-sm text-slate-300/80 mt-1">
          Este módulo foi projetado para garantir cadeia de autoria verificável,
          documentação robusta, e conformidade com a Lei 9.610/98.
        </p>
      </LegalSection>


      {/* ============================================================
          SEÇÃO — LISTA DE OBRAS
      ============================================================ */}
      <LegalSection
        eyebrow="Catálogo"
        title="Obras cadastradas"
        subtitle="Todas as músicas, letras, arranjos e composições do Studio Art Hub. Cada obra inclui metadados completos, contratos e evidências forenses."
      >
        <LegalCard
          title="Catálogo geral de obras"
          description="Visualize todas as obras já registradas, seus status, autores, vínculos contratuais e integridade de evidências."
        >
          <ObraLista />
        </LegalCard>
      </LegalSection>


      {/* ============================================================
          SEÇÃO — CADASTRO DE NOVA OBRA
      ============================================================ */}
      <LegalSection
        eyebrow="Cadastro"
        title="Registrar nova obra"
        subtitle="Preencha os metadados essenciais da obra, autores, splits e anexos legais."
      >
        <LegalCard
          title="Formulário de Cadastro"
          description="Utilize este formulário para registrar uma nova obra com integridade jurídica total."
          accent="gold"
        >
          <ObraForm />
        </LegalCard>
      </LegalSection>

    </div>
  );
}