import { GameEvent } from 'dtos/events';

import { Game, Answer, Turn } from './types/Game';
import { Player } from './types/Player';
import { formatPlayer, formatGame, formatTurn } from './format';

const formatedDate = () => {
  const now = new Date();

  return [
    [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-'),
    [
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    ].join(':')
  ].join(' ');
};

const formatEvent = (event: GameEvent) => {
  return event.type;
};

const handleEvent = (io: SocketIO.Server, game: Game | undefined, event: GameEvent) => {
  if (game) {
    io.in(game.id).send(event);
  }

  console.log([
    `[${formatedDate()}]`,
    game && `[${game.id}]`,
    ' ',
    formatEvent(event),
  ].filter(chunk => !!chunk).join(''));
};

export const connected = (io: SocketIO.Server, game: Game, player: Player) => {
  handleEvent(io, game, {
    type: 'connected',
    nick: player.nick,
  });
};

export const disconnected = (io: SocketIO.Server, game: Game, player: Player) => {
  handleEvent(io, game, {
    type: 'disconnected',
    nick: player.nick,
  });
};

export const join = (io: SocketIO.Server, game: Game, player: Player) => {
  handleEvent(io, game, {
    type: 'join',
    player: formatPlayer(player),
  });
};

export const start = (io: SocketIO.Server, game: Game) => {
  handleEvent(io, game, {
    type: 'start',
    game: formatGame(game),
  });
};

export const answer = (io: SocketIO.Server, game: Game, nick: string) => {
  handleEvent(io, game, {
    type: 'answer',
    nick,
  });
};

export const allAnswers = (io: SocketIO.Server, game: Game, answers: Answer[]) => {
  handleEvent(io, game, {
    type: 'allanswers',
    answers,
  });
};

export const turn = (io: SocketIO.Server, game: Game, turn: Turn) => {
  handleEvent(io, game, {
    type: 'turn',
    turn: formatTurn(turn),
  });
}

export const next = (io: SocketIO.Server, game: Game) => {
  handleEvent(io, game, {
    type: 'next',
    game: formatGame(game),
  });
};

export const end = (io: SocketIO.Server, game: Game) => {
  handleEvent(io, game, {
    type: 'end',
    game: formatGame(game),
  });
}
