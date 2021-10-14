// import express router
const express = require('express');
const router = express.Router();

// import router
const main = require('./main');
const auth = require('./auth');
const room = require('./room');
const fight = require('./fight');

// routes list
router.use('/', main);
router.use('/', room);
router.use('/', fight);
router.use('/auth', auth);

// export router
module.exports = router;