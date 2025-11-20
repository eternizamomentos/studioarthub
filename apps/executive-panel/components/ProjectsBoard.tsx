"use client";

import { useState, useEffect } from "react";
import GUTModal, { GUTValues } from "./GUTModal";
import NewTaskModal from "./NewTaskModal";
import EditTaskModal from "./EditTaskModal";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

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
};

type Col = { title: string; color: string; items: Item[] };

const initialBoard: Col[] = [
  {
    title: "Pendente",
    color: "amber",
    items: [
      {
        id: "p1",
        title: "FAQ SEO",
        owner: "JG",
        due: "2025-11-20",
        gut: { g: 3, u: 2, t: 1 },
        createdAt: Date.now(),
      },
    ],
  },
  {
    title: "Em Execução",
    color: "blush",
    items: [
      {
        id: "p2",
        title: "Worker v2.6 (Webhook PIX)",
        owner: "JG",
        due: "2025-11-17",
        gut: { g: 4, u: 3, t: 2 },
        createdAt: Date.now(),
      },
    ],
  },
  {
    title: "Concluído",
    color: "green",
    items: [
      {
        id: "p3",
        title: "Painel v2.5 Logs",
        owner: "JG",
        due: "2025-11-10",
        gut: { g: 1, u: 1, t: 1 },
        createdAt: Date.now(),
      },
    ],
  },
  {
    title: "Atrasado",
    color: "red",
    items: [],
  },
];

const BADGE_CLASS: Record<string, string> = {
  green: "badge-green",
  amber: "badge-amber",
  red: "badge-red",
  blush: "badge-blush",
};

const STORAGE_KEY = "projects_board_v1";

export default function ProjectsBoard() {
  const [board, setBoard] = useState<Col[] | null>(null);
  const [editing, setEditing] = useState<{ columnIndex: number; taskIndex: number } | null>(null);
  const [editingTask, setEditingTask] = useState<{ columnIndex: number; taskIndex: number } | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      let parsed: Col[] = raw ? JSON.parse(raw) : initialBoard;

      if (!Array.isArray(parsed)) parsed = initialBoard;

      let base = Date.now();
      parsed = parsed.map(col => ({
        ...col,
        items: col.items.map(it => ({
          ...it,
          createdAt: typeof it.createdAt === "number" ? it.createdAt : base++,
        })),
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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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

  function handleDragEnd(event: DragEndEvent) {
    if (!board) return;

    const { active, over } = event;
    if (!over) return;

    const id = String(active.id);
    const target = String(over.id);

    const fromCol = board.findIndex(c => c.items.some(it => it.id === id));
    if (fromCol === -1) return;

    const source = board[fromCol];
    const sourceIndex = source.items.findIndex(it => it.id === id);
    const item = source.items[sourceIndex];

    const toCol = board.findIndex(c => c.title === target);
    if (toCol === -1 || toCol === fromCol) return;

    const next = structuredClone(board);
    next[fromCol].items.splice(sourceIndex, 1);
    next[toCol].items.push(item);
    next[toCol] = sortColumn(next[toCol]);

    persistBoard(next);
  }

  if (!board) {
    return <section className="text-pure/50 mt-10 animate-pulse">Carregando quadro...</section>;
  }

  const currentTask = editing ? board[editing.columnIndex].items[editing.taskIndex] : null;

  function updateGUT(values: GUTValues) {
    if (!editing) return;
    const { columnIndex, taskIndex } = editing;

    const copy = structuredClone(board);
    copy[columnIndex].items[taskIndex].gut = values;
    copy[columnIndex] = sortColumn(copy[columnIndex]);

    persistBoard(copy);
    setEditing(null);
  }

  function updateTask({
    title,
    owner,
    due,
    columnIndex,
    description,
    attachments
  }: {
    title: string;
    owner: string;
    due: string;
    columnIndex: number;
    description?: string;
    attachments?: UploadedFile[];
  }) {
    if (!editingTask) return;
  
    const next = structuredClone(board);
    const { columnIndex: oldCol, taskIndex } = editingTask;
    const task = next[oldCol].items[taskIndex];
  
    task.title = title;
    task.owner = owner;
    task.due = due;
  
    if (description !== undefined) task.description = description;
    if (attachments !== undefined) task.attachments = attachments;
  
    if (oldCol !== columnIndex) {
      next[oldCol].items.splice(taskIndex, 1);
      next[columnIndex].items.push(task);
      next[columnIndex] = sortColumn(next[columnIndex]);
    }
  
    persistBoard(next);
    setEditingTask(null);
  }

  function addTask(task: { title: string; owner: string; due: string; gut: GUTValues; columnIndex: number }) {
    const next = structuredClone(board);

    next[task.columnIndex].items.push({
      id: crypto.randomUUID(),
      ...task,
      createdAt: Date.now(),
    });

    next[task.columnIndex] = sortColumn(next[task.columnIndex]);
    persistBoard(next);
  }

  function deleteTask(columnIndex: number, taskIndex: number) {
    const next = structuredClone(board);
    next[columnIndex].items.splice(taskIndex, 1);
    persistBoard(next);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 mt-10">
      <div className="flex justify-end mb-4">
        <button onClick={() => setCreating(true)} className="px-4 py-2 bg-gold text-black rounded-lg hover:brightness-110 transition shadow-md shadow-gold/20">+ Novo Card</button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-6 md:grid-cols-4">
          {board.map((col, colIndex) => (
            <Column
              key={col.title}
              col={col}
              colIndex={colIndex}
              onEditGUT={(taskIndex) => setEditing({ columnIndex: colIndex, taskIndex })}
              onEditTask={(taskIndex) => setEditingTask({ columnIndex: colIndex, taskIndex })}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </DndContext>

      <NewTaskModal open={creating} onClose={() => setCreating(false)} columns={board.map((b) => b.title)} onCreate={addTask} />

      <GUTModal open={!!editing} onClose={() => setEditing(null)} taskTitle={currentTask?.title ?? ""} values={currentTask?.gut ?? { g: 1, u: 1, t: 1 }} onSave={updateGUT} />

      <EditTaskModal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        initial={
          editingTask
            ? {
                title: board[editingTask.columnIndex].items[editingTask.taskIndex].title,
                owner: board[editingTask.columnIndex].items[editingTask.taskIndex].owner,
                due: board[editingTask.columnIndex].items[editingTask.taskIndex].due,
                gut: board[editingTask.columnIndex].items[editingTask.taskIndex].gut,
                columnIndex: editingTask.columnIndex,
                description: board[editingTask.columnIndex].items[editingTask.taskIndex].description ?? "",
                attachments: board[editingTask.columnIndex].items[editingTask.taskIndex].attachments ?? []
              }
            : null
        }
        columns={board.map((b) => b.title)}
        onSave={updateTask}
      />
    </section>
  );
}

/* ------------------------- COLUMN + TASK CARD ------------------------ */

function Column({ col, colIndex, onEditGUT, onEditTask, onDelete }: {
  col: Col;
  colIndex: number;
  onEditGUT: (taskIndex: number) => void;
  onEditTask: (taskIndex: number) => void;
  onDelete: (colIndex: number, taskIndex: number) => void;
}) {
  const badgeClass = BADGE_CLASS[col.color] || "badge-amber";
  const { setNodeRef, isOver } = useDroppable({ id: col.title });

  const humanDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div ref={setNodeRef}
      className="card flex flex-col min-h-[240px] transition-colors flex-1 min-w-[280px]"
      style={isOver ? {
        outline: "1px dashed rgba(231,183,95,0.6)",
        outlineOffset: 4,
        background: "linear-gradient(to bottom, rgba(231,183,95,0.08), transparent)",
      } : undefined}
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
            onEdit={() => onEditTask(idx)}
            onEditGUT={onEditGUT}
            onDelete={onDelete}
            humanDate={humanDate}
          />
        ))}

        {col.items.length === 0 && <li className="text-sm text-pure/40 italic mt-2">— sem itens —</li>}
      </ul>
    </div>
  );
}

/* ------------------------------- TASK CARD ------------------------------ */

function TaskCard({ item, idx, colIndex, onEdit, onEditGUT, onDelete, humanDate }: {
  item: Item;
  idx: number;
  colIndex: number;
  onEdit: (taskIndex: number) => void;
  onEditGUT: (taskIndex: number) => void;
  onDelete: (colIndex: number, taskIndex: number) => void;
  humanDate: (dateStr: string) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    opacity: isDragging ? 0.75 : 1,
    cursor: "grab",
  } as React.CSSProperties;

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (isDragging) return;            // evita abrir modal se estiver arrastando
        e.stopPropagation();
        onEdit(idx);
      }}
      className="rounded-lg border border-white/10 p-3 backdrop-blur-sm hover:border-gold/40 hover:shadow-[0_0_8px_rgba(231,183,95,0.2)] transition-all duration-150 flex flex-col gap-2"
    >
      {/* Título e Info */}
      <div>
        <p className="font-medium text-pure/90 break-words hyphens-auto leading-snug text-[15px]">
          {item.title}
        </p>

        <p className="text-[13px] text-pure/50 mt-1 flex items-center gap-2">
          <span>👤 {item.owner}</span>
          <span>•</span>
          <span>📅 {humanDate(item.due)}</span>
        </p>
      </div>

      {item.attachments && item.attachments.length > 0 && (
        <div className="text-[12px] text-pure/60 mt-1 flex items-center gap-1">
          📎 {item.attachments.length} arquivo(s)
        </div>
      )}

      {/* Rodapé estilizado */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
        <span className="text-[12px] text-pure/50">
          Prioridade:{" "}
          <span className="text-gold font-semibold">
            {item.gut.g * item.gut.u * item.gut.t}
          </span>
        </span>

        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(idx); }}
            className="text-xs px-2 py-1 rounded-lg bg-white/10 text-pure/70 border border-white/10 hover:bg-white/20 transition"
          >
            Editar
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onEditGUT(idx); }}
            className="text-xs px-2 py-1 rounded-lg bg-white/5 text-pure/60 border border-white/10 hover:bg-gold hover:text-black hover:border-gold transition"
          >
            GUT
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(colIndex, idx); }}
            className="text-xs px-2 py-1 rounded-lg font-semibold bg-red-900/30 text-red-300 border border-red-900/40 hover:bg-red-700/40 hover:text-red-200 hover:border-red-700/40 transition"
            title="Excluir card"
          >
            🗑
          </button>
        </div>
      </div>
    </li>
  );
}