import { injectableClass } from 'ditox';

import { TOKENS } from 'src/tokens';

import { type RandomPort } from '../random/random.port.ts';

import { type GeneratorPort } from './generator.port.ts';

export class RandomGeneratorAdapter implements GeneratorPort {
  static inject = injectableClass(this, TOKENS.random);

  constructor(private readonly random: RandomPort) {}

  generateId(): string {
    return this.random.randomString(6);
  }

  generateGameCode() {
    return this.random.randomString(4).toUpperCase();
  }
}
