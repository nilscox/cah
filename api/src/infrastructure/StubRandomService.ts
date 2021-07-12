import { RandomService } from '../application/services/RandomService';

export class StubRandomService extends RandomService {
  override randomize = <T>(array: T[]) => array;
}
