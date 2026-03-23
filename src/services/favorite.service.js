const favoriteRepository = require('../repositories/favorite.repository');
const companyRepository  = require('../repositories/company.repository');

function listFavorites({ page, pageSize }) {
  const limit  = Math.min(parseInt(pageSize) || 10, 50);
  const offset = ((parseInt(page) || 1) - 1) * limit;

  const { data, total } = favoriteRepository.findAll({ limit, offset });

  return {
    data,
    pagination: {
      total,
      page:       parseInt(page) || 1,
      pageSize:   limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

function addFavorite(cnpj) {
  const cleanCnpj = cnpj.replace(/\D/g, '');
  const company = companyRepository.findByCnpj(cleanCnpj);

  if (!company) {
    const error = new Error('Empresa não encontrada no banco. Consulte o CNPJ primeiro.');
    error.statusCode = 404;
    throw error;
  }

  const already = favoriteRepository.findByCompanyId(company.id);
  if (already) {
    const error = new Error('Empresa já está nos favoritos.');
    error.statusCode = 409;
    throw error;
  }

  return favoriteRepository.create(company.id);
}

function removeFavorite(cnpj) {
  const cleanCnpj = cnpj.replace(/\D/g, '');
  const company = companyRepository.findByCnpj(cleanCnpj);

  if (!company) {
    const error = new Error('Empresa não encontrada no banco.');
    error.statusCode = 404;
    throw error;
  }

  const removed = favoriteRepository.remove(company.id);
  if (!removed) {
    const error = new Error('Empresa não está nos favoritos.');
    error.statusCode = 404;
    throw error;
  }

  return true;
}

module.exports = { listFavorites, addFavorite, removeFavorite };