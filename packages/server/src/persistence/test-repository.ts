import { StubConfigAdapter } from 'src/adapters';

import { Database } from './database';

export class TestRepository {
  config = new StubConfigAdapter({
    database: {
      url: 'postgres://postgres@localhost:5432/cah',
    },
  });

  db = new Database(this.config);

  static async create() {
    const test = new TestRepository();

    await test.setup();

    return test;
  }

  async setup() {
    await this.db.clear('cah');
  }

  getRepository<T>(Repository: { new (database: Database): T }) {
    return new Repository(this.db);
  }
}
