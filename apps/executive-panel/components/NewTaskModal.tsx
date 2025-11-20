"use client";

import { useState } from "react";
import { GUTValues } from "./GUTModal";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (task: {
    title: string;
    owner: string;
    due: string;
    gut: GUTValues;
    columnIndex: number;
    description?: string;
    attachments?: File[];
  }) => void;
  columns: string[];
};

export default function NewTaskModal({
  open,
  onClose,
  onCreate,
  columns,
}: Props) {
  if (!open) return null;

  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [due, setDue] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [columnIndex, setColumnIndex] = useState(0);
  const [gut, setGut] = useState<GUTValues>({ g: 1, u: 1, t: 1 });
  const [columnOpen, setColumnOpen] = useState(false);

  const ready = title.trim().length > 0 && owner.trim().length > 0 && due;

  function close() {
    setTitle("");
    setOwner("");
    setDue("");
    setDescription("");
    setAttachments([]);
    setColumnIndex(0);
    setGut({ g: 1, u: 1, t: 1 });
    onClose();
  }

  function save() {
    if (!ready) return;
    onCreate({
      title: title.trim(),
      owner: owner.trim(),
      due,
      gut,
      columnIndex,
      description: description.trim(),
      attachments,
    });
    close();
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && close()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="card relative max-w-md w-full max-h-[90vh] flex flex-col border border-gold/30 shadow-xl shadow-gold/10 bg-[#0D1220] overflow-hidden p-6">
        {/* Header */}
        <div className="flex-shrink-0 pb-4 border-b border-white/5 mb-4">
          <button
            onClick={close}
            className="absolute right-4 top-4 text-pure/50 hover:text-pure/80 text-xl transition"
          >
            ×
          </button>
          <h2 className="section-title mb-1">Novo Card</h2>
          <p className="text-pure/70 text-sm">Criar nova tarefa no Kanban</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto -mx-2 px-2">

          {/* Title */}
          <div className="mb-3">
            <label className="text-sm text-pure/80 mb-1.5 block">Título</label>
            <input
              className="w-full p-2.5 rounded-lg bg-white/5 text-pure/90 border border-white/10 focus:border-gold/50 focus:outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Novo fluxo Pix"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="text-sm text-pure/80 mb-1.5 block">Descrição</label>
            <textarea
              rows={3}
              className="w-full p-2.5 rounded-lg bg-white/5 text-pure/90 border border-white/10 resize-none focus:border-gold/50 focus:outline-none transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Detalhes sobre a tarefa"
            />
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="text-sm text-pure/80 mb-1.5 block">Anexos</label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setAttachments(Array.from(e.target.files));
                }
              }}
              className="block w-full text-sm text-pure/80 bg-white/5 file:bg-gold file:text-black file:px-3 file:py-1.5 file:rounded-lg file:border-none file:cursor-pointer hover:file:brightness-110"
            />
          </div>

          {/* Owner + Due */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-sm text-pure/80 mb-1.5 block">Responsável</label>
              <input
                className="w-full p-2.5 rounded-lg bg-white/5 text-pure/90 border border-white/10 focus:border-gold/50 focus:outline-none transition"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Ex: JG"
              />
            </div>
            <div>
              <label className="text-sm text-pure/80 mb-1.5 block">Prazo</label>
              <input
                type="date"
                className="w-full p-2.5 rounded-lg bg-white/5 text-pure/90 border border-white/10 focus:border-gold/50 focus:outline-none transition"
                style={{
                  WebkitAppearance: 'none',
                  colorScheme: 'dark'
                }}
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </div>
          </div>

          {/* Column dropdown */}
          <div className="mb-4 relative">
            <label className="text-sm text-pure/80 mb-1.5 block">Coluna</label>
            <button
              type="button"
              onClick={() => setColumnOpen((v) => !v)}
              className="w-full p-2.5 rounded-lg bg-[#191c25] text-[#e5e7eb] border border-[#2a2f3a] flex items-center justify-between hover:border-[#c8a566]/65 hover:shadow-[0_0_6px_rgba(200,165,102,0.25)] focus:outline-none focus:border-[#c8a566] focus:ring-1 focus:ring-[#c8a566]/35 transition"
            >
              <span>{columns[columnIndex] ?? "Selecionar"}</span>
              <span className="text-[#9aa2b1] text-xs">▼</span>
            </button>

            {columnOpen && (
              <ul className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto bg-[#171b25] border border-[#2a2f3a] rounded-lg shadow-xl shadow-black/30 backdrop-blur-sm">
                {columns.map((c, i) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        setColumnIndex(i);
                        setColumnOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm ${
                        i === columnIndex
                          ? "bg-[#c8a566] text-black font-medium shadow-[0_0_8px_rgba(200,165,102,0.35)]"
                          : "text-[#e5e7eb] hover:bg-[#1f2431]"
                      }`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* GUT */}
          <div className="mb-2">
            <p className="text-pure/80 text-sm mb-3">GUT inicial</p>
            <div className="grid grid-cols-3 gap-3">
              {["g", "u", "t"].map((key) => (
                <div key={key}>
                  <p className="text-pure/60 text-xs mb-2 text-center capitalize">
                    {key === "g" ? "Gravidade" : key === "u" ? "Urgência" : "Tendência"}
                  </p>
                  <div className="flex gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setGut({ ...gut, [key]: n })}
                        className={`w-7 h-7 rounded border text-xs font-medium transition ${
                          gut[key as keyof GUTValues] === n
                            ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
                            : "bg-white/5 text-pure/60 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 mt-4 border-t border-white/5">
          <button
            onClick={close}
            className="px-4 py-2 rounded-lg border border-white/10 text-pure/60 hover:bg-white/5 transition"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={!ready}
            className="px-4 py-2 rounded-lg bg-gold text-black hover:brightness-110 transition disabled:opacity-40 disabled:pointer-events-none"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}