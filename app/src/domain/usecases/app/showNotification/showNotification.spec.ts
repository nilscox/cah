import expect from 'expect';

import { TestStore } from '../../../../tests/TestStore';

import { showNotification } from './showNotification';

describe('showNotification', () => {
  it('shows a notification', () => {
    const store = new TestStore();

    store.dispatch(showNotification('you see me'));

    expect(store.app.notification).toEqual('you see me');
  });

  it('hides the notification after a timeout', () => {
    const store = new TestStore();

    store.dispatch(showNotification('you see me'));

    store.timerGateway.invokeTimeout();

    expect(store.app.notification).toBeUndefined();
  });
});
