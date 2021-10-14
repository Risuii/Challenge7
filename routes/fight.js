// import express router
const express = require('express');
const router = express.Router();

// import middleware
const restrict = require('../middlewares/restrict');

// import controllers
const fight = require('../controller/fight');

// routes list
router.post('/fight/:id', restrict, fight.game);

// export router
module.exports = router;