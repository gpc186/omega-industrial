const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const adm = require('../middleware/adminMiddleware');

router.get('/:id', auth, orderController.getOrderById);
router.get('/me', auth, orderController.getMyOrders);

router.post('/', auth, orderController.createOrder);

router.get('/adm/allOrders', auth, adm, orderController.listAllOrders);
router.patch('/adm/:id/updateStatus', auth, adm, orderController.updateOrderstatus);

module.exports = router;