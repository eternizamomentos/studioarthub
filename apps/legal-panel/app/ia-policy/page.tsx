// apps/legal-panel/app/ia-policy/page.tsx

import LegalSection from "../components/LegalSection";
import LegalCard from "../components/LegalCard";
import LegalBadge from "../components/LegalBadge";
import LawQuote from "../components/LawQuote";

import IAGovernancaChecklist from "./IAGovernancaChecklist";
import ScannerPlagioIA from "./ScannerPlagioIA";

export default function IAPolicyPage() {
  return (
    <div className="space-y-12">
      {/* ============================================================
         CABEÇALHO DO DOMÍNIO
      ============================================================ */}
      <LegalSection
        eyebrow="Domínio Jurídico"
        title="Uso de IA na Criação"
        subtitle="Definição de políticas, limites e evidências para o uso de IA na voz, letra, arranjo e master das músicas do Studio Art Hub."
        rightSlot={<LegalBadge tone="gold">Política de IA</LegalBadge>} children={""}      />

      {/* ============================================================
         SEÇÃO 1 — GOVERNANÇA E POLÍTICAS
      ============================================================ */}
      <LegalSection
        eyebrow="Governança"
        title="Política de Governança de IA na Música"
        subtitle="Checklist obrigatório antes de aprovar qualquer projeto que utilize IA na criação ou pós-produção."
      >
        <div className="legal-grid-2">
          <LegalCard
            title="Checklist de Governança"
            description="Valide se o uso de IA no projeto está dentro da política oficial do Studio Art Hub."
            accent="gold"
          >
            <IAGovernancaChecklist />
          </LegalCard>

          <LegalCard
            title="Princípios de uso responsável"
            description="Diretrizes gerais para equilibrar criatividade, direitos autorais e transparência com clientes e artistas."
          >
            <ul className="legal-card-list">
              <li>
                • Todas as faixas com IA devem ser identificadas como tal em contratos e materiais de briefing.
              </li>
              <li>
                • Nenhuma voz semelhante a artista real pode ser utilizada sem autorização explícita e por escrito.
              </li>
              <li>
                • Letras geradas por IA passam por curadoria humana, com revisão de contexto, sensibilidade e adequação.
              </li>
              <li>
                • Sempre que possível, registrar a trilha final e os arquivos-fonte como evidência (hash + OTS).
              </li>
            </ul>
          </LegalCard>
        </div>
      </LegalSection>

      {/* ============================================================
         SEÇÃO 2 — SCANNER DE PLÁGIO / SIMILARIDADE
      ============================================================ */}
      <LegalSection
        eyebrow="Risco & Evidências"
        title="Scanner de plágio e similaridade com IA"
        subtitle="Ferramenta de apoio para registrar consultas de similaridade e gerar evidências antes de publicar faixas com IA."
      >
        <div className="legal-grid-2">
          <LegalCard
            title="Scanner IA de Similaridade"
            description="Simulação de interface para acionar serviços externos de detecção de plágio ou similaridade musical."
          >
            <ScannerPlagioIA />
          </LegalCard>

          <LegalCard
            title="Registro probatório"
            description="Como o resultado do scanner será usado em conjunto com o módulo de Evidências & Cadeia de Custódia."
          >
            <ul className="legal-card-list">
              <li>
                • Cada consulta gera um registro com data, hora, hash do arquivo analisado e captura do resultado.
              </li>
              <li>
                • Esses registros podem ser vinculados à obra no módulo de Direitos Autorais & Obras Musicais.
              </li>
              <li>
                • Em caso de disputa, o histórico de consultas ajuda a demonstrar diligência e boa-fé do estúdio.
              </li>
            </ul>
          </LegalCard>
        </div>
      </LegalSection>

      {/* ============================================================
         SEÇÃO 3 — FUNDAMENTO LEGAL (PLACEHOLDER)
      ============================================================ */}
      <LegalSection
        eyebrow="Base Jurídica"
        title="Referenciais legais e boas práticas"
        subtitle="Espaço reservado para consolidar leis, pareceres e recomendações oficiais sobre uso de IA em obras musicais."
      >
        <div className="legal-grid-2">
          <LawQuote
            fonte="(exemplo) Diretrizes internacionais sobre IA generativa em conteúdo criativo"
            trecho="Trecho exato de normas, pareceres ou recomendações poderá ser inserido aqui para servir de base às políticas do Studio Art Hub."
            comentario="Este bloco serve como âncora jurídica e reputacional: o objetivo é documentar que a política de IA não é arbitrária, mas alinhada a boas práticas e tendências regulatórias."
          />

          <LegalCard
            title="Integração com outros módulos"
            description="Como o domínio de IA conversa com contratos, direitos autorais e evidências."
          >
            <ul className="legal-card-list">
              <li>• Cláusulas específicas de IA nos contratos (módulo Contratos & Minutas).</li>
              <li>• Marcações de faixas com IA no cadastro de obras (módulo Direitos Autorais).</li>
              <li>• Upload de stems, sessões e resultados do scanner no módulo de Evidências.</li>
            </ul>
          </LegalCard>
        </div>
      </LegalSection>
    </div>
  );
}