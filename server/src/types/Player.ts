import { Choice } from './Choice';
import { Answer } from './Game';

export interface Player {
  nick: string;
  created: Date;
  gameId?: string;
  cards?: Choice[];
  answer?: Answer;
  socket?: SocketIO.Socket;
}
