import { Answer } from '../entities/Answer';
import { Choice } from '../entities/Choice';
import { Game, GameState, PlayState, StartedGame } from '../entities/Game';
import { Player } from '../entities/Player';
import { Question } from '../entities/Question';

type ClassType<T> = {
  new (): T;
};

const creatorsFactory = <T extends { id: number }>(Cls: ClassType<T>, defaults: () => Partial<T>) => {
  const createOne = (overrides?: Partial<T>) => Object.assign(new Cls(), defaults(), overrides) as T;

  const createMany = (count: number, overrides?: (n: number) => Partial<T>) =>
    Array(count)
      .fill(null)
      .map((_, n) => createOne({ id: n + 1, ...overrides?.(n) } as Partial<T>));

  return {
    createOne,
    createMany,
  };
};

export const { createOne: createQuestion, createMany: createQuestions } = creatorsFactory(Question, () => ({
  id: 1,
  text: 'question',
}));

export const { createOne: createChoice, createMany: createChoices } = creatorsFactory(Choice, () => ({
  id: 1,
  text: 'choice',
}));

export const { createOne: createAnswer, createMany: createAnswers } = creatorsFactory(Answer, () => ({
  id: 1,
  player: createPlayer(),
  choices: [],
  place: undefined,
}));

export const { createOne: createPlayer, createMany: createPlayers } = creatorsFactory(Player, () => ({
  id: 1,
  nick: 'nick',
  cards: [],
}));

export const { createOne: createGame } = creatorsFactory(Game, () => ({
  id: 1,
  code: '1234',
  state: GameState.idle,
  players: [],
}));

export const createStartedGame = (overrides?: Partial<StartedGame>) => {
  const game = new StartedGame();

  game.id = 0;
  game.state = GameState.started;
  game.playState = PlayState.playersAnswer;
  game.players = createPlayers(4, (n) => ({ nick: 'player ' + (n + 1) }));
  game.questionMaster = game.players[0];
  game.question = createQuestion();
  game.answers = [];

  const cards = [...createChoices(11 * 4 + 1 * 3)];

  for (const player of game.players) {
    player.cards.push(...cards.splice(0, Game.cardsPerPlayer));
  }

  Object.assign(game, overrides);

  return game;
};
