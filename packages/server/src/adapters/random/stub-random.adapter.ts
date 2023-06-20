import { RandomPort } from './random.port';

export class StubRandomAdapter implements RandomPort {
  randomItem = <T>(array: T[]): T => {
    return array[0];
  };
}
