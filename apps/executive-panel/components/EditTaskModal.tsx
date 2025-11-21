// apps/executive-panel/components/EditTaskModal.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { GUTValues } from "./GUTModal";

/* ============================================================
   TYPES
============================================================ */

type UploadedFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
};

type LinkItem = {
  id: string;
  label: string;
  url: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  initial: {
    title: string;
    owner: string;
    due: string;
    gut: GUTValues;
    columnIndex: number;
    description?: string;
    attachments?: UploadedFile[];
    links?: LinkItem[];
    aiInsight?: string;
  } | null;
  columns: string[];
  onSave: (edited: {
    title: string;
    owner: string;
    due: string;
    columnIndex: number;
    description?: string;
    attachments?: UploadedFile[];
    links?: LinkItem[];
    aiInsight?: string;
  }) => void;
};

/* ============================================================
   COMPONENT
============================================================ */

export default function EditTaskModal({ open, onClose, initial, columns, onSave }: Props) {
  if (!open || !initial) return null;

  /* ------------------------------------
     STATES PRINCIPAIS
  ------------------------------------ */
  const [title, setTitle] = useState(initial.title);
  const [owner, setOwner] = useState(initial.owner);
  const [due, setDue] = useState(initial.due);
  const [columnIndex, setColumnIndex] = useState(initial.columnIndex);
  const [description, setDescription] = useState(initial.description ?? "");
  const [attachments, setAttachments] = useState<UploadedFile[]>(initial.attachments ?? []);
  const [links, setLinks] = useState<LinkItem[]>(initial.links ?? []);
  const [aiInsight, setAiInsight] = useState(initial.aiInsight ?? "");

  /* Links */
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const [uploading, setUploading] = useState(false);

  /* IA */
  const [aiLoading, setAiLoading] = useState(false);

  /* ------------------------------------
     SYNC QUANDO ABRE MODAL
  ------------------------------------ */
  useEffect(() => {
    setTitle(initial.title);
    setOwner(initial.owner);
    setDue(initial.due);
    setColumnIndex(initial.columnIndex);
    setDescription(initial.description ?? "");
    setAttachments(initial.attachments ?? []);
    setLinks(initial.links ?? []);
    setAiInsight(initial.aiInsight ?? "");
  }, [initial]);

  const ready = title.trim() !== "" && owner.trim() !== "" && due.trim() !== "";

  /* ============================================================
     HANDLERS
  ============================================================ */

  function closeModal() {
    onClose();
  }

  /* Upload */
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = URL.createObjectURL(file);

    const newFile: UploadedFile = {
      id: crypto.randomUUID(),
      name: file.name,
      url,
      size: file.size,
      type: file.type,
    };

    setAttachments(prev => [...prev, newFile]);
    setUploading(false);
  }

  function removeAttachment(id: string) {
    setAttachments(prev => prev.filter(att => att.id !== id));
  }

  /* Criar link com Enter */
  function tryCreateLink(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const label = newLinkLabel.trim();
    const url = newLinkUrl.trim();
    const urlPattern = /^https?:\/\/[^\s]+$/i;

    if (!label || !urlPattern.test(url)) return;

    const newLink: LinkItem = { id: crypto.randomUUID(), label, url };
    setLinks(prev => [...prev, newLink]);

    setNewLinkLabel("");
    setNewLinkUrl("");
  }

  function removeLink(id: string) {
    setLinks(prev => prev.filter(link => link.id !== id));
  }

  /* IA */
  async function generateInsights() {
    setAiLoading(true);
    setAiInsight("");

    await new Promise(r => setTimeout(r, 1100));

    const gutScore =
      initial?.gut
        ? initial.gut.g * initial.gut.u * initial.gut.t
        : 0;

    const insight = `
🧠 ANÁLISE INTELIGENTE DA TAREFA

• Resumo:
  A tarefa "${title}" é de responsabilidade de ${owner} com prazo em ${due}.
  ${description ? "Há uma descrição detalhada da tarefa." : "Descrição ausente — considere incluir mais contexto."}

• Prioridade via GUT:
  Pontuação: ${gutScore}

• Recomendações:
  - Revisar requisitos principais
  - Dividir a tarefa em subtarefas pequenas
  - Antecipar dependências
  - Usar links úteis para referências externas

• Checklist rápido:
  - [ ] Requisitos definidos
  - [ ] Estrutura criada
  - [ ] Execução iniciada
  - [ ] Revisão final
`;

    setAiInsight(insight.trim());
    setAiLoading(false);
  }

  /* SALVAR */
  function saveChanges() {
    if (!ready) return;

    onSave({
      title: title.trim(),
      owner: owner.trim(),
      due,
      columnIndex,
      description: description.trim(),
      attachments,
      links,
      aiInsight,
    });

    closeModal();
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="card relative max-w-xl w-full max-h-[90vh] flex flex-col border border-gold/30 shadow-2xl shadow-gold/10 bg-[#0D1220] overflow-hidden rounded-xl">

        {/* HEADER */}
        <header className="flex-shrink-0 p-6 pb-4 border-b border-white/5 mb-1 relative">
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 text-pure/50 hover:text-pure/80 text-xl transition"
            aria-label="Fechar modal"
          >×</button>

          <h2 className="section-title mb-1">Editar Card</h2>
          <p className="text-pure/70 text-sm">Gerencie informações, anexos, links e insights da IA</p>
        </header>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7 custom-scroll">

          {/* Título */}
          <div>
            <label className="text-sm text-pure/80 block mb-1.5">Título</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 text-pure/90 border border-white/10 
                         focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition"
            />
          </div>

          {/* Responsável + Prazo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-pure/80 block mb-1.5">Responsável</label>
              <input
                value={owner}
                onChange={e => setOwner(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 text-pure/90 border border-white/10 
                           focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition"
              />
            </div>

            <div>
              <label className="text-sm text-pure/80 block mb-1.5">Prazo</label>
              <input
                type="date"
                value={due}
                onChange={e => setDue(e.target.value)}
                style={{ WebkitAppearance: "none", colorScheme: "dark" }}
                className="w-full p-3 rounded-lg bg-white/5 text-pure/80 border border-white/10 
                           focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm text-pure/80 block mb-1.5">Descrição</label>
            <textarea
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 text-pure/90 border border-white/10 
                         focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition resize-none"
            />
          </div>

          {/* Anexos */}
          <div>
            <label className="text-sm text-pure/80 block mb-1.5">Anexar arquivo</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-pure/70 
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                         file:bg-gold/10 file:text-gold hover:file:bg-gold/20 transition"
            />
            {uploading && <p className="text-xs text-pure/50 mt-1">Carregando…</p>}
          </div>

          {attachments.length > 0 && (
            <div>
              <p className="text-sm text-pure/80 mb-1">Arquivos anexados</p>
              <ul className="space-y-2">
                {attachments.map(att => (
                  <li key={att.id}
                      className="flex items-center justify-between text-sm bg-white/5 p-2 rounded-lg hover:bg-white/10 transition">
                    <a href={att.url} target="_blank" className="underline hover:text-gold">
                      {att.name}
                    </a>

                    <button
                      onClick={() => removeAttachment(att.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >×</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links úteis */}
          <div>
            <label className="text-sm text-pure/80 block mb-1.5">Links úteis</label>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                placeholder="Link"
                value={newLinkLabel}
                onChange={e => setNewLinkLabel(e.target.value)}
                onKeyDown={tryCreateLink}
                className="flex-1 p-3 rounded-lg bg-white/5 text-pure/90 border border-white/10
                           focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition"
              />

              <input
                placeholder="https://exemplo.com"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                onKeyDown={tryCreateLink}
                className="flex-1 p-3 rounded-lg bg-white/5 text-pure/90 border border-white/10
                           focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition"
              />
            </div>

            {links.length > 0 && (
              <ul className="space-y-2 mt-3">
                {links.map(link => (
                  <li
                    key={link.id}
                    className="flex items-center justify-between bg-white/5 p-2 rounded-lg hover:bg-white/10 transition text-sm"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#f7d88c] hover:text-white transition"
                      style={{ textShadow: "0 0 5px rgba(245,211,108,0.35)" }}
                    >
                      🔗 {link.label}
                    </a>

                    <button
                      onClick={() => removeLink(link.id)}
                      className="text-red-400 hover:text-red-200 text-xs"
                    >×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* IA Assistente */}
          <div className="pt-2">
            <label className="text-sm text-pure/80 block mb-2">🤖 IA – Análise Inteligente</label>

            <button
              onClick={generateInsights}
              disabled={aiLoading}
              className="px-4 py-2 rounded-lg bg-gold text-black text-sm hover:brightness-110 
                         disabled:opacity-40 transition"
            >
              {aiLoading ? "Gerando insights…" : "Gerar Insights da IA"}
            </button>

            {aiInsight && (
              <div
                className="mt-4 p-4 rounded-lg border border-gold/20 text-pure/80 text-sm whitespace-pre-wrap leading-relaxed"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(200,165,102,0.06), rgba(0,0,0,0.2))",
                  boxShadow:
                    "0 0 10px rgba(200,165,102,0.15), inset 0 0 12px rgba(200,165,102,0.05)",
                }}
              >
                {aiInsight}
              </div>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <footer className="p-6 border-t border-white/5 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-lg border border-white/10 text-pure/60 hover:bg-white/5 transition"
          >
            Cancelar
          </button>

          <button
            onClick={saveChanges}
            disabled={!ready}
            className="px-4 py-2 rounded-lg bg-gold text-black hover:brightness-110 transition disabled:opacity-40"
          >
            Salvar
          </button>
        </footer>
      </div>
    </div>
  );
}