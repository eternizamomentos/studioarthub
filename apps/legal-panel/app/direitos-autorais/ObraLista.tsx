// apps/legal-panel/app/direitos-autorais/ObraLista.tsx

export default function ObraLista() {
    const obrasMock = [
      {
        id: "1",
        titulo: "Luz do Cálculo",
        autores: "Josué / Coautor",
        status: "Registrada",
        evidencias: "4 arquivos",
      },
      {
        id: "2",
        titulo: "Melodia do Futuro",
        autores: "Josué",
        status: "Pendente de evidências",
        evidencias: "1 arquivo",
      },
      {
        id: "3",
        titulo: "Horizonte Azul",
        autores: "Josué / Ana",
        status: "Em validação",
        evidencias: "2 arquivos",
      },
    ];
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-slate-300/60 border-b border-slate-700/40">
              <th className="py-2 text-left font-medium">Título</th>
              <th className="py-2 text-left font-medium">Autores</th>
              <th className="py-2 text-left font-medium">Status</th>
              <th className="py-2 text-left font-medium">Evidências</th>
            </tr>
          </thead>
  
          <tbody>
            {obrasMock.map((obra) => (
              <tr
                key={obra.id}
                className="border-b border-slate-700/30 hover:bg-slate-800/40 transition"
              >
                <td className="py-2 font-semibold text-slate-100">
                  {obra.titulo}
                </td>
                <td className="py-2 text-slate-300">{obra.autores}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      obra.status === "Registrada"
                        ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40"
                        : obra.status === "Pendente de evidências"
                        ? "bg-orange-600/20 text-orange-300 border border-orange-500/40"
                        : "bg-yellow-600/20 text-yellow-300 border border-yellow-500/40"
                    }`}
                  >
                    {obra.status}
                  </span>
                </td>
                <td className="py-2 text-slate-300">{obra.evidencias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }  