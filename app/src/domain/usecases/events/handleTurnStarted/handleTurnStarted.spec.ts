import expect from 'expect';

import { first } from '../../../../shared/first';
import { selectGame, selectPlayers } from '../../../../store/slices/game/game.selectors';
import { selectPlayerGame } from '../../../../store/slices/player/player.selectors';
import { createQuestion } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { GamePlayer, PlayState, StartedGame } from '../../../entities/game';
import { RTCMessage } from '../../../gateways/RTCGateway';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handleTurnStarted', () => {
  const store = new TestBuilder().apply(TestBuilder.setPlayer()).apply(TestBuilder.createGame()).getStore();

  const createMessage = (question = createQuestion()) => {
    const questionMaster = first(store.select(selectPlayers)) as GamePlayer;

    const message: RTCMessage = {
      type: 'TurnStarted',
      playState: PlayState.playersAnswer,
      question,
      questionMaster: questionMaster.nick,
    };

    return [message, questionMaster, question] as const;
  };

  it('resets the game for the next turn', () => {
    const [message, questionMaster, question] = createMessage();

    store.dispatch(handleRTCMessage(message));

    const game = store.select(selectGame) as StartedGame;

    expect(game.playState).toEqual(PlayState.playersAnswer);
    expect(game.questionMaster).toEqual(questionMaster.nick);
    expect(game.question).toEqual(question);
  });

  it("clears the player's selection", () => {
    const [message] = createMessage(createQuestion({ numberOfBlanks: 2 }));

    store.dispatch(handleRTCMessage(message));

    expect(store.select(selectPlayerGame)).toHaveProperty('selection', [null, null]);
  });

  it('navigates to the answer question view', () => {
    store.dispatch(
      handleRTCMessage({
        type: 'TurnStarted',
        playState: PlayState.playersAnswer,
        question: createQuestion(),
        questionMaster: first(store.select(selectPlayers))?.nick as string,
      }),
    );

    expect(store.routerGateway.gamePathname).toMatch(/\/started\/answer-question$/);
  });
});
