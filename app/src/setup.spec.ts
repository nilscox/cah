import { cleanup } from '@testing-library/react';

before(() => {
  process.stdout.write('\x1Bc');
});

afterEach(cleanup);
