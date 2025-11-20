type Alert = { level: "red"|"amber"|"green"; title: string; action: string };

const alerts: Alert[] = [
  { level:"amber", title:"Taxa de erro PIX acima de 2% (24h)", action:"Revisar CPF/document no payload" },
  { level:"green", title:"Aumento no tráfego orgânico (7d)", action:"Acelerar conteúdo /preco + FAQ" }
];

export default function Alerts() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-8">
      <div className="card">
        <h3 className="section-title">Alertas de Risco & Oportunidade</h3>
        <ul className="mt-4 space-y-3">
          {alerts.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`badge ${a.level==="green"?"badge-green":a.level==="amber"?"badge-amber":"badge-red"}`}>
                {a.level.toUpperCase()}
              </span>
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-sm subtle">Ação: {a.action}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}