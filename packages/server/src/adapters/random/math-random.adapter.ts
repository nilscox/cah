import { RandomPort } from './random.port';

export class MathRandomAdapter implements RandomPort {
  randomize<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  randomItem<T>(array: T[]): T {
    return array[this.randomInteger(array.length)];
  }

  randomInteger(max: number) {
    return Math.floor(Math.random() * max);
  }

  randomString(length: number) {
    return Math.random().toString(36).slice(-length);
  }
}
