import { Inject, Service } from 'typedi';

import { Game, PlayState } from '../entities/Game';
import { Player } from '../entities/Player';
import { Question } from '../entities/Question';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { NoMoreChoiceError } from '../errors/NoMoreChoiceError';
import { ChoiceRepository, ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { GameEvents, GameEventsToken } from '../interfaces/GameEvents';
import { PlayerRepository, PlayerRepositoryToken } from '../interfaces/PlayerRepository';

class StartedGame extends Game {
  playState!: PlayState;
  questionMaster!: Player;
  question!: Question;
  winner?: Player;
}

@Service()
export class GameService {
  @Inject(ChoiceRepositoryToken)
  private readonly choiceRepository!: ChoiceRepository;

  @Inject(PlayerRepositoryToken)
  private readonly playerRepository!: PlayerRepository;

  @Inject(GameEventsToken)
  private readonly gameEvents!: GameEvents;

  ensurePlayState(game: Game, playState: PlayState): StartedGame {
    if (game.playState !== playState) {
      throw new InvalidPlayStateError(game, playState);
    }

    return game as StartedGame;
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

        this.gameEvents.emit(game, player, { type: 'CardsDealt', cards });
      }
    }
  }
}
