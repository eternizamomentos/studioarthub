"use client";

import { useNotes } from "./NotesProvider";
import { useEffect, useRef } from "react";

/* ============================================================
   DRAG HANDLE · 40px invisível — estilo iOS Notes
   - Fica sempre ativo quando sidebarOpen = false
   - Detecta arrastar puxando da lateral
   - Funciona no desktop e no mobile
   - Ultra leve e sem interferir no layout
============================================================ */

export default function SidebarDragHandle() {
  const { sidebarOpen, openSidebar } = useNotes();

  const startX = useRef<number | null>(null);
  const threshold = 25; // Quanto precisa arrastar para abrir

  /* ------------------------------
     DESKTOP — mouse events
  ------------------------------ */
  function handleMouseDown(e: React.MouseEvent) {
    startX.current = e.clientX;
  }

  function handleMouseMove(e: MouseEvent) {
    if (startX.current === null) return;
    const delta = e.clientX - startX.current;

    if (delta > threshold) {
      openSidebar();
      startX.current = null;
    }
  }

  function handleMouseUp() {
    startX.current = null;
  }

  /* ------------------------------
     MOBILE — touch events
  ------------------------------ */
  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e: TouchEvent) {
    if (startX.current === null) return;
    const delta = e.touches[0].clientX - startX.current;

    if (delta > threshold) {
      openSidebar();
      startX.current = null;
    }
  }

  function handleTouchEnd() {
    startX.current = null;
  }

  /* ------------------------------
     Registra listeners globais
  ------------------------------ */
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  /* ------------------------------
     Só exibe o handle quando
     a sidebar estiver FECHADA
  ------------------------------ */
  if (sidebarOpen) return null;

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="
        fixed left-0 top-0
        h-screen
        w-[40px]
        z-[45]
        bg-transparent
        cursor-ew-resize
        select-none
        lg:w-[40px]
      "
    />
  );
}