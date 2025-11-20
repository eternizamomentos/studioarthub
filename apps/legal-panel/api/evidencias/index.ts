// apps/legal-panel/api/evidencias/index.ts
import { NextResponse } from "next/server";

// ===================================================================
// TIPOS BASE — profissional, pronto para banco e domain services
// ===================================================================
export type EvidenciaTipo = "arquivo" | "print" | "audio" | "daw" | "contrato";

export interface EvidenciaDTO {
  id: string;
  obraId: string | null;
  nome: string;
  mime: string;
  tamanho: number;
  tipo: EvidenciaTipo;
  hashSha256: string;
  criadoEm: string; 
}

// ===================================================================
// MOCK PROFISSIONAL — será substituído pelo SQLite + OTS
// ===================================================================
function mockList(): EvidenciaDTO[] {
  const now = new Date().toISOString();

  return [
    {
      id: "evi-001",
      obraId: "obra-001",
      nome: "sessao_producao_r01.zip",
      mime: "application/zip",
      tamanho: 2381921,
      tipo: "daw",
      hashSha256:
        "f2f4ae8e91c321ccac99832b8e5fcddc0d658a76f2fdcd2e79e3a875b23aab99",
      criadoEm: now,
    },
    {
      id: "evi-002",
      obraId: "obra-002",
      nome: "print_autoria_telegram.png",
      mime: "image/png",
      tamanho: 192331,
      tipo: "print",
      hashSha256:
        "c91d91aae3a117009b71bb5dc947e6f3e394d6b4cb9e977d3c251f0bd9df33ca",
      criadoEm: now,
    },
  ];
}

// ===================================================================
// GET /api/evidencias
// filtros: obraId, tipo, q (texto)
// ===================================================================
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const obraId = searchParams.get("obraId");
  const tipo = searchParams.get("tipo") as EvidenciaTipo | null;
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";

  let lista = mockList();

  if (obraId) lista = lista.filter((e) => e.obraId === obraId);
  if (tipo) lista = lista.filter((e) => e.tipo === tipo);
  if (q) lista = lista.filter((e) => e.nome.toLowerCase().includes(q));

  return NextResponse.json({
    ok: true,
    total: lista.length,
    items: lista,
  });
}

// ===================================================================
// POST /api/evidencias
// Aceita: multipart/form-data
// Campos:
//   - file  (File)
//   - obraId (string)
//   - tipo ("arquivo" | "print" | "audio" | "daw" | "contrato")
// ===================================================================
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    // ---------------------------------------------------------------
    // 1) MULTIPART (uso real)
    // ---------------------------------------------------------------
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file") as File | null;
      const obraId = form.get("obraId")?.toString() || null;
      const tipo = (form.get("tipo") as EvidenciaTipo) || "arquivo";

      if (!file) {
        return NextResponse.json(
          { ok: false, error: "Nenhum arquivo enviado." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const hash = await sha256(buffer);

      const nova: EvidenciaDTO = {
        id: crypto.randomUUID(),
        obraId,
        nome: file.name,
        mime: file.type,
        tamanho: file.size,
        tipo,
        hashSha256: hash,
        criadoEm: new Date().toISOString(),
      };

      // Futuro:
      // - salvar arquivo no storage local/Cloudflare R2
      // - registrar hash em db/legal.sqlite
      // - disparar cadeia OTS automática

      return NextResponse.json({ ok: true, evidencia: nova }, { status: 201 });
    }

    // ---------------------------------------------------------------
    // 2) JSON (modo DEV)
    // ---------------------------------------------------------------
    const body = await request.json();

    const nome = String(body?.nome ?? "").trim();
    const mime = String(body?.mime ?? "application/octet-stream");
    const tamanho = Number(body?.tamanho ?? 0);
    const tipo = (body?.tipo as EvidenciaTipo) || "arquivo";
    const obraId = body?.obraId ?? null;

    if (!nome) {
      return NextResponse.json(
        { ok: false, error: "Campo nome é obrigatório." },
        { status: 400 },
      );
    }

    const hash = await sha256(Buffer.from(nome));

    const nova: EvidenciaDTO = {
      id: crypto.randomUUID(),
      obraId,
      nome,
      mime,
      tamanho,
      tipo,
      hashSha256: hash,
      criadoEm: new Date().toISOString(),
    };

    return NextResponse.json({ ok: true, evidencia: nova }, { status: 201 });
  } catch (err) {
    console.error("[api/evidencias] Erro POST:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao processar evidência." },
      { status: 500 },
    );
  }
}

// ===================================================================
// Utilitário — SHA-256 puro (sem dependências externas)
// ===================================================================
async function sha256(data: ArrayBuffer | Buffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data instanceof Buffer ? data : data,
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}