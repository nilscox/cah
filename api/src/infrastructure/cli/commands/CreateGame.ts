import { CreateGameHandler } from '../../../application/commands/CreateGameCommand/CreateGameCommand';
import { Command } from '../Command';

export class CreateGame extends Command {
  handler = new CreateGameHandler(
    this.deps.configService,
    this.deps.gameService,
    this.deps.gameRepository,
    this.deps.rtcManager,
    this.deps.mapper,
  );

  async run() {
    this.requirePlayer();

    const game = await this.handler.execute({}, this);
    this.log(`game created, code = "${game.code}"`);
  }
}
