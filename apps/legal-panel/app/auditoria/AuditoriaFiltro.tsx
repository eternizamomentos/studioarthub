// apps/legal-panel/app/auditoria/AuditoriaFiltro.tsx

"use client";

import { useState } from "react";

export default function AuditoriaFiltro() {
  const [tipo, setTipo] = useState("todos");
  const [modulo, setModulo] = useState("todos");
  const [risco, setRisco] = useState("todos");

  return (
    <div className="grid gap-4 md:grid-cols-3">
      
      {/* TIPO */}
      <div className="flex flex-col gap-1">
        <label className="text-xs tracking-wide uppercase text-slate-400">
          Tipo do evento
        </label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="legal-select"
        >
          <option value="todos">Todos</option>
          <option value="atualizacao">Atualização</option>
          <option value="criacao">Criação</option>
          <option value="remocao">Remoção</option>
          <option value="acesso">Acesso</option>
        </select>
      </div>

      {/* MÓDULO */}
      <div className="flex flex-col gap-1">
        <label className="text-xs tracking-wide uppercase text-slate-400">
          Módulo jurídico
        </label>
        <select
          value={modulo}
          onChange={(e) => setModulo(e.target.value)}
          className="legal-select"
        >
          <option value="todos">Todos</option>
          <option value="direitos-autorais">Direitos Autorais</option>
          <option value="evidencias">Evidências</option>
          <option value="contratos">Contratos</option>
          <option value="lgpd">LGPD</option>
          <option value="ia">Política de IA</option>
        </select>
      </div>

      {/* RISCO */}
      <div className="flex flex-col gap-1">
        <label className="text-xs tracking-wide uppercase text-slate-400">
          Severidade
        </label>
        <select
          value={risco}
          onChange={(e) => setRisco(e.target.value)}
          className="legal-select"
        >
          <option value="todos">Todos</option>
          <option value="baixo">Baixo</option>
          <option value="medio">Médio</option>
          <option value="alto">Alto</option>
        </select>
      </div>

    </div>
  );
}