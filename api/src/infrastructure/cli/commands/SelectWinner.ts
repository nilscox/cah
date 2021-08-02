import { SelectWinnerHandler } from '../../../application/commands/SelectWinnerCommand/SelectWinnerCommand';
import { Command } from '../Command';

export class SelectWinner extends Command {
  handler = new SelectWinnerHandler(this.deps.gameService);

  async run(args: { answer: string[] }) {
    this.requirePlayer(true);

    const answer = this.game!.answers![Number(args.answer) - 1];

    await this.handler.execute({ answerId: answer.id }, this);
    this.log(`answer selected by "${this.player?.nick}"`);
  }
}
