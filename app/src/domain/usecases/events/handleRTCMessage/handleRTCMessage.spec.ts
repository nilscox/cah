import expect from 'expect';

import { TestBuilder } from '../../../../tests/TestBuilder';
import { RTCMessage } from '../../../gateways/RTCGateway';

import { handleRTCMessage } from './handleRTCMessage';

describe('handleRTCMessage', () => {
  const store = new TestBuilder().apply(TestBuilder.setPlayer()).apply(TestBuilder.createGame()).getStore();

  it("fails when no handle exist for some event's type", () => {
    const event: RTCMessage = {
      type: 'nope',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    expect(() => store.dispatch(handleRTCMessage(event))).toThrow('no handler for event nope');
  });
});
