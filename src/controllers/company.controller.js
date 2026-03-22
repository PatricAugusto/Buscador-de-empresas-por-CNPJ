const companyService = require('../services/company.service');

async function getByCnpj(req, res) {
  const { cnpj } = req.params;

  if (!/^\d{14}$/.test(cnpj.replace(/\D/g, ''))) {
    return res.status(400).json({ error: 'CNPJ inválido. Informe 14 dígitos.' });
  }

  try {
    const { company, source } = await companyService.getCompanyByCnpj(cnpj);
    return res.json({ company, source });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message });
  }
}

function search(req, res) {
  const { by, value, page, pageSize } = req.query;

  try {
    const result = companyService.searchCompanies({ by, value, page, pageSize });
    return res.json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message });
  }
}

module.exports = { getByCnpj, search };