import { injectableClass } from 'ditox';

import { TOKENS } from 'src/tokens';

import { RandomPort } from '../random/random.port';

import { GeneratorPort } from './generator.port';

export class RandomGeneratorAdapter implements GeneratorPort {
  static inject = injectableClass(this, TOKENS.random);

  constructor(private readonly random: RandomPort) {}

  generateId(): string {
    return this.random.randomString(6);
  }

  generateGameCode() {
    return this.random.randomString(4);
  }
}
