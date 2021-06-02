import { Choice } from '../entities/Choice';
import { Game, GameState, PlayState } from '../entities/Game';
import { Player } from '../entities/Player';
import { Question } from '../entities/Question';

type ClassType<T> = {
  new (): T;
};

const creatorsFactory = <T>(Cls: ClassType<T>, defaults: () => Partial<T>) => {
  const createOne = (overrides?: Partial<T>) => Object.assign(new Cls(), defaults(), overrides) as T;

  const createMany = (count: number, overrides?: (n: number) => Partial<T>) =>
    Array(count)
      .fill(null)
      .map((_, n) => createOne(overrides?.(n)));

  return {
    createOne,
    createMany,
  };
};

export const { createOne: createQuestion, createMany: createQuestions } = creatorsFactory(Question, () => ({
  text: 'question',
}));

export const { createOne: createChoice, createMany: createChoices } = creatorsFactory(Choice, () => ({
  text: 'choice',
}));

export const { createOne: createPlayer, createMany: createPlayers } = creatorsFactory(Player, () => ({
  nick: 'nick',
  cards: [],
}));

export const { createOne: createGame } = creatorsFactory(Game, () => ({
  code: '1234',
  state: GameState.idle,
  players: [],
}));

export const createStartedGame = (overrides?: Partial<Game>) => {
  const players = createPlayers(4, (n) => ({ nick: 'player ' + (n + 1) }));
  const question = createQuestion();
  const choices = createChoices(11 * 4 + 1 * 3);

  const cards = [...choices];

  for (const player of players) {
    player.cards.push(...cards.splice(0, Game.cardsPerPlayer));
  }

  return createGame({
    players,
    state: GameState.started,
    playState: PlayState.playersAnswer,
    question,
    questionMaster: players[0],
    answers: [],
    turns: [],
    ...overrides,
  });
};
