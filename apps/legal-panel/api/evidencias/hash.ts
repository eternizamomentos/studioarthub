// apps/legal-panel/api/evidencias/hash.ts
import { NextResponse } from "next/server";

// =============================================================
// POST /api/evidencias/hash
// Aceita:
//  - file (multipart)
//  - ou: { texto: "..." }
// Retorna:
//  - sha256
//  - bytes (hex)
//  - tamanho
//  - payload para OTS
// =============================================================
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    // ----------------------------------------------------------
    // Caso seja upload de arquivo
    // ----------------------------------------------------------
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { ok: false, error: "Nenhum arquivo enviado." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const hash = await sha256(buffer);

      return NextResponse.json({
        ok: true,
        tipo: "arquivo",
        nome: file.name,
        mime: file.type,
        tamanho: file.size,
        sha256: hash,
        otsPayload: createOTSPayload(hash),
      });
    }

    // ----------------------------------------------------------
    // JSON: texto → hash
    // ----------------------------------------------------------
    const body = await request.json();

    if (!body?.texto) {
      return NextResponse.json(
        { ok: false, error: "Campo 'texto' é obrigatório." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(String(body.texto));
    const hash = await sha256(buffer);

    return NextResponse.json({
      ok: true,
      tipo: "texto",
      tamanho: buffer.length,
      sha256: hash,
      otsPayload: createOTSPayload(hash),
    });
  } catch (err) {
    console.error("[api/evidencias/hash] Erro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao gerar hash." },
      { status: 500 },
    );
  }
}

// =============================================================
// Utilitário SHA-256
// =============================================================
async function sha256(data: ArrayBuffer | Buffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data instanceof Buffer ? data : data,
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// =============================================================
// Criar payload para OpenTimestamp (um JSON leve e padronizado)
// =============================================================
function createOTSPayload(hash: string) {
  return {
    version: 1,
    algorithm: "sha256",
    hash: hash,
    createdAt: new Date().toISOString(),
  };
}