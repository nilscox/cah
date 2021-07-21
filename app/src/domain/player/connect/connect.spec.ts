import { expectPartialState, inMemoryStore } from '../../../store/utils';
import { createPlayer } from '../../../utils/factories';
import { setPlayer } from '../../actions';

import { connect } from './connect';

describe('connect', () => {
  it('connects to the server', async () => {
    const store = inMemoryStore();

    store.dispatch(setPlayer(createPlayer()));

    await store.dispatch(connect());

    expectPartialState(store, 'player', {
      isConnected: true,
    });
  });
});
