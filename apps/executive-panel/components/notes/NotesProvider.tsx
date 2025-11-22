// apps/executive-panel/components/notes/NotesProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* ============================================================
   TYPES
============================================================ */

export type Notebook = {
  id: string;
  name: string;
  icon?: string;
};

export type Note = {
  id: string;
  notebookId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

/* ============================================================
   CONTEXT TYPE
============================================================ */

type NotesContextType = {
  notebooks: Notebook[];
  notes: Note[];

  activeNotebookId: string | null;
  activeNoteId: string | null;

  setActiveNotebook: (id: string | null) => void;
  setActiveNote: (id: string | null) => void;

  createNotebook: (name: string, icon?: string) => void;
  renameNotebook: (id: string, newName: string) => void;
  deleteNotebook: (id: string) => void;

  createNote: () => Note;
  updateNote: (id: string, fields: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  /* === Editor slide-in/out state === */
  editorVisible: boolean;
  openEditor: (noteId: string) => void;
  closeEditor: () => void;
};

const NotesContext = createContext<NotesContextType | null>(null);

/* ============================================================
   STORAGE KEYS
============================================================ */

const STORAGE_NOTEBOOKS = "sah_notes_notebooks_v1";
const STORAGE_NOTES = "sah_notes_items_v1";
const STORAGE_ACTIVE_NOTEBOOK = "sah_notes_activeNotebook_v1";
const STORAGE_ACTIVE_NOTE = "sah_notes_activeNote_v1";

/* ============================================================
   PROVIDER — PREMIUM + ANIMATION-COMPATIBLE
============================================================ */

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const [initialized, setInitialized] = useState(false);

  /* ============================================================
     SIDEBAR STATE
  ============================================================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((p) => !p);

  /* ============================================================
     EDITOR ANIMATION STATE (Apple Notes)
  ============================================================= */

  const [editorVisible, setEditorVisible] = useState(false);

  /** Abre editor com animação */
  function openEditor(noteId: string) {
    setActiveNoteId(noteId);
    setEditorVisible(true); // animação começa imediatamente
  }

  /** Fecha editor suavemente, remove activeNoteId só após a animação */
  function closeEditor() {
    setEditorVisible(false); // aciona animação de saída (170ms)

    setTimeout(() => {
      setActiveNoteId(null); // remove nota após animação
    }, 180); // Apple Notes: 170ms – usamos 180ms para segurança
  }

  /* ============================================================
     LOAD FROM LOCALSTORAGE
============================================================ */

  useEffect(() => {
    try {
      const storedNB = localStorage.getItem(STORAGE_NOTEBOOKS);
      const storedNT = localStorage.getItem(STORAGE_NOTES);

      const nbs: Notebook[] = storedNB ? JSON.parse(storedNB) : [];
      const nts: Note[] = storedNT ? JSON.parse(storedNT) : [];

      let activeNB = localStorage.getItem(STORAGE_ACTIVE_NOTEBOOK);
      let activeNT = localStorage.getItem(STORAGE_ACTIVE_NOTE);

      if (nbs.length === 0) {
        const defaultNB: Notebook = {
          id: crypto.randomUUID(),
          name: "Geral",
          icon: "📒",
        };
        nbs.push(defaultNB);
        activeNB = defaultNB.id;
      }

      setNotebooks(nbs);
      setNotes(nts);
      setActiveNotebookId(activeNB ?? null);
      setActiveNoteId(activeNT ?? null);

      if (activeNT) {
        setEditorVisible(true); // restaura editor aberto
      }

      setInitialized(true);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  }, []);

  /* ============================================================
     SAVE LOCALSTORAGE
============================================================ */

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(STORAGE_NOTEBOOKS, JSON.stringify(notebooks));
  }, [notebooks, initialized]);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
  }, [notes, initialized]);

  useEffect(() => {
    if (!initialized) return;
    if (activeNotebookId !== null) {
      localStorage.setItem(STORAGE_ACTIVE_NOTEBOOK, activeNotebookId);
    }
  }, [activeNotebookId, initialized]);

  useEffect(() => {
    if (!initialized) return;
    if (activeNoteId !== null) {
      localStorage.setItem(STORAGE_ACTIVE_NOTE, activeNoteId);
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_NOTE);
    }
  }, [activeNoteId, initialized]);

  /* ============================================================
     NOTEBOOK ACTIONS
============================================================ */

  function createNotebook(name: string, icon?: string) {
    const nb: Notebook = {
      id: crypto.randomUUID(),
      name,
      icon: icon ?? "🗂️",
    };
    setNotebooks((p) => [...p, nb]);
    setActiveNotebookId(nb.id);
  }

  function renameNotebook(id: string, newName: string) {
    setNotebooks((p) =>
      p.map((n) => (n.id === id ? { ...n, name: newName } : n))
    );
  }

  function deleteNotebook(id: string) {
    setNotebooks((p) => p.filter((n) => n.id !== id));
    const toDelete = notes.filter((n) => n.notebookId === id);

    setNotes((p) => p.filter((n) => n.notebookId !== id));

    if (activeNotebookId === id) setActiveNotebookId(null);
    if (toDelete.some((n) => n.id === activeNoteId)) {
      closeEditor();
    }
  }

  /* ============================================================
     NOTE ACTIONS
============================================================ */

  function createNote(): Note {
    if (!activeNotebookId) {
      console.warn("createNote called without notebook");
      return {
        id: "",
        notebookId: "",
        title: "",
        content: "",
        createdAt: 0,
        updatedAt: 0,
      };
    }

    const now = Date.now();
    const note: Note = {
      id: crypto.randomUUID(),
      notebookId: activeNotebookId,
      title: "Nova nota",
      content: "",
      createdAt: now,
      updatedAt: now,
    };

    setNotes((p) => [...p, note]);
    openEditor(note.id);

    return note;
  }

  function updateNote(id: string, fields: Partial<Note>) {
    setNotes((p) =>
      p.map((n) =>
        n.id === id ? { ...n, ...fields, updatedAt: Date.now() } : n
      )
    );
  }

  function deleteNote(id: string) {
    setNotes((p) => p.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      closeEditor();
    }
  }

  /* ============================================================
     CONTEXT VALUE
============================================================ */

  const value: NotesContextType = {
    notebooks,
    notes,

    activeNotebookId,
    activeNoteId,

    setActiveNotebook: setActiveNotebookId,
    setActiveNote: setActiveNoteId,

    createNotebook,
    renameNotebook,
    deleteNotebook,

    createNote,
    updateNote,
    deleteNote,

    sidebarOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,

    editorVisible,
    openEditor,
    closeEditor,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

/* ============================================================
   HOOK
============================================================ */

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be inside NotesProvider");
  return ctx;
}