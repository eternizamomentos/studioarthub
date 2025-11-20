// apps/legal-panel/app/evidencias/EvidenciaTimeline.tsx

export default function EvidenciaTimeline() {
    const eventos = [
      {
        id: 1,
        titulo: "Arquivo enviado",
        detalhe: "Upload inicial do arquivo 'stems_v3.zip'.",
        data: "2025-01-18 16:42",
        tipo: "upload",
      },
      {
        id: 2,
        titulo: "Hash SHA-256 gerado",
        detalhe: "Integridade verificada — hash anexado à evidência.",
        data: "2025-01-18 16:43",
        tipo: "hash",
      },
      {
        id: 3,
        titulo: "Carimbo OTS aplicado",
        detalhe: "Prova de existência registrada com OpenTimestamp.",
        data: "2025-01-18 16:44",
        tipo: "ots",
      },
      {
        id: 4,
        titulo: "Assinatura interna",
        detalhe: "Assinado pelo Studio Art Hub — auditoria interna.",
        data: "2025-01-18 17:10",
        tipo: "assinatura",
      },
    ];
  
    return (
      <div className="space-y-6">
  
        {eventos.map((e) => (
          <div
            key={e.id}
            className="relative border-l border-slate-700/60 pl-6 pb-6"
          >
            {/* Bolinha do timeline */}
            <div className="absolute -left-[7px] top-[4px] w-[13px] h-[13px] rounded-full bg-gold shadow-lg shadow-yellow-500/20" />
  
            {/* Conteúdo */}
            <h3 className="font-semibold text-slate-200">{e.titulo}</h3>
            <p className="text-slate-400 text-sm">{e.detalhe}</p>
            <p className="text-slate-500 text-xs mt-1">{e.data}</p>
          </div>
        ))}
  
      </div>
    );
  }  