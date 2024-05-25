const express = require('express');
const { register, login } = require('../controllers/userController');
const validInfo = require('../middleware/validInfo');
const router = express.Router();

router.post('/signup', validInfo, register);
router.post('/login', validInfo, login);

module.exports = router;
