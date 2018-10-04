const express = require('express');

const pkg = require('../../package');
const player = require('./player');
const game = require('./game');
const admin = require('./admin');

const router = express.Router();

router.use('/version', (req, res) => res.send(pkg.version));
router.use('/player', player);
router.use('/game', game);
router.use('/admin', admin);

module.exports = router;
