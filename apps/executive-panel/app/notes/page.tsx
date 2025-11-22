// apps/executive-panel/app/notes/page.tsx
"use client";

import Header from "@/components/Header";

function noopRefresh() {
  // Para o módulo de notas não precisamos de refresh remoto,
  // mas mantemos a assinatura do Header para consistência.
}

export default function NotesPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header global do Painel Executivo */}
      <Header onRefresh={noopRefresh} />

      {/* Conteúdo principal da Central de Notas */}
      <section className="mx-auto max-w-7xl px-4 py-10 w-full space-y-8">
        {/* Título + descrição */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="section-title text-2xl md:text-3xl lg:text-4xl">
              Central de Notas
            </h1>
            <p className="text-pure/60 text-sm md:text-base mt-2 max-w-2xl">
              Um espaço premium para organizar ideias, registrar aprendizados,
              rascunhar estratégias e conectar tudo ao Painel Executivo do
              Studio Art Hub.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end text-xs md:text-sm text-pure/45 gap-1">
            <span className="uppercase tracking-[0.18em] text-pure/40">
              FASE 1 · ARQUITETURA
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 bg-white/5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-pure/60">
                Módulo de notas em construção controlada
              </span>
            </span>
          </div>
        </header>

        {/* GRID PRINCIPAL: Sidebar (futura) + Editor (futuro) */}
        <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px),minmax(0,1fr)] items-start">
          {/* Coluna esquerda — futura Sidebar de cadernos / notas */}
          <aside className="card relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.28] bg-[radial-gradient(circle_at_top,_rgba(231,183,95,0.32),_transparent_60%)]" />
            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-pure/80 tracking-wide">
                  Blocos & Cadernos
                </h2>
                <span className="text-[10px] uppercase tracking-[0.16em] text-pure/45">
                  Fase 1
                </span>
              </div>

              <p className="text-sm text-pure/60 leading-relaxed">
                Aqui ficará a sua lista de cadernos, coleções e notas rápidas.
                Em breve você poderá criar agrupamentos, filtros e atalhos
                inteligentes conectados às tarefas do Painel Executivo.
              </p>

              <div className="mt-4 rounded-lg border border-dashed border-white/12 bg-white/5 px-3 py-3 text-xs text-pure/45">
                <p className="font-medium text-pure/60 mb-1">
                  Próximos passos desta coluna:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Lista de cadernos com contagem de notas</li>
                  <li>Tags visuais para contexto rápido</li>
                  <li>Atalhos para “Nova nota” e “Notas fixadas”</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Coluna direita — futuro Editor de Notas */}
          <section className="card relative min-h-[260px] md:min-h-[340px] overflow-hidden">
            <div className="absolute -top-20 -right-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(231,183,95,0.16),_transparent_60%)] pointer-events-none" />
            <div className="relative h-full flex flex-col">
              <header className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-pure/80 tracking-wide">
                    Área de Escrita & Pensamento
                  </h2>
                  <p className="text-xs text-pure/55 mt-1">
                    Em breve: editor estruturado, IA assistindo suas notas e
                    conexão direta com projetos.
                  </p>
                </div>
                <span className="text-[11px] text-pure/45 border border-white/10 rounded-full px-3 py-1 bg-black/20">
                  v1 · Esqueleto pronto
                </span>
              </header>

              <div className="flex-1 border border-dashed border-white/12 rounded-lg bg-black/20 px-4 py-4 flex items-center justify-center text-center">
                <p className="text-sm text-pure/45 max-w-md leading-relaxed">
                  Esta área será o{" "}
                  <span className="text-gold">
                    editor de notas do Studio Art Hub
                  </span>
                  . Vamos evoluir daqui para: escrita rica, blocos de pensamento,
                  vínculos com cards do Kanban e insights guiados por IA.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}