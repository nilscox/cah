import { classToPlain } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import sharedSession from 'express-socket.io-session';
import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

class ValidationErrors extends Error {
  constructor(public errors: ValidationError[]) {
    super('validation errors');
    Object.setPrototypeOf(this, ValidationErrors.prototype);
  }

  getErrors() {
    return this.errors.reduce((obj, error) => ({ ...obj, [error.property]: Object.keys(error.constraints ?? {}) }), {});
  }
}

type WSEventHandler<Payload = undefined, Result = void> = (
  socket: Socket,
  payload: Payload,
) => Result | Promise<Result>;
type DtoClass<Dto> = { new (payload: unknown): Dto };

export class WebsocketServer {
  private io: SocketIOServer;
  private handlers = new Map<
    string,
    { Dto: DtoClass<unknown> | undefined; handler: WSEventHandler<unknown, unknown> }
  >();

  constructor(server: Server, session: RequestHandler) {
    this.io = new SocketIOServer(server);

    this.io.use(sharedSession(session));
    this.io.on('connection', (socket) => this.onSocketConnected(socket));
  }

  registerEventHandler<Dto, Result>(event: string, Dto: DtoClass<Dto>, handler: WSEventHandler<Dto, Result>): void;
  registerEventHandler<Result>(event: string, handler: WSEventHandler<undefined, Result>): void;
  registerEventHandler(event: string, ...args: unknown[]) {
    const [Dto, handler] = args.length === 2 ? [args[0], args[1]] : [undefined, args[0]];

    this.handlers.set(event, {
      Dto: Dto as DtoClass<unknown>,
      handler: handler as WSEventHandler<unknown>,
    });
  }

  private bindSocketEvent<Dto, Result>(
    socket: Socket,
    DtoClass: DtoClass<Dto> | undefined,
    handler: WSEventHandler<Dto, Result>,
  ) {
    return async (payload: unknown, cb: (...args: unknown[]) => void) => {
      try {
        let data: any;

        if (DtoClass) {
          data = new DtoClass(payload);

          const errors = await validate(data);

          if (errors.length > 0) {
            throw new ValidationErrors(errors);
          }
        }

        const result = await handler(socket, data);

        cb({ status: 'ok', ...classToPlain(result) });
      } catch (error) {
        if (error instanceof ValidationErrors) {
          cb({ status: 'ko', error: error.message, validationErrors: error.getErrors(), stack: error.stack });
        } else {
          cb({ status: 'ko', error: error.message, stack: error.stack });
        }
      }
    };
  }

  onSocketConnected(socket: Socket) {
    socket.on('disconnect', () => this.onSocketDisconnected(socket));

    for (const [event, { Dto, handler }] of this.handlers.entries()) {
      socket.on(event, this.bindSocketEvent(socket, Dto, handler));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSocketDisconnected(_socket: Socket) {}

  broadcast(room: string, message: unknown): void {
    this.io.to(room).emit('message', message);
  }
}
