export type ChecklistItem = {
  id: string;
  label: string;
  weight: number; // peso individual
  completed: boolean;
};

export function getChecklist(): ChecklistItem[] {
  return [
    // LGPD
    { id: "lgpd-min", label: "Minimização de dados", weight: 3, completed: false },
    { id: "lgpd-cons", label: "Consentimento claro", weight: 3, completed: false },
    { id: "lgpd-dir", label: "Direitos do titular", weight: 3, completed: false },
    { id: "lgpd-sec", label: "Segurança operacional", weight: 3, completed: false },

    // Direitos Autorais
    { id: "da-reg", label: "Registro e metadados completos", weight: 4, completed: false },
    { id: "da-evid", label: "Evidências + hash + OTS", weight: 4, completed: false },
    { id: "da-perm", label: "Permissões e coautoria", weight: 3, completed: false },

    // IA
    { id: "ia-transp", label: "Transparência no uso de IA", weight: 2, completed: false },
    { id: "ia-plagio", label: "Scanner de plágio concluído", weight: 3, completed: false },

    // Contratos
    { id: "ct-ass", label: "Contrato válido e assinado", weight: 3, completed: false },
    { id: "ct-cla", label: "Cláusulas conformes", weight: 3, completed: false },

    // Evidências
    { id: "ev-int", label: "Integridade e hash", weight: 2, completed: false },

    // Auditoria
    { id: "aud-log", label: "Logs essenciais registrados", weight: 2, completed: false },
  ];
}

export function getComplianceScore(): number {
  const items = getChecklist();

  const max = items.reduce((acc, i) => acc + i.weight, 0);
  const current = items
    .filter(i => i.completed)
    .reduce((acc, i) => acc + i.weight, 0);

  return Math.round((current / max) * 100);
}