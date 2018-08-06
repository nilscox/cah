const router = require('express').Router();

router.use(require('./player-crud'));
router.use(require('./player-auth'));

module.exports = router;
