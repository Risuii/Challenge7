// import express router
const express = require('express');
const router = express.Router();

// import controllers
const main = require('../controller/main');

// routes list
router.get('/', main.home);

// export router
module.exports = router;