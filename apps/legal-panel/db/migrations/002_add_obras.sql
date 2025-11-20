-- ============================================
-- 002_add_obras.sql
-- Obras musicais + metadados de autoria
-- ============================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS obras (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  autores TEXT NOT NULL,                    -- string JSON: ["Josué", "Convidado"]
  isrc TEXT,                                -- código do fonograma
  splits TEXT,                              -- JSON: { "Josué": 70, "Fulano": 30 }
  descricao TEXT,
  data_registro TEXT DEFAULT (datetime('now')),
  atualizado_em TEXT DEFAULT (datetime('now'))
);

-- Índice para busca rápida por título
CREATE INDEX IF NOT EXISTS idx_obras_titulo ON obras(titulo);