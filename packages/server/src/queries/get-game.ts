import { Game } from 'src/entities';
import { QueryHandler } from 'src/interfaces';
import { GameRepository } from 'src/persistence';

export type GetGameQuery = {
  gameId: string;
};

export class GetGameHandler implements QueryHandler<GetGameQuery, Game> {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute({ gameId }: GetGameQuery): Promise<Game> {
    return this.gameRepository.findByIdOrFail(gameId);
  }
}
