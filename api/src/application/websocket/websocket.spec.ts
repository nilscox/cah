import { expect } from 'chai';
import { io, Socket } from 'socket.io-client';

import { createPlayer } from '../../domain/tests/creators';
import { app } from '../index';
import { auth } from '../test';

describe('websocket', () => {
  const port = 1234;

  before((done) => {
    app.listen(port, done);
  });

  after((done) => {
    app.close(done);
  });

  describe('unauthenticated', () => {
    it('closes the connection when the connection is not authenticated', async () => {
      const socket = io(`ws://localhost:${port}`);

      const connectPromise = new Promise<void>((resolve) => socket.on('connect', resolve));
      const disconnectPromise = new Promise<string>((resolve) => socket.on('disconnect', resolve));

      await connectPromise;
      const reason = await disconnectPromise;

      expect(reason).to.eql('io server disconnect');
    });
  });

  describe('authenticated', () => {
    let socket: Socket;

    const player = createPlayer({ id: 1 });
    const asPlayer = auth(player);

    beforeEach((done) => {
      const cookie = asPlayer.jar.getCookie('connect.sid', {
        domain: 'localhost',
        path: '/',
        script: false,
        secure: false,
      });

      socket = io(`ws://localhost:${port}`, {
        extraHeaders: {
          cookie: [cookie?.name, cookie?.value].join('='),
        },
      });

      socket.on('connect', done);
    });

    afterEach(() => {
      socket.close();
    });

    it('connects to the websocket server', async () => {
      expect(socket.connected).to.be.true;
    });
  });
});
