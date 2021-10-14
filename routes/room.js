// import express router
const express = require('express');
const router = express.Router();

// import middleware
const restrict = require('../middlewares/restrict');

// import controllers
const room = require('../controller/room');

// routes list
router.post('/room', restrict, room.createRoom);

// export router
module.exports = router;