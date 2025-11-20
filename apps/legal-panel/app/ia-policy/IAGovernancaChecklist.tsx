// apps/legal-panel/app/ia-policy/IAGovernancaChecklist.tsx

"use client";

import { useMemo, useState } from "react";

type GrupoChecklist = {
  titulo: string;
  descricao: string;
  itens: string[];
};

const GRUPOS: GrupoChecklist[] = [
  {
    titulo: "Transparência com o cliente",
    descricao: "O cliente sabe exatamente quando e como a IA será usada no projeto.",
    itens: [
      "Briefing menciona explicitamente o uso de IA (voz, letra, arranjo ou master).",
      "O contrato contém cláusulas claras sobre uso de IA e limites de responsabilidade.",
      "O cliente aprovou, por escrito, o uso de IA no projeto.",
    ],
  },
  {
    titulo: "Direitos de voz, imagem e autoria",
    descricao: "Proteção contra uso indevido de vozes e obras de terceiros.",
    itens: [
      "Nenhuma voz é treinada ou simulada com base em artista reconhecido sem autorização.",
      "Samples, loops e referências são licenciados ou de bancos autorizados.",
      "Letras geradas por IA são revisadas para evitar trechos claramente copiados.",
    ],
  },
  {
    titulo: "Risco reputacional e jurídico",
    descricao: "Prevenção de danos à marca Studio Art Hub e aos clientes.",
    itens: [
      "Conteúdo é revisado para evitar temas sensíveis, discriminatórios ou ofensivos.",
      "Foi feita ao menos uma checagem de similaridade/plágio para faixas de maior exposição.",
      "O projeto possui plano de resposta caso surja contestação futura.",
    ],
  },
];

export default function IAGovernancaChecklist() {
  const [checks, setChecks] = useState<boolean[][]>(
    () => GRUPOS.map((g) => g.itens.map(() => false))
  );

  function toggle(grupoIndex: number, itemIndex: number) {
    setChecks((prev) => {
      const clone = prev.map((linha) => [...linha]);
      clone[grupoIndex][itemIndex] = !clone[grupoIndex][itemIndex];
      return clone;
    });
  }

  const percentualTotal = useMemo(() => {
    const flat = checks.flat();
    const total = flat.length || 1;
    const marcados = flat.filter(Boolean).length;
    return Math.round((marcados / total) * 100);
  }, [checks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Checklist de governança de IA</span>
        <span>
          Cumprimento atual:{" "}
          <span className="text-gold font-semibold">
            {percentualTotal}%
          </span>
        </span>
      </div>

      <div className="space-y-4">
        {GRUPOS.map((grupo, gIdx) => (
          <div
            key={grupo.titulo}
            className="rounded-xl bg-slate-950/40 border border-slate-700/60 p-3.5 space-y-2"
          >
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-slate-400">
                {grupo.titulo}
              </p>
              <p className="text-[0.8rem] text-slate-300">
                {grupo.descricao}
              </p>
            </div>

            <ul className="mt-2 space-y-1.5">
              {grupo.itens.map((item, iIdx) => (
                <li key={iIdx}>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checks[gIdx][iIdx]}
                      onChange={() => toggle(gIdx, iIdx)}
                      className="mt-[3px] h-4 w-4 accent-gold"
                    />
                    <span className="text-[0.82rem] text-slate-200 leading-relaxed">
                      {item}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}