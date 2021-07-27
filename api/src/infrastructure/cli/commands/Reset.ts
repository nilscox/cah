import { createKnexConnection, createKnexSessionStore } from '../../index';
import { Command } from '../Command';

export class Reset extends Command {
  private async recreateDatabase() {
    await this.connection.synchronize(true);
  }

  private async dropSessions() {
    const knex = await createKnexConnection();

    await new Promise<void>((r) => createKnexSessionStore(knex).clear?.(r) ?? r());
    await knex.destroy();
  }

  async run() {
    await this.recreateDatabase();
    await this.dropSessions();
  }
}
