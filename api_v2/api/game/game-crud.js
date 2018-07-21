const { Game } = require('../../models');
const router = require('./router');
const { NotFoundError } = require('../../errors');
const validateGame = require('../../validation/validateGame');
const { GameFormatter } = require('../../formatters');
const { isPlayer } = require('../../auth');

router.get('/', (req, res, next) => {
  Game.findAll({ include: 'players' })
    .then(games => res.json(games))
    .catch(next);
});

router.get('/:id', (req, res) => {
  res.json(new GameFormatter('full').format(req.game));
});

router.post('/', isPlayer, (req, res, next) => {
  validateGame(req.body)
    .then(game => Game.create(game))
    .then(game => game.setOwner(req.player))
    .then(game => game.reload({ include: ['players', 'owner'] }))
    .then(game => res.status(201).json(new GameFormatter().format(game)))
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  validateGame(req.body, { partial: true })
    .then(game => req.game.update(game))
    .then(game => res.json(game))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  req.game.destroy()
    .then(() => res.status(204).end());
});
