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

  const result = stmt.run(company);
  return findByCnpj(company.cnpj);
}

module.exports = { findByCnpj, create };