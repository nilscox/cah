import { LoginHandler } from '../../../application/commands/LoginCommand';
import { Command } from '../Command';

export class CreatePlayer extends Command {
  handler = new LoginHandler(this.deps.playerRepository, this.deps.mapper);

  async run(args: { nick: string }) {
    const player = await this.handler.execute({ nick: args.nick }, {});
    this.log(`player created, nick = "${player.nick}"`);
  }
}
