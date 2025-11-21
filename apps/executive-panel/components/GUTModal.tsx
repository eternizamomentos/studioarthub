"use client";

import { useEffect, useState } from "react";

export type GUTValues = {
  g: number;
  u: number;
  t: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  taskTitle: string;
  values: GUTValues;
  onSave: (v: GUTValues) => void;
};

export default function GUTModal({
  open,
  onClose,
  taskTitle,
  values,
  onSave,
}: Props) {
  const [localValues, setLocalValues] = useState(values);

  /* ============================================================
     Sync + Scroll Lock
  ============================================================ */
  useEffect(() => {
    if (open) {
      setLocalValues(values);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, values]);

  if (!open) return null;

  const priority = localValues.g * localValues.u * localValues.t;

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function setVal(key: keyof GUTValues, v: number) {
    setLocalValues((prev) => ({ ...prev, [key]: v }));
  }

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleBackdrop}
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/70 backdrop-blur-md
        animate-fadeIn
      "
    >
      <div
        className="
          card relative w-full max-w-md p-6
          bg-[rgba(13,18,32,0.55)]
          border border-white/10 rounded-xl
          shadow-xl shadow-black/40
          animate-scaleIn
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute right-4 top-4 text-pure/50 
            hover:text-pure/80 transition text-xl
          "
        >
          ×
        </button>

        {/* TITLE */}
        <h2 className="section-title mb-2 text-[1.65rem]">
          Prioridade GUT
        </h2>

        <p className="text-pure/70 text-sm mb-5">
          Tarefa:{" "}
          <span className="text-gold font-semibold">{taskTitle}</span>
        </p>

        {/* Fields */}
        <GUTField
          label="Gravidade (G)"
          value={localValues.g}
          onSelect={(v) => setVal("g", v)}
        />

        <GUTField
          label="Urgência (U)"
          value={localValues.u}
          onSelect={(v) => setVal("u", v)}
        />

        <GUTField
          label="Tendência (T)"
          value={localValues.t}
          onSelect={(v) => setVal("t", v)}
        />

        {/* Priority preview */}
        <div className="mt-6 text-pure/80 text-sm">
          Prioridade (G × U × T):
          <span className="text-gold font-bold ml-2 text-lg">
            {priority}
          </span>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={onClose}
            className="
              px-4 py-2 text-sm rounded-lg 
              border border-white/10
              text-pure/60 hover:text-pure/80 hover:bg-white/5
              transition
            "
          >
            Cancelar
          </button>

          <button
            onClick={() => onSave(localValues)}
            className="
              px-4 py-2 text-sm rounded-lg 
              bg-gold text-black 
              hover:brightness-110
              transition shadow-md shadow-gold/20
            "
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   GUTField (subcomponente Premium)
============================================================ */
function GUTField({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: number;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="mb-5">
      <p className="text-pure/80 text-sm mb-2">{label}</p>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onSelect(n)}
            className={`
              w-9 h-9 rounded-lg text-sm font-medium transition
              border
              ${
                value === n
                  ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
                  : "bg-white/5 text-pure/60 border-white/10 hover:bg-white/10"
              }
            `}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}