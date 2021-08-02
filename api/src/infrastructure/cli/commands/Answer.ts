import { CreateAnswerHandler } from '../../../application/commands/CreateAnswerCommand/CreateAnswerCommand';
import { Command } from '../Command';

export class Answer extends Command {
  handler = new CreateAnswerHandler(this.deps.gameService, this.deps.randomService);

  async run(args: { choices: string[] }) {
    this.requirePlayer(true);

    const choices = args.choices.map(Number).map((index) => this.player!.cards[index - 1]);

    await this.handler.execute({ choicesIds: choices.map(({ id }) => id) }, this);
    this.log(`answer submitted by "${this.player?.nick}"`);
  }
}
