// apps/executive-panel/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

import { NotesProvider } from "@/components/notes/NotesProvider";
import SidebarDragHandle from "@/components/notes/SidebarDragHandle";
import NotesSidebar from "@/components/notes/NotesSidebar";
import NoteEditorWrapper from "@/components/notes/NoteEditorWrapper";

/* ============================================================
   METADADOS DO PAINEL EXECUTIVO
============================================================ */
export const metadata = {
  title: "Painel Executivo — Studio Art Hub",
  description: "Centro de gestão E-T-O do Studio Art Hub",
};

/* ============================================================
   ROOT LAYOUT — PREMIUM FINAL
   ✔ Sidebar overlay real
   ✔ Drag-to-open (40px) externo
   ✔ Editor flutuante à direita (md+), só aparece quando há nota ativa
   ✔ Layout base estável e fluido
============================================================ */

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className="
          bg-legalNavy
          text-legalPure
          font-text
          antialiased
          min-h-screen flex
        "
      >
        <NotesProvider>
          {/* Área sensível invisível (40px) para arrastar e abrir sidebar */}
          <SidebarDragHandle />

          {/* Sidebar overlay (controla o próprio z-index) */}
          <NotesSidebar />

          {/* CONTAINER PRINCIPAL */}
          <div className="flex-1 overflow-hidden relative">

            {/* CONTEÚDO DO PAINEL */}
            <main
              className="
                h-full
                overflow-y-auto
                px-3 py-4
              "
            >
              {children}
            </main>

            {/* EDITOR DE NOTAS — aparece só quando activeNote existe */}
            <NoteEditorWrapper />
          </div>

          {/* Portal de modais globais */}
          <div id="modal-root" />
        </NotesProvider>
      </body>
    </html>
  );
}