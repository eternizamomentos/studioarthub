"use client";

export type AIInsight = {
  id: string;
  text: string;
  severity: "info" | "warning" | "critical";
};

export async function analyzeTaskAI({
  title,
  description,
  due,
  gut,
  attachments,
}: {
  title: string;
  description?: string;
  due: string;
  gut: { g: number; u: number; t: number };
  attachments?: { name: string; type: string }[];
}): Promise<AIInsight[]> {

  // Simulação local — pode ser trocado por GPT-4.1 ou outro modelo
  const insights: AIInsight[] = [];

  const today = new Date();
  const deadline = new Date(due);
  const daysLeft = Math.floor((deadline.getTime() - today.getTime()) / 86400000);

  // 🔍 Análise 1 — risco de prazo
  if (daysLeft <= 2) {
    insights.push({
      id: crypto.randomUUID(),
      text: `O prazo está muito curto (${daysLeft} dias). Considere revisar.`,
      severity: "warning",
    });
  }

  // 🔍 Análise 2 — descrição muito curta
  if (!description || description.trim().length < 20) {
    insights.push({
      id: crypto.randomUUID(),
      text: "A descrição está muito curta. Talvez seja melhor detalhar melhor os passos.",
      severity: "info",
    });
  }

  // 🔍 Análise 3 — prioridade crítica
  const gutScore = gut.g * gut.u * gut.t;
  if (gutScore >= 75) {
    insights.push({
      id: crypto.randomUUID(),
      text: "Essa tarefa possui prioridade crítica pelo GUT. Recomenda-se iniciar o quanto antes.",
      severity: "critical",
    });
  }

  // 🔍 Análise 4 — anexos reconhecidos
  if (attachments && attachments.length > 0) {
    insights.push({
      id: crypto.randomUUID(),
      text: `Foram encontrados ${attachments.length} anexo(s). Talvez queira revisar ou categorizar.`,
      severity: "info",
    });
  }

  // 🔍 Análise 5 — título genérico
  const genericWords = ["ajustar", "update", "coisa", "refatorar", "melhorar"];
  if (genericWords.some((w) => title.toLowerCase().includes(w))) {
    insights.push({
      id: crypto.randomUUID(),
      text: "O título parece genérico. Títulos claros facilitam o entendimento da equipe.",
      severity: "info",
    });
  }

  return insights;
}