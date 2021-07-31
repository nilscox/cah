import { PlayState } from '../../../domain/entities/Game';
import {
  createAnswer,
  createChoice,
  createFullPlayer,
  createPlayers,
  createQuestion,
  createStartedGame,
  createTurns,
} from '../../../tests/factories';

export const mano = createFullPlayer({ nick: 'mano' });

const nicks = ['nilsou', 'tominou', 'jeanette', ' Grââlandin', 'Croûtard', 'Fanny'];
export const players = createPlayers(nicks.length, {
  nick: nicks,
  isConnected: (index) => index !== 2,
});

export const choices = [
  createChoice({ text: 'Bravo' }),
  createChoice({ text: 'Charlie' }),
  createChoice({ text: "S'étouffer avec une carrote cuite" }),
  createChoice({ text: "Un coussin d'air" }),
  createChoice({ text: 'Ta soeur' }),
  createChoice({ text: 'Conduire une grue sous acide' }),
  createChoice({ text: 'Gros con' }),
  createChoice({ text: "Les chaussettes de l'archiduchesse" }),
  createChoice({ text: 'Aller au cinémas' }),
  createChoice({ text: 'Nicolas Sarkozy' }),
  createChoice({ text: 'La chasse aux sorcières' }),
];

export const player = createFullPlayer({ ...players[0], cards: choices });
export const questionMaster = players[1];

export const questions = [
  createQuestion({ text: 'Eh, elle est ou la marchandise ?' }),
  createQuestion({ text: "J'ai envie de .", blanks: [14] }),
  createQuestion({ text: "T'es plutôt  ou  ?.", blanks: [12, 16] }),
];

export const answers = [
  createAnswer({ choices: [createChoice({ text: 'avoir de la merde dans les yeux' })], player: players[1] }),
  createAnswer({ choices: [createChoice({ text: 'toi' })], player: players[2] }),
  createAnswer({ choices: [createChoice({ text: 'péter et rôter en même temps' })], player: players[3] }),
];

export const startedGame = createStartedGame({
  playState: PlayState.playersAnswer,
  players,
  questionMaster,
  question: questions[0],
});

player.gameId = startedGame.id;

export const turns = [
  ...createTurns(7, { winner: players[0] }),
  ...createTurns(6, { winner: players[4] }),
  ...createTurns(5, { winner: players[1] }),
  ...createTurns(5, { winner: players[3] }),
  ...createTurns(4, { winner: players[2] }),
];
