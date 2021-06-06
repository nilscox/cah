import { Inject, Service } from 'typedi';

import { Player } from '../entities/Player';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';

@Service()
export class JoinGame {
  @Inject(GameRepositoryToken)
  private gameRepository!: GameRepository;

  async joinGame(gameCode: string, player: Player): Promise<void> {
    const game = await this.gameRepository.findByCode(gameCode);

    if (!game) {
      throw new Error(`game with code ${gameCode} was not found`);
    }

    await this.gameRepository.addPlayer(game, player);
  }
}
