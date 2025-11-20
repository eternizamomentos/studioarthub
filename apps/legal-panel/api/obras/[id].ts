// apps/legal-panel/api/obras/[id].ts
import { NextResponse } from "next/server";
import type { ObraDTO, ObraStatus, ObraTipo } from "./index";

// Para manter consistência com o mock da lista
function getMockObraById(id: string): ObraDTO | null {
  const all = ((): ObraDTO[] => {
    const now = new Date().toISOString();
    return [
      {
        id: "obra-001",
        titulo: "Luz do Cálculo (Lo-fi ITA)",
        tipo: "musica",
        status: "registrada",
        autores: "Studio Art Hub ft. Josué",
        isrc: "BR-SAH-24-00001",
        tags: ["lofi", "estudo", "ita", "instrumental"],
        criadoEm: now,
        atualizadoEm: now,
      },
      {
        id: "obra-002",
        titulo: "Carta para o Futuro (Versão Voz + Piano)",
        tipo: "musica",
        status: "em_validacao",
        autores: "Studio Art Hub",
        tags: ["voz", "piano", "emocional"],
        criadoEm: now,
        atualizadoEm: now,
      },
      {
        id: "obra-003",
        titulo: "Template de Beat Chill para Encomendas",
        tipo: "beat",
        status: "rascunho",
        autores: "Studio Art Hub",
        tags: ["beat", "lofihiphop", "encomendas"],
        criadoEm: now,
        atualizadoEm: now,
      },
    ];
  })();

  return all.find((o) => o.id === id) ?? null;
}

// ============================================================
// GET /api/obras/:id
// ============================================================
export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;

  const obra = getMockObraById(id);

  if (!obra) {
    return NextResponse.json(
      {
        ok: false,
        error: "Obra não encontrada.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    obra,
  });
}

// ============================================================
// PUT /api/obras/:id
// Atualiza dados de uma obra (mock — ecoa dados)
// Futuro: validar contra domínio + persistência real
// ============================================================
export async function PUT(
  request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;

  try {
    const body = await request.json();

    const titulo =
      body?.titulo !== undefined
        ? String(body.titulo).trim()
        : undefined;
    const tipo = body?.tipo as ObraTipo | undefined;
    const status = body?.status as ObraStatus | undefined;
    const autores =
      body?.autores !== undefined
        ? String(body.autores).trim()
        : undefined;
    const isrc =
      body?.isrc !== undefined ? String(body.isrc) : undefined;
    const tags = Array.isArray(body?.tags)
      ? body.tags.map((t: unknown) => String(t))
      : undefined;

    const existente = getMockObraById(id);

    if (!existente) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Obra não encontrada para atualização (no futuro, será checado no banco).",
        },
        { status: 404 },
      );
    }

    const atualizado: ObraDTO = {
      ...existente,
      titulo: titulo ?? existente.titulo,
      tipo: tipo ?? existente.tipo,
      status: status ?? existente.status,
      autores: autores ?? existente.autores,
      isrc: isrc ?? existente.isrc,
      tags: tags ?? existente.tags,
      atualizadoEm: new Date().toISOString(),
    };

    // Futuro: persistir em DB
    return NextResponse.json({
      ok: true,
      obra: atualizado,
    });
  } catch (error) {
    console.error("[api/obras/:id] Erro no PUT:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Erro ao processar atualização da obra.",
      },
      { status: 500 },
    );
  }
}

// ============================================================
// DELETE /api/obras/:id
// Marca exclusão (mock). Futuro: soft-delete / auditoria.
// ============================================================
export async function DELETE(
  _request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;

  // Futuro: registrar em AuditoriaService + remover/soft-delete no DB.
  // Aqui apenas retornamos ok para manter contrato simples.
  return NextResponse.json({
    ok: true,
    deletedId: id,
    message:
      "No ambiente atual (mock), a exclusão é apenas simbólica. Futuro: integrar com Auditoria + SQLite.",
  });
}