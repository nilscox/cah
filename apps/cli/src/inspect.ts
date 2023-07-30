import { inspect } from 'node:util';

import { Game, isStarted, Question, Choice, Player, Turn } from '@cah/shared';

import { chalk } from './chalk';

const dimId = (id: string) => {
  return chalk.light(`(${id})`);
};

const list = <T>(items: T[], inspectItem: (item: T) => string): string[] => {
  return items.map((item, index) => `  ${String(index + 1).padStart(2)}. ${inspectItem(item)}`);
};

export const inspectGame = (game: Game): string => {
  const lines = [`Game ${dimId(game.id)}`];

  lines.push(`- id: ${game.id}`);
  lines.push(`- code: ${game.code}`);
  lines.push(`- state: ${game.state}`);

  lines.push('- players:');
  for (const player of game.players) {
    lines.push(`  - ${player.nick} ${dimId(player.id)}`);
  }

  if (isStarted(game)) {
    const questionMaster = game.players.find((player) => player.id === game.questionMasterId);
    lines.push(`- questionMaster: ${questionMaster?.nick}`);

    lines.push(`- question: ${inspectQuestion(game.question)}`);

    if (game.answers && game.answers.length > 0) {
      lines.push('- answers:');

      lines.push(
        ...list(game.answers, (answer) => {
          const f = answer.id === game.selectedAnswerId ? chalk.green : (s: string) => s;
          const playerId = 'playerId' in answer && answer.playerId;

          const parts = [
            playerId && f(`${game.players.find(({ id }) => id === playerId)?.nick}:`),
            inspectQuestion(game.question, answer.choices),
            dimId(answer.id),
          ].filter(Boolean);

          return parts.join(' ');
        }),
      );
    }
  }

  return lines.join('\n');
};

const inspectQuestion = (question: Question, choices?: Choice[]): string => {
  const blanks = question.blanks;
  let text = question.text;

  const getBlankValue = (index: number) => {
    const choice = choices?.[index];

    if (!choice) {
      return '__';
    }

    if (choice.caseSensitive || blanks === undefined) {
      return chalk.underline(choice.text);
    }

    return chalk.underline(choice.text.toLowerCase());
  };

  if (blanks === undefined) {
    return [text, getBlankValue(0)].join(' ');
  }

  for (const [i, place] of Object.entries(blanks.slice().reverse())) {
    text = [text.slice(0, place), text.slice(place)].join(getBlankValue(blanks.length - Number(i) - 1));
  }

  return text;
};

export const inspectPlayer = (player: Player): string => {
  const lines = [`Player ${dimId(player.id)}`];

  lines.push(`- id: ${player.id}`);
  lines.push(`- nick: ${player.nick}`);
  lines.push(`- gameId: ${player.gameId}`);

  if (player.cards) {
    lines.push('- cards:');
    lines.push(...list(player.cards, (card) => card.text));
  }

  return lines.join('\n');
};

export const inspectTurn = (turn: Turn): string => {
  return inspect(turn, { depth: null, colors: true });
};
