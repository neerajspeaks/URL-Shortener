const express = require('express');
const {handleUserSignUp, handleUserLogin} = require('../controllers/user');

const router = express.Router();

router.post('/', handleUserSignUp);

router.post('/login', handleUserLogin);

router.get('/logout', handleUserLogin);

module.exports = router;