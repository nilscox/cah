import { GameState } from '@cah/shared';
import { InferModel } from 'drizzle-orm';
import { AnyPgColumn, boolean, integer, pgEnum, pgSchema, text, varchar } from 'drizzle-orm/pg-core';

const typedPgEnum = <Enum extends object>(name: string, e: Enum) => {
  type T = keyof Enum extends string ? keyof Enum : never;
  return pgEnum<T, readonly [T, ...T[]]>(name, Object.values(e) as [T, ...T[]]);
};

const id = (name = 'id') => varchar(name, { length: 16 });
const primaryKey = () => id('id').primaryKey();

export const gameStateEnum = typedPgEnum('game_state', GameState);

export const cah = pgSchema('cah');

export const games = cah.table('games', {
  id: primaryKey(),
  // todo: unique
  code: varchar('code', { length: 4 }).notNull(),
  state: gameStateEnum('state').notNull(),
  questionMasterId: id('questionMasterId').references((): AnyPgColumn => players.id),
  questionId: id('questionId').references((): AnyPgColumn => questions.id),
});

export type SqlGame = InferModel<typeof games>;

export const players = cah.table('players', {
  id: primaryKey(),
  nick: text('nick').notNull(),
  gameId: id('gameId').references(() => games.id),
});

export type SqlPlayer = InferModel<typeof players>;

export const questions = cah.table('questions', {
  id: primaryKey(),
  gameId: varchar('gameId')
    .notNull()
    .references(() => games.id),
  text: text('text').notNull(),
  blanks: integer('blanks').array().notNull(),
});

export type SqlQuestion = InferModel<typeof questions>;

export const choices = cah.table('choices', {
  id: primaryKey(),
  gameId: varchar('gameId')
    .notNull()
    .references(() => games.id),
  playerId: varchar('playerId').references(() => players.id),
  text: text('text').notNull(),
  caseSensitive: boolean('caseSensitive').notNull(),
});

export type SqlChoice = InferModel<typeof choices>;
