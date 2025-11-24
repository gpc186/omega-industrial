const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const CartController = require('../controllers/cartController');

router.post('/add', auth, CartController.add);
router.get('/', auth, CartController.list);
router.put('/:id/updateCart', auth, CartController.update);
router.delete('/:id', auth, CartController.remove);
router.get('/total', auth, CartController.total);
router.get('/count', auth , CartController.count);

module.exports = router;