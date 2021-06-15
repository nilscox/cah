import { Inject, Service } from 'typedi';

import { Game, GameState, PlayState, StartedGame } from '../entities/Game';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { NoMoreChoiceError } from '../errors/NoMoreChoiceError';
import { ChoiceRepository, ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { GameRepository, GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepository, PlayerRepositoryToken } from '../interfaces/PlayerRepository';

@Service()
export class GameService {
  @Inject(GameRepositoryToken)
  private readonly gameRepository!: GameRepository;

  @Inject(ChoiceRepositoryToken)
  private readonly choiceRepository!: ChoiceRepository;

  @Inject(PlayerRepositoryToken)
  private readonly playerRepository!: PlayerRepository;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  ensurePlayState(game: StartedGame, playState: PlayState): void {
    if (game.playState !== playState) {
      throw new InvalidPlayStateError(game, playState);
    }
  }

  async findStartedGame(gameId: number): Promise<StartedGame> {
    const game = await this.gameRepository.findOne(gameId);

    if (!game) {
      throw new EntityNotFoundError('game', 'id', gameId);
    }

    if (game.state !== GameState.started) {
      throw new Error(`game with id ${gameId} is not started`);
    }

    return Object.assign(new StartedGame(), game);
  }

  async dealCards(game: Game) {
    const choices = await this.choiceRepository.getAvailableChoices(game);

    for (const player of game.players) {
      const needed = Game.cardsPerPlayer - player.cards.length;

      if (needed > choices.length) {
        throw new NoMoreChoiceError();
      }

      if (needed > 0) {
        const cards = choices.splice(0, needed);

        await this.playerRepository.addCards(player, cards);
        this.gameEvents.onPlayerEvent(player, { type: 'CardsDealt', cards });
      }
    }
  }
}
