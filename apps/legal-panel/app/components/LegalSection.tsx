// apps/legal-panel/app/components/LegalSection.tsx
import React from "react";

type LegalSectionProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * LegalSection
 * --------------------------------------------------------
 * Estrutura premium usada em TODAS as seções do Painel Jurídico.
 * Inspirado no padrão do Painel Executivo, porém isolado, refinado
 * e com tokens próprios para o domínio jurídico.
 *
 * - Eyebrow (label acima do título)
 * - Título premium com gradiente
 * - Slot à direita para badges, métricas, botões etc.
 * - Body com grid responsivo
 *
 * Nenhuma regra daqui interfere no Painel Executivo.
 */
export default function LegalSection({
  title,
  subtitle,
  eyebrow,
  rightSlot,
  children,
}: LegalSectionProps) {
  return (
    <section className="legal-section">
      {/* HEADER */}
      <header className="legal-section-header">
        <div className="legal-section-header-left">
          {eyebrow && (
            <p className="legal-section-eyebrow">
              {eyebrow}
            </p>
          )}

          <h2 className="legal-section-title">
            {title}
          </h2>

          {subtitle && (
            <p className="legal-section-subtitle">
              {subtitle}
            </p>
          )}
        </div>

        {rightSlot && (
          <div className="legal-section-right">
            {rightSlot}
          </div>
        )}
      </header>

      {/* BODY */}
      <div className="legal-section-body">
        {children}
      </div>
    </section>
  );
}