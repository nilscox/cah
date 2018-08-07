const router = require('express').Router();

router.use(require('./game-crud'));
router.use(require('./game-history'));
router.use(require('./game-players'));
router.use(require('./game-loop'));

module.exports = router;
