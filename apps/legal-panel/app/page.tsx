// apps/legal-panel/app/page.tsx
import LegalSection from "./components/LegalSection";
import LegalCard from "./components/LegalCard";
import LegalBadge from "./components/LegalBadge";
import LawQuote from "./components/LawQuote";

export default function LegalHomePage() {
  // Depois virá da API /api/score
  const indiceConformidadeGeral = 72;

  return (
    <div className="space-y-12">
      
      {/* ============================================================
         SEÇÃO 1 — ÍNDICE DE CONFORMIDADE JURÍDICA
      ============================================================ */}
      <LegalSection
        eyebrow="Visão Geral"
        title="Índice de Conformidade Jurídica"
        subtitle="Resumo da saúde legal do Studio Art Hub, focado em direitos autorais, contratos, dados e uso de IA."
        rightSlot={
          <LegalBadge tone={indiceConformidadeGeral >= 80 ? "success" : "gold"}>
            Status atual: {indiceConformidadeGeral}%
          </LegalBadge>
        }
      >
        <div className="legal-grid-2">

          {/* CARD: SCORE PRINCIPAL */}
          <LegalCard
            title="Painel de Conformidade"
            description="Dividido por domínios críticos — cada um com checklists, evidências e provas forenses."
            accent="gold"
          >
            <div className="legal-score-ring">
              <div className="legal-score-ring-inner">
                <span className="legal-score-value">
                  {indiceConformidadeGeral}%
                </span>
                <span className="legal-score-label">
                  Conformidade geral
                </span>
              </div>
            </div>

            <div className="legal-score-legend">
              <div>
                <p className="legal-score-pill legal-score-pill-ok" />
                <span>Áreas em dia</span>
              </div>
              <div>
                <p className="legal-score-pill legal-score-pill-warn" />
                <span>Melhorias próximas</span>
              </div>
              <div>
                <p className="legal-score-pill legal-score-pill-risk" />
                <span>Risco jurídico</span>
              </div>
            </div>
          </LegalCard>

          {/* CARD: ETO JURÍDICO */}
          <LegalCard
            title="Radar Jurídico ETO"
            description="Resumo estratégico (E), tático (T) e operacional (O) das próximas ações jurídicas prioritárias."
          >
            <ul className="legal-checklist">
              <li>
                <span className="legal-check-tag">Estratégico</span>
                <p>Mapear todas as obras musicais e consolidar registros de autoria.</p>
              </li>

              <li>
                <span className="legal-check-tag">Tático</span>
                <p>Padronizar contratos com clientes, parceiros e músicos convidados.</p>
              </li>

              <li>
                <span className="legal-check-tag">Operacional</span>
                <p>Definir rotina mensal de auditoria jurídica com checklist guiado.</p>
              </li>
            </ul>
          </LegalCard>
        </div>
      </LegalSection>

      {/* ============================================================
         SEÇÃO 2 — MÓDULOS CRÍTICOS
      ============================================================ */}
      <LegalSection
        eyebrow="Módulos do Painel"
        title="Domínios jurídicos monitorados"
        subtitle="Tudo que importa para um estúdio de música profissional no Brasil — com evidências, IA assistiva e histórico completo."
      >
        <div className="legal-grid-3">
          
          {/* CARD 1 */}
          <LegalCard
            title="Direitos Autorais & Obras Musicais"
            description="Cadastro de músicas, letras, arranjos, splits e registros oficiais."
          >
            <ul className="legal-card-list">
              <li>• Cadastro de obras com metadados completos (ISRC, autores, splits).</li>
              <li>• Vinculação de contratos e autorizações específicas por obra.</li>
              <li>• Trilhas geradas com IA marcadas e documentadas explicitamente.</li>
            </ul>
          </LegalCard>

          {/* CARD 2 */}
          <LegalCard
            title="Evidências & Cadeia de Custódia"
            description="Arquivos, prints, stems, sessões de DAW e carimbo de tempo forense (OTS)."
          >
            <ul className="legal-card-list">
              <li>• Upload de sessões de produção, stems e versões intermediárias.</li>
              <li>• Hash SHA-256 + carimbo OpenTimestamp para cada evidência.</li>
              <li>• Linha do tempo forense com quem fez o quê, quando e como.</li>
            </ul>
          </LegalCard>

          {/* CARD 3 */}
          <LegalCard
            title="Governança de IA na Música"
            description="Uso responsável de IA (voz, letra, arranjo, master) com trilha de decisão."
          >
            <ul className="legal-card-list">
              <li>• Política clara de uso de IA em cada projeto musical.</li>
              <li>• Registro de qual ferramenta foi usada (Sunno, Donna IA, etc.).</li>
              <li>• Checklist de risco reputacional e jurídico antes da publicação.</li>
            </ul>
          </LegalCard>
        </div>
      </LegalSection>

      {/* ============================================================
         SEÇÃO 3 — FUNDAMENTO LEGAL
      ============================================================ */}
      <LegalSection
        eyebrow="Fundamento legal"
        title="Âncora em lei brasileira"
        subtitle="Aqui entrarão as citações exatas de leis, artigos, incisos e parágrafos que fundamentam cada checklist."
      >
        <div className="legal-grid-2">

          <LawQuote
            fonte="(exemplo) Lei 9.610/98 — Direitos Autorais"
            trecho="Trecho exato da lei será inserido aqui quando definirmos os artigos prioritários para o Studio Art Hub."
            comentario="Este espaço será usado para lembrar, em linguagem humana, o impacto prático desse artigo no dia a dia do estúdio."
          />

          <LegalCard
            title="Como será usado na prática"
            description="Cada artigo será mapeado para um item de checklist e para uma evidência recomendada."
          >
            <ul className="legal-card-list">
              <li>• Artigo → checklist objetivo (sim/não) com peso na pontuação.</li>
              <li>• Checklist → evidência sugerida (documento, print, contrato, áudio).</li>
              <li>• Evidência → hash + OTS → prova de alta robustez jurídica.</li>
            </ul>
          </LegalCard>
        </div>
      </LegalSection>
    </div>
  );
}