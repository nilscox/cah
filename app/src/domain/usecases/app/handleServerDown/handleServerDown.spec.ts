import expect from 'expect';

import { NetworkStatus } from '../../../../store/reducers/appStateReducer';
import { FakeServerGateway } from '../../../../tests/gateways/FakeServerGateway';
import { FakeTimerGateway } from '../../../../tests/gateways/FakeTimerGateway';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { serverStatusChanged } from '../../../actions';

import { handleServerDown } from './handleServerDown';

describe('handleServerDown', () => {
  let store: InMemoryStore;

  let timerGateway: FakeTimerGateway;
  let serverGateway: FakeServerGateway;

  beforeEach(() => {
    store = new InMemoryStore();
    ({ timerGateway, serverGateway } = store);
  });

  const expectServerStatus = (status: NetworkStatus) => {
    expect(store.getState().app.server).toEqual(status);
  };

  it('does not do anything when the server is already down', async () => {
    serverGateway.serverStatus = NetworkStatus.up;

    store.dispatch(serverStatusChanged(NetworkStatus.down));

    await store.dispatch(handleServerDown());

    await timerGateway.invokeInterval();

    expectServerStatus(NetworkStatus.down);
  });

  it('periodically checks if the server is up', async () => {
    serverGateway.serverStatus = NetworkStatus.down;

    await store.dispatch(handleServerDown());

    expectServerStatus(NetworkStatus.down);

    await timerGateway.invokeInterval();

    expectServerStatus(NetworkStatus.down);

    serverGateway.serverStatus = NetworkStatus.up;
    await timerGateway.invokeInterval();

    expectServerStatus(NetworkStatus.up);
    store.expectPartialState('app', { ready: true });

    serverGateway.serverStatus = NetworkStatus.down;
    await timerGateway.invokeInterval();

    // interval was cleared
    expectServerStatus(NetworkStatus.up);
  });
});
