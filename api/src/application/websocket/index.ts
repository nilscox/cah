import { IsString, Length, validate, ValidationError } from 'class-validator';
import { SessionData } from 'express-session';
import sharedSession from 'express-socket.io-session';
import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import Container from 'typedi';

import { Player } from '../../domain/entities/Player';
import { CreateGame } from '../../domain/use-cases/CreateGame';
import { JoinGame } from '../../domain/use-cases/JoinGame';
import { QueryPlayer } from '../../domain/use-cases/QueryPlayer';
import { session } from '../web';

class ValidationErrors extends Error {
  constructor(public errors: ValidationError[]) {
    super('validation errors');
    Object.setPrototypeOf(this, ValidationErrors.prototype);
  }

  getErrors() {
    return this.errors.reduce((obj, error) => ({ ...obj, [error.property]: Object.keys(error.constraints ?? {}) }), {});
  }
}

const handleEvent = <Payload, Result>(
  socket: Socket,
  Dto: { new (): Payload } | undefined,
  handler: (payload: Payload, player: Player) => Promise<Result>,
) => {
  return async (payload: unknown, cb: (...args: unknown[]) => void) => {
    const { playerId }: SessionData = (socket.handshake as any).session;

    try {
      const player = await Container.get(QueryPlayer).queryPlayer(playerId);

      if (!player) {
        throw new Error('player not found');
      }

      let data = undefined;

      if (Dto) {
        data = Object.assign(new Dto(), payload);

        const errors = await validate(Object.assign(new JoinGameDto(), payload));

        if (errors.length > 0) {
          throw new ValidationErrors(errors);
        }
      }

      const result = await handler(data as Payload, player);

      cb({ status: 'ok', ...result });
    } catch (error) {
      if (error instanceof ValidationErrors) {
        cb({ status: 'ko', error: error.message, validationErrors: error.getErrors() });
      } else {
        cb({ status: 'ko', error: error.message });
      }
    }
  };
};

class JoinGameDto {
  @IsString()
  @Length(4, 4)
  code!: string;
}

export const bootstrap = (server: Server) => {
  const io = new SocketIOServer(server);

  io.use(sharedSession(session));

  io.on('connection', (socket) => {
    const session: SessionData = (socket.handshake as any).session;

    if (!session.playerId) {
      return socket.disconnect(true);
    }

    socket.on(
      'createGame',
      handleEvent(socket, undefined, async () => {
        const game = await Container.get(CreateGame).createGame();
        return { game };
      }),
    );

    socket.on(
      'joinGame',
      handleEvent(socket, JoinGameDto, async (payload, player) => {
        await Container.get(JoinGame).joinGame(payload.code, player);
      }),
    );

    // console.log('connected!', session.playerId);
  });
};
