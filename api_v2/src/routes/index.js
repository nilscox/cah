const express = require('express');

const player = require('./player');
const game = require('./game');

const router = express.Router();

router.use((req, res, next) => {
  res.format = async (Formatter, inst, opts = {}) => {
    const many = opts.many || false;
    let result = null;

    if (many)
      result = await Promise.all(inst.map(i => Formatter.format(i)));
    else
      result = await Formatter.format(inst);

    return res.json(result);
  };

  next();
});

router.use('/player', player);
router.use('/game', game);

module.exports = router;
