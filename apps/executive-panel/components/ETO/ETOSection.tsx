"use client";

import { useEffect, useMemo, useState } from "react";

type LevelKey = "E" | "T" | "O";

type Initiative = {
  id: string;
  title: string;
  progress: number;
};

type EtoState = Record<LevelKey, Initiative[]>;

const INITIAL_ETO: EtoState = {
  E: [
    { id: "E-1", title: "Expandir B2B (Q1/Q2)", progress: 30 },
    { id: "E-2", title: "Parcerias estratégicas", progress: 10 },
  ],
  T: [
    { id: "T-1", title: "Aumentar conversão Pix", progress: 45 },
    { id: "T-2", title: "SEO + Conteúdo alvo", progress: 25 },
  ],
  O: [
    { id: "O-1", title: "Estabilizar Worker + Logs", progress: 70 },
    { id: "O-2", title: "Painel Exec v1", progress: 60 },
  ],
};

const STORAGE_KEY = "executive_panel_eto_v1";

const LEVEL_META: Record<
  LevelKey,
  { label: string; color: "gold" | "blush" | "raspberry"; description: string }
> = {
  E: { label: "Estratégico", color: "gold", description: "Metas de longo prazo e direção do Studio Art Hub." },
  T: { label: "Tático", color: "blush", description: "Planos a médio/curto prazo para atingir o estratégico." },
  O: { label: "Operacional", color: "raspberry", description: "Famoso 'mão na massa'" },
};

export default function ETOSection() {
  const [eto, setEto] = useState<EtoState>(INITIAL_ETO);
  const [hydrated, setHydrated] = useState(false);

  // State to control ghost inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEto(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // Save to localStorage automatically
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eto));
    } catch {}
  }, [eto, hydrated]);

  const globalAverage = useMemo(() => {
    const all = [...eto.E, ...eto.T, ...eto.O];
    if (!all.length) return 0;
    return Math.round(all.reduce((a, i) => a + i.progress, 0) / all.length);
  }, [eto]);

  function handleProgressChange(level: LevelKey, id: string, value: number) {
    const clamped = Math.min(100, Math.max(0, Math.round(value)));
    setEto(prev => ({
      ...prev,
      [level]: prev[level].map(item =>
        item.id === id ? { ...item, progress: clamped } : item
      ),
    }));
  }

  function handleRemoveInitiative(level: LevelKey, id: string) {
    setEto(prev => ({
      ...prev,
      [level]: prev[level].filter(item => item.id !== id),
    }));
  }

  function handleAddInitiative(level: LevelKey) {
    const raw = typeof window !== "undefined" ? window.prompt("Título da nova iniciativa:") : "";
    const title = raw?.trim();
    if (!title) return;

    const id = `${level}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;

    setEto(prev => ({
      ...prev,
      [level]: [...prev[level], { id, title, progress: 0 }],
    }));
  }

  // ghost edit handlers
  function startEdit(id: string, current: string) {
    setEditingId(id);
    setEditingText(current);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  function confirmEdit(level: LevelKey, id: string) {
    const title = editingText.trim();
    if (!title) return cancelEdit();

    setEto(prev => ({
      ...prev,
      [level]: prev[level].map(item =>
        item.id === id ? { ...item, title } : item
      ),
    }));

    cancelEdit();
  }

  function getGradient(color: string) {
    return color === "gold"
      ? "linear-gradient(90deg, #E7B75F, #F4E2B5)"
      : color === "blush"
      ? "linear-gradient(90deg, #FF7A9E, #FFC9D9)"
      : "linear-gradient(90deg, #D6395F, #FF7A94)";
  }

  if (!hydrated)
    return (
      <section className="mx-auto max-w-7xl px-4 mt-8 text-pure/40 italic">
        Carregando interface…
      </section>
    );

  return (
    <section className="mx-auto max-w-7xl px-4 mt-8">
      <div className="flex justify-between items-baseline mb-3 text-xs text-pure/60">
        <div>
          <h2 className="section-title">E/T/O – Foco Estratégico do Studio</h2>
          <p className="text-pure/70 text-sm">
            Visão resumida do que é mais importante agora nos níveis
            <span className="text-gold font-medium"> Estratégico</span>,{" "}
            <span className="text-blush font-medium">Tático</span> e{" "}
            <span className="text-raspberry font-medium">Operacional</span>.
          </p>
        </div>
        <div>📍 Dados armazenados localmente</div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {(Object.keys(LEVEL_META) as LevelKey[]).map(level => {
          const meta = LEVEL_META[level];
          const items = eto[level];
          const barGradient = getGradient(meta.color);

          return (
            <div key={level} className="card flex flex-col">
              <h3 className="section-title">{meta.label}</h3>
              <p className="text-xs text-pure/60 mt-1">{meta.description}</p>

              <ul className="mt-3 space-y-3">
                {items.map(g => (
                  <li key={g.id}>
                    <div className="flex justify-between items-center text-sm">
                      {/* GHOST EDIT AREA */}
                      {editingId === g.id ? (
                        <input
                          value={editingText}
                          autoFocus
                          onChange={e => setEditingText(e.target.value)}
                          onBlur={() => confirmEdit(level, g.id)}
                          onKeyDown={e => {
                            if (e.key === "Enter") confirmEdit(level, g.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="bg-transparent text-pure/95 border-none outline-none p-0 m-0 w-full"
                          style={{ fontSize: "0.9rem" }}
                        />
                      ) : (
                        <span
                          className="text-pure/90 truncate pr-2 cursor-text transition-opacity hover:opacity-70"
                          onClick={() => startEdit(g.id, g.title)}
                        >
                          {g.title}
                        </span>
                      )}

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-pure/70 text-xs">{g.progress}%</span>
                        <button
                          onClick={() => handleRemoveInitiative(level, g.id)}
                          className="text-pure/50 text-sm px-1 transition-colors hover:text-raspberry/70 hover:scale-110"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* PROGRESS UI (unchanged premium) */}
                    <div className="mt-1 relative">
                      <div className="h-2 bg-white/10 rounded-md overflow-hidden backdrop-blur-sm">
                        <div
                          className="h-full rounded-md transition-all duration-150"
                          style={{
                            width: `${g.progress}%`,
                            background: barGradient,
                            boxShadow: "0 0 10px rgba(231,183,95,0.25)",
                          }}
                        />
                      </div>

                      <div className="absolute inset-0 pointer-events-none">
                        <div className="relative h-full">
                          <div
                            className="absolute top-1/2 h-[14px] w-[14px] rounded-full -translate-y-1/2 -translate-x-1/2 transition-all duration-75"
                            style={{
                              left: `${g.progress}%`,
                              background: "#0B0F19",
                              border: "2.3px solid #E7B75F",
                              boxShadow: "0 0 6px rgba(231,183,95,0.6)",
                            }}
                          />
                        </div>
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={g.progress}
                        onChange={e => handleProgressChange(level, g.id, Number(e.target.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleAddInitiative(level)}
                className="mt-4 inline-flex items-center text-xs text-pure/70 hover:text-gold transition-colors"
              >
                <span className="text-base mr-1">＋</span>
                Adicionar iniciativa
              </button>

              {items.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-pure/60 flex justify-between">
                  <span>Nível médio deste bloco</span>
                  <span className="text-pure/80">
                    {Math.round(items.reduce((a, i) => a + i.progress, 0) / items.length)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {globalAverage > 0 && (
        <p className="mt-3 text-[11px] text-pure/50">
          Nível médio geral E/T/O:{" "}
          <span className="text-pure/70">{globalAverage}%</span>
        </p>
      )}
    </section>
  );
}