const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registrar, (req, res)=>{
    res.send('/register')
})

router.post('/login', authController.login , (req, res)=>{
    res.send('/login')
})

module.exports = router;