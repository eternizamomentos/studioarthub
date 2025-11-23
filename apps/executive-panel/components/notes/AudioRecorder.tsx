"use client";

import { useState, useRef } from "react";
import { useNotes } from "./NotesProvider";

export default function AudioRecorder({ noteId }: { noteId: string }) {
  const { notes, updateNote } = useNotes();
  const note = notes.find((n) => n.id === noteId);

  // Se não existe nota → não renderiza
  if (!note) return null;

  const [recording, setRecording] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  /* ============================================================
     INICIAR GRAVAÇÃO
  ============================================================ */
  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      // Garantir nota válida (TS safe)
      const currentNote = notes.find((n) => n.id === noteId);
      if (!currentNote) return;

      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const file = new File([blob], "gravacao.webm", { type: "audio/webm" });

      // === Upload via API ===
      const form = new FormData();
      form.append("file", file);

      try {
        const res = await fetch("/api/audio/upload", {
          method: "POST",
          body: form,
        });

        const data = await res.json();

        if (data.url) {
          updateNote(noteId, {
            attachments: [
              ...(currentNote.attachments ?? []),
              {
                id: crypto.randomUUID(),
                type: "audio",
                url: data.url,
                name: "Gravação de áudio",
                size: file.size,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Erro ao enviar áudio:", err);
      }
    };

    mediaRecorder.current.start();
    setRecording(true);
  }

  /* ============================================================
     PARAR GRAVAÇÃO
  ============================================================ */
  function stopRecording() {
    mediaRecorder.current?.stop();
    setRecording(false);
  }

  /* ============================================================
     UI
  ============================================================ */
  return (
    <div className="mt-6">
      {!recording ? (
        <button
          onClick={startRecording}
          className="
            px-4 py-2 text-xs
            bg-gold/20 text-gold 
            border border-gold/40
            rounded-md 
            hover:bg-gold/30
            transition
          "
        >
          🎙 Gravar áudio
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="
            px-4 py-2 text-xs
            bg-red-500/20 text-red-300 
            border border-red-500/40
            rounded-md 
            hover:bg-red-500/30
            transition
          "
        >
          ⏹ Parar gravação
        </button>
      )}
    </div>
  );
}