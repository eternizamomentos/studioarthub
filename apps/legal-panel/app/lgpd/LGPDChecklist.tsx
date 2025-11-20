// apps/legal-panel/app/lgpd/LGPDChecklist.tsx

"use client";

import { useState, useMemo } from "react";

type SecaoChecklist = {
  titulo: string;
  itens: string[];
};

const SECOES: SecaoChecklist[] = [
  {
    titulo: "Coleta de dados",
    itens: [
      "Informei claramente por que estou coletando esse dado.",
      "Coletei somente o mínimo necessário para o fluxo.",
      "O formulário não inclui dados sensíveis sem motivo válido.",
    ],
  },
  {
    titulo: "Transparência",
    itens: [
      "Existe aviso visível informando sobre coleta (LGPD Notice).",
      "O usuário sabe para onde os dados irão.",
      "A base legal está clara (consentimento, execução contratual, etc.).",
    ],
  },
  {
    titulo: "Armazenamento e segurança",
    itens: [
      "Nenhum dado pessoal é logado em plaintext.",
      "Os dados são armazenados somente pelo tempo necessário.",
      "Acesso a dados internos é restrito (senhas, chaves, KV).",
    ],
  },
];

export default function LGPDChecklist() {
  const [checks, setChecks] = useState<boolean[][]>(
    () => SECOES.map((s) => s.itens.map(() => false))
  );

  function toggle(grupo: number, item: number) {
    setChecks((prev) => {
      const clone = prev.map((linha) => [...linha]);
      clone[grupo][item] = !clone[grupo][item];
      return clone;
    });
  }

  const percentual = useMemo(() => {
    const flat = checks.flat();
    const total = flat.length;
    const marcados = flat.filter(Boolean).length;
    return Math.round((marcados / total) * 100);
  }, [checks]);

  return (
    <div className="space-y-4">
      {/* Header mini progress */}
      <p className="text-xs text-slate-400 flex justify-between">
        <span>Avaliação de conformidade</span>
        <span className="text-gold font-semibold">{percentual}%</span>
      </p>

      {/* Grupos */}
      <div className="space-y-4">
        {SECOES.map((secao, sIdx) => (
          <div
            key={secao.titulo}
            className="rounded-xl bg-slate-950/40 border border-slate-700/60 p-3.5"
          >
            <p className="text-xs tracking-[0.16em] uppercase text-slate-400">
              {secao.titulo}
            </p>

            <ul className="mt-2 space-y-1.5">
              {secao.itens.map((item, iIdx) => (
                <li key={iIdx}>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checks[sIdx][iIdx]}
                      onChange={() => toggle(sIdx, iIdx)}
                      className="mt-[2px] h-4 w-4 accent-gold"
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