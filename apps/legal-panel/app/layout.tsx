// apps/legal-panel/app/layout.tsx
import type { Metadata } from "next";

// 1) Tailwind + tokens globais do painel jurídico
import "./globals.css";

// 2) Tema Premium isolado (gradientes, cards, ring, etc.)
import "./styles/legal-panel.css";

// 3) Fonte Playfair (títulos)
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-playfair",
});

// ================================
// METADATA
// ================================
export const metadata: Metadata = {
  title: "Painel Jurídico | Studio Art Hub",
  description:
    "Painel Jurídico do Studio Art Hub — conformidade legal, direitos autorais, evidências e governança de IA em um só lugar.",
};

// ================================
// ROOT LAYOUT PREMIUM
// ================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={playfair.variable}>
      <body className="legal-layout antialiased">

        {/* ========================== */}
        {/* SHELL DO PAINEL JURÍDICO   */}
        {/* ========================== */}
        <div className="legal-shell-wrapper">

          {/* ========================== */}
          {/* SIDEBAR PREMIUM            */}
          {/* ========================== */}
          <aside className="legal-sidebar-premium">
            <div className="legal-sidebar-header">
              <div className="legal-logo-mark">§</div>
              <div className="legal-logo-text">
                <h1>Studio Art Hub</h1>
                <p>Painel Jurídico</p>
              </div>
            </div>

            <nav className="legal-nav-block">
              <p className="legal-nav-section-title">Visão Geral</p>
              <ul>
                <li>
                  <a href="/" className="legal-nav-link">
                    Dashboard Jurídico
                    <span className="legal-nav-chip">Índice</span>
                  </a>
                </li>
              </ul>
            </nav>

            <nav className="legal-nav-block">
              <p className="legal-nav-section-title">Domínios Críticos</p>
              <ul>
                <li>
                  <a href="/compliance" className="legal-nav-link">
                    Compliance & Checklists
                  </a>
                </li>
                <li>
                  <a href="/direitos-autorais" className="legal-nav-link">
                    Direitos Autorais & Músicas
                  </a>
                </li>
                <li>
                  <a href="/evidencias" className="legal-nav-link">
                    Evidências & Cadeia de Custódia
                  </a>
                </li>
                <li>
                  <a href="/contratos" className="legal-nav-link">
                    Contratos & Minutas
                  </a>
                </li>
                <li>
                  <a href="/ia-policy" className="legal-nav-link">
                    Uso de IA na Criação
                  </a>
                </li>
                <li>
                  <a href="/lgpd" className="legal-nav-link">
                    LGPD & Dados de Clientes
                  </a>
                </li>
                <li>
                  <a href="/auditoria" className="legal-nav-link">
                    Auditoria & Logs
                  </a>
                </li>
                <li>
                  <a href="/financeiro-fiscal" className="legal-nav-link">
                    Financeiro / Fiscal
                  </a>
                </li>
              </ul>
            </nav>

            <footer className="legal-sidebar-footer">
              <p>Acesso restrito • uso interno Studio Art Hub</p>
            </footer>
          </aside>

          {/* ========================== */}
          {/* MAIN CONTENT WRAPPER       */}
          {/* ========================== */}
          <main className="legal-main-content">
            <header className="legal-main-header">
              <h2 className="legal-main-header-title">Painel Jurídico</h2>
              <p className="legal-main-header-desc">
                Monitorar conformidade, proteger criações musicais e registrar
                evidências de forma forense.
              </p>
            </header>

            <div className="legal-main-container">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}