import { IsUUID } from 'class-validator';

import { CommandHandler } from '../../ddd/CommandHandler';
import { SessionStore } from '../interfaces/SessionStore';
import { GameService } from '../services/GameService';

export class SelectWinnerCommand {
  @IsUUID('4')
  public readonly answerId: string;

  constructor(answerId: string) {
    this.answerId = answerId;
  }
}

export class SelectWinnerHandler implements CommandHandler<SelectWinnerCommand, void, SessionStore> {
  constructor(private readonly gameService: GameService) {}

  async execute({ answerId }: SelectWinnerCommand, session: SessionStore) {
    const player = session.player!;
    const game = await this.gameService.getGameForPlayer(player.id);

    game.setWinningAnswer(player, answerId);

    await this.gameService.saveAndPublish(game);
  }
}
