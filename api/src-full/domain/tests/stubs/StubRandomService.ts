import { RandomService } from '../../services/RandomService';

export class StubRandomService implements RandomService {
  randomize<T>(array: T[]): T[] {
    return [...array].reverse();
  }
}
