// apps/executive-panel/components/notes/NoteEditorWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { useNotes } from "./NotesProvider";
import NoteEditor from "./NoteEditor";

/* ============================================================
   NOTE EDITOR WRAPPER · Apple Notes Animation • Premium v2
   - Slide + Fade com suavidade calibrada
   - 180ms (nem rápido demais, nem lento — ideal)
   - Animation-In e Animation-Out suaves
   - Remove do DOM somente após animação
   - Totalmente estável com SSR/CSR e sidebar overlay
============================================================ */

export default function NoteEditorWrapper() {
  const { activeNoteId } = useNotes();

  // Se está montado no DOM
  const [mounted, setMounted] = useState(false);

  // Qual animação está rodando
  const [animatingIn, setAnimatingIn] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  /* ------------------------------------------------------------
     MONITORAMENTO → QUANDO activeNoteId MUDA
  ------------------------------------------------------------ */
  useEffect(() => {
    if (activeNoteId) {
      // === ENTRADA ===
      setMounted(true);          // monta
      setAnimatingOut(false);    // cancela saída
      setTimeout(() => setAnimatingIn(true), 12); // leve atraso para CSS aplicar
    } else if (mounted) {
      // === SAÍDA ===
      setAnimatingIn(false);     // remove classe de entrada
      setAnimatingOut(true);     // ativa animação de saída

      // após a animação → desmontar
      const t = setTimeout(() => {
        setMounted(false);
        setAnimatingOut(false);
      }, 180); // suavidade calibrada Apple Notes

      return () => clearTimeout(t);
    }
  }, [activeNoteId]);

  /* ------------------------------------------------------------
     Se não estiver montado → não renderiza
  ------------------------------------------------------------ */
  if (!mounted) return null;

  /* ------------------------------------------------------------
     CLASSES DE ANIMAÇÃO (usado também no iOS Notes)
  ------------------------------------------------------------ */
  const base = `
    hidden md:block
    fixed right-0 top-0
    h-screen
    w-[420px] lg:w-[520px]
    border-l border-white/10
    bg-[rgba(13,18,32,0.55)]
    backdrop-blur-xl
    z-40
    overflow-y-auto

    transition-all
    duration-[180ms]
    ease-[cubic-bezier(0.32,0.72,0,1)]
  `;

  const animClass =
    animatingIn
      ? "translate-x-0 opacity-100"
      : "translate-x-[40px] opacity-0";

  return (
    <div className={`${base} ${animClass}`}>
      <NoteEditor />
    </div>
  );
}