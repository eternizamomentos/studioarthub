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
  onSave
}: Props) {
  const [localValues, setLocalValues] = useState(values);

  // Sync caso abra modal com valores novos
  useEffect(() => {
    if (open) {
      setLocalValues(values);
      document.body.style.overflow = "hidden"; // trava scroll
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [open, values]);

  if (!open) return null;

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function setVal(key: keyof GUTValues, v: number) {
    setLocalValues((prev) => ({ ...prev, [key]: v }));
  }

  const priority = localValues.g * localValues.u * localValues.t;

  return (
    <div
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/60 backdrop-blur-sm
        animate-fadeIn
      "
    >
      <div
        className="
          card relative max-w-md w-full p-6 border border-gold/30
          shadow-xl shadow-gold/10 bg-[#0D1220]
          animate-scaleIn
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute right-4 top-4 text-pure/50 hover:text-pure/80 
            transition text-xl
          "
        >
          ×
        </button>

        <h2 className="section-title mb-2">Editar Prioridade GUT</h2>

        <p className="text-pure/70 text-sm mb-4">
          Tarefa: <span className="text-gold font-medium">{taskTitle}</span>
        </p>

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

        <div className="mt-6 text-pure/80 text-sm">
          Prioridade Calculada (G × U × T):
          <span className="text-gold font-semibold ml-2 text-base">
            {priority}
          </span>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg border border-white/10 
              text-pure/60 hover:text-pure/80 hover:bg-white/5 transition
            "
          >
            Cancelar
          </button>

          <button
            onClick={() => onSave(localValues)}
            className="
              px-4 py-2 rounded-lg bg-gold text-black 
              hover:brightness-110 transition
            "
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================
//  Subcomponente (GUTField)
// =========================
function GUTField({
  label,
  value,
  onSelect
}: {
  label: string;
  value: number;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="mb-4">
      <p className="text-pure/80 text-sm mb-2">{label}</p>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onSelect(n)}
            className={`
              w-9 h-9 rounded-lg border text-sm font-medium transition 
              ${value === n 
                ? "bg-gold text-black border-gold shadow-md shadow-gold/20" 
                : "bg-white/5 text-pure/60 border-white/10 hover:bg-white/10"}
            `}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}