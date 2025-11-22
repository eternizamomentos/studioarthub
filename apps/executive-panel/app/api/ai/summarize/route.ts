import { NextResponse } from "next/server";

export const runtime = "edge"; // ultra rápido

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Texto vazio — nada para resumir." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY não configurada." },
        { status: 500 }
      );
    }

    // 🔥 Chamada ao modelo Llama-3-70B (GRÁTIS + mais forte)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente de notas premium. Gere resumos curtos, objetivos e elegantes.",
          },
          {
            role: "user",
            content: `Resuma o seguinte texto:\n\n${text}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const json = await response.json();
    const summary = json.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}