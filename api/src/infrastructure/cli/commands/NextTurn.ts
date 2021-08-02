import { NextTurnHandler } from '../../../application/commands/NextTurnCommand/NextTurnCommand';
import { Command } from '../Command';

export class NextTurn extends Command {
  handler = new NextTurnHandler(this.deps.gameService, this.deps.gameRepository);

  async run() {
    this.requirePlayer(true);

    await this.handler.execute({}, this);
    this.log(`next turn by "${this.player?.nick}"`);
  }
}
