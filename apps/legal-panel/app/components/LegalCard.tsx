// apps/legal-panel/app/components/LegalCard.tsx
import React from "react";

type LegalCardProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  accent?: "default" | "gold" | "danger" | "success";
  footer?: React.ReactNode;
};

/**
 * LegalCard
 * --------------------------------------------------------
 * Card premium para o Painel Jurídico do Studio Art Hub.
 *
 * Características:
 * - Glassmorphism jurídico (isolado)
 * - Bordas premium com acentuação dinâmica (ouro, sucesso, risco)
 * - Header consistente com LegalSection
 * - Body fluido para grids e componentes complexos
 * - Footer opcional estilizado
 *
 * O card é 100% isolado do Painel Executivo.
 */
export default function LegalCard({
  title,
  description,
  children,
  accent = "default",
  footer,
}: LegalCardProps) {
  /**
   * Mapeamento de acentuação premium para o visual jurídico.
   * Todos os tons batem com o globals.css atual.
   */
  const accentClass =
    accent === "gold"
      ? "legal-border-gold"
      : accent === "danger"
      ? "legal-border-danger"
      : accent === "success"
      ? "legal-border-success"
      : "legal-border-default";

  return (
    <article className={`legal-card ${accentClass}`}>
      {/* HEADER */}
      <header className="legal-card-header">
        <h3 className="legal-card-title">{title}</h3>

        {description && (
          <p className="legal-card-description">
            {description}
          </p>
        )}
      </header>

      {/* BODY */}
      {children && (
        <div className="legal-card-body">
          {children}
        </div>
      )}

      {/* FOOTER */}
      {footer && (
        <footer className="legal-card-footer">
          {footer}
        </footer>
      )}
    </article>
  );
}