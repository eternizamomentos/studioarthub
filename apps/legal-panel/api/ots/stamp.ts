import { NextResponse } from "next/server";

// ================================================================
// POST /api/ots/stamp
// Envia hash SHA-256 para OpenTimestamp (opentimestamps.org)
// ================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sha256 = String(body?.sha256 || "").trim();
    const metadata = body?.metadata ?? null;

    if (!sha256 || sha256.length !== 64) {
      return NextResponse.json(
        { ok: false, error: "Hash SHA-256 inválido." },
        { status: 400 }
      );
    }

    // --------------------------------------------------------------
    // 1) Preparar payload OTS (formato usado pelo 'ots' CLI)
    // --------------------------------------------------------------
    const payload = sha256ToHexBuffer(sha256);

    // --------------------------------------------------------------
    // 2) Envio ao servidor OTS
    // --------------------------------------------------------------
    const url = "https://alice.btc.calendar.opentimestamps.org/stamp";
    const res = await fetch(url, {
      method: "POST",
      body: payload, // OTS exige hash bruto (32 bytes)
      headers: {
        "Content-Type": "application/octet-stream",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Falha ao enviar ao servidor OTS (status ${res.status}).`,
        },
        { status: 502 }
      );
    }

    const otsBuffer = Buffer.from(await res.arrayBuffer());

    const response = {
      ok: true,
      id: crypto.randomUUID(),
      sha256,
      stampedAt: new Date().toISOString(),
      otsProofBase64: otsBuffer.toString("base64"),
      otsProofHex: otsBuffer.toString("hex"),
      metadata,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("[api/ots/stamp] erro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao gerar timestamp OTS." },
      { status: 500 }
    );
  }
}

// ================================================================
// Utilitário — converte SHA-256 hex → ArrayBuffer (32 bytes)
// ================================================================
function sha256ToHexBuffer(hex: string) {
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );
  return bytes;
}