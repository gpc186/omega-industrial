const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const auth = require('../middleware/authMiddleware');
const adm = require('../middleware/adminMiddleware');

router.get('/', produtoController.listarTodos);
router.get('/:id', produtoController.listarPorId);

router.post('/adm/createProd', auth, adm, produtoController.create);
router.put('/adm/:id/updateProd', auth, adm, produtoController.update);
router.delete('/adm/:id/removeProd', auth, adm, produtoController.remove);

module.exports = router;