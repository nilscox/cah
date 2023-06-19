import { GeneratorPort } from './generator.port';

export class MathRandomGeneratorAdapter implements GeneratorPort {
  generateId(): string {
    return MathRandomGeneratorAdapter.randomString(6);
  }

  generateGameCode() {
    return MathRandomGeneratorAdapter.randomString(4);
  }

  private static randomString(length: number) {
    return Math.random().toString(36).slice(-length);
  }
}
