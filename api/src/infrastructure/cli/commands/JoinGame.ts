import { JoinGameHandler } from '../../../application/commands/JoinGameCommand';
import { Command } from '../Command';

export class JoinGame extends Command {
  handler = new JoinGameHandler(
    this.deps.gameService,
    this.deps.gameRepository,
    this.deps.rtcManager,
    this.deps.mapper,
  );

  async run(args: { code: string }) {
    this.requirePlayer();

    const game = await this.handler.execute({ gameCode: args.code }, this);
    this.log(`game "${game.code}" joined by "${this.player?.nick}"`);
  }
}
