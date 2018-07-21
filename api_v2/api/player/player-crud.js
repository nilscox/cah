const { Player, Game } = require('../../models');
const validatePlayer = require('../../validation/validatePlayer');
const { ValidationError, NotFoundError } = require('../../errors');
const router = require('./router');

const validatePlayerNickUnique = (nick) => {
  return Player.count({ where: { nick } })
    .then(count => {
      if (count > 0)
        throw new ValidationError('nick', 'this nick is already taken');
    });
}

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
    .then(players => res.json(players))
    .catch(next);
});

router.get('/', (req, res, next) => {
  if (!req.player)
    return next();

  res.json(req.player);
});

router.get('/:nick', (req, res) => {
  res.json(req.player);
});

router.post('/', (req, res, next) => {
  validatePlayer(req.body)
    .tap(player => validatePlayerNickUnique(player.nick))
    .then(player => Player.create(player))
    .tap(player => req.session.player = player.nick)
    .then(player => res.status(201).json(player))
    .catch(next);
});

router.put('/:nick', (req, res, next) => {
  if (req.body.nick)
    throw new ValidationError('you can\'t change your nick');

  validatePlayer(req.body, { partial: true })
    .tap(player => validatePlayerNickUnique(player.nick))
    .then(player => req.player.update(player))
    .then(player => res.json(player))
    .catch(next);
});

router.delete('/:nick', (req, res, next) => {
  req.player.destroy()
    .then(() => res.status(204).end());
});
