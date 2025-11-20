// apps/legal-panel/api/obras/index.ts
import { NextResponse } from "next/server";

export type ObraStatus = "rascunho" | "em_validacao" | "registrada" | "risco";
export type ObraTipo = "musica" | "letra" | "beat" | "arranjo";

export interface ObraDTO {
  id: string;
  titulo: string;
  tipo: ObraTipo;
  status: ObraStatus;
  autores: string;
  isrc?: string;
  tags?: string[];
  criadoEm: string;      // ISO
  atualizadoEm: string;  // ISO
}

// ===================================================================
// MOCK PROFISSIONAL — será substituído pelo SQLite + domain services
// ===================================================================
function getMockObras(): ObraDTO[] {
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
}

// ===================================================================
// GET /api/obras
// Lista obras, com filtros simples por status, tipo e busca textual
// ===================================================================
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as ObraStatus | null;
  const tipo = searchParams.get("tipo") as ObraTipo | null;
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  let obras = getMockObras();

  if (status) {
    obras = obras.filter((o) => o.status === status);
  }

  if (tipo) {
    obras = obras.filter((o) => o.tipo === tipo);
  }

  if (q) {
    obras = obras.filter((o) => {
      const base =
        `${o.titulo} ${o.autores} ${(o.tags || []).join(" ")}`.toLowerCase();
      return base.includes(q);
    });
  }

  return NextResponse.json({
    ok: true,
    total: obras.length,
    items: obras,
  });
}

// ===================================================================
// POST /api/obras
// Cria uma nova obra (apenas ecoa payload com id gerado)
// Futuro: persistir em SQLite / domain services
// ===================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const titulo = (body?.titulo ?? "").toString().trim();
    const tipo = body?.tipo as ObraTipo | undefined;
    const autores = (body?.autores ?? "").toString().trim();
    const isrc = body?.isrc ? String(body.isrc) : undefined;
    const tags = Array.isArray(body?.tags)
      ? body.tags.map((t: unknown) => String(t))
      : undefined;

    if (!titulo || !tipo || !autores) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Campos obrigatórios ausentes: título, tipo e autores são necessários.",
        },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const novaObra: ObraDTO = {
      id,
      titulo,
      tipo,
      status: "rascunho", // padrão inicial
      autores,
      isrc,
      tags,
      criadoEm: now,
      atualizadoEm: now,
    };

    // Futuro: salvar em DB
    return NextResponse.json(
      {
        ok: true,
        obra: novaObra,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/obras] Erro no POST:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Erro ao processar requisição de criação de obra.",
      },
      { status: 500 },
    );
  }
}