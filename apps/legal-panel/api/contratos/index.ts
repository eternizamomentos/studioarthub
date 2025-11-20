import { NextResponse } from "next/server";

// ========================================================================
// GET /api/contratos
// Lista todos os contratos existentes (in-memory por enquanto)
// ========================================================================
let CONTRATOS: any[] = [];   // Será substituído por SQLite no módulo 'db/'

export async function GET() {
  try {
    return NextResponse.json(
      {
        ok: true,
        total: CONTRATOS.length,
        contratos: CONTRATOS,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/contratos] GET erro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao listar contratos." },
      { status: 500 }
    );
  }
}

// ========================================================================
// POST /api/contratos
// Cria novo contrato (rascunho)
// ========================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const titulo = String(body?.titulo || "").trim();
    const partes = Array.isArray(body?.partes) ? body.partes : [];
    const conteudo = String(body?.conteudo || "").trim();
    const status = body?.status || "rascunho";

    if (!titulo) {
      return NextResponse.json(
        { ok: false, error: "Título do contrato é obrigatório." },
        { status: 400 }
      );
    }

    const novoContrato = {
      id: crypto.randomUUID(),
      titulo,
      partes,
      conteudo,
      status,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    CONTRATOS.push(novoContrato);

    return NextResponse.json(
      {
        ok: true,
        contrato: novoContrato,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/contratos] POST erro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao criar contrato." },
      { status: 500 }
    );
  }
}