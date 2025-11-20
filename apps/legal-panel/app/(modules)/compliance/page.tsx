import ComplianceScoreRing from "./ComplianceScoreRing";
import MedalhaConformidade from "./MedalhaConformidade";

// Importa regras
import { getComplianceScore } from "@/domain/rules/complianceRules";

export default function CompliancePage() {
  const score = getComplianceScore(); // regra isolada

  return (
    <section className="mx-auto max-w-5xl px-6 mt-10">
      <h1 className="section-title">Compliance Jurídico</h1>
      <p className="text-pure/60 max-w-2xl mt-2">
        Avaliação automática de conformidade jurídica, direitos autorais, IA,
        contratos, evidências e práticas internas.
      </p>

      <div className="mt-10 flex items-center gap-12">
        <ComplianceScoreRing value={score} size={180} stroke={14} />

        <div className="flex flex-col gap-3">
          <MedalhaConformidade score={score} />

          <p className="text-sm text-pure/70 max-w-sm">
            Índice calculado com base em políticas internas, obrigações legais,
            evidências armazenadas e parâmetros regulatórios.
          </p>
        </div>
      </div>
    </section>
  );
}