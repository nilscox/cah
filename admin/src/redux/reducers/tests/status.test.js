import { test } from './reducers.test.utils';
import reducer from '../status';

describe('status reducer', () => {

  it('should process a INITIALIZATION_STARTED action', () => test(
    reducer,
    [],
    { type: 'INITIALIZATION_STARTED' },
    () => ({ initializing: true, ready: false }),
  ));

  it('should process a INITIALIZATION_FINISHED action', () => test(
    reducer,
    [],
    { type: 'INITIALIZATION_FINISHED' },
    () => ({ initializing: false, ready: true }),
  ));

});
