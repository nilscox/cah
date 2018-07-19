const express = require('express');

const player = require('./player');
const game = require('./game');

const router = express.Router();

router.use('/player', player);
router.use('/game', game);

module.exports = router;
