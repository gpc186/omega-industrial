const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const adm = require('../middleware/adminMiddleware');

router.get('/', categoryController.listarTodos);
router.get('/:id', categoryController.listarPorId);
router.get('/:id/products', categoryController.listarPorCategoria)

router.post('/adm/createCat', auth, adm, categoryController.create);
router.put('/adm/:id/updateCat', auth, adm, categoryController.update);
router.delete('/adm/:id/removeCat', auth, adm, categoryController.remove);

module.exports = router