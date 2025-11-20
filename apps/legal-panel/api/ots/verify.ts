import { NextResponse } from "next/server";

// =====================================================================
// POST /api/ots/verify
// Verifica prova OTS de timestamp de arquivo/hash
// =====================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const otsBase64 = String(body?.ots || "").trim();
    if (!otsBase64) {
      return NextResponse.json(
        { ok: false, error: "Prova OTS (base64) é obrigatória." },
        { status: 400 }
      );
    }

    const otsBuffer = Buffer.from(otsBase64, "base64");

    // -----------------------------------------------------------------
    // Envio ao servidor de verificação
    // -----------------------------------------------------------------
    const url = "https://alice.btc.calendar.opentimestamps.org/verify";

    const res = await fetch(url, {
      method: "POST",
      body: otsBuffer,
      headers: {
        "Content-Type": "application/octet-stream",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Falha ao verificar prova OTS (status ${res.status}).`,
        },
        { status: 502 }
      );
    }

    const result = await res.json().catch(() => null);

    // Caso a prova não esteja completa ainda
    if (!result) {
      return NextResponse.json({
        ok: true,
        status: "pending",
        message: "A prova OTS ainda não foi ancorada em bloco Bitcoin.",
        verifiedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      status: result.status ?? "verified",
      bitcoinBlock: result?.bitcoin ? result.bitcoin.block : null,
      bitcoinTimestamp: result?.bitcoin ? result.bitcoin.timestamp : null,
      expandedProof: result,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[api/ots/verify] erro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno na verificação OTS." },
      { status: 500 }
    );
  }
}