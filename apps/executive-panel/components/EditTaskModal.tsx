// apps/executive-panel/components/EditTaskModal.tsx
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { GUTValues } from "./GUTModal";

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
  }) => void;
};

export default function EditTaskModal({ open, onClose, initial, columns, onSave }: Props) {
  if (!open || !initial) return null;

  const [title, setTitle] = useState(initial.title);
  const [owner, setOwner] = useState(initial.owner);
  const [due, setDue] = useState(initial.due);
  const [columnIndex, setColumnIndex] = useState(initial.columnIndex);
  const [description, setDescription] = useState(initial.description ?? "");
  const [attachments, setAttachments] = useState<UploadedFile[]>(initial.attachments ?? []);
  const [links, setLinks] = useState<LinkItem[]>(initial.links ?? []);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTitle(initial.title);
    setOwner(initial.owner);
    setDue(initial.due);
    setColumnIndex(initial.columnIndex);
    setDescription(initial.description ?? "");
    setAttachments(initial.attachments ?? []);
    setLinks(initial.links ?? []);
  }, [initial]);

  const ready = title.trim() !== "" && owner.trim() !== "" && due.trim() !== "";

  function closeModal() {
    onClose();
  }

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

  function addLink(e: FormEvent) {
    e.preventDefault();
    const trimmedLabel = newLinkLabel.trim();
    const trimmedUrl = newLinkUrl.trim();
    const urlPattern = /^https?:\/\/[^\s]+$/i;

    if (!trimmedLabel || !urlPattern.test(trimmedUrl)) {
      return;
    }

    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      label: trimmedLabel,
      url: trimmedUrl,
    };
    setLinks(prev => [...prev, newLink]);
    setNewLinkLabel("");
    setNewLinkUrl("");
  }

  function removeLink(id: string) {
    setLinks(prev => prev.filter(link => link.id !== id));
  }

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
    });
    closeModal();
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && closeModal()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="card relative max-w-lg w-full max-h-[90vh] flex flex-col border border-gold/30 shadow-xl shadow-gold/10 bg-[#0D1220] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-6 pb-4 border-b border-white/5 mb-4">
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 text-pure/50 hover:text-pure/80 text-xl transition"
            aria-label="Fechar"
          >
            ×
          </button>
          <h2 className="section-title mb-1">Editar Card</h2>
          <p className="text-pure/70 text-sm">Atualize informações, descrição, anexos e links</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm text-pure/80 mb-1.5 block">Título</label>
            <input
              className="w-full p-2.5 rounded-lg bg-white/5 text-pure/90 border border-white/10 focus:border-gold/50 focus:outline-none transition"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Owner + Due */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-pure/80 mb-1.5 block">Responsável</label>
              <input
                className="w-full p-2.5 rounded-lg bg-white/5 text-pure/90 border border-white/10 focus:border-gold/50 focus:outline-none transition"
                value={owner}
                onChange={e => setOwner(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-pure/80 mb-1.5 block">Prazo</label>
              <input
                type="date"
                className="w-full p-2.5 rounded-lg bg-white/5 text-pure/90 border border-white/10 focus:border-gold/50 focus:outline-none transition appearance-none"
                style={{ WebkitAppearance: 'none', colorScheme: 'dark' }}
                value={due}
                onChange={e => setDue(e.target.value)}
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm text-pure/80 mb-1.5 block">Descrição</label>
            <textarea
              rows={4}
              className="w-full p-2.5 rounded-lg bg-white/5 text-pure/90 border border-white/10 focus:border-gold/50 focus:outline-none transition resize-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Anexos */}
          <div>
            <label className="text-sm text-pure/80 mb-1.5 block">Anexar arquivo</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-pure/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20 transition"
            />
            {uploading && <p className="text-pure/50 text-xs mt-1">Fazendo upload…</p>}
          </div>

          {attachments.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-pure/80 mb-1">Arquivos anexados</p>
              <ul className="space-y-1">
                {attachments.map(att => (
                  <li key={att.id} className="flex items-center justify-between text-sm text-pure/70">
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      download={att.name}
                      className="underline hover:text-gold"
                    >
                      {att.name}
                    </a>
                    <button
                      onClick={() => removeAttachment(att.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                      aria-label={`Remover anexo ${att.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links úteis */}
          <div>
            <label className="text-sm text-pure/80 mb-1.5 block">Links úteis</label>
            <form onSubmit={addLink} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                placeholder="Etiqueta"
                value={newLinkLabel}
                onChange={e => setNewLinkLabel(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-white/5 text-pure/90 border border-white/10 focus:border-gold/50 focus:outline-none transition"
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addLink(e); } }}
              />
              <input
                type="url"
                placeholder="https://exemplo.com"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-white/5 text-pure/90 border border-white/10 focus:border-gold/50 focus:outline-none transition"
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addLink(e); } }}
              />
            </form>
            {links.length > 0 && (
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.id} className="flex items-center justify-between text-sm text-pure/70 bg-white/5 rounded-lg p-2 hover:bg-white/10 transition">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#f5d36c] hover:text-white transition-colors"
                      style={{ textShadow: "0 0 3px rgba(245,211,108,0.4)" }}
                    >
                      <span className="inline-block w-4 h-4">🔗</span>
                      {link.label}
                    </a>
                    <button
                      onClick={() => removeLink(link.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                      aria-label={`Remover link ${link.label}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-white/5 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-lg border border-white/10 text-pure/60 hover:bg-white/5 transition"
          >
            Cancelar
          </button>
          <button
            onClick={saveChanges}
            disabled={!ready}
            className="px-4 py-2 rounded-lg bg-gold text-black hover:brightness-110 transition disabled:opacity-40 disabled:pointer-events-none"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}