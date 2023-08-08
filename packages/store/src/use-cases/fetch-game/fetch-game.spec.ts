import {
  GameState,
  createAnswer,
  createChoice,
  createPlayer,
  createQuestion,
  createStartedGame,
} from '@cah/shared';

import { answersSelectors } from '../../slices/answers/answers.selectors';
import { AnswerSlice } from '../../slices/answers/answers.slice';
import { choicesSelectors } from '../../slices/choices/choices.selectors';
import { ChoiceSlice } from '../../slices/choices/choices.slice';
import { GameSlice } from '../../slices/game/game.slice';
import { playersSelectors } from '../../slices/players/players.selectors';
import { PlayersSlice } from '../../slices/players/players.slice';
import { questionsSelectors } from '../../slices/questions/questions.selectors';
import { QuestionSlice } from '../../slices/questions/questions.slice';
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

    expect(store.select(playersSelectors.all)).toEqual<PlayersSlice[]>([questionMaster, player]);
    expect(store.select(questionsSelectors.all)).toEqual<QuestionSlice[]>([question]);
    expect(store.select(choicesSelectors.all)).toEqual<ChoiceSlice[]>([choice]);

    expect(store.select(answersSelectors.all)).toEqual<AnswerSlice[]>([
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
