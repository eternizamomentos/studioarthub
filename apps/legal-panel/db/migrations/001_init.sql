-- ============================================
-- 001_init.sql
-- Base do banco jurídico do Studio Art Hub
-- ============================================

PRAGMA foreign_keys = ON;

-- Tabela de contratos (estrutura simples inicial)
CREATE TABLE IF NOT EXISTS contratos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  partes_envvolvidas TEXT,
  data_criacao TEXT NOT NULL DEFAULT (datetime('now')),
  conteudo TEXT,
  hash TEXT,
  atualizado_em TEXT DEFAULT (datetime('now'))
);