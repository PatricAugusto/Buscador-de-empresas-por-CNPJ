const db = require('./connection');

db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    cnpj         TEXT    NOT NULL UNIQUE,
    razao_social TEXT    NOT NULL,
    nome_fantasia TEXT,
    situacao     TEXT    NOT NULL,
    logradouro   TEXT,
    numero       TEXT,
    municipio    TEXT,
    uf           TEXT,
    cep          TEXT,
    telefone     TEXT,
    email        TEXT,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company_id)
  );
`);

console.log('Migration executada com sucesso.');