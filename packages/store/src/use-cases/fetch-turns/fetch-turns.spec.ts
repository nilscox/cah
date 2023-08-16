import { Choice, Question, createAnswer, createChoice, createQuestion, createTurn } from '@cah/shared';

import { NormalizedTurn } from '../../normalization';
import { AnswerViewModel, selectAllAnswers } from '../../slices/answers/answers.selectors';
import { selectAllChoices } from '../../slices/choices/choices.selectors';
import { selectAllQuestions } from '../../slices/questions/questions.selectors';
import { selectTurns } from '../../slices/turns/turns.selectors';
import { TestStore } from '../../test-store';

import { fetchTurns } from './fetch-turns';

describe('fetchTurns', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
  });

  it("fetches a game's turns", async () => {
    const question = createQuestion({ id: 'questionId', blanks: [0, 1] });
    const choice = createChoice({ id: 'choiceId' });
    const answer = createAnswer({ id: 'answerId', playerId: 'playerId', choices: [choice] });

    store.client.getGameTurns.mockResolvedValue([
      createTurn({
        id: 'turnId',
        number: 1,
        question,
        answers: [answer],
        selectedAnswerId: answer.id,
      }),
    ]);

    await store.dispatch(fetchTurns('gameId'));

    expect(store.select(selectTurns)).toEqual<NormalizedTurn[]>([
      {
        id: 'turnId',
        number: 1,
        question: 'questionId',
        answers: ['answerId'],
        selectedAnswerId: 'answerId',
      },
    ]);

    expect(store.select(selectAllQuestions)).toEqual<Question[]>([question]);
    expect(store.select(selectAllChoices)).toEqual<Choice[]>([choice]);
    expect(store.select(selectAllAnswers)).toEqual<AnswerViewModel[]>([answer]);
  });
});
