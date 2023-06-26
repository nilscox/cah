import { Player } from '@cah/shared';
import { injectableClass } from 'ditox';

import { QueryHandler } from 'src/interfaces';
import { ChoiceRepository, PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export type GetPlayerQuery = {
  playerId: string;
};

export class GetPlayerHandler implements QueryHandler<GetPlayerQuery, Player> {
  static inject = injectableClass(this, TOKENS.repositories.player, TOKENS.repositories.choice);

  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly choiceRepository: ChoiceRepository
  ) {}

  async execute({ playerId }: GetPlayerQuery): Promise<Player> {
    const player = await this.playerRepository.findByIdOrFail(playerId);
    const cards = player.gameId ? await this.choiceRepository.findPlayerCards(playerId) : undefined;

    const result: Player = {
      id: player.id,
      nick: player.nick,
      gameId: player.gameId,
      cards: cards?.map((choice) => ({
        id: choice.id,
        text: choice.text,
        caseSensitive: choice.caseSensitive,
      })),
    };

    return result;
  }
}
