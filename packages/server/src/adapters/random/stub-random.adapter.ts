import { RandomPort } from './random.port';

export class StubRandomAdapter implements RandomPort {
  randomize = <T>(array: T[]): T[] => {
    return array;
  };

  randomItem = <T>(array: T[]): T => {
    return array[0];
  };
}
