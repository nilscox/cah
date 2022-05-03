import expect from 'expect';

import { array } from '../../../../shared/array';
import { selectAnswers, selectQuestion, selectTurns, selectWinner } from '../../../../store/slices/game/game.selectors';
import { selectPlayerGame } from '../../../../store/slices/player/player.selectors';
import { createGamePlayer, createPlayer } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { RTCMessage } from '../../../gateways/RTCGateway';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handleTurnFinished', () => {
  const players = array(3, () => createGamePlayer());
  const [player, initialQuestionMaster] = players;

  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer(createPlayer(player)))
    .apply(TestBuilder.createGame({ players }))
    .apply(TestBuilder.startGame(initialQuestionMaster))
    .apply(TestBuilder.answerQuestion())
    .apply(TestBuilder.selectWinner())
    .getStore();

  const message: RTCMessage = {
    type: 'TurnFinished',
  };

  it("resets the current turn's values", () => {
    store.dispatch(handleRTCMessage(message));

    expect(store.select(selectAnswers)).toEqual([]);
    expect(store.select(selectWinner)).toBeUndefined();
  });

  it("resets the player's selection validation state", () => {
    store.dispatch(handleRTCMessage(message));

    expect(store.select(selectPlayerGame)).toHaveProperty('selectionValidated', false);
  });

  it('adds the current turn to the list of turns', () => {
    const question = store.select(selectQuestion);
    const answers = store.select(selectAnswers);
    const winner = store.select(selectWinner);

    store.dispatch(handleRTCMessage(message));

    expect(store.select(selectTurns)).toEqual([
      {
        number: 1,
        question,
        answers,
        winner,
      },
    ]);
  });
});
