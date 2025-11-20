-- ============================================
-- 004_add_auditoria.sql
-- Auditoria completa de ações jurídicas
-- ============================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS auditoria_eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  categoria TEXT NOT NULL,                    -- ex: "obra", "evidencia", "contrato"
  acao TEXT NOT NULL,                         -- ex: "criou", "atualizou", "removeu"
  detalhes TEXT,                               -- JSON detalhando o evento
  ip TEXT,
  user_agent TEXT,
  criado_em TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_auditoria_categoria 
  ON auditoria_eventos(categoria);