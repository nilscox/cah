import { FakeTimerGateway } from '../../../../tests/gateways/FakeTimerGateway';
import { InMemoryStore } from '../../../../tests/InMemoryStore';

import { showNotification } from './showNotification';

describe.only('showNotification', () => {
  it('shows a notification', () => {
    const store = new InMemoryStore();

    store.dispatch(showNotification('you see me'));

    store.expectPartialState('app', {
      notification: 'you see me',
    });
  });

  it('hides the notification after a timeout', () => {
    const timerGateway = new FakeTimerGateway();
    const store = new InMemoryStore({ timerGateway });

    store.dispatch(showNotification('you see me'));

    timerGateway.invokeTimeout();

    store.expectPartialState('app', {
      notification: undefined,
    });
  });
});
