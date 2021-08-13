import { createKnexConnection, createKnexSessionStore } from '../../web/web';
import { Command } from '../Command';

export class Reset extends Command {
  private async recreateDatabase() {
    await this.connection.synchronize(true);
  }

  private async dropSessions() {
    const knex = await createKnexConnection(this.deps.configService);

    await new Promise<void>((r) => createKnexSessionStore(knex).clear?.(r) ?? r());
    await knex.destroy();
  }

  async run() {
    await this.recreateDatabase();
    await this.dropSessions();
  }
}
