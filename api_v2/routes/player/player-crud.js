const { Player, sequelize } = require('../../models');
const { PlayerValidator } = require('../../validators');
const { PlayerFormatter } = require('../../formatters');
const { ValidationError, NotFoundError } = require('../../errors');
const router = require('./router');

router.param('nick', (req, res, next, nick) => {
  Player.findOne({
    where: { nick: nick },
    include: ['game'],
  })
    .then(player => {
      if (!player)
        throw new NotFoundError('player');

      req.player = player;
      next();
    })
    .catch(next);
});

router.get('/list', (req, res, next) => {
  Player.findAll({ include: ['game'] })
    .then(players => res.format(PlayerFormatter, players, { many: true }))
    .catch(next);
});

router.get('/', (req, res, next) => {
  if (!req.player)
    return next();

  res.format(PlayerFormatter, req.player);
});

router.get('/:nick', (req, res) => {
  res.format(PlayerFormatter, req.player);
});

router.post('/', (req, res, next) => {
  PlayerValidator.validate(req.body, null)
    .then(player => Player.create(player))
    .tap(player => req.session.player = player.nick)
    .then(player => res.status(201).json(player))
    .catch(next);
});

router.put('/:nick', (req, res, next) => {
  PlayerValidator.validate(req.body, { partial: true, nick: { readOnly: true } })
    .then(player => req.player.update(player))
    .then(player => res.json(player))
    .catch(next);
});

router.delete('/:nick', (req, res, next) => {
  req.player.destroy()
    .then(() => res.status(204).end())
    .catch(next);
});
