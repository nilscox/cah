import { StartGameHandler } from '../../../application/commands/StartGameCommand/StartGameCommand';
import { PlayerNotFoundError } from '../../../domain/errors/PlayerNotFoundError';
import { Command } from '../Command';

export class StartGame extends Command {
  handler = new StartGameHandler(this.deps.gameService, this.deps.gameRepository, this.deps.externalData);

  async run(args: { questionMaster: string; turns: string }) {
    this.requirePlayer(true);

    const questionMaster = await this.deps.playerRepository.findPlayerByNick(args.questionMaster);

    if (!questionMaster) {
      throw new PlayerNotFoundError();
    }

    await this.handler.execute({ questionMasterId: questionMaster.id, turns: Number(args.turns) }, this);

    this.log('game started');
  }
}
