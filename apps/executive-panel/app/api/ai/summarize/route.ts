import { NextResponse } from "next/server";

/* ============================================================
   SUMMARIZE ROUTE — VERSÃO PRO • STUDIO ART HUB
   - Compatível com output: export (sem dynamic)
   - IA altamente consistente com formatação fixa
   - Bullets 100% separados por linhas
   - Markdown premium estilo SAH
============================================================ */

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    /* ------------------------------------------------------------
       1. Validação de entrada
    ------------------------------------------------------------ */
    if (!text || text.trim().length < 8) {
      return NextResponse.json(
        { error: "Texto insuficiente para gerar resumo." },
        { status: 400 }
      );
    }

    /* ------------------------------------------------------------
       2. Validação da chave de API
    ------------------------------------------------------------ */
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("❌ GROQ_API_KEY ausente no servidor");
      return NextResponse.json(
        { error: "Configuração ausente: GROQ_API_KEY." },
        { status: 500 }
      );
    }

    /* ------------------------------------------------------------
       3. PROMPT OFICIAL (NOVA VERSÃO PREMIUM)
    ------------------------------------------------------------ */
    const systemPrompt = `
Você é o assistente executivo oficial do Studio Art Hub.
Sua missão é produzir **RESUMOS PREMIUM** extremamente bem organizados,
com estética Apple Notes + Notion e clareza executiva.

⚜️ ESTILO OBRIGATÓRIO:
- Tom sóbrio, executivo e direto
- Frases curtas, objetivas e limpas
- Zero emojis dentro das listas
- Markdown impecável
- Nunca usar texto corrido grande
- NUNCA juntar bullets na mesma linha

⚜️ FORMATO FIXO (sempre idêntico):

📌 **Visão Geral**

• Uma frase clara explicando o tema principal.

📌 **Pontos-Chave**

• Entre 3 e 6 bullets  
• Cada bullet sempre em linha separada  
• Sem repetições  
• Conteúdo essencial, direto e limpo  

📌 **Ações / Próximos Passos**

• Entre 1 e 4 bullets  
• Ações práticas e objetivas  
• Cada bullet em uma única linha  

⚜️ NUNCA remova os títulos.  
⚜️ NUNCA altere a estrutura.  
⚜️ NUNCA una bullets.  
`.trim();

    /* ------------------------------------------------------------
       4. Chamada à Groq API
    ------------------------------------------------------------ */
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Resuma a nota abaixo seguindo 100% o formato Premium:\n\n${text}`,
            },
          ],
          temperature: 0.2,
          max_tokens: 250,
        }),
      }
    );

    const data = await groqRes.json();

    /* ------------------------------------------------------------
       5. Tratamento de erros da Groq
    ------------------------------------------------------------ */
    if (data?.error) {
      return NextResponse.json(
        { error: "Erro da IA: " + data.error.message },
        { status: 500 }
      );
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Resposta inesperada da IA." },
        { status: 500 }
      );
    }

    /* ------------------------------------------------------------
       6. Retorno final
    ------------------------------------------------------------ */
    return NextResponse.json({
      summary: content.trim(),
    });
  } catch (err) {
    console.error("🔥 Erro interno summarize():", err);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}