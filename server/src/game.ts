import { Player } from './types/Player';
import { Game, Answer, Turn } from './types/Game';
import { Choice } from './types/Choice';
import { randomItem, shuffle } from './utils';
import { Question } from 'src/types/Question';

export const create = (data: { questions: Question[], choices: Choice[]}, player: Player) => {
  // const gameId = Math.random().toString(36).slice(-4).toUpperCase();
  const gameId = 'ABCD';

  const game: Game = {
    id: gameId,
    state: 'idle',
    players: [player!],
    questions: [...data.questions],
    choices: [...data.choices],
  };

  return game;
};

export const start = (game: Game) => {
  game.state = 'started';
  game.playState = 'players_answer';
  game.answers = [];
  game.turns = [];

  for (const p of game.players)
    p.cards = [];

  nextTurn(game);
};

export const nextTurn = (game: Game, lastWinner?: string) => {
  if (lastWinner)
    game.questionMaster = lastWinner;
  else
    game.questionMaster = randomItem(game.players).nick;

  game.question = randomItem(game.questions, true);

  if (!game.question)
    return false;

  for (const player of game.players) {
    delete player.answer;

    const newCards: Choice[] = [];

    while (player.cards!.length < 11) {
      const card = randomItem(game.choices, true);

      if (!card)
        return false;

      player.cards!.push(card);
      newCards.push(card);
    }

    if (player.socket)
      player.socket.send({ type: 'cards', cards: newCards });
  }

  game.playState = 'players_answer';
  game.answers = [];

  return true;
};

export const answerChoices = (game: Game, player: Player, choices: Choice[]) => {
  const answer: Answer = {
    player: player.nick,
    question: game.question!,
    choices,
  };

  game.answers!.push(answer);

  for (const choice of answer.choices)
    player.cards!.splice(player!.cards!.indexOf(choice), 1);

  if (game.answers!.length === game.players.length - 1) {
    game.playState = 'question_master_selection';
    shuffle(game.answers!);
  }

  player.answer = answer;

  return answer;
};

export const selectAnswer = (game: Game, answer: Answer) => {
  const turn: Turn = {
    number: game.turns!.length + 1,
    question: game.question!,
    questionMaster: game.questionMaster!,
    winner: answer.player,
    answers: game.answers!,
  };

  game.turns!.push(turn);
  game.playState = 'end_of_turn';

  return turn;
};

export const end = (game: Game) => {
  delete game.playState;
  delete game.answers;
  delete game.question;
  delete game.questionMaster;

  for (const player of game.players)
    delete player.cards;

  game.state = 'finished';

  const wins: { player: string, wins: number }[] = game.players.map(player => ({ player: player.nick, wins: 0 }));

  for (const turn of game.turns!) {
    const win = wins.find(w => w.player === turn.winner);
    win!.wins++;
  }

  wins.sort(({ wins: a }, { wins: b }) => b - a);

  game.scores = wins.reduce((scores, { player, wins }) => ({
    ...scores,
    [player]: wins,
  }), {});
};
