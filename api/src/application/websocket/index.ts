import { SessionData } from 'express-session';
import sharedSession from 'express-socket.io-session';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { session } from '../web';

export const bootstrap = (server: Server) => {
  const io = new SocketIOServer(server);

  io.use(sharedSession(session));

  io.on('connection', (socket) => {
    const session: SessionData = (socket.handshake as any).session;

    if (!session.playerId) {
      return socket.disconnect(true);
    }

    // console.log('connected!', session.playerId);
  });
};
