// apps/executive-panel/components/ProjectsBoard.tsx
"use client";

import { useState, useEffect } from "react";
import GUTModal, { GUTValues } from "./GUTModal";
import NewTaskModal from "./NewTaskModal";
import EditTaskModal from "./EditTaskModal";

/* ============================================================
   DRAG & DROP
============================================================ */
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

/* ============================================================
   TYPES
============================================================ */

type LinkItem = {
  id: string;
  label: string;
  url: string;
};

type UploadedFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
};

type Item = {
  id: string;
  title: string;
  owner: string;
  due: string;
  gut: GUTValues;
  createdAt: number;

  description?: string;
  attachments?: UploadedFile[];
  links?: LinkItem[];
  aiInsight?: string;
};

type Col = { title: string; color: string; items: Item[] };

/* ============================================================
   INITIAL BOARD
============================================================ */

const initialBoard: Col[] = [
  { title: "Pendente",      color: "amber", items: [] },
  { title: "Em Execução",   color: "blush", items: [] },
  { title: "Concluído",     color: "green", items: [] },
  { title: "Atrasado",      color: "red",   items: [] },
];

const BADGE_CLASS: Record<string, string> = {
  green: "badge-green",
  amber: "badge-amber",
  red: "badge-red",
  blush: "badge-blush",
};

const STORAGE_KEY = "projects_board_v1";

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function ProjectsBoard() {
  const [board, setBoard] = useState<Col[]>(initialBoard);

  const [editing, setEditing] = useState<{ columnIndex: number; taskIndex: number } | null>(null);
  const [editingTask, setEditingTask] = useState<{ columnIndex: number; taskIndex: number } | null>(null);
  const [creating, setCreating] = useState(false);

  /* ------------------------------------
     Load (with migrations + fail-safe)
  ------------------------------------ */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let parsed = raw ? JSON.parse(raw) : initialBoard;

      if (!Array.isArray(parsed)) parsed = initialBoard;
      if (parsed.length !== initialBoard.length) parsed = initialBoard;

      let base = Date.now();

      parsed = parsed.map((col, i) => ({
        title: initialBoard[i]?.title ?? col.title ?? "Coluna",
        color: initialBoard[i]?.color ?? col.color ?? "amber",
        items: Array.isArray(col.items)
          ? col.items.map((it: Item) => ({
              ...it,
              links: it.links ?? [],
              attachments: it.attachments ?? [],
              aiInsight: it.aiInsight ?? "",
              description: it.description ?? "",
              createdAt: typeof it.createdAt === "number" ? it.createdAt : base++,
            }))
          : [],
      }));

      setBoard(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      setBoard(initialBoard);
    }
  }, []);

  function persistBoard(next: Col[]) {
    setBoard(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }

  /* ------------------------------------
     Sorting
  ------------------------------------ */
  function sortColumn(col: Col): Col {
    return {
      ...col,
      items: [...col.items].sort((a, b) => {
        const pa = a.gut.g * a.gut.u * a.gut.t;
        const pb = b.gut.g * b.gut.u * b.gut.t;
        if (pb !== pa) return pb - pa;
        return b.createdAt - a.createdAt;
      }),
    };
  }

  /* ------------------------------------
     Drag & Drop
  ------------------------------------ */

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const id = String(active.id);
    const target = String(over.id);

    const fromCol = board.findIndex((c) => c.items.some((it) => it.id === id));
    const toCol = board.findIndex((c) => c.title === target);

    if (fromCol < 0 || toCol < 0 || fromCol === toCol) return;

    const taskIndex = board[fromCol].items.findIndex((it) => it.id === id);
    if (taskIndex < 0) return;

    const next = structuredClone(board);
    if (!next[fromCol] || !next[toCol]) return;

    const task = next[fromCol].items[taskIndex];
    next[fromCol].items.splice(taskIndex, 1);
    next[toCol].items.push(task);

    next[toCol] = sortColumn(next[toCol]);

    persistBoard(next);
  }

  /* ------------------------------------
     GUT UPDATE (CORRIGIDO)
  ------------------------------------ */
  function updateGUT(values: GUTValues) {
    if (!editing) return;

    const { columnIndex, taskIndex } = editing;

    const next = structuredClone(board);

    if (!next[columnIndex]) return;
    if (!next[columnIndex].items[taskIndex]) return;

    next[columnIndex].items[taskIndex].gut = values;
    next[columnIndex] = sortColumn(next[columnIndex]);

    persistBoard(next);
    setEditing(null);
  }

  /* ------------------------------------
     TASK UPDATE (CORRIGIDO)
  ------------------------------------ */
  function updateTask(updated: {
    title: string;
    owner: string;
    due: string;
    columnIndex: number;
    description?: string;
    attachments?: UploadedFile[];
    links?: LinkItem[];
    aiInsight?: string;
  }) {
    if (!editingTask) return;

    const next = structuredClone(board);

    const { columnIndex: oldCol, taskIndex } = editingTask;

    if (!next[oldCol] || !next[oldCol].items[taskIndex]) return;

    const task = next[oldCol].items[taskIndex];

    task.title = updated.title;
    task.owner = updated.owner;
    task.due = updated.due;

    if (updated.description !== undefined) task.description = updated.description;
    if (updated.attachments !== undefined) task.attachments = updated.attachments;
    if (updated.links !== undefined) task.links = updated.links;
    if (updated.aiInsight !== undefined) task.aiInsight = updated.aiInsight;

    if (oldCol !== updated.columnIndex) {
      next[oldCol].items.splice(taskIndex, 1);
      next[updated.columnIndex].items.push(task);
      next[updated.columnIndex] = sortColumn(next[updated.columnIndex]);
    }

    persistBoard(next);
    setEditingTask(null);
  }

  /* ------------------------------------
     CREATE TASK (CORRIGIDO)
  ------------------------------------ */
  function addTask(task: {
    title: string;
    owner: string;
    due: string;
    gut: GUTValues;
    columnIndex: number;
    description?: string;
    attachments?: UploadedFile[];
    links?: LinkItem[];
    aiInsight?: string;
  }) {
    const next = structuredClone(board);

    if (!next[task.columnIndex]) return;

    next[task.columnIndex].items.push({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...task,
      description: task.description ?? "",
      attachments: task.attachments ?? [],
      links: task.links ?? [],
      aiInsight: task.aiInsight ?? "",
    });

    next[task.columnIndex] = sortColumn(next[task.columnIndex]);
    persistBoard(next);
  }

  /* ------------------------------------
     DELETE TASK (CORRIGIDO)
  ------------------------------------ */
  function deleteTask(columnIndex: number, taskIndex: number) {
    const next = structuredClone(board);
    if (!next[columnIndex]) return;
    if (!next[columnIndex].items[taskIndex]) return;

    next[columnIndex].items.splice(taskIndex, 1);
    persistBoard(next);
  }

  /* ============================================================
     RENDER
============================================================ */

  const currentTask =
    editing && board[editing.columnIndex]?.items[editing.taskIndex]
      ? board[editing.columnIndex].items[editing.taskIndex]
      : null;

  return (
    <section className="mx-auto max-w-7xl px-4 mt-10">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-gold text-black rounded-lg hover:brightness-110 transition shadow-md shadow-gold/20"
        >
          + Novo Card
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-6 md:grid-cols-4">
          {board.map((col, colIndex) => (
            <Column
              key={col.title}
              col={col}
              colIndex={colIndex}
              onEditTask={(taskIndex) => setEditingTask({ columnIndex: colIndex, taskIndex })}
              onEditGUT={(taskIndex) => setEditing({ columnIndex: colIndex, taskIndex })}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </DndContext>

      {/* EDIT MODAL */}
      <EditTaskModal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        initial={
          editingTask
            ? {
                ...board[editingTask.columnIndex].items[editingTask.taskIndex],
                columnIndex: editingTask.columnIndex,
              }
            : null
        }
        columns={board.map((c) => c.title)}
        onSave={updateTask}
      />

      {/* CREATE MODAL */}
      <NewTaskModal
        open={creating}
        onClose={() => setCreating(false)}
        columns={board.map((c) => c.title)}
        onCreate={addTask}
      />

      {/* GUT MODAL */}
      <GUTModal
        open={!!editing}
        onClose={() => setEditing(null)}
        taskTitle={currentTask?.title ?? ""}
        values={currentTask?.gut ?? { g: 1, u: 1, t: 1 }}
        onSave={updateGUT}
      />
    </section>
  );
}

/* ============================================================
   COLUMN
============================================================ */

function Column({
  col,
  colIndex,
  onEditTask,
  onEditGUT,
  onDelete,
}: {
  col: Col;
  colIndex: number;
  onEditTask: (taskIndex: number) => void;
  onEditGUT: (taskIndex: number) => void;
  onDelete: (colIndex: number, taskIndex: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.title });
  const badgeClass = BADGE_CLASS[col.color] || "badge-amber";

  const humanDate = (str: string) => {
    const d = new Date(str);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div
      ref={setNodeRef}
      className="card flex flex-col min-h-[240px] transition-colors"
      style={
        isOver
          ? {
              outline: "1px dashed rgba(231,183,95,0.6)",
              outlineOffset: 4,
              background: "linear-gradient(to bottom, rgba(231,183,95,0.08), transparent)",
            }
          : undefined
      }
    >
      <header className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
        <h3 className="section-title">{col.title}</h3>
        <span className={`badge ${badgeClass}`}>{col.items.length} itens</span>
      </header>

      <ul className="space-y-3 pb-2">
        {col.items.map((it, idx) => (
          <TaskCard
            key={it.id}
            item={it}
            idx={idx}
            colIndex={colIndex}
            onEdit={onEditTask}
            onEditGUT={onEditGUT}
            onDelete={onDelete}
            humanDate={humanDate}
          />
        ))}

        {col.items.length === 0 && <li className="text-sm text-pure/40 italic">— sem itens —</li>}
      </ul>
    </div>
  );
}

/* ============================================================
   TASK CARD
============================================================ */

function TaskCard({
  item,
  idx,
  colIndex,
  onEdit,
  onEditGUT,
  onDelete,
  humanDate,
}: {
  item: Item;
  idx: number;
  colIndex: number;
  onEdit: (taskIndex: number) => void;
  onEditGUT: (taskIndex: number) => void;
  onDelete: (colIdx: number, idx: number) => void;
  humanDate: (d: string) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (isDragging) return;
        e.stopPropagation();
        onEdit(idx);
      }}
      className="rounded-lg border border-white/10 p-3 backdrop-blur-sm hover:border-gold/40 hover:shadow-[0_0_8px_rgba(231,183,95,0.2)] transition flex flex-col gap-2"
    >
      {/* TÍTULO */}
      <div>
        <p className="font-medium text-pure/90 leading-snug">{item.title}</p>
        <p className="text-[13px] text-pure/50 flex items-center gap-2 mt-1">
          <span>👤 {item.owner}</span>•<span>📅 {humanDate(item.due)}</span>
        </p>
      </div>

      {/* LINKS */}
      {item.links && item.links.length > 0 && (
        <div className="mt-1 flex flex-col gap-1">
          {item.links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              className="text-[12px] text-[#f5d36c] hover:text-white transition"
              style={{ textShadow: "0 0 4px rgba(245,211,108,0.35)" }}
            >
              🔗 {l.label}
            </a>
          ))}
        </div>
      )}

      {/* ANEXOS */}
      {item.attachments && item.attachments.length > 0 && (
        <div className="text-[12px] text-pure/60">📎 {item.attachments.length} arquivo(s)</div>
      )}

      {/* IA RESUMO */}
      {item.aiInsight && (
        <div className="text-[11px] text-pure/50 italic line-clamp-2 mt-1">
          💡 {item.aiInsight}
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
        <span className="text-[12px] text-pure/50">
          Prioridade:{" "}
          <span className="text-gold font-semibold">{item.gut.g * item.gut.u * item.gut.t}</span>
        </span>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(idx);
            }}
            className="text-xs px-2 py-1 rounded-lg bg-white/10 text-pure/70 border border-white/10 hover:bg-white/20 transition"
          >
            Editar
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditGUT(idx);
            }}
            className="text-xs px-2 py-1 rounded-lg bg-white/5 text-pure/60 border border-white/10 hover:bg-gold hover:text-black hover:border-gold transition"
          >
            GUT
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(colIndex, idx);
            }}
            className="text-xs px-2 py-1 rounded-lg bg-red-900/30 text-red-300 border border-red-900/40 hover:bg-red-700/40 hover:text-red-200 transition"
          >
            🗑
          </button>
        </div>
      </div>
    </li>
  );
}