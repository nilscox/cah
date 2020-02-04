import { useEffect, useState } from 'react';

import { PlayerDTO } from 'dtos/player.dto';

const usePlayer = (socket: SocketIOClient.Socket) => {
  const [player, setPlayer] = useState<PlayerDTO>();

  const handleMessage = (message: any) => {
    if (!player)
      return;

    if (message.type === 'cards') {
      setPlayer({
        ...player,
          cards: [
            ...(player.cards || []),
            ...message.cards,
          ],
        });
    }
  };

  useEffect(() => {
    socket.on('message', handleMessage);
    return () => void socket.off('message', handleMessage);
  }, [player, socket]);

  return [
    player,
    (player: PlayerDTO) => {
      setPlayer(player);
      socket.emit('login', { nick: player.nick });
    },
  ] as const;
};

export default usePlayer;
