// apps/legal-panel/app/auditoria/LogAuditoriaTabela.tsx

"use client";

const MOCK_LOGS = [
  {
    id: "EVT-001",
    modulo: "direitos-autorais",
    acao: "Cadastro de obra",
    risco: "baixo",
    horario: "12/02/2025 14:22",
  },
  {
    id: "EVT-002",
    modulo: "evidencias",
    acao: "Upload de arquivo",
    risco: "medio",
    horario: "12/02/2025 14:28",
  },
  {
    id: "EVT-003",
    modulo: "contratos",
    acao: "Geração de minuta via IA",
    risco: "alto",
    horario: "12/02/2025 14:33",
  },
];

export default function LogAuditoriaTabela() {
  return (
    <div className="overflow-x-auto">
      <table className="legal-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Módulo</th>
            <th>Ação</th>
            <th>Risco</th>
            <th>Horário</th>
          </tr>
        </thead>

        <tbody>
          {MOCK_LOGS.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.modulo}</td>
              <td>{log.acao}</td>
              <td>
                <span className={`legal-risk-${log.risco}`}>
                  {log.risco}
                </span>
              </td>
              <td>{log.horario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}