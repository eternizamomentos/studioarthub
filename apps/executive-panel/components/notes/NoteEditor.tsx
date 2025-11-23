// apps/executive-panel/components/notes/NoteEditor.tsx
"use client";

import { useEffect, useState } from "react";
import { useNotes } from "./NotesProvider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AudioSection from "./AudioSection";
import AccordionSection from "./AccordionSection";

export default function NoteEditor() {
  const {
    notes,
    activeNoteId,
    updateNote,
    deleteNote,
    closeEditor,
  } = useNotes();

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null;
  if (!activeNote) return null;

  const [title, setTitle] = useState(activeNote.title);
  const [content, setContent] = useState(activeNote.content);

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  const [summary, setSummary] = useState<string>("");
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  /* ===================== IA — Resumo Premium ===================== */
  async function summarize() {
    if (!activeNote) return;

    setSummarizing(true);
    setSummaryError(null);
    setSummary("Gerando resumo via IA…");

    try {
      const res = await fetch(`/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      });

      const data = await res.json();

      if (data.error) {
        setSummaryError(data.error);
        setSummary("");
      } else {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
      setSummaryError("Falha ao conectar ao servidor.");
      setSummary("");
    }

    setSummarizing(false);
  }

  /* ===================== Auto-update ===================== */
  useEffect(() => {
    if (!activeNote) return;
    setTitle(activeNote.title);
    setContent(activeNote.content);
    setSummary("");
    setSummaryError(null);
  }, [activeNoteId]);

  /* ===================== Auto-save ===================== */
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

  /* ===================== Delete ===================== */
  function handleDelete() {
    if (!activeNote) return;
    deleteNote(activeNote.id);
    closeEditor();
  }

  /* ===================== UI ===================== */
  return (
    <div
      className="
        flex flex-col h-full w-full
        px-8 py-6
        bg-[rgba(13,18,32,0.60)]
        backdrop-blur-xl
        border-l border-white/10
        overflow-y-auto
      "
    >
      {/* Header ================================================== */}
      <div className="flex items-center justify-between mb-6">
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

        <div className="flex items-center gap-2">
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

          <button
            onClick={summarize}
            disabled={summarizing}
            className="
              px-3 py-1.5 text-xs
              bg-gold/20 text-gold
              border border-gold/40
              rounded-md
              hover:bg-gold/30 hover:border-gold/60
              transition
            "
          >
            {summarizing ? "IA..." : "Resumo IA"}
          </button>

          <button
            onClick={closeEditor}
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

      {/* Título ================================================== */}
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
        placeholder="Título da nota..."
      />

      {/* Conteúdo ================================================ */}
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

      {/* 🔊 ÁUDIO (Accordion) ==================================== */}
      <AccordionSection title="Áudio" defaultOpen={false}>
        <AudioSection noteId={activeNote.id} />
      </AccordionSection>

      {/* 🤖 RESUMO IA (Accordion) ================================= */}
      <AccordionSection title="Resumo IA" defaultOpen={false}>
        {summaryError && (
          <p className="text-red-400 text-sm mb-2">{summaryError}</p>
        )}

        {summary && (
          <div className="prose prose-invert max-w-none leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => (
                  <p className="mb-3 leading-relaxed whitespace-pre-line" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-1 leading-relaxed" {...props} />
                ),
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        )}

        {!summary && !summaryError && (
          <p className="text-pure/40 text-sm">
            Clique no botão “Resumo IA” para gerar.
          </p>
        )}
      </AccordionSection>
    </div>
  );
}