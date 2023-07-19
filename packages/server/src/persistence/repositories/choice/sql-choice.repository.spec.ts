import { Choice, createChoice } from 'src/entities';
import { array } from 'src/utils/array';

import { SqlChoice, choices, games, players } from '../../drizzle-schema';
import { TestRepository } from '../../test-repository';

import { SqlChoiceRepository } from './sql-choice.repository';

describe('SqlChoiceRepository', () => {
  let test: TestRepository;
  let repository: SqlChoiceRepository;

  beforeEach(async () => {
    test = await TestRepository.create();
    repository = new SqlChoiceRepository(test.db);
  });

  it('finds the cards for all players in a given game', async () => {
    await test.db.insert(games).values({ id: 'gameId', code: 'ABCD', state: 'idle' });
    await test.db.insert(players).values({ id: 'playerId', gameId: 'gameId', nick: '' });

    await test.db
      .insert(choices)
      .values({ id: 'choiceId1', gameId: 'gameId', playerId: null, text: '', caseSensitive: false });

    await test.db
      .insert(choices)
      .values({ id: 'choiceId2', gameId: 'gameId', playerId: 'playerId', text: '', caseSensitive: false });

    const cards = await repository.findPlayersCards('gameId');

    expect(cards).toEqual<Record<string, Choice[]>>({
      playerId: [
        {
          id: 'choiceId2',
          gameId: 'gameId',
          playerId: 'playerId',
          text: '',
          caseSensitive: false,
        },
      ],
    });
  });

  it('finds the cards of given player', async () => {
    await test.db.insert(games).values({ id: 'gameId', code: 'ABCD', state: 'idle' });
    await test.db.insert(players).values({ id: 'playerId', gameId: 'gameId', nick: '' });

    await test.db
      .insert(choices)
      .values({ id: 'choiceId1', gameId: 'gameId', playerId: null, text: '', caseSensitive: false });

    await test.db
      .insert(choices)
      .values({ id: 'choiceId2', gameId: 'gameId', playerId: 'playerId', text: '', caseSensitive: false });

    const cards = await repository.findPlayerCards('playerId');

    expect(cards).toEqual<Choice[]>([
      {
        id: 'choiceId2',
        gameId: 'gameId',
        playerId: 'playerId',
        text: '',
        caseSensitive: false,
      },
    ]);
  });

  it('finds all available choices in a given game', async () => {
    await test.db.insert(games).values({ id: 'gameId', code: 'ABCD', state: 'idle' });
    await test.db.insert(players).values({ id: 'playerId', gameId: 'gameId', nick: '' });

    await test.db
      .insert(choices)
      .values({ id: 'choiceId1', gameId: 'gameId', playerId: null, text: '', caseSensitive: false });

    await test.db
      .insert(choices)
      .values({ id: 'choiceId2', gameId: 'gameId', playerId: null, text: '', caseSensitive: false });

    await test.db
      .insert(choices)
      .values({ id: 'choiceId3', gameId: 'gameId', playerId: 'playerId', text: '', caseSensitive: false });

    const cards = await repository.findAvailable('gameId', 1);

    expect(cards).toEqual<Choice[]>([
      {
        id: 'choiceId1',
        gameId: 'gameId',
        text: '',
        caseSensitive: false,
      },
    ]);
  });

  it('inserts multiple choices', async () => {
    await test.db.insert(games).values({ id: 'gameId', code: 'ABCD', state: 'idle' });

    await repository.insertMany(array(2, (i) => createChoice({ id: `choiceId${i + 1}`, gameId: 'gameId' })));

    const results = await test.db.select().from(choices);

    expect(results).toEqual<SqlChoice[]>([
      {
        id: 'choiceId1',
        gameId: 'gameId',
        text: '',
        playerId: null,
        caseSensitive: false,
      },
      {
        id: 'choiceId2',
        gameId: 'gameId',
        text: '',
        playerId: null,
        caseSensitive: false,
      },
    ]);
  });

  it('inserts multiple choices', async () => {
    await test.db.insert(games).values({ id: 'gameId', code: 'ABCD', state: 'idle' });

    await repository.insertMany(array(2, (i) => createChoice({ id: `choiceId${i + 1}`, gameId: 'gameId' })));

    const results = await test.db.select().from(choices);

    expect(results).toEqual<SqlChoice[]>([
      {
        id: 'choiceId1',
        gameId: 'gameId',
        text: '',
        playerId: null,
        caseSensitive: false,
      },
      {
        id: 'choiceId2',
        gameId: 'gameId',
        text: '',
        playerId: null,
        caseSensitive: false,
      },
    ]);
  });
});
