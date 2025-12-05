const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', authController.registrar)

router.post('/login', authController.login)

router.get('/me', auth, authController.me)

router.get('/users', auth, authController.listAllUsers)

router.get("/validate-token", auth, (req, res) => {
    res.json({ ok: true });
});

module.exports = router;