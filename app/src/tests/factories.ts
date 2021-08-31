import { AnonymousAnswer, Answer } from '../domain/entities/Answer';
import { Choice } from '../domain/entities/Choice';
import { Game, GameState, PlayState, StartedGame } from '../domain/entities/Game';
import { FullPlayer, Player } from '../domain/entities/Player';
import { Question } from '../domain/entities/Question';
import { Turn } from '../domain/entities/Turn';
import { NetworkStatus } from '../store/reducers/appStateReducer';
import { AppState } from '../store/types';

type FieldFactory<T, K extends keyof T> = T[K] | Array<T[K]> | ((index: number) => T[K]);
type ObjectsFactory<T> = { [key in keyof T]: FieldFactory<T, key> };

/**
 * Generate an object's factories functions, which can be used to easily create objects of this type
 * with default values and override some of their properties.
 *
 * More examples can be found in the .spec.ts
 *
 * type: Foo = {
 *   yo: number,
 *   plait: string;
 *   fraise: boolean;
 * };
 *
 * const [createFoo, createFoos] = factory<Foo>(index => ({
 *   yo: 0,
 *   plait: 'plait',
 *   fraise: index % 2 === 1,
 * }));
 *
 * const someFoo = createFoo({ yo: 2048 });
 *
 * { yo: 2048,  plait: 'plait', fraise: false }
 *
 * const someFoos = createFoos(3, { plait: ['plait1', 'plait2'] });
 *
 * [
 *   { yo: 0, plait: 'plait1', fraise: false },
 *   { yo: 0, plait: 'plait2', fraise: true },
 *   { yo: 0, plait: 'plait', fraise: false },
 * ]
 *
 *  const otherFoos = createFoos(3, { fraise: (n) => n % 3 === 0 });
 *
 *  [
 *    { yo: 0, plait: 'plait', fraise: true },
 *    { yo: 0, plait: 'plait', fraise: false },
 *    { yo: 0, plait: 'plait', fraise: false },
 *  ]
 */

const stripUndefined = <T>(obj: T): Partial<T> => {
  const result = { ...obj };

  for (const key in result) {
    if (result[key] === undefined) {
      delete result[key];
    }
  }

  return result;
};

export const factory = <T>(defaults: (index: number) => T) => {
  const createOne = (overrides: Partial<T> = {}): T => ({ ...defaults(0), ...overrides });

  const createMany = (count: number, overrides: Partial<ObjectsFactory<T>> = {}): T[] => {
    const getOverride = (index: number, key: keyof T) => {
      const fieldFactory = overrides[key] as FieldFactory<T, typeof key> | undefined;

      if (Array.isArray(fieldFactory)) {
        return fieldFactory[index];
      }

      if (typeof fieldFactory === 'function') {
        return (fieldFactory as (index: number) => T[typeof key])(index);
      }

      if (fieldFactory) {
        return fieldFactory;
      }
    };

    const getOverrides = (index: number): T => {
      return Object.keys(overrides).reduce(
        (obj, key) => ({
          ...obj,
          [key]: getOverride(index, key as keyof T),
        }),
        {} as T,
      );
    };

    return Array(count)
      .fill(null)
      .map((_, n) => ({
        ...defaults(n),
        ...stripUndefined(getOverrides(n)),
      }));
  };

  return [createOne, createMany] as const;
};

const createId = () => Math.random().toString(36).slice(-6);

export const [createPlayer, createPlayers] = factory<Player>(() => ({
  id: createId(),
  nick: 'nick',
  isConnected: false,
}));

export const [createFullPlayer] = factory<FullPlayer>(() => ({
  ...createPlayer(),
  cards: [],
  hasFlushed: false,
}));

export const [createGame, createGames] = factory<Game>(() => ({
  id: createId(),
  creator: createPlayer({ nick: 'creator' }),
  code: 'code',
  state: GameState.idle,
  players: [],
  turns: [],
}));

export const [createStartedGame, createStartedGames] = factory<StartedGame>(() => ({
  ...createGame(),
  state: GameState.started,
  playState: PlayState.playersAnswer,
  totalQuestions: 1,
  questionMaster: createPlayer(),
  question: createQuestion(),
  answers: [],
}));

export const [createTurn, createTurns] = factory<Turn>((index) => ({
  number: index + 1,
  question: createQuestion(),
  winner: createPlayer(),
  answers: [],
}));

export const [createQuestion, createQuestions] = factory<Question>((index) => ({
  id: createId(),
  text: `question ${index}`,
  formatted: `question ${index}`,
  numberOfBlanks: 1,
}));

export const [createChoice, createChoices] = factory<Choice>((index) => ({
  id: `c${index}`,
  text: `choice ${index}`,
  caseSensitive: false,
}));

export const [createAnonymousAnswer, createAnonymousAnswers] = factory<AnonymousAnswer>((index) => ({
  id: `a ${index}`,
  formatted: `answer ${index}`,
  choices: [],
}));

export const [createAnswer, createAnswers] = factory<Answer>(() => ({
  ...createAnonymousAnswer(),
  player: createPlayer(),
}));

export const [createState] = factory<AppState>(() => ({
  game: null,
  player: null,
  app: { ready: true, network: NetworkStatus.up, server: NetworkStatus.up, menuOpen: false },
}));
