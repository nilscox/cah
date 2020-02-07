import { useEffect, useState } from 'react';

import { GameDTO } from 'dtos/game.dto';

const useGame = (socket: SocketIOClient.Socket) => {
  const [game, setGame] = useState<GameDTO>();

  const handleMessage = (message: any) => {
    if (!game)
      return;

    switch (message.type) {

    case 'join':
      setGame({
        ...game,
        players: [...game.players, message.player],
      });
      break;

    case 'connected': {
      const player = game.players.find((p: any) => p.nick === message.nick);

      if (!player) {
        console.warn('cannot find player: ' + message.nick);
        break;
      }

      const idx = game.players.indexOf(player);

      setGame({
        ...game,
        players: [
          ...game.players.slice(0, idx),
          { ...player, connected: true },
          ...game.players.slice(idx + 1),
        ],
      });
      break;
    }

    case 'disconnected': {
      const player = game.players.find((p: any) => p.nick === message.nick);

      if (!player) {
        console.warn('cannot find player: ' + message.nick);
        break;
      }

      const idx = game.players.indexOf(player);

      setGame({
        ...game,
        players: [
          ...game.players.slice(0, idx),
          { ...player, connected: false },
          ...game.players.slice(idx + 1),
        ],
      });
      break;
    }

    case 'start':
    case 'next':
    case 'end':
      setGame({ ...game, ...message.game });
      break;

    case 'answer':
      setGame({
        ...game,
        answered: [
          ...(game.answered || []),
          message.nick,
        ],
      });
      break;

    case 'allanswers':
      setGame({
        ...game,
        answers: message.answers,
        playState: 'question_master_selection',
      });
      break;

    case 'turn':
      setGame({
        ...game,
        turns: [
          ...(game.turns || []),
          message.turn,
        ]
      });
      break;

    }
  };

  useEffect(() => {
    socket.on('message', handleMessage);
    return () => void socket.off('message', handleMessage);
  }, [game, socket]);

  return [
    game,
    setGame,
  ] as const;
};

export default useGame;
