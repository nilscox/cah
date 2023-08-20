import { array } from '@cah/utils';

import { Choice, createChoice } from 'src/entities';

import { SqlChoice, choices } from '../../drizzle-schema';
import { TestRepository } from '../../test-repository';

import { SqlChoiceRepository } from './sql-choice.repository';

describe('SqlChoiceRepository', () => {
  let test: TestRepository;
  let repository: SqlChoiceRepository;

  beforeEach(async () => {
    test = await TestRepository.create();
    repository = new SqlChoiceRepository(test.db);

    await test.create.game({ id: 'gameId' });
    await test.create.player({ id: 'playerId', gameId: 'gameId' });
  });

  it('finds the cards for all players in a given game', async () => {
    await test.create.choice({ id: 'choiceId1', gameId: 'gameId', playerId: null });
    await test.create.choice({ id: 'choiceId2', gameId: 'gameId', playerId: 'playerId' });

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
    await test.create.choice({ id: 'choiceId1', gameId: 'gameId', playerId: null });
    await test.create.choice({ id: 'choiceId2', gameId: 'gameId', playerId: 'playerId' });

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
    await test.create.choice({ id: 'choiceId1', gameId: 'gameId', playerId: 'playerId' });

    await test.create.question({ id: 'questionId', gameId: 'gameId' });
    // prettier-ignore
    await test.create.answer({ id: 'answerId', gameId: 'gameId', playerId: 'playerId', questionId: 'questionId' });
    await test.create.choice({ id: 'choiceId2', gameId: 'gameId', playerId: null, answerId: 'answerId' });

    await test.create.choice({ id: 'choiceId3', gameId: 'gameId', playerId: null });
    await test.create.choice({ id: 'choiceId4', gameId: 'gameId', playerId: null });

    const cards = await repository.findAvailable('gameId', 1);

    expect(cards).toEqual<Choice[]>([
      {
        id: 'choiceId3',
        gameId: 'gameId',
        text: '',
        caseSensitive: false,
      },
    ]);
  });

  it('inserts multiple choices', async () => {
    await repository.insertMany(array(2, (i) => createChoice({ id: `choiceId${i + 1}`, gameId: 'gameId' })));

    const results = await test.db.select().from(choices);

    expect(results).toEqual<SqlChoice[]>([
      {
        id: 'choiceId1',
        gameId: 'gameId',
        text: '',
        playerId: null,
        answerId: null,
        caseSensitive: false,
        place: null,
      },
      {
        id: 'choiceId2',
        gameId: 'gameId',
        text: '',
        playerId: null,
        answerId: null,
        caseSensitive: false,
        place: null,
      },
    ]);
  });

  it('updates multiple choices', async () => {
    await test.create.choice({ id: `choiceId1`, gameId: 'gameId', text: 'Yes.' });

    const [choice] = await repository.findAvailable('gameId', 1);

    choice.text = 'No.';

    await repository.updateMany([choice]);

    const results = await test.db.select().from(choices);

    expect(results).toHaveProperty('0.text', 'No.');
  });
});
