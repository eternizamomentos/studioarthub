// apps/executive-panel/app/notes/layout.tsx
import type { ReactNode } from "react";

/* ============================================================
   METADADOS — Notas
============================================================ */
export const metadata = {
  title: "Notas — Painel Executivo • Studio Art Hub",
  description: "Central de notas e pensamento estratégico do Studio Art Hub",
};

/* ============================================================
   NOTES LAYOUT — Seguro e Compatível
   - Não interfere no RootLayout
   - Não cria novos flex containers desnecessários
   - Mantém o conteúdo fluido e sem quebrar o drag da sidebar
   - Garante padding interno consistente
============================================================ */

export default function NotesLayout({ children }: { children: ReactNode }) {
  return (
    <section
      className="
        flex-1 
        h-full 
        overflow-y-auto
        px-4 md:px-6 lg:px-8
        py-6
      "
    >
      {children}
    </section>
  );
}