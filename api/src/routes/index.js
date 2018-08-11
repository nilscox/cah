const express = require('express');

const pkg = require('../../package');

const player = require('./player');
const game = require('./game');

const API_ADMIN_TOKEN = process.env.CAH_API_ADMIN_TOKEN;

const router = express.Router();

router.use('/version', (req, res) => res.send(pkg.version));
router.use('/player', player);
router.use('/game', game);

router.post('/admin', (req, res) => {
  if (req.body.token !== API_ADMIN_TOKEN)
    return res.status(401).end();

  req.session.admin = true;
  res.end();
})

module.exports = router;
