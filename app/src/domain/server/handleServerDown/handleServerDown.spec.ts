import { ServerStatus } from '../../../store/reducers/appStateReducer';
import { AppStore } from '../../../store/types';
import { expectPartialState, inMemoryStore } from '../../../store/utils';
import { serverStatusChanged } from '../../actions';
import { FakeServerGateway } from '../../gateways/FakeServerGateway';
import { FakeTimerGateway } from '../../gateways/FakeTimerGateway';

import { handleServerDown } from './handleServerDown';

describe('handleServerDown', () => {
  let timerGateway: FakeTimerGateway;
  let serverGateway: FakeServerGateway;

  let store: AppStore;

  beforeEach(() => {
    timerGateway = new FakeTimerGateway();
    serverGateway = new FakeServerGateway();

    store = inMemoryStore({ timerGateway, serverGateway });
  });

  const expectServerStatus = (status: ServerStatus) => {
    expectPartialState(store, 'app', { server: status });
  };

  it('does not do anything when the server is already down', async () => {
    serverGateway.serverStatus = ServerStatus.up;
    store.dispatch(serverStatusChanged(ServerStatus.down));

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
    expectPartialState(store, 'app', { ready: true });

    serverGateway.serverStatus = ServerStatus.down;
    await timerGateway.invokeInterval();

    // interval was cleared
    expectServerStatus(ServerStatus.up);
  });
});
