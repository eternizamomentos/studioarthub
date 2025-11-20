// apps/legal-panel/app/direitos-autorais/ObraDetalhe.tsx

export default function ObraDetalhe() {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-serif text-gold">Detalhes da Obra</h2>
  
        <p className="text-slate-300/90">
          Aqui mostraremos metadados completos, timeline forense, autores,
          splits, contratos anexados, hashes, registros e auditoria técnica.
        </p>
  
        <div className="legal-card legal-border-gold">
          <h3 className="legal-card-title">Em breve</h3>
          <p className="legal-card-description">
            Esta página exibirá informações completas da obra selecionada.
          </p>
        </div>
      </div>
    );
  }  