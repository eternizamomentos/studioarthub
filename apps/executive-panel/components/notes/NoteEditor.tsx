// apps/executive-panel/components/notes/NoteEditor.tsx
"use client";

import { useEffect, useState } from "react";
import { useNotes } from "./NotesProvider";

/* ============================================================
   NOTE EDITOR · V4 PREMIER ANIMATION EDITION
   - Compatível com o novo sistema de animação (editorVisible)
   - Usa closeEditor() em vez de setActiveNote(null)
   - Auto-save suave
   - Altamente estável
============================================================ */

export default function NoteEditor() {
  const {
    notes,
    activeNoteId,
    updateNote,
    deleteNote,
    closeEditor,     // << NOVO: usa API correta
  } = useNotes();

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null;

  /* ============================================================
     Se não existe nota ativa → não renderizar
     (montagem é controlada pelo NoteEditorWrapper)
  ============================================================= */
  if (!activeNote) return null;

  /* ============================================================
     Estados locais
  ============================================================= */
  const [title, setTitle] = useState(activeNote.title);
  const [content, setContent] = useState(activeNote.content);

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  /* ============================================================
     Atualiza quando troca a nota ativa
  ============================================================= */
  useEffect(() => {
    if (!activeNote) return;
    setTitle(activeNote.title);
    setContent(activeNote.content);
  }, [activeNoteId]);

  /* ============================================================
     Auto-save (400ms debounce)
  ============================================================= */
  useEffect(() => {
    if (!activeNote) return;

    const timer = setTimeout(() => {
      setSaving(true);

      updateNote(activeNote.id, { title, content });

      setTimeout(() => {
        setSaving(false);
        setLastSaved(Date.now());
      }, 150);
    }, 400);

    return () => clearTimeout(timer);
  }, [title, content, activeNoteId]);

  /* ============================================================
     generateSummary
  ============================================================= */
  async function generateSummary() {
    if (!activeNote) return;

    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });

    const json = await res.json();

    if (json.summary) {
      setContent((prev) => prev + "\n\n---\n🧠 Resumo:\n" + json.summary);
    }
  }
  
  /* ============================================================
     Ações
  ============================================================= */
  function handleClose() {
    closeEditor(); // << animação + desativação correta
  }

  function handleDelete() {
    if (!activeNote) return;
    deleteNote(activeNote.id);
    closeEditor();
  }

  /* ============================================================
     UI Premium
  ============================================================= */
  return (
    <div
      className="
        flex flex-col h-full w-full
        px-8 py-6
        bg-[rgba(13,18,32,0.6)]
        backdrop-blur-xl
        border-l border-white/10
        overflow-y-auto
      "
    >
      {/* ======================= Barra superior ======================= */}
      <div className="flex items-center justify-between mb-6">

        {/* Status */}
        <div className="text-xs text-pure/40 h-4">
          {saving ? (
            <span className="text-gold/80">Salvando…</span>
          ) : lastSaved ? (
            <span className="text-pure/30">
              Salvo há {Math.floor((Date.now() - lastSaved) / 1000)}s
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>

        {/* Botões */}
        <div className="flex items-center gap-2">

          {/* Excluir */}
          <button
            onClick={handleDelete}
            className="
              px-3 py-1.5 text-xs
              bg-red-500/20 text-red-300
              border border-red-500/30
              rounded-md
              hover:bg-red-500/30 hover:border-red-400
              transition
            "
          >
            Excluir
          </button>

          {/* RESUMO IA */}
          <button
            onClick={generateSummary}
            className="
              px-3 py-1.5 text-xs
              bg-gold/20 text-gold
              border border-gold/40
              rounded-md
              hover:bg-gold/30 hover:border-gold/60
              transition
            "
          >
            Resumo IA
          </button>

          {/* Fechar */}
          <button
            onClick={handleClose}
            className="
              px-3 py-1.5 text-xs
              bg-white/10 text-pure/80
              border border-white/20
              rounded-md
              hover:bg-white/20
              transition
            "
          >
            Fechar
          </button>
        </div>
      </div>

      {/* ======================= Título ======================= */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="
          w-full bg-transparent
          text-3xl font-title text-pure
          border-none outline-none
          mb-6
          placeholder:text-pure/20
        "
        placeholder="Título da nota…"
      />

      {/* ======================= Conteúdo ======================= */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="
          flex-1 w-full bg-transparent
          text-pure/90 text-[15px] leading-relaxed
          outline-none border-none resize-none
          placeholder:text-pure/30
        "
        placeholder="Escreva algo inspirador..."
      />
    </div>
  );
}