import request from 'supertest';

import { app } from './infrastructure/web';

describe('e2e', () => {
  it('plays a full game', async () => {
    const player1 = request.agent(app);
    const player2 = request.agent(app);

    const { body } = await player1.post('/login').send({ nick: 'nils' });

    await player1.get('/player/me').expect(200).expect({ nick: 'nils', cards: [] });

    await player1
      .get('/player/' + body.id)
      .expect(200)
      .expect({ nick: 'nils', cards: [] });

    await player2
      .get('/player/' + body.id)
      .expect(200)
      .expect({ nick: 'nils' });
  });
});
