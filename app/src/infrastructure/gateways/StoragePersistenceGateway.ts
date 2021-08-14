import { PersistenceGateway } from '../../domain/gateways/PersistenceGateway';

export class StoragePersistenceGateway implements PersistenceGateway {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  getItem<T>(key: string): T {
    return JSON.parse(this.storage.getItem(key) ?? 'null');
  }

  setItem<T>(key: string, value: T): void {
    return this.storage.setItem(key, JSON.stringify(value));
  }
}
