const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');

const CartController = require('../controllers/cartController');

router.post('/add', authenticateToken, CartController.add);
router.get('/', authenticateToken, CartController.list);
router.put('/:id', authenticateToken, CartController.update);
router.delete('/:id', authenticateToken, CartController.remove);

module.exports = router;
