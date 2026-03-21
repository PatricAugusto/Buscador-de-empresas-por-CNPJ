const companyRepository = require('../repositories/company.repository');

const BRASIL_API_URL = 'https://brasilapi.com.br/api/cnpj/v1';

async function fetchFromBrasilApi(cnpj) {
  const response = await fetch(`${BRASIL_API_URL}/${cnpj}`, {
    headers: {
      'User-Agent': 'cnpj-buscador/1.0',
      'Accept': 'application/json',
    },
  });

  if (response.status === 404) {
    const error = new Error('CNPJ não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  if (!response.ok) {
    const error = new Error('Erro ao consultar a BrasilAPI.');
    error.statusCode = 502;
    throw error;
  }

  return response.json();
}

function normalizeCompany(data) {
  return {
    cnpj:          data.cnpj.replace(/\D/g, ''),
    razao_social:  data.razao_social,
    nome_fantasia: data.nome_fantasia || null,
    situacao:      data.descricao_situacao_cadastral,
    logradouro:    data.logradouro || null,
    numero:        data.numero || null,
    municipio:     data.municipio || null,
    uf:            data.uf || null,
    cep:           data.cep?.replace(/\D/g, '') || null,
    telefone:      data.ddd_telefone_1 || null,
    email:         data.email || null,
  };
}

async function getCompanyByCnpj(cnpj) {
  const cleanCnpj = cnpj.replace(/\D/g, '');

  const cached = companyRepository.findByCnpj(cleanCnpj);
  if (cached) return { company: cached, source: 'cache' };

  const apiData = await fetchFromBrasilApi(cleanCnpj);
  const normalized = normalizeCompany(apiData);
  const company = companyRepository.create(normalized);

  return { company, source: 'api' };
}

module.exports = { getCompanyByCnpj };