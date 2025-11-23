// apps/executive-panel/components/notes/NotesSidebar.tsx
"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  useNotes,
  type Notebook,
  type Note,
} from "@/components/notes/NotesProvider";

export default function NotesSidebar() {
  const {
    notebooks,
    notes,
    activeNotebookId,
    activeNoteId,
    setActiveNotebook,
    setActiveNote,
    createNote,
    sidebarOpen,
    openSidebar,
    closeSidebar,
  } = useNotes();

  /* ============================================================
     NOTEBOOK / NOTES DERIVATION
  ============================================================ */

  const currentNotebookId = useMemo(() => {
    if (!notebooks.length) return null;
    return activeNotebookId || notebooks[0].id;
  }, [notebooks, activeNotebookId]);

  const notesForNotebook = (id: string | null): Note[] => {
    if (!id) return [];
    return notes
      .filter((n) => n.notebookId === id)
      .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  };

  const notesInCurrentNotebook = useMemo(
    () => notesForNotebook(currentNotebookId),
    [notes, currentNotebookId]
  );

  /* ============================================================
     DRAG TO OPEN — 40px invisible area
  ============================================================ */

  const startXOpen = useRef(0);
  const draggingOpen = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  function getClientX(e: any) {
    return e?.touches?.[0]?.clientX ?? e?.clientX ?? 0;
  }

  function handleOpenStart(e: any) {
    if (sidebarOpen) return;
    draggingOpen.current = true;
    startXOpen.current = getClientX(e);
  }

  function handleOpenMove(e: any) {
    if (!draggingOpen.current || sidebarOpen) return;

    const delta = getClientX(e) - startXOpen.current;
    if (delta > 0 && delta < 270) setDragOffset(delta);
  }

  function handleOpenEnd() {
    if (!draggingOpen.current) return;

    draggingOpen.current = false;
    if (dragOffset > 120) openSidebar();
    setDragOffset(0);
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleOpenMove);
    window.addEventListener("mouseup", handleOpenEnd);
    window.addEventListener("touchmove", handleOpenMove);
    window.addEventListener("touchend", handleOpenEnd);

    return () => {
      window.removeEventListener("mousemove", handleOpenMove);
      window.removeEventListener("mouseup", handleOpenEnd);
      window.removeEventListener("touchmove", handleOpenMove);
      window.removeEventListener("touchend", handleOpenEnd);
    };
  }, [sidebarOpen, dragOffset]);

  /* ============================================================
     DRAG TO CLOSE — swipe inside sidebar
  ============================================================ */

  const startXClose = useRef<number | null>(null);
  const thresholdClose = 40;

  function handleSidebarStart(e: any) {
    if (!sidebarOpen) return;
    startXClose.current = getClientX(e);
  }

  function handleSidebarMove(e: any) {
    if (!sidebarOpen || startXClose.current === null) return;

    const delta = getClientX(e) - startXClose.current;

    if (delta < -thresholdClose) {
      closeSidebar();
      startXClose.current = null;
    }
  }

  function handleSidebarEnd() {
    startXClose.current = null;
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleSidebarMove);
    window.addEventListener("mouseup", handleSidebarEnd);
    window.addEventListener("touchmove", handleSidebarMove);
    window.addEventListener("touchend", handleSidebarEnd);
    return () => {
      window.removeEventListener("mousemove", handleSidebarMove);
      window.removeEventListener("mouseup", handleSidebarEnd);
      window.removeEventListener("touchmove", handleSidebarMove);
      window.removeEventListener("touchend", handleSidebarEnd);
    };
  }, [sidebarOpen]);

  /* ============================================================
     ACTIONS (Corrigido: não fecha mais ao clicar!)
  ============================================================ */

  function handleSelectNotebook(id: string) {
    setActiveNotebook(id);
    const arr = notesForNotebook(id);
    setActiveNote(arr.length ? arr[0].id : null);
    // ❌ REMOVE closeSidebar()
  }

  function handleSelectNote(id: string) {
    setActiveNote(id);
    // ❌ REMOVE closeSidebar()
  }

  function handleCreateNote() {
    const created = createNote();
    if (!created) return;
    setActiveNotebook(created.notebookId);
    setActiveNote(created.id);
    // ❌ REMOVE closeSidebar()
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* DRAG-OPEN AREA */}
      {!sidebarOpen && (
        <div
          onMouseDown={handleOpenStart}
          onTouchStart={handleOpenStart}
          className="
            fixed left-0 top-0 h-screen w-[40px]
            z-20 bg-transparent cursor-ew-resize select-none
          "
        />
      )}

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="
            fixed inset-0 bg-black/30 backdrop-blur-sm
            z-30
          "
        />
      )}

      <aside
        onMouseDown={handleSidebarStart}
        onTouchStart={handleSidebarStart}
        className="
          fixed left-0 top-0 h-screen w-[270px]
          bg-[rgba(13,18,32,0.78)]
          border-r border-white/10
          backdrop-blur-2xl shadow-[8px_0_30px_rgba(0,0,0,0.55)]
          z-40 flex flex-col
          transition-transform duration-300 ease-out
        "
        style={{
          transform: sidebarOpen
            ? "translateX(0)"
            : `translateX(calc(-100% + ${dragOffset}px))`,
        }}
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold tracking-[0.08em] uppercase text-pure/70">
              Bloco de notas
            </h2>
            <p className="text-[11px] text-pure/40">Studio Art Hub</p>
          </div>

          <div
            onClick={closeSidebar}
            className="text-pure/60 hover:text-pure cursor-pointer text-xl px-2"
          >
            ✕
          </div>
        </div>

        {/* CREATE NOTE */}
        <div className="px-5 pt-3 pb-2 border-b border-white/10">
          <div
            onClick={handleCreateNote}
            className="w-full flex items-center justify-center gap-2
              px-3 py-2.5 rounded-lg bg-gold text-black cursor-pointer
              shadow-[0_0_14px_rgba(231,183,95,0.45)] hover:brightness-110 transition"
          >
            <span className="text-base">＋</span>
            <span>Nova nota</span>
          </div>
        </div>

        {/* NOTEBOOKS */}
        <div className="px-5 pt-4 pb-2 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] uppercase text-pure/40 tracking-[0.16em]">
              Cadernos
            </p>
            <span className="text-[11px] text-pure/35">
              {notebooks.length} ativo(s)
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {notebooks.map((nb) => {
              const isActive = nb.id === currentNotebookId;
              return (
                <div
                  key={nb.id}
                  onClick={() => handleSelectNotebook(nb.id)}
                  className={`
                    px-3 py-2 rounded-md text-xs cursor-pointer transition
                    ${
                      isActive
                        ? "bg-gold/12 border border-gold/60 text-gold"
                        : "bg-transparent text-pure/60 hover:bg-white/5 hover:text-pure/80"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {nb.icon && <span>{nb.icon}</span>}
                    <span className="truncate">{nb.name}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* NOTES */}
        <div className="flex-1 px-5 py-4 overflow-y-auto custom-scroll">
          {notesInCurrentNotebook.map((note) => {
            const isSelected = note.id === activeNoteId;
            return (
              <div
                key={note.id}
                onClick={() => handleSelectNote(note.id)}
                className={`
                  mb-1 px-3 py-2 rounded-lg border cursor-pointer text-[12px]
                  ${
                    isSelected
                      ? "border-gold/70 bg-gold/10 text-pure"
                      : "border-white/8 text-pure/70 hover:border-gold/40 hover:bg-white/5"
                  }
                `}
              >
                <p className="truncate mb-0.5">
                  {note.title || "Sem título"}
                </p>
                <p className="text-[11px] text-pure/40 truncate">
                  {note.content?.slice(0, 40) || ""}
                </p>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}