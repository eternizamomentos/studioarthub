// apps/legal-panel/app/evidencias/page.tsx

import LegalSection from "../components/LegalSection";
import LegalCard from "../components/LegalCard";
import UploadEvidencia from "./UploadEvidencia";
import EvidenciaTimeline from "./EvidenciaTimeline";
import LegalBadge from "../components/LegalBadge";

export default function EvidenciasPage() {
  return (
    <div className="space-y-12">

      {/* ============================================================
          CABEÇALHO PRINCIPAL DO MÓDULO
      ============================================================ */}
      <LegalSection
        eyebrow="Domínio Jurídico"
        title="Evidências & Cadeia de Custódia"
        subtitle="Registre e valide arquivos, prints, sessões de DAW e material forense com hash criptográfico e linha do tempo rastreável."
        rightSlot={<LegalBadge tone="gold">Cadeia Oficial</LegalBadge>}
      >
        <p className="text-sm text-slate-300/80 mt-1">
          Cada evidência registrada gera integridade verificável, carimbo de tempo
          e rastreamento detalhado — essenciais para proteção jurídica do Studio Art Hub.
        </p>
      </LegalSection>


      {/* ============================================================
          SEÇÃO DE UPLOAD
      ============================================================ */}
      <LegalSection
        eyebrow="Registro de Evidências"
        title="Anexar arquivos forenses"
        subtitle="Faça upload de arquivos relevantes: prints, stems, PDFs, contratos, imagens, DAW, áudios ou ZIPs completos."
      >
        <LegalCard
          title="Upload de Evidências"
          description="Arquivos anexados aqui serão processados com hash SHA-256 e adicionados à cadeia de custódia."
          accent="gold"
        >
          <UploadEvidencia />
        </LegalCard>
      </LegalSection>


      {/* ============================================================
          SEÇÃO TIMELINE
      ============================================================ */}
      <LegalSection
        eyebrow="Cadeia de Custódia"
        title="Linha do tempo forense"
        subtitle="Veja o histórico de criação, edição, assinatura e carimbo de tempo das evidências."
      >
        <LegalCard
          title="Timeline de Eventos"
          description="Visualização sequencial da cadeia de custódia vinculada às evidências registradas."
        >
          <EvidenciaTimeline />
        </LegalCard>
      </LegalSection>

    </div>
  );
}