// apps/legal-panel/app/contratos/ContratoChecklist.tsx

"use client";

import { useState } from "react";

export default function ContratoChecklist() {
  const itens = [
    "As partes estão corretamente identificadas?",
    "O objeto do contrato está claro e específico?",
    "As responsabilidades de cada parte estão definidas?",
    "Existe cláusula de uso de IA (se relevante)?",
    "Existe cláusula de direitos autorais e propriedade intelectual?",
    "Existe cláusula de confidencialidade?",
    "Existe cláusula de foro e legislação aplicável?",
    "O contrato possui anexos mencionados no texto?",
  ];

  const [checked, setChecked] = useState<boolean[]>(
    Array(itens.length).fill(false)
  );

  function toggle(i: number) {
    const clone = [...checked];
    clone[i] = !clone[i];
    setChecked(clone);
  }

  return (
    <div className="space-y-3">
      {itens.map((item, i) => (
        <label
          key={i}
          className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-700/50 hover:bg-slate-900/60 transition cursor-pointer"
        >
          <input
            type="checkbox"
            checked={checked[i]}
            onChange={() => toggle(i)}
            className="mt-1 h-4 w-4 accent-gold"
          />

          <span className="text-slate-200 text-sm">{item}</span>
        </label>
      ))}
    </div>
  );
}