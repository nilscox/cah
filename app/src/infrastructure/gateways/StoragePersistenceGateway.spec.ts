import { expect } from 'earljs';

import { InMemoryStorage } from '../../tests/InMemoryStorgae';

import { StoragePersistenceGateway } from './StoragePersistenceGateway';

describe('StoragePersistenceGateway', () => {
  it('persists an item to the storage', () => {
    const storage = new InMemoryStorage();
    const item = { question: 'What is the answer to life?' };

    const gateway = new StoragePersistenceGateway(storage);

    gateway.setItem('gollum', item);

    expect(storage.getItem('gollum')).toEqual(JSON.stringify(item));
  });

  it('loads an item to the storage', () => {
    const storage = new InMemoryStorage();
    const item = { answer: 51 };

    storage.setItem('sméagol', JSON.stringify(item));

    const gateway = new StoragePersistenceGateway(storage);

    expect(gateway.getItem('sméagol')).toEqual(item);
  });
});
