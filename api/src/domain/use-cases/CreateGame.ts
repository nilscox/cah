import { Inject, Service } from 'typedi';

import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';

@Service()
export class CreateGame {
  @Inject(GameRepositoryToken)
  gameRepository!: GameRepository;

  async createGame() {
    const code = Math.random().toString(36).slice(-4).toUpperCase();
    const game = await this.gameRepository.createGame(code);

    return game;
  }
}
