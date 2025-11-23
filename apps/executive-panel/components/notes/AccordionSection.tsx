// apps/executive-panel/components/notes/AccordionSection.tsx
"use client";

import { useState } from "react";

export default function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mt-6">
      {/* Cabeçalho */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full flex items-center justify-between
          px-4 py-2
          bg-white/5 hover:bg-white/10
          border border-white/10
          rounded-md
          transition
          text-pure/80 font-medium
        "
      >
        {title}

        <span className="text-pure/50 text-sm">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Conteúdo */}
      {open && (
        <div
          className="
            mt-3
            p-4
            bg-white/5
            border border-white/10
            rounded-md
          "
        >
          {children}
        </div>
      )}
    </div>
  );
}