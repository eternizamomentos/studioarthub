// apps/legal-panel/app/direitos-autorais/ObraForm.tsx

"use client";

import { useState } from "react";

export default function ObraForm() {
  const [titulo, setTitulo] = useState("");
  const [autores, setAutores] = useState("");
  const [splits, setSplits] = useState("");

  return (
    <form className="space-y-4">

      {/* Campo: Título */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-300/80 font-medium">
          Título da Obra
        </label>
        <input
          type="text"
          className="legal-input"
          placeholder="Ex: Luz do Cálculo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      {/* Campo: Autores */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-300/80 font-medium">
          Autores (separados por vírgula)
        </label>
        <input
          type="text"
          className="legal-input"
          placeholder="Ex: Josué, Coautor"
          value={autores}
          onChange={(e) => setAutores(e.target.value)}
        />
      </div>

      {/* Campo: Splits */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-300/80 font-medium">
          Splits (percentuais)
        </label>
        <input
          type="text"
          className="legal-input"
          placeholder="Ex: 70/30"
          value={splits}
          onChange={(e) => setSplits(e.target.value)}
        />
      </div>

      {/* Botão */}
      <button
        type="submit"
        className="mt-2 px-5 py-2 rounded-lg bg-gold/80 text-slate-900 font-semibold hover:bg-gold transition"
      >
        Registrar Obra
      </button>
    </form>
  );
}