import { PlayState } from '../../../domain/entities/game';
import {
  createAnswers,
  createChoice,
  createFullPlayer,
  createPlayers,
  createQuestion,
  createStartedGame,
  createTurns,
} from '../../../tests/factories';

const nicks = ['nilsou', 'tominou', 'jeanette', ' Grââlandin', 'Croûtard', 'Fanny'];
export const players = createPlayers(nicks.length, {
  nick: nicks,
  isConnected: (index) => index !== 2,
});

export const choices = [
  createChoice({ text: 'Avoir de la merde dans les yeux' }),
  createChoice({ text: 'Toi' }),
  createChoice({ text: 'Péter et rôter en même temps' }),
  createChoice({ text: "S'étouffer avec une carrote cuite" }),
  createChoice({ text: "Un coussin d'air" }),
  createChoice({ text: 'Ta soeur' }),
  createChoice({ text: 'Conduire une grue sous acide' }),
  createChoice({ text: "Les chaussettes de l'archiduchesse" }),
  createChoice({ text: 'Aller au cinémas' }),
  createChoice({ text: 'Nicolas Sarkozy' }),
  createChoice({ text: 'Dans ton cul' }),
];

export const player = createFullPlayer({ ...players[0], cards: choices });
export const questionMaster = players[1];

export const questions = [
  createQuestion({ text: 'Eh, elle est ou la marchandise ?' }),
  createQuestion({ text: "J'ai envie de .", blanks: [14] }),
  createQuestion({ text: "T'es plutôt  ou  ?.", blanks: [12, 16] }),
  createQuestion({ text: "Il y a des fois, j'me dit : , et je pense toute de suite à toi...", blanks: [28] }),
];

export const answers = createAnswers(players.length, {
  player: players,
  choices: [[choices[1]], [choices[2]], [choices[10]], [choices[7]], [choices[6]], [choices[9]]],
});

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

for (let i = 0; i < turns.length; ++i) {
  turns[i].number = i + 1;
  turns[i].winner = players[i % players.length];
  turns[i].question = questions[i % questions.length];
  turns[i].answers = answers;
}
