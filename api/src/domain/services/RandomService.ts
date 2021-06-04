import { Token } from 'typedi';

export const RandomServiceToken = new Token('RandomService');

export class RandomService {
  randomize<T>(array: T[]): T[] {
    return array;
  }
}
