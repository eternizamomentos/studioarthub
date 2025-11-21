import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Painel Executivo — Studio Art Hub",
  description: "Centro de gestão E-T-O do Studio Art Hub",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className="
          bg-legalNavy 
          text-legalPure 
          font-text 
          antialiased 
          min-h-screen 
          flex flex-col
        "
      >
        {/* futuro: Sidebar / Navbar / Modais globais */}
        <main className="flex-grow">{children}</main>

        <div id="modal-root" />
      </body>
    </html>
  );
}