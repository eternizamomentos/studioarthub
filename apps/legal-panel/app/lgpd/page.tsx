// apps/legal-panel/app/lgpd/page.tsx

import LegalSection from "../components/LegalSection";
import LegalCard from "../components/LegalCard";
import LegalBadge from "../components/LegalBadge";
import LawQuote from "../components/LawQuote";

import LGPDChecklist from "./LGPDChecklist";

export default function LGPDPage() {
  return (
    <div className="space-y-12">

      {/* ============================================================
         SEÇÃO — CABEÇALHO DO DOMÍNIO LGPD
      ============================================================ */}
      <LegalSection
        eyebrow="Domínio Jurídico"
        title="Proteção de Dados (LGPD)"
        subtitle="Práticas obrigatórias para garantir segurança, privacidade e conformidade no tratamento de dados de clientes, parceiros e usuários."
        rightSlot={<LegalBadge tone="gold">LGPD</LegalBadge>} children={""}      />

      {/* ============================================================
         SEÇÃO 1 — CHECKLIST LGPD
      ============================================================ */}
      <LegalSection
        eyebrow="Checklist"
        title="Checklist de Conformidade – LGPD"
        subtitle="Mapa rápido das obrigações de privacidade do Studio Art Hub. Ideal para revisar antes de publicar sites, campanhas e produtos digitais."
      >
        <div className="legal-grid-2">
          <LegalCard
            title="Checklist de Conformidade"
            description="Itens essenciais da LGPD para o Studio Art Hub. Use antes de lançar qualquer fluxo que lide com dados pessoais."
            accent="gold"
          >
            <LGPDChecklist />
          </LegalCard>

          <LegalCard
            title="Quando aplicar"
            description="Situações práticas onde o checklist deve ser seguido."
          >
            <ul className="legal-card-list">
              <li>• Coleta de nome, e-mail ou telefone em formulários.</li>
              <li>• Uso de cookies ou analytics (como Google Analytics).</li>
              <li>• Processamento de pagamentos e dados sensíveis.</li>
              <li>• Armazenamento de informações em banco de dados ou KV.</li>
              <li>• Envio de e-mails automáticos (Resend, automações, etc.).</li>
            </ul>
          </LegalCard>
        </div>
      </LegalSection>

      {/* ============================================================
         SEÇÃO 2 — PILARES E FUNDAMENTOS
      ============================================================ */}
      <LegalSection
        eyebrow="Fundamentos"
        title="Pilares essenciais da LGPD"
        subtitle="Os principais princípios que devem nortear todo sistema, API ou componente de coleta dentro do Studio Art Hub."
      >
        <div className="legal-grid-3">
          <LegalCard
            title="Finalidade"
            description="Todo dado precisa ter um motivo transparente e explícito."
          >
            <ul className="legal-card-list">
              <li>• Informar ao usuário por que cada dado é coletado.</li>
              <li>• Não usar o dado para finalidade diferente sem autorização.</li>
            </ul>
          </LegalCard>

          <LegalCard
            title="Necessidade"
            description="Coletar somente o mínimo necessário."
          >
            <ul className="legal-card-list">
              <li>• Reduzir campos em formulários.</li>
              <li>• Evitar dados sensíveis quando possível.</li>
            </ul>
          </LegalCard>

          <LegalCard
            title="Segurança"
            description="Proteger os dados contra acessos indevidos."
          >
            <ul className="legal-card-list">
              <li>• Criptografia quando necessário.</li>
              <li>• Uso correto das permissões em APIs e Workers.</li>
              <li>• Evitar logs contendo dados pessoais.</li>
            </ul>
          </LegalCard>
        </div>
      </LegalSection>

      {/* ============================================================
         SEÇÃO 3 — CITAÇÃO LEGAL
      ============================================================ */}
      <LegalSection
        eyebrow="Referência legal"
        title="Base jurídica da LGPD"
        subtitle="Trechos fundamentais da lei para fundamentar as práticas do Studio Art Hub."
      >
        <div className="legal-grid-2">
          <LawQuote
            fonte="LGPD — Lei 13.709/2018"
            trecho="O tratamento de dados pessoais deverá observar a boa-fé e os princípios da finalidade, adequação, necessidade e transparência."
            comentario="Esses princípios servem como pilares do seu fluxo de coleta, processamento e descarte de dados no Studio Art Hub."
          />

          <LegalCard
            title="Aplicação prática na música"
            description="Como a LGPD impacta estúdios, artistas e clientes."
          >
            <ul className="legal-card-list">
              <li>• Você armazena dados para vender músicas personalizadas.</li>
              <li>• Clientes confiam informações sensíveis (histórias, presentes, datas especiais).</li>
              <li>• O estúdio é responsável por proteger esses dados, mesmo sem backend complexo.</li>
            </ul>
          </LegalCard>
        </div>
      </LegalSection>

    </div>
  );
}