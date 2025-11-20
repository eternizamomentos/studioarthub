// apps/legal-panel/app/contratos/ContratoEditorIA.tsx

"use client";

import { useState } from "react";

export default function ContratoEditorIA() {
  const [prompt, setPrompt] = useState("");
  const [resultado, setResultado] = useState("");

  async function gerarMinuta() {
    if (!prompt.trim()) return;

    // (placeholder) — AQUI entra sua API IA futura
    setResultado(
      `Resultado gerado pela IA com base em: "${prompt}"\n\n[Exemplo de minuta gerada automaticamente...]`
    );
  }

  return (
    <div className="space-y-5">

      {/* Input premium */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Descreva o tipo de contrato, partes, contexto e objetivo..."
        className="w-full h-32 p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-gold placeholder-slate-500"
      />

      <button
        onClick={gerarMinuta}
        className="px-5 py-2 rounded-lg bg-gold text-slate-900 font-semibold hover:bg-yellow-300 transition"
      >
        Gerar minuta com IA
      </button>

      {/* Resultado */}
      {resultado && (
        <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-300 text-sm whitespace-pre-wrap">
          {resultado}
        </div>
      )}
    </div>
  );
}