"use client";

import { useState, useRef } from "react";
import { useNotes } from "./NotesProvider";
import WaveformPlayer from "./WaveformPlayer";

type AudioItem = {
  name: string;
  size: number;
  url: string;
  type?: string;
};

/* ============================================================
   IDENTIFICA SE A URL É BASE64 (gravação) OU EXTERNA (upload)
============================================================ */
function isBase64Url(url: string) {
  return url?.startsWith("data:audio/");
}

/* ============================================================
   EXTRAI CHAVE DO ARQUIVO PARA O ENDPOINT /api/audio
============================================================ */
function extractKeyFromUrl(url?: string) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/(audio\/[^?#]+)/);
  return match ? match[1] : url;
}

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */
export default function AudioSection({ noteId }: { noteId: string }) {
  const { notes, updateNote } = useNotes();
  const note = notes.find((n) => n.id === noteId);
  if (!note) return null;

  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  // Normaliza note.audio (string[]) para AudioItem[] para exibição
  const normalizeAudio = (audio: string[] | undefined): AudioItem[] => {
    if (!audio) return [];
    return audio.map((url) => ({
      name: url.includes("audio/") ? url.split("/").pop() || "Áudio" : "Gravação de áudio.webm",
      size: 0,
      url,
      type: url.startsWith("data:audio/") ? "audio/webm" : "audio/*",
    }));
  };

  const attachments: AudioItem[] = normalizeAudio(note.audio);

  function handleDeleteAudio(index: number) {
    const currentNote = notes.find((n) => n.id === noteId);
    if (!currentNote) return;
    const currentUrls = currentNote.audio ?? [];
    const updated = [...currentUrls];
    updated.splice(index, 1);
    updateNote(noteId, { audio: updated });
  }

  function pickFile() {
    audioInputRef.current?.click();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload-audio", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error("Erro ao enviar para R2");
      }

      const currentNote = notes.find((n) => n.id === noteId);
      if (!currentNote) return;
      updateNote(noteId, {
        audio: [...(currentNote.audio ?? []), data.url],
      });
    } catch (err) {
      console.error("Upload falhou:", err);
      alert("Falha ao enviar áudio. Tente novamente.");
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream, { mimeType: "audio/webm" });

      const chunks: BlobPart[] = [];
      media.ondataavailable = (e) => chunks.push(e.data);

      media.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });

        const reader = new FileReader();
        reader.onload = () => {
          const currentNote = notes.find((n) => n.id === noteId);
          if (!currentNote) return;
          updateNote(noteId, {
            audio: [...(currentNote.audio ?? []), reader.result as string],
          });
        };

        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      media.start();
      setRecorder(media);
      setRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Erro ao acessar microfone.");
    }
  }

  function stopRecording() {
    recorder?.stop();
    setRecording(false);
  }

  return (
    <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-lg">
      <h3 className="text-gold font-semibold mb-4 flex items-center gap-2 text-base">
        Áudio
      </h3>

      {/* BOTÕES */}
      <div className="grid grid-cols-2 sm:flex sm:flex-row sm:items-center gap-3 mb-5">
        <button
          onClick={pickFile}
          className="px-3 py-1.5 text-xs bg-gold/20 text-gold border border-gold/40 rounded-md hover:bg-gold/30 transition"
        >
          Anexar áudio
        </button>

        <button
          onClick={recording ? stopRecording : startRecording}
          className={`px-3 py-1.5 text-xs rounded-md border transition ${
            recording
              ? "bg-red-500/30 border-red-400 text-red-200 hover:bg-red-500/40"
              : "bg-white/10 border-white/20 text-pure/80 hover:bg-white/20"
          }`}
        >
          {recording ? "Parar gravação" : "Gravar áudio"}
        </button>

        <input
          type="file"
          ref={audioInputRef}
          accept="audio/*"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
      </div>

      {/* LISTA DE ÁUDIOS */}
      {attachments.length === 0 ? (
        <p className="text-sm text-pure/40">Nenhum áudio anexado ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {attachments.map((a, index) => {
            const isBase64 = isBase64Url(a.url);
            const key = isBase64 ? null : extractKeyFromUrl(a.url);
            const playerSrc = isBase64 ? a.url : `/api/audio?file=${encodeURIComponent(key || "")}`;

            return (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-3 bg-white/5 border border-white/10 rounded-md"
              >
                {/* INFO */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xl flex-shrink-0">🎙️</span>
                  <div className="flex flex-col min-w-0 max-w-[200px]">
                    <p className="text-pure/90 text-sm truncate">{a.name}</p>
                    <p className="text-pure/40 text-xs">{(a.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>

                {/* PLAYER + EXCLUIR */}
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 md:ml-auto">
                  {a.url ? (
                    <WaveformPlayer
                      src={playerSrc}
                      height={60}
                    />
                  ) : (
                    <span className="text-red-400 text-xs">URL inválida</span>
                  )}

                  <button
                    onClick={() => handleDeleteAudio(index)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-red-400/70 text-red-300 text-sm hover:bg-red-500/20 transition flex-shrink-0"
                    title="Excluir áudio"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}