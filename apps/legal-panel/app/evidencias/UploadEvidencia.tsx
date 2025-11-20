// apps/legal-panel/app/evidencias/UploadEvidencia.tsx

"use client";

import { useState } from "react";

export default function UploadEvidencia() {
  const [files, setFiles] = useState<File[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
  }

  function formatBytes(bytes: number) {
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
  }

  return (
    <div className="space-y-6">

      {/* Input estilizado premium */}
      <label className="block">
        <div className="border border-slate-600/40 rounded-xl p-5 text-center bg-slate-900/40 cursor-pointer hover:bg-slate-900/60 transition">
          <p className="text-slate-200 font-medium mb-1">
            Clique para anexar evidências
          </p>
          <p className="text-slate-400 text-sm">
            Suporta imagens, PDFs, áudios, stems, ZIPs e sessões DAW
          </p>
        </div>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Lista dos arquivos selecionados */}
      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between"
            >
              <div>
                <p className="text-slate-200 font-medium">{file.name}</p>
                <p className="text-slate-400 text-xs">
                  {file.type || "arquivo"} • {formatBytes(file.size)}
                </p>
              </div>

              <span className="px-3 py-1 rounded-md bg-slate-700/60 text-slate-300 text-xs border border-slate-600/50">
                SHA-256 pendente
              </span>
            </div>
          ))}

          <button
            className="px-5 py-2 rounded-lg bg-gold/80 text-slate-900 font-semibold hover:bg-gold transition w-full"
          >
            Registrar evidências
          </button>
        </div>
      )}
    </div>
  );
}