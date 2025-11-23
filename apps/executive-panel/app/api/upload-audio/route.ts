// apps/executive-panel/app/api/upload-audio/route.ts
import { NextResponse } from "next/server";
import { R2, sanitizeFileName } from "@/lib/r2";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const cleanName = sanitizeFileName(file.name);
    const key = `audio/${Date.now()}-${cleanName}`;

    // Upload REAL com metadados corretos
    await R2.putObject({
      key,
      value: buffer,
      contentType: file.type || "audio/mpeg",
      cacheControl: "public, max-age=31536000",
      downloadName: cleanName,
    });

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({
      url: publicUrl,
      name: cleanName,
      size: file.size,
      type: file.type,
    });

  } catch (err) {
    console.error("Erro Upload:", err);
    return NextResponse.json({ error: "Falha no upload" }, { status: 500 });
  }
}