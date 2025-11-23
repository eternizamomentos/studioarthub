// apps/executive-panel/app/api/audio/route.ts
import { NextResponse } from "next/server";
import { R2 } from "@/lib/r2";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("file");

    if (!key) {
      return NextResponse.json({ error: "Arquivo não especificado" }, { status: 400 });
    }

    // Baixar do R2
    const file = await R2.getObject(key);

    if (!file) {
      return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
    }

    return new NextResponse(file.body as any, {
      status: 200,
      headers: {
        "Content-Type": file.contentType ?? "audio/mpeg",
        "Content-Length": file.size?.toString() ?? "",
        "Cross-Origin-Resource-Policy": "cross-origin",
        "Cross-Origin-Embedder-Policy": "unsafe-none",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (err: any) {
    console.error("Erro GET /api/audio:", err);
    return NextResponse.json({ error: "Falha ao carregar áudio" }, { status: 500 });
  }
}