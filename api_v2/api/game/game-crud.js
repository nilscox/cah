const { Game } = require('../../models');
const router = require('./router');
const { NotFoundError } = require('../../errors');
const validateGame = require('../../validation/validateGame');

router.get('/', (req, res, next) => {
  Game.findAll()
    .then(games => res.json(games))
    .catch(next);
});

router.get('/:id', (req, res) => {
  res.json(req.game);
});

router.post('/', (req, res, next) => {
  validateGame(req.body)
    .then(game => Game.create(game))
    .then(game => res.status(201).json(game))
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
