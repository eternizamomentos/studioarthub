// apps/legal-panel/app/ia-policy/ScannerPlagioIA.tsx

"use client";

import { useState } from "react";

type FerramentaScanner = "nenhuma" | "audio" | "letra";

export default function ScannerPlagioIA() {
  const [ferramenta, setFerramenta] = useState<FerramentaScanner>("nenhuma");
  const [inputDescricao, setInputDescricao] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function executarScanner(e: React.FormEvent) {
    e.preventDefault();
    setResultado(null);

    if (!inputDescricao.trim() || ferramenta === "nenhuma") return;

    setLoading(true);

    // Placeholder: aqui, futuramente, você chama sua API real de scanner
    setTimeout(() => {
      setLoading(false);
      setResultado(
        `Simulação de relatório de similaridade para: "${inputDescricao}".\n\n• Ferramenta usada: ${
          ferramenta === "audio" ? "Scanner de áudio" : "Scanner de letra"
        }.\n• Similaridade relevante não detectada acima do limiar definido.\n• Recomendação: registrar esta consulta no módulo de Evidências e manter o relatório anexado à obra.`
      );
    }, 900);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={executarScanner} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
            Tipo de análise
          </label>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFerramenta("audio")}
              className={`px-3 py-1.5 rounded-full border text-[0.72rem] uppercase tracking-[0.18em] ${
                ferramenta === "audio"
                  ? "bg-gold text-slate-900 border-gold"
                  : "bg-slate-950/30 text-slate-300 border-slate-700/60 hover:border-gold/60"
              }`}
            >
              Áudio
            </button>
            <button
              type="button"
              onClick={() => setFerramenta("letra")}
              className={`px-3 py-1.5 rounded-full border text-[0.72rem] uppercase tracking-[0.18em] ${
                ferramenta === "letra"
                  ? "bg-gold text-slate-900 border-gold"
                  : "bg-slate-950/30 text-slate-300 border-slate-700/60 hover:border-gold/60"
              }`}
            >
              Letra
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
            Arquivo / descrição
          </label>
          <textarea
            value={inputDescricao}
            onChange={(e) => setInputDescricao(e.target.value)}
            placeholder="Descreva o arquivo, cole um trecho da letra ou informe o identificador interno da faixa..."
            className="w-full h-24 rounded-lg bg-slate-950/40 border border-slate-700/60 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold"
          />
        </div>

        <button
          type="submit"
          disabled={
            loading || !inputDescricao.trim() || ferramenta === "nenhuma"
          }
          className="px-4 py-2 rounded-lg bg-gold text-slate-900 text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-300 transition"
        >
          {loading ? "Executando análise…" : "Executar scanner de similaridade"}
        </button>
      </form>

      {resultado && (
        <div className="mt-2 rounded-lg border border-slate-700/60 bg-slate-950/50 px-3.5 py-3 text-[0.8rem] text-slate-200 whitespace-pre-wrap">
          {resultado}
        </div>
      )}
    </div>
  );
}