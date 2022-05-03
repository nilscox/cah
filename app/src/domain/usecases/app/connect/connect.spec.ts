import expect from 'expect';

import { TestBuilder } from '../../../../tests/TestBuilder';
import { selectPlayer } from '../../../selectors/playerSelectors';

import { connect } from './connect';

describe('connect', () => {
  const store = new TestBuilder().apply(TestBuilder.setPlayer()).getStore();

  it('sets the player as connected to the server', async () => {
    await store.dispatch(connect());

    expect(store.select(selectPlayer)).toHaveProperty('isConnected', true);
  });
});
