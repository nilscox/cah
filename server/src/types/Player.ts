import { Choice } from './Choice';

export interface Player {
  nick: string;
  gameId?: string;
  cards?: Choice[];
  socket?: SocketIO.Socket;
}
