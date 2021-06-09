import { Inject, Service } from 'typedi';

import { Game } from '../entities/Game';
import { Player } from '../entities/Player';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';

@Service()
export class JoinGame {
  @Inject(GameRepositoryToken)
  private gameRepository!: GameRepository;

  @Inject(GameEventsToken)
  private gameEvents!: GameEvents;

  async joinGame(gameCode: string, player: Player): Promise<Game> {
    const game = await this.gameRepository.findByCode(gameCode);

    if (!game) {
      throw new Error(`game with code ${gameCode} was not found`);
    }

    await this.gameRepository.addPlayer(game, player);

    this.gameEvents.onGameEvent(game, { type: 'PlayerJoined', player });

    return game;
  }
}
