// apps/legal-panel/app/contratos/ContratoLista.tsx

export default function ContratoLista() {
    // Mock — depois conectamos com API
    const contratos = [
      {
        id: "C-001",
        titulo: "Contrato de Prestação de Serviço – Música Personalizada",
        partes: "Studio Art Hub • Cliente Final",
        status: "Assinado",
        data: "2025-01-12",
        tipo: "Prestação de Serviço",
      },
      {
        id: "C-002",
        titulo: "Contrato de Parceria Artística – Produção Musical",
        partes: "Studio Art Hub • Músico Convidado",
        status: "Revisão",
        data: "2025-01-21",
        tipo: "Parceria",
      },
      {
        id: "C-003",
        titulo: "Autorização de Uso de Voz (IA Assistiva)",
        partes: "Artista • Studio Art Hub",
        status: "Pendente",
        data: "2025-01-25",
        tipo: "Autorização",
      },
    ];
  
    const statusClass = (s: string) =>
      s === "Assinado"
        ? "text-emerald-300"
        : s === "Revisão"
        ? "text-yellow-300"
        : "text-red-300";
  
    return (
      <div className="space-y-4">
        {contratos.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/40 hover:bg-slate-900/60 transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-slate-200 font-semibold">{c.titulo}</h3>
              <span className={`text-sm font-semibold ${statusClass(c.status)}`}>
                {c.status}
              </span>
            </div>
  
            <p className="text-slate-400 text-sm">{c.partes}</p>
  
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>{c.tipo}</span>
              <span>{c.data}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }  