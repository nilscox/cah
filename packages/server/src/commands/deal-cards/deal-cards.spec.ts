import { StubEventPublisherAdapter } from 'src/adapters';
import { GameState, Player, createChoice } from 'src/entities';
import { HandlerCommand } from 'src/interfaces';
import { InMemoryChoiceRepository, InMemoryGameRepository, InMemoryPlayerRepository } from 'src/persistence';
import { array } from 'src/utils/array';

import { CardsDealtEvent, DealCardsHandler } from './deal-cards';

class Test {
  publisher = new StubEventPublisherAdapter();
  gameRepository = new InMemoryGameRepository();
  playerRepository = new InMemoryPlayerRepository();
  choiceRepository = new InMemoryChoiceRepository();

  handler = new DealCardsHandler(
    this.publisher,
    this.gameRepository,
    this.playerRepository,
    this.choiceRepository
  );

  command: HandlerCommand<typeof this.handler> = {
    gameId: 'gameId',
  };

  choices = array(12, () => createChoice({ gameId: 'gameId' }));

  constructor() {
    this.gameRepository.set({ id: 'gameId', code: '', state: GameState.started });
    this.choiceRepository.set(...this.choices);
  }

  addPlayer(playerId: string, numberOfCards: number) {
    const player: Player = {
      id: playerId,
      nick: '',
      gameId: 'gameId',
    };

    this.playerRepository.set(player);
    this.choiceRepository.set(...array(numberOfCards, () => createChoice({ gameId: 'gameId', playerId })));
  }
}

describe('DealCardsCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  beforeEach(() => {
    test.addPlayer('player1Id', 11);
    test.addPlayer('player2Id', 10);
    test.addPlayer('player3Id', 0);
  });

  it('deals cards to all players', async () => {
    const [choice1, choice2, choice3] = test.choices;

    await test.handler.execute(test.command);

    const players = test.playerRepository.all();
    const cards = await test.choiceRepository.findPlayersCards('gameId');

    const [, player2, player3] = players;

    for (const player of players) {
      expect(cards[player.id]).toHaveLength(11);
    }

    expect(cards[player2.id]).toContainEqual({ ...choice1, playerId: player2.id });
    expect(cards[player3.id]).toContainEqual({ ...choice2, playerId: player3.id });
    expect(cards[player3.id]).toContainEqual({ ...choice3, playerId: player3.id });
  });

  it('triggers a CardsDealtEvent for each player who received cards', async () => {
    const [choice1] = test.choices;

    await test.handler.execute(test.command);

    expect(test.publisher).toHaveLength(2);
    expect(test.publisher).toContainEqual(new CardsDealtEvent('player2Id', [choice1.id]));
  });
});
