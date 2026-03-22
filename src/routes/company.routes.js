const { Router } = require('express');
const companyController = require('../controllers/company.controller');

const router = Router();

router.get('/cnpj/:cnpj', companyController.getByCnpj);
router.get('/search', companyController.search);

module.exports = router;