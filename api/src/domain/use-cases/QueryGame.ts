import { Inject, Service } from 'typedi';

import { Game } from '../entities/Game';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';

@Service()
export class QueryGame {
  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  queryGame(gameId: number): Promise<Game | undefined> {
    return this.gameRepository.findOne(gameId);
  }
}
