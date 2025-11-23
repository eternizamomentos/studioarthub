// apps/executive-panel/components/notes/NoteEditorWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { useNotes } from "./NotesProvider";
import NoteEditor from "./NoteEditor";

/* ============================================================
   NOTE EDITOR WRAPPER · ULTRA PREMIUM — Apple Notes V3
   - Slide + fade impecável (52px → 0)
   - Sombra lateral estilo macOS
   - Montagem suave e estável no DOM
   - Sem flickering / sem saltos de layout
   - Animação calibrada: 180ms cubic-bezier Apple
============================================================ */

export default function NoteEditorWrapper() {
  const { activeNoteId } = useNotes();

  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  /* ------------------------------------------------------------
     Entrada / Saída
  ------------------------------------------------------------ */
  useEffect(() => {
    if (activeNoteId) {
      // ENTRADA
      setMounted(true);
      setAnimIn(false);

      // atraso mínimo → permite CSS aplicar transitions
      const t = setTimeout(() => {
        setAnimIn(true);
      }, 20);

      return () => clearTimeout(t);
    } else if (mounted) {
      // SAÍDA
      setAnimIn(false);

      const t = setTimeout(() => {
        setMounted(false);
      }, 185);

      return () => clearTimeout(t);
    }
  }, [activeNoteId]);

  if (!mounted) return null;

  /* ------------------------------------------------------------
     CLASSES
  ------------------------------------------------------------ */
  const base = `
    fixed right-0 top-0
    h-screen
    w-[420px] lg:w-[520px]
    z-40

    bg-[rgba(13,18,32,0.55)]
    backdrop-blur-xl
    border-l border-white/10

    overflow-y-auto

    transition-all
    duration-[180ms]
    ease-[cubic-bezier(0.32,0.72,0,1)]

    drop-shadow-[-6px_0px_12px_rgba(0,0,0,0.28)]
  `;

  const animClass = animIn
    ? "translate-x-0 opacity-100"
    : "translate-x-[52px] opacity-0";

  return (
    <div className={`${base} ${animClass}`}>
      <NoteEditor />
    </div>
  );
}