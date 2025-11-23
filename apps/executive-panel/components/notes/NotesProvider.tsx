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

export type NoteAttachment = {
  id: string;
  type: "audio" | "image" | "file";
  url: string;
  name: string;
  duration?: number; // para áudio
  size?: number;
};

export type Note = {
  id: string;
  notebookId: string;
  title: string;
  content: string;
  attachments: NoteAttachment[];   // 🔥 novo campo
  audio?: string[];                // ✅ campo para URLs de áudio anexados
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

  createNote: () => Note | null;
  updateNote: (id: string, fields: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

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
   PROVIDER — ULTRA PREMIUM
============================================================ */

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const [initialized, setInitialized] = useState(false);

  /* ============================================================
     SIDEBAR (UI)
  ============================================================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((p) => !p);

  /* ============================================================
     EDITOR VISIBILITY (ANIMAÇÃO)
  ============================================================= */
  const [editorVisible, setEditorVisible] = useState(false);

  function openEditor(noteId: string) {
    setActiveNoteId(noteId);
    setEditorVisible(true);
  }

  function closeEditor() {
    setEditorVisible(false);

    // Remove a nota ativa após animação completa
    setTimeout(() => {
      setActiveNoteId(null);
    }, 185);
  }

  /* ============================================================
     LOAD FROM LOCALSTORAGE (robusto)
============================================================ */
  useEffect(() => {
    try {
      const storedNB = JSON.parse(localStorage.getItem(STORAGE_NOTEBOOKS) || "[]");
      const storedNT = JSON.parse(localStorage.getItem(STORAGE_NOTES) || "[]");

      let activeNB = localStorage.getItem(STORAGE_ACTIVE_NOTEBOOK);
      let activeNT = localStorage.getItem(STORAGE_ACTIVE_NOTE);

      // Notebook padrão
      if (!storedNB.length) {
        const defaultNB = {
          id: crypto.randomUUID(),
          name: "Geral",
          icon: "📒",
        };
        storedNB.push(defaultNB);
        activeNB = defaultNB.id;
      }

      setNotebooks(storedNB);
      setNotes(storedNT);
      setActiveNotebookId(activeNB);
      setActiveNoteId(activeNT);

      if (activeNT) setEditorVisible(true);

      setInitialized(true);
    } catch (err) {
      console.error("❌ Erro carregando LocalStorage:", err);
    }
  }, []);

  /* ============================================================
     SAVE (com segurança)
============================================================ */

  const safeStore = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("❌ Erro salvando:", key, err);
    }
  };

  useEffect(() => {
    if (initialized) safeStore(STORAGE_NOTEBOOKS, notebooks);
  }, [notebooks, initialized]);

  useEffect(() => {
    if (initialized) safeStore(STORAGE_NOTES, notes);
  }, [notes, initialized]);

  useEffect(() => {
    if (!initialized) return;
    activeNotebookId
      ? localStorage.setItem(STORAGE_ACTIVE_NOTEBOOK, activeNotebookId)
      : localStorage.removeItem(STORAGE_ACTIVE_NOTEBOOK);
  }, [activeNotebookId, initialized]);

  useEffect(() => {
    if (!initialized) return;
    activeNoteId
      ? localStorage.setItem(STORAGE_ACTIVE_NOTE, activeNoteId)
      : localStorage.removeItem(STORAGE_ACTIVE_NOTE);
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
    const notesToDelete = notes.filter((n) => n.notebookId === id);

    // Fecha editor SE a nota aberta está sendo removida
    if (notesToDelete.some((n) => n.id === activeNoteId)) {
      closeEditor();
    }

    setNotebooks((p) => p.filter((n) => n.id !== id));
    setNotes((p) => p.filter((n) => n.notebookId !== id));

    if (activeNotebookId === id) setActiveNotebookId(null);
  }

  /* ============================================================
     NOTE ACTIONS
============================================================ */

  function createNote(): Note | null {
    if (!activeNotebookId) {
      console.warn("⚠ createNote chamado sem notebook ativo.");
      return null;
    }

    const now = Date.now();

    const note: Note = {
      id: crypto.randomUUID(),
      notebookId: activeNotebookId,
      title: "Nova nota",
      content: "",
      attachments: [],       // 🔥 novo
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [...prev, note]);
    openEditor(note.id);

    return note;
  }

  function updateNote(id: string, fields: Partial<Note>) {
    setNotes((p) =>
      p.map((n) =>
        n.id === id
          ? { ...n, ...fields, updatedAt: Date.now() }
          : n
      )
    );
  }

  function deleteNote(id: string) {
    if (activeNoteId === id) closeEditor();
    setNotes((p) => p.filter((n) => n.id !== id));
  }

  /* ============================================================
     FINAL CONTEXT VALUE
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