const db = require('../db/connection');

function findByCnpj(cnpj) {
  return db.prepare('SELECT * FROM companies WHERE cnpj = ?').get(cnpj);
}

function create(company) {
  const stmt = db.prepare(`
    INSERT INTO companies
      (cnpj, razao_social, nome_fantasia, situacao, logradouro, numero, municipio, uf, cep, telefone, email)
    VALUES
      (@cnpj, @razao_social, @nome_fantasia, @situacao, @logradouro, @numero, @municipio, @uf, @cep, @telefone, @email)
  `);

  stmt.run(company);
  return findByCnpj(company.cnpj);
}

function search({ field, value, limit, offset }) {
  const total = db
    .prepare(`SELECT COUNT(*) as count FROM companies WHERE ${field} LIKE ?`)
    .get(`%${value}%`).count;

  const data = db
    .prepare(`SELECT * FROM companies WHERE ${field} LIKE ? LIMIT ? OFFSET ?`)
    .all(`%${value}%`, limit, offset);

  return { data, total };
}

module.exports = { findByCnpj, create, search };