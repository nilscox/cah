import express from 'express';

import { Game } from '../types/Game';
import { Choice } from '../types/Choice';
import APIError from '../APIError';
import { formatGame, formatAnswer, formatTurn, formatPlayer } from '../format';
import { isAuthenticated, isInGame, isNotInGame } from '../guards';

import * as g from '../game';
import * as events from '../events';

const router = express.Router();

router.get('/', (req, res) => {
  const gameId = req.query.gameId;
  const { state: { games } } = req;

  if (!gameId)
    throw new APIError(400, 'missing gameId query param');

  const game = games.find(g => g.id === gameId);

  if (!game)
    throw new APIError(404, 'game not found');

  res.json(formatGame(game, true));
});

router.post('/new', isAuthenticated, (req, res) => {
  const { player, state: { games, data } } = req;

  let game: Game;
  let n = 0;

  do {
    game = g.create(data, player!);
    n++;
  } while (n < 10 && games.find(g => g.id === game.id));

  if (n === 10)
    throw new APIError(500, 'no more available id');

  games.push(game);
  player!.gameId = game.id;

  player!.socket?.join(game.id);

  res.status(201);
  res.json(formatGame(game));
});

router.post('/join', isAuthenticated, isNotInGame, (req, res) => {
  const { body: { gameId }, state: { games }, player } = req;

  if (!player)
    throw new APIError(500, 'something is not defined');

  if (!gameId)
    throw new APIError(400, 'missing gameId');

  const game = games.find(g => g.id === gameId);

  if (!game)
    throw new APIError(404, 'game not found');

  if (game.state !== 'idle')
    throw new APIError(400, 'game is not idle');

  game.players.push(player);
  player.gameId = game.id;

  res.json(formatGame(game));

  player.socket?.join(game.id);
  events.join(req.io, game, player);
});

router.post('/start', isInGame('idle'), (req, res) => {
  const { game } = req;

  if (!game)
    throw new APIError(500, 'something is not defined');

  g.start(game);

  res.json(formatGame(game));

  events.start(req.io, game);
});

router.post('/answer', isInGame('started', 'players_answer'), (req, res) => {
  const { body: { cards }, game, player } = req;

  if (!player || !player.cards || !game || !game.question || !game.answers)
    throw new APIError(500, 'something is not defined');

  if (game.questionMaster === player.nick)
    throw new APIError(400, 'the question master can not answer');

  if (!cards)
    throw new APIError(400, 'missing cards');

  const choices: Choice[] = [];

  for (const text of cards) {
    const card = player.cards.find(c => c.text === text);

    if (!card)
      throw new APIError(400, 'invalid cards');

    choices.push(card);
  }

  if (game.question!.blanks === null && choices.length !== 1)
    throw new APIError(400, 'invalid number of cards');

  if (game.question.blanks !== null && game.question.blanks.length !== choices.length)
    throw new APIError(400, 'invalid number of cards');

  const answer = g.answerChoices(game, player, choices);

  res.json(formatAnswer(answer));

  events.answer(req.io, game, player.nick);

  // @ts-ignore
  if (game.playState === 'question_master_selection') {
    events.allAnswers(req.io, game, game.answers);
  }
});

router.post('/select', isInGame('started', 'question_master_selection'), (req, res) => {
  const { body: { answerIndex }, game, player } = req;

  if (!player || !game || !game.answers)
    throw new APIError(500, 'something is not defined');

  if (game.questionMaster !== player.nick)
    throw new APIError(400, 'only the question master can select an answer');

  if (answerIndex === undefined)
    throw new APIError(400, 'missing answerIndex');

  const answer = game.answers[answerIndex];

  if (!answer)
    throw new APIError(400, 'invalid answerIndex');

  const turn = g.selectAnswer(game, answer);

  res.json(formatTurn(turn));

  events.turn(req.io, game, turn);
});

router.post('/next', isInGame('started', 'end_of_turn'), (req, res) => {
  const { game, player } = req;

  if (!player || !game || !game.turns)
    throw new APIError(500, 'something is not defined');

  if (game.questionMaster !== player.nick)
    throw new APIError(400, 'only the question master can go next');

  const end = !g.nextTurn(game, game.turns[game.turns.length - 1].winner);

  res.status(204).end();

  if (end) {
    g.end(game);
    events.end(req.io, game);
  } else {
    events.next(req.io, game);
  }
});

export default router;
