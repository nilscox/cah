import express from 'express';

import { Game } from '../types/Game';
import { Choice } from '../types/Choice';
import APIError from '../APIError';
import { startGame, answerChoices, selectAnswer, nextTurn, endGame } from '../game';
import { formatGame, formatAnswer, formatTurn } from '../format';
import { isAuthenticated, isInGame, isNotInGame } from '../guards';

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
  // const gameId = Math.random().toString(36).slice(-4).toUpperCase();
  const gameId = 'ABCD';

  const game: Game = {
    id: gameId,
    state: 'idle',
    players: [player!],
    questions: [...data.questions],
    choices: [...data.choices],
  };

  games.push(game);
  player!.gameId = game.id;

  player!.socket?.join(game.id);

  res.status(201);
  res.json(formatGame(game));
});

router.post('/join', isAuthenticated, isNotInGame, (req, res) => {
  const { body: { gameId }, state: { games }, player, io } = req;

  if (!gameId)
    throw new APIError(400, 'missing gameId');

  const game = games.find(g => g.id === gameId);

  if (!game)
    throw new APIError(404, 'game not found');

  if (game.state !== 'idle')
    throw new APIError(400, 'game is not idle');

  game.players.push(req.player!);
  player!.gameId = game.id;

  res.json(formatGame(game));

  player!.socket?.join(game.id);

  io.in(game.id).send({
    type: 'join',
    player: { nick: player!.nick, connected: !!player!.socket },
  });
});

router.post('/start', isInGame, (req, res) => {
  const { game, io } = req;

  if (!game)
    throw new APIError(500, 'req.game is not defined');

  if (game.state !== 'idle')
    throw new APIError(400, 'game is not idle');

  startGame(game);

  res.json(formatGame(game));

  io.in(game.id).send({
    type: 'start',
    game: formatGame(game),
  });
});

router.post('/answer', isInGame, (req, res) => {
  const { body: { cards }, game, player, io } = req;

  if (game!.state !== 'started')
    throw new APIError(400, 'game is not started');

  if (game!.playState !== 'players_answer')
    throw new APIError(400, 'waiting for the question master to select an answer');

  if (game!.questionMaster === player!.nick)
    throw new APIError(400, 'the question master can not answer');

  if (!cards)
    throw new APIError(400, 'missing cards');

  const choices: Choice[] = [];

  for (const text of cards) {
    const card = player!.cards!.find(c => c.text === text);

    if (!card)
      throw new APIError(400, 'invalid cards');

    choices.push(card);
  }

  if (game!.question!.blanks === null && choices.length !== 1)
    throw new APIError(400, 'invalid number of cards');

  if (game!.question!.blanks !== null && game!.question!.blanks!.length !== choices.length)
    throw new APIError(400, 'invalid number of cards');

  const answer = answerChoices(game!, player!, choices);

  res.json(formatAnswer(answer));

  io.in(game!.id).send({
    type: 'answer',
    nick: player!.nick,
  });

  // @ts-ignore
  if (game!.playState === 'question_master_selection') {
    io.in(game!.id).send({
      type: 'allanswers',
      answers: game!.answers!.map(a => ({ choices: a.choices })),
    });
  }
});

router.post('/select', isInGame, (req, res) => {
  const { body: { answerIndex }, game, player, io } = req;

  if (game!.state !== 'started')
    throw new APIError(400, 'game is not started');

  if (game!.questionMaster !== player!.nick)
    throw new APIError(400, 'only the question master can select an answer');

  if (game!.playState !== 'question_master_selection')
    throw new APIError(400, 'not all players answered yet');

  if (answerIndex === undefined)
    throw new APIError(400, 'missing answerIndex');

  const answer = game!.answers![answerIndex];

  if (!answer)
    throw new APIError(400, 'invalid answerIndex');

  const turn = selectAnswer(game!, answer);

  if (!nextTurn(game!, turn.winner)) {
    endGame(game!);

    io.in(game!.id).send({
      type: 'end',
      game: formatGame(game!),
    });
  }

  res.json(formatTurn(turn));

  io.in(game!.id).send({
    type: 'turn',
    turn: formatTurn(turn),
  });

  io.in(game!.id).send({
    type: 'next',
    game: formatGame(game!),
  });
});

export default router;
