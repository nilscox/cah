import { GeneratorPort } from './generator.port';

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
