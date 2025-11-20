"use client";

import { useState } from "react";
import { GUTValues } from "./GUTModal";

/* ============================================================
   TYPES COMPATÍVEIS COM PROJECTSBOARD
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
  onCreate: (task: {
    title: string;
    owner: string;
    due: string;
    gut: GUTValues;
    columnIndex: number;
    description?: string;
    attachments?: UploadedFile[];
    links?: LinkItem[];
    aiInsight?: string;
  }) => void;
  columns: string[];
};

/* ============================================================
   COMPONENT
============================================================ */

export default function NewTaskModal({ open, onClose, onCreate, columns }: Props) {
  if (!open) return null;

  /* ------------------------------------
     STATES PRINCIPAIS
  ------------------------------------ */
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [due, setDue] = useState("");
  const [description, setDescription] = useState("");
  const [columnIndex, setColumnIndex] = useState(0);
  const [gut, setGut] = useState<GUTValues>({ g: 1, u: 1, t: 1 });

  /* Uploads */
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  /* Links */
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  /* IA */
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [columnOpen, setColumnOpen] = useState(false);

  const ready = title.trim() !== "" && owner.trim() !== "" && due.trim() !== "";

  /* ============================================================
     HANDLERS
  ============================================================ */

  function close() {
    setTitle("");
    setOwner("");
    setDue("");
    setDescription("");
    setLinks([]);
    setAttachments([]);
    setColumnIndex(0);
    setGut({ g: 1, u: 1, t: 1 });
    setAiInsight("");

    onClose();
  }

  /* Upload de arquivo */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const url = URL.createObjectURL(file);

    const up: UploadedFile = {
      id: crypto.randomUUID(),
      name: file.name,
      url,
      size: file.size,
      type: file.type,
    };

    setAttachments(prev => [...prev, up]);
    setUploading(false);
  }

  function removeAttachment(id: string) {
    setAttachments(prev => prev.filter(att => att.id !== id));
  }

  /* Criar link pelo ENTER */
  function tryCreateLink(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const label = newLinkLabel.trim();
    const url = newLinkUrl.trim();
    const regex = /^https?:\/\/[^\s]+$/i;

    if (!label || !regex.test(url)) return;

    const link: LinkItem = {
      id: crypto.randomUUID(),
      label,
      url,
    };

    setLinks(prev => [...prev, link]);
    setNewLinkLabel("");
    setNewLinkUrl("");
  }

  function removeLink(id: string) {
    setLinks(prev => prev.filter(l => l.id !== id));
  }

  /* IA */
  async function generateAI() {
    setAiLoading(true);

    await new Promise(r => setTimeout(r, 1200));

    const insight = `
🧠 ANÁLISE INICIAL DA TAREFA

• Tarefa: ${title || "(sem título)"}
• Responsável: ${owner || "(não definido)"}
• Prazo: ${due || "(não definido)"}

⚡ Recomendações iniciais:
- Estruturar objetivos imediatamente
- Criar subtarefas para evitar bloqueios
- Documentar requisitos no campo de Links
- Validar impacto e urgência

📌 Pontuação GUT inicial: ${gut.g * gut.u * gut.t}
    `.trim();

    setAiInsight(insight);
    setAiLoading(false);
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
      links,
      aiInsight, // ⭐ Agora salvo corretamente
    });

    close();
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      onClick={e => e.target === e.currentTarget && close()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="card relative max-w-lg w-full max-h-[90vh] flex flex-col border border-gold/30 shadow-2xl shadow-gold/10 bg-[#0D1220] overflow-hidden rounded-xl">

        {/* HEADER */}
        <header className="flex-shrink-0 p-6 pb-4 border-b border-white/5 relative">
          <button
            onClick={close}
            className="absolute right-4 top-4 text-pure/50 hover:text-pure/80 text-xl transition"
          >
            ×
          </button>

          <h2 className="section-title mb-1">Novo Card</h2>
          <p className="text-pure/70 text-sm">Criar nova tarefa no painel</p>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7 custom-scroll">

          {/* ------------------------------------------------ */}
          {/* TÍTULO */}
          {/* ------------------------------------------------ */}
          <div>
            <label className="text-sm text-pure/80 block mb-1.5">Título</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Novo fluxo Pix"
              className="w-full p-3 rounded-lg bg-white/5 text-pure/90 border border-white/10
                         focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition"
            />
          </div>

          {/* ------------------------------------------------ */}
          {/* DESCRIÇÃO */}
          {/* ------------------------------------------------ */}
          <div>
            <label className="text-sm text-pure/80 block mb-1.5">Descrição</label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: Detalhes da tarefa"
              className="w-full p-3 rounded-lg bg-white/5 text-pure/90 border border-white/10
                         focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition resize-none"
            />
          </div>

          {/* ------------------------------------------------ */}
          {/* UPLOAD */}
          {/* ------------------------------------------------ */}
          <div>
            <label className="text-sm text-pure/80 block mb-1.5">Anexos</label>

            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-pure/70
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                         file:bg-gold/10 file:text-gold hover:file:bg-gold/20 transition"
            />

            {uploading && (
              <p className="text-xs text-pure/50 mt-1">Carregando…</p>
            )}

            {attachments.length > 0 && (
              <ul className="mt-3 space-y-1">
                {attachments.map(att => (
                  <li
                    key={att.id}
                    className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-2"
                  >
                    <span className="text-pure/80">{att.name}</span>

                    <button
                      onClick={() => removeAttachment(att.id)}
                      className="text-xs text-red-400 hover:text-red-200 transition"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ------------------------------------------------ */}
          {/* LINKS */}
          {/* ------------------------------------------------ */}
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
                      className="flex items-center gap-2 text-[#f5d36c] hover:text-white transition"
                      style={{ textShadow: "0 0 5px rgba(245,211,108,0.35)" }}
                    >
                      🔗 {link.label}
                    </a>

                    <button
                      onClick={() => removeLink(link.id)}
                      className="text-red-400 hover:text-red-200 text-xs"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ------------------------------------------------ */}
          {/* RESPONSÁVEL + PRAZO */}
          {/* ------------------------------------------------ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-pure/80 block mb-1.5">Responsável</label>
              <input
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="Ex: JG"
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

          {/* ------------------------------------------------ */}
          {/* COLUNA */}
          {/* ------------------------------------------------ */}
          <div className="relative">
            <label className="text-sm text-pure/80 block mb-1.5">Coluna</label>

            <button
              type="button"
              onClick={() => setColumnOpen(v => !v)}
              className="w-full p-3 rounded-lg bg-[#191c25] text-[#e5e7eb] border border-[#2a2f3a]
                         flex items-center justify-between hover:border-[#c8a566]/65 hover:shadow-[0_0_6px_rgba(200,165,102,0.25)]
                         focus:outline-none focus:border-[#c8a566] focus:ring-1 focus:ring-[#c8a566]/35 transition"
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

          {/* ------------------------------------------------ */}
          {/* GUT */}
          {/* ------------------------------------------------ */}
          <div>
            <p className="text-pure/80 text-sm mb-3">GUT inicial</p>

            <div className="grid grid-cols-3 gap-3">
              {["g", "u", "t"].map(key => (
                <div key={key}>
                  <p className="text-pure/60 text-xs mb-2 text-center capitalize">
                    {key === "g" ? "Gravidade" : key === "u" ? "Urgência" : "Tendência"}
                  </p>

                  <div className="flex gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map(n => (
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

          {/* ------------------------------------------------ */}
          {/* IA */}
          {/* ------------------------------------------------ */}
          <div className="pt-2">
            <label className="text-sm text-pure/80 block mb-2">🤖 IA – Análise Inicial</label>

            <button
              onClick={generateAI}
              disabled={aiLoading}
              className="px-4 py-2 rounded-lg bg-gold text-black text-sm hover:brightness-110 disabled:opacity-40 transition"
            >
              {aiLoading ? "Gerando análise…" : "Gerar Análise da IA"}
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
        <footer className="flex-shrink-0 flex justify-end gap-3 p-6 pt-4 border-t border-white/5">
          <button
            onClick={close}
            className="px-4 py-2 rounded-lg border border-white/10 text-pure/60 hover:bg-white/5 transition"
          >
            Cancelar
          </button>

          <button
            onClick={save}
            disabled={!ready}
            className="px-4 py-2 rounded-lg bg-gold text-black hover:brightness-110 transition disabled:opacity-40"
          >
            Criar
          </button>
        </footer>

      </div>
    </div>
  );
}