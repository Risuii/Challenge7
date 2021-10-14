// import express router
const express = require('express');
const router = express.Router();

// import controllers
const auth = require('../controller/auth');

// routes list
router.post('/register', auth.register);
router.post('/login', auth.login);

// export router
module.exports = router;