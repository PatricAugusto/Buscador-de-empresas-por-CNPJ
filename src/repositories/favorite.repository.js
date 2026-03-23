const db = require('../db/connection');

function findAll({ limit, offset }) {
  const total = db
    .prepare('SELECT COUNT(*) as count FROM favorites')
    .get().count;

  const data = db.prepare(`
    SELECT
      f.id AS favorite_id,
      f.created_at AS favorited_at,
      c.*
    FROM favorites f
    JOIN companies c ON c.id = f.company_id
    ORDER BY f.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);

  return { data, total };
}

function findByCompanyId(companyId) {
  return db
    .prepare('SELECT * FROM favorites WHERE company_id = ?')
    .get(companyId);
}

function create(companyId) {
  db.prepare('INSERT INTO favorites (company_id) VALUES (?)').run(companyId);
  return findByCompanyId(companyId);
}

function remove(companyId) {
  const result = db
    .prepare('DELETE FROM favorites WHERE company_id = ?')
    .run(companyId);
  return result.changes > 0;
}

module.exports = { findAll, findByCompanyId, create, remove };