import request from 'supertest';

import { app } from './infrastructure/web';

describe('e2e', () => {
  it('plays a full game', async () => {
    const player = request.agent(app);

    await player.post('/login').send({ nick: 'nils' });
    await player.get('/me').expect(200).expect({ nick: 'nils', cards: [] });
  });
});
