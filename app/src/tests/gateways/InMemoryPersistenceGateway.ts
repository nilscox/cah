import { StoragePersistenceGateway } from '../../infrastructure/gateways/StoragePersistenceGateway';
import { InMemoryStorage } from '../InMemoryStorgae';

export class InMemoryPersistenceGateway extends StoragePersistenceGateway {
  constructor() {
    super(new InMemoryStorage());
  }
}
