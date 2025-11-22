"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

/* ============================================================
   TYPES — BASE PREMIUM E EXTENSÍVEL
   (Preparado para Tags, IA, Relacionamentos e Cadernos)
============================================================ */

export type NoteTag = {
  id: string;
  label: string;
  color?: string; // Premium customization
};

export type Note = {
  id: string;
  notebookId: string | null; // null → nota solta
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;

  tags: NoteTag[];
  links: { label: string; url: string }[];
  aiInsight?: string;
};

export type Notebook = {
  id: string;
  name: string;
  createdAt: number;
};

export type NotesState = {
  notebooks: Notebook[];
  notes: Note[];
};

/* ============================================================
   STORAGE KEY + VERSIONING (migração fácil)
============================================================ */

const STORAGE_KEY = "sah_notes_data_v1";

/* ============================================================
   CONTEXT
============================================================ */

type NotesContextType = {
  state: NotesState;
  createNotebook: (name: string) => void;
  renameNotebook: (id: string, name: string) => void;
  deleteNotebook: (id: string) => void;

  createNote: (partial: Partial<Note>) => Note;
  updateNote: (id: string, partial: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  hardReset: () => void; // modo manutenção
};

const NotesContext = createContext<NotesContextType | null>(null);

/* ============================================================
   PROVIDER
============================================================ */

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotesState>({
    notebooks: [],
    notes: [],
  });

  /* ---------------------------------------
     LOAD (com migração futura fácil)
  --------------------------------------- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) return;

      const parsed = JSON.parse(raw);

      // Garantia de integridade
      if (!parsed.notes || !parsed.notebooks) return;

      setState(parsed);
    } catch {
      console.warn("⚠️ Falha ao carregar notas.");
    }
  }, []);

  /* ---------------------------------------
     SAVE persistente
  --------------------------------------- */
  const persist = useCallback(
    (next: NotesState) => {
      setState(next);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    },
    [setState]
  );

  /* ============================================================
     NOTEBOOK ACTIONS
  ============================================================ */

  function createNotebook(name: string) {
    const nb: Notebook = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };

    persist({
      ...state,
      notebooks: [...state.notebooks, nb],
    });
  }

  function renameNotebook(id: string, name: string) {
    persist({
      ...state,
      notebooks: state.notebooks.map((nb) =>
        nb.id === id ? { ...nb, name } : nb
      ),
    });
  }

  function deleteNotebook(id: string) {
    persist({
      notes: state.notes.map((n) =>
        n.notebookId === id ? { ...n, notebookId: null } : n
      ),
      notebooks: state.notebooks.filter((n) => n.id !== id),
    });
  }

  /* ============================================================
     NOTE ACTIONS
  ============================================================ */

  function createNote(partial: Partial<Note>): Note {
    const note: Note = {
      id: crypto.randomUUID(),
      notebookId: partial.notebookId ?? null,
      title: partial.title ?? "Nota sem título",
      content: partial.content ?? "",
      tags: partial.tags ?? [],
      links: partial.links ?? [],
      aiInsight: partial.aiInsight ?? "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    persist({
      ...state,
      notes: [...state.notes, note],
    });

    return note;
  }

  function updateNote(id: string, partial: Partial<Note>) {
    persist({
      ...state,
      notes: state.notes.map((n) =>
        n.id === id
          ? { ...n, ...partial, updatedAt: Date.now() }
          : n
      ),
    });
  }

  function deleteNote(id: string) {
    persist({
      ...state,
      notes: state.notes.filter((n) => n.id !== id),
    });
  }

  /* ============================================================
     HARD RESET (modo manutenção / debug)
  ============================================================ */
  function hardReset() {
    persist({ notebooks: [], notes: [] });
  }

  /* ============================================================
     PROVIDER RETURN
  ============================================================ */

  return (
    <NotesContext.Provider
      value={{
        state,
        createNotebook,
        renameNotebook,
        deleteNotebook,
        createNote,
        updateNote,
        deleteNote,
        hardReset,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

/* ============================================================
   HOOK
============================================================ */

export function useNotes(): NotesContextType {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes must be used within <NotesProvider>");
  }
  return ctx;
}