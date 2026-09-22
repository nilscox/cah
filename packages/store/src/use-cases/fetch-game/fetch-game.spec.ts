import {
  type Choice,
  GameState,
  type Question,
  createAnswer,
  createChoice,
  createCurrentPlayer,
  createGamePlayer,
  createQuestion,
  createStartedGame,
} from '@cah/shared';

import { type AnswerViewModel, selectAllAnswers } from '../../slices/answers/answers.selectors.ts';
import { selectAllChoices } from '../../slices/choices/choices.selectors.ts';
import { type GameSlice } from '../../slices/game/game.slice.ts';
import { selectAllPlayers } from '../../slices/players/players.selectors.ts';
import { type PlayersSlice } from '../../slices/players/players.slice.ts';
import { selectAllQuestions } from '../../slices/questions/questions.selectors.ts';
import { TestStore } from '../../test-store.ts';

import { fetchGame } from './fetch-game.ts';

describe('fetchGame', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
  });

  it('fetches a game from its id', async () => {
    const player = createCurrentPlayer({ id: 'playerId' });
    const questionMaster = createGamePlayer({ id: 'questionMasterId' });
    const question = createQuestion({ id: 'questionId', blanks: [0, 1] });
    const choice = createChoice({ id: 'choiceId' });
    const answer = createAnswer({ id: 'answerId', playerId: 'playerId', choices: [choice] });

    store.client.getGame.mockResolvedValue(
      createStartedGame({
        id: 'gameId',
        code: 'CODE',
        state: GameState.started,
        players: [createGamePlayer(player), questionMaster],
        questionMaster,
        question,
        answers: [answer],
        selectedAnswerId: 'selectedAnswerId',
      }),
    );

    await store.dispatch(fetchGame('gameId'));

    expect(store.getGame()).toEqual<GameSlice>({
      id: 'gameId',
      code: 'CODE',
      state: GameState.started,
      playersIds: ['playerId', 'questionMasterId'],
      questionMasterId: 'questionMasterId',
      questionId: 'questionId',
      answersIds: ['answerId'],
      selectedAnswerId: 'selectedAnswerId',
    });

    expect(store.getPlayer()).toHaveProperty('selectedChoicesIds', [null, null]);

    expect(store.select(selectAllPlayers)).toEqual<PlayersSlice[]>([player, questionMaster]);
    expect(store.select(selectAllQuestions)).toEqual<Question[]>([question]);
    expect(store.select(selectAllChoices)).toEqual<Choice[]>([choice]);
    expect(store.select(selectAllAnswers)).toEqual<AnswerViewModel[]>([answer]);
  });

  it("sets the player's gameId", async () => {
    store.client.getGame.mockResolvedValue(createStartedGame({ id: 'gameId' }));

    await store.dispatch(fetchGame('gameId'));

    expect(store.getPlayer()).toHaveProperty('gameId', 'gameId');
  });
});
