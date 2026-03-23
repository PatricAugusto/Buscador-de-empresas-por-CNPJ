const { Router } = require('express');
const favoriteController = require('../controllers/favorite.controller');

const router = Router();

router.get('/', favoriteController.list);
router.post('/:cnpj', favoriteController.add);
router.delete('/:cnpj', favoriteController.remove);

module.exports = router;