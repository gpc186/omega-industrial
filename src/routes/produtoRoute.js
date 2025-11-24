const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const auth = require('../middleware/authMiddleware');
const adm = require('../middleware/adminMiddleware');

router.get('/', produtoController.listarTodos);
router.get('/:id', produtoController.listarPorId);

router.post('/', auth, adm, produtoController.create);
router.put('/:id', auth, adm, produtoController.update);
router.delete('/:id', auth, adm, produtoController.delete);

module.exports = router;