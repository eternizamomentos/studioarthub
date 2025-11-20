-- ============================================
-- 003_add_evidencias.sql
-- Evidências + Cadeia de Custódia
-- ============================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS evidencias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  obra_id INTEGER,
  nome_arquivo TEXT NOT NULL,
  mime TEXT,
  tamanho_bytes INTEGER,
  caminho_storage TEXT NOT NULL,
  hash_sha256 TEXT NOT NULL,
  ots_timestamp TEXT,                        -- payload enviado ao servidor OTS
  ots_prova TEXT,                            -- prova retornada após consolidação
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_evidencias_obra_id 
  ON evidencias(obra_id);