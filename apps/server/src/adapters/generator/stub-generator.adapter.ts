import { type GeneratorPort } from './generator.port.ts';

export class StubGeneratorAdapter implements GeneratorPort {
  nextId = '';

  generateId(): string {
    return this.nextId;
  }

  nextGameCode = '';

  generateGameCode() {
    return this.nextGameCode;
  }
}
