const router = require('./router');
const { NotFoundError } = require('../../errors');
const { Game } = require('../../models');
const { GameValidator } = require('../../validators');
const { GameFormatter } = require('../../formatters');

router.get('/', (req, res, next) => {
  Game.findAll({
    include: 'owner',
  })
    .then(games => res.format(GameFormatter, games, { many: true }))
    .catch(next);
});

router.get('/:id', (req, res) => {
  res.format(GameFormatter, req.game);
});

router.post('/', (req, res, next) => {
  GameValidator.validate(req.body)
    .then(game => Game.create(game))
    .then(game => game.setOwner(req.player))
    .then(game => game.reload({ include: ['players', 'owner'] }))
    .then(game => res.status(201).format(GameFormatter, game))
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  GameValidator.validate(req.body, { partial: true, lang: { readOnly: true } })
    .then(game => req.game.update(game))
    .then(game => res.format(GameFormatter, game))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  req.game.destroy()
    .then(() => res.status(204).end());
});
