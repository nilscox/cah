const express = require('express');

const pkg = require('../../package');
const config = require('../config');
const player = require('./player');
const game = require('./game');

const router = express.Router();

router.use('/version', (req, res) => res.send(pkg.version));
router.use('/player', player);
router.use('/game', game);

router.post('/admin', (req, res) => {
  if (req.body.token !== config.adminToken)
    return res.status(401).end();

  req.session.admin = true;
  res.end();
});

module.exports = router;
