import { GameState } from '@cah/shared';
import { AnyPgColumn, boolean, integer, pgEnum, pgSchema, text, varchar } from 'drizzle-orm/pg-core';

export type SqlGame = typeof games.$inferSelect;
export type SqlPlayer = typeof players.$inferSelect;
export type SqlQuestion = typeof questions.$inferSelect;
export type SqlChoice = typeof choices.$inferSelect;
export type SqlAnswer = typeof answers.$inferSelect;
export type SqlTurn = typeof turns.$inferSelect;

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
  selectedAnswerId: id('selectedAnswerId').references((): AnyPgColumn => answers.id),
});

export const players = cah.table('players', {
  id: primaryKey(),
  nick: text('nick').notNull(),
  gameId: id('gameId').references(() => games.id),
});

export const questions = cah.table('questions', {
  id: primaryKey(),
  gameId: id('gameId')
    .notNull()
    .references(() => games.id),
  text: text('text').notNull(),
  blanks: integer('blanks').array().notNull(),
});

export const choices = cah.table('choices', {
  id: primaryKey(),
  gameId: varchar('gameId')
    .notNull()
    .references(() => games.id),
  playerId: varchar('playerId').references(() => players.id),
  answerId: varchar('answerId').references(() => answers.id),
  text: text('text').notNull(),
  caseSensitive: boolean('caseSensitive').notNull(),
  place: integer('place'),
});

export const answers = cah.table('answers', {
  id: primaryKey(),
  gameId: id('gameId')
    .notNull()
    .references(() => games.id),
  playerId: id('playerId')
    .notNull()
    .references(() => players.id),
  questionId: id('questionId')
    .notNull()
    .references(() => questions.id),
  turnId: id('turnId').references((): AnyPgColumn => turns.id),
  place: integer('place'),
});

export const turns = cah.table('turns', {
  id: primaryKey(),
  // todo: unique
  number: integer('number').notNull(),
  gameId: id('gameId')
    .notNull()
    .references(() => games.id),
  questionMasterId: id('questionMasterId')
    .notNull()
    .references(() => players.id),
  questionId: id('questionId')
    .notNull()
    .references(() => questions.id),
  selectedAnswerId: id('selectedAnswerId')
    .notNull()
    .references(() => answers.id),
});
