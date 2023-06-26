import { injectableClass } from 'ditox';

import { EventPublisherPort } from 'src/adapters';
import { Player, isStarted } from 'src/entities';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { ChoiceRepository, GameRepository, PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';
import { sum } from 'src/utils/sum';

export class CardsDealtEvent extends DomainEvent {
  constructor(playerId: string, public readonly choicesIds: string[]) {
    super('player', playerId);
  }
}

type DealCardsCommand = {
  gameId: string;
};

export class DealCardsHandler implements CommandHandler<DealCardsCommand> {
  static inject = injectableClass(
    this,
    TOKENS.publisher,
    TOKENS.repositories.game,
    TOKENS.repositories.player,
    TOKENS.repositories.choice
  );

  constructor(
    private readonly publisher: EventPublisherPort,
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly choiceRepository: ChoiceRepository
  ) {}

  async execute(command: DealCardsCommand): Promise<void> {
    const game = await this.gameRepository.findByIdOrFail(command.gameId);
    const players = await this.playerRepository.findAllByGameId(game.id);

    if (!isStarted(game)) {
      throw new Error('the game is not started');
    }

    const cards = await this.choiceRepository.findPlayersCards(game.id);
    const getCards = (player: Player) => cards[player.id] ?? [];

    const numberOfChoices = sum(players.map((player) => 11 - getCards(player).length));
    const choices = await this.choiceRepository.findAvailable(game.id, numberOfChoices);

    const events: CardsDealtEvent[] = [];
    const availableChoices = [...choices];

    for (const player of players) {
      const cards = availableChoices.splice(0, 11 - getCards(player).length);

      if (cards.length === 0) {
        continue;
      }

      cards.forEach((card) => {
        card.playerId = player.id;
      });

      const choicesIds = cards.map((card) => card.id);
      events.push(new CardsDealtEvent(player.id, choicesIds));
    }

    await this.choiceRepository.save(...choices);

    for (const event of events) {
      this.publisher.publish(event);
    }
  }
}
