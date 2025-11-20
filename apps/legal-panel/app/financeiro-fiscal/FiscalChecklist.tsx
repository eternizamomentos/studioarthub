// apps/legal-panel/app/financeiro-fiscal/FiscalChecklist.tsx

"use client";

import { useState } from "react";

export default function FiscalChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const itens = [
    {
      id: "nf-01",
      categoria: "Notas Fiscais",
      texto: "Emitir nota fiscal para cada música/venda/prestação de serviço."
    },
    {
      id: "nf-02",
      categoria: "Notas Fiscais",
      texto: "Guardar XML e PDF de todas as notas emitidas."
    },
    {
      id: "tax-01",
      categoria: "Tributos",
      texto: "Recolher ISS dentro do prazo mensal e arquivar comprovante."
    },
    {
      id: "tax-02",
      categoria: "Tributos",
      texto: "Verificar enquadramento tributário adequado (MEI/Simples/etc.)."
    },
    {
      id: "roy-01",
      categoria: "Direitos Autorais",
      texto: "Registrar pagamentos de splits e repasses a parceiros."
    },
    {
      id: "roy-02",
      categoria: "Direitos Autorais",
      texto: "Guardar contratos e recibos comprovando repasses."
    },
    {
      id: "audit-01",
      categoria: "Auditoria Fiscal",
      texto: "Manter planilhas mensais de entradas e saídas auditáveis."
    },
    {
      id: "audit-02",
      categoria: "Auditoria Fiscal",
      texto: "Gerar relatório fiscal trimestral para o Painel Jurídico."
    },
  ];

  return (
    <ul className="legal-checklist">
      {itens.map((item) => (
        <li
          key={item.id}
          className="flex items-start justify-between gap-3"
        >
          <div>
            <span className="legal-check-tag">{item.categoria}</span>
            <p>{item.texto}</p>
          </div>

          {/* Checkbox premium */}
          <button
            onClick={() => toggle(item.id)}
            className={`legal-checkbox ${checked[item.id] ? "checked" : ""}`}
            aria-label="Marcar item"
          >
            {checked[item.id] && <span className="checkmark">✔</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}