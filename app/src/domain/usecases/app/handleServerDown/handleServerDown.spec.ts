import expect from 'expect';

import { NetworkStatus } from '../../../../store/reducers/appStateReducer';
import { appActions } from '../../../../store/slices/app/app.actions';
import { selectServerStatus } from '../../../../store/slices/app/app.selectors';
import { TestStore } from '../../../../tests/TestStore';

import { handleServerDown } from './handleServerDown';

describe('handleServerDown', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  const expectServerStatus = (status: NetworkStatus) => {
    expect(store.select(selectServerStatus)).toEqual(status);
  };

  it('does not do anything when the server is already down', async () => {
    store.serverGateway.serverStatus = NetworkStatus.up;

    store.dispatch(appActions.setServerStatus(NetworkStatus.down));

    await store.dispatch(handleServerDown());

    await store.timerGateway.invokeInterval();

    expectServerStatus(NetworkStatus.down);
  });

  it('periodically checks if the server is up', async () => {
    const { serverGateway, timerGateway } = store;

    serverGateway.serverStatus = NetworkStatus.down;

    await store.dispatch(handleServerDown());

    expectServerStatus(NetworkStatus.down);

    await timerGateway.invokeInterval();

    expectServerStatus(NetworkStatus.down);

    serverGateway.serverStatus = NetworkStatus.up;
    await timerGateway.invokeInterval();

    expectServerStatus(NetworkStatus.up);
    expect(store.app.ready).toBe(true);

    serverGateway.serverStatus = NetworkStatus.down;
    await timerGateway.invokeInterval();

    // interval was cleared
    expectServerStatus(NetworkStatus.up);
  });
});
