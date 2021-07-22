import expect from 'expect';

import { ServerStatus } from '../../../store/reducers/appStateReducer';
import { InMemoryStore } from '../../../store/utils';
import { serverStatusChanged } from '../../actions';
import { FakeServerGateway } from '../../gateways/FakeServerGateway';
import { FakeTimerGateway } from '../../gateways/FakeTimerGateway';

import { handleServerDown } from './handleServerDown';

describe('handleServerDown', () => {
  let store: InMemoryStore;

  let timerGateway: FakeTimerGateway;
  let serverGateway: FakeServerGateway;

  beforeEach(() => {
    store = new InMemoryStore();
    ({ timerGateway, serverGateway } = store);
  });

  const expectServerStatus = (status: ServerStatus) => {
    expect(store.getState().app.server).toEqual(status);
  };

  it('does not do anything when the server is already down', async () => {
    serverGateway.serverStatus = ServerStatus.up;

    store.dispatch(serverStatusChanged(ServerStatus.down));
    store.snapshot();

    await store.dispatch(handleServerDown());

    await timerGateway.invokeInterval();

    expectServerStatus(ServerStatus.down);
  });

  it('periodically checks if the server is up', async () => {
    serverGateway.serverStatus = ServerStatus.down;

    await store.dispatch(handleServerDown());

    expectServerStatus(ServerStatus.down);

    await timerGateway.invokeInterval();

    expectServerStatus(ServerStatus.down);

    serverGateway.serverStatus = ServerStatus.up;
    await timerGateway.invokeInterval();

    expectServerStatus(ServerStatus.up);
    store.expectPartialState('app', { ready: true });

    serverGateway.serverStatus = ServerStatus.down;
    await timerGateway.invokeInterval();

    // interval was cleared
    expectServerStatus(ServerStatus.up);
  });
});
