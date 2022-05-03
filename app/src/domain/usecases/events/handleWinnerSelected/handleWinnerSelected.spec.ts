import expect from 'expect';

import { first } from '../../../../shared/first';
import {
  selectAnswers,
  selectPlayersExcludingQuestionMaster,
  selectWinner,
} from '../../../../store/slices/game/game.selectors';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { GamePlayer } from '../../../entities/game';
import { RTCMessage } from '../../../gateways/RTCGateway';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handleAllPlayersAnswered', () => {
  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer())
    .apply(TestBuilder.createGame())
    .apply(TestBuilder.startGame())
    .apply(TestBuilder.answerQuestion())
    .getStore();

  const createMessage = () => {
    const players = store.select(selectPlayersExcludingQuestionMaster);
    const winner = first(players) as GamePlayer;

    const anonymousAnswers = store.select(selectAnswers);
    const answers = anonymousAnswers.map((answer, index) => ({
      id: answer.id,
      choices: answer.choices,
      formatted: answer.formatted,
      player: players[index].id,
    }));

    const message: RTCMessage = {
      type: 'WinnerSelected',
      answers,
      winner: winner.id,
    };

    return [message, answers, winner] as const;
  };

  it('reveals the players attached to each answer, along with the winner', () => {
    const [message, answers, winner] = createMessage();

    store.dispatch(handleRTCMessage(message));

    expect(store.select(selectAnswers)).toEqual(answers);
    expect(store.select(selectWinner)).toEqual(winner);
  });

  it('redirects to the answer selection view', () => {
    const [message] = createMessage();

    store.dispatch(handleRTCMessage(message));

    expect(store.routerGateway.gamePathname).toMatch(/\/started\/end-of-turn$/);
  });
});
