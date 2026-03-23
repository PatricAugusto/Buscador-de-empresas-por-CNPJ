const favoriteService = require('../services/favorite.service');

function list(req, res) {
  const { page, pageSize } = req.query;
  try {
    const result = favoriteService.listFavorites({ page, pageSize });
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

function add(req, res) {
  const { cnpj } = req.params;
  try {
    const favorite = favoriteService.addFavorite(cnpj);
    return res.status(201).json(favorite);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

function remove(req, res) {
  const { cnpj } = req.params;
  try {
    favoriteService.removeFavorite(cnpj);
    return res.status(204).send();
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

module.exports = { list, add, remove };