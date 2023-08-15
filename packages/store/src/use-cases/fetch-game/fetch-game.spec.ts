import {
  Choice,
  GameState,
  Question,
  createAnswer,
  createChoice,
  createPlayer,
  createQuestion,
  createStartedGame,
} from '@cah/shared';

import { selectAllAnswers } from '../../slices/answers/answers.selectors';
import { AnswerSlice } from '../../slices/answers/answers.slice';
import { selectAllChoices } from '../../slices/choices/choices.selectors';
import { GameSlice } from '../../slices/game/game.slice';
import { selectAllPlayers } from '../../slices/players/players.selectors';
import { PlayersSlice } from '../../slices/players/players.slice';
import { selectAllQuestions } from '../../slices/questions/questions.selectors';
import { TestStore } from '../../test-store';

import { fetchGame } from './fetch-game';

describe('fetchGame', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
  });

  it('fetches a game from its id', async () => {
    const player = createPlayer({ id: 'playerId' });
    const questionMaster = createPlayer({ id: 'questionMasterId' });
    const question = createQuestion({ id: 'questionId', blanks: [0, 1] });
    const choice = createChoice({ id: 'choiceId' });
    const answer = createAnswer({ id: 'answerId', playerId: 'playerId', choices: [choice] });

    store.client.getGame.mockResolvedValue(
      createStartedGame({
        id: 'gameId',
        code: 'CODE',
        state: GameState.started,
        players: [questionMaster, player],
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
      playersIds: ['questionMasterId', 'playerId'],
      questionMasterId: 'questionMasterId',
      questionId: 'questionId',
      answersIds: ['answerId'],
      selectedAnswerId: 'selectedAnswerId',
      isAnswerValidated: true,
    });

    expect(store.getPlayer()).toHaveProperty('selectedChoicesIds', [null, null]);

    expect(store.select(selectAllPlayers)).toEqual<PlayersSlice[]>([questionMaster, player]);
    expect(store.select(selectAllQuestions)).toEqual<Question[]>([question]);
    expect(store.select(selectAllChoices)).toEqual<Choice[]>([choice]);

    expect(store.select(selectAllAnswers)).toEqual<AnswerSlice[]>([
      {
        id: answer.id,
        playerId: 'playerId',
        choicesIds: ['choiceId'],
      },
    ]);
  });

  it("sets the player's gameId", async () => {
    store.client.getGame.mockResolvedValue(createStartedGame({ id: 'gameId' }));

    await store.dispatch(fetchGame('gameId'));

    expect(store.getPlayer()).toHaveProperty('gameId', 'gameId');
  });
});
