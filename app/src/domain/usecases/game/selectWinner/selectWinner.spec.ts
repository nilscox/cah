import expect from 'expect';

import { createAnonymousAnswer, createFullPlayer, createPlayer, createStartedGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';
import { PlayState } from '../../../entities/Game';

import { selectWinner } from './selectWinner';

describe('selectWinner', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('selects the winning answer', async () => {
    const answer = createAnonymousAnswer();
    const winner = createPlayer({ nick: 'winnie' });

    store.gameGateway.winner = winner;

    store.setup(({ dispatch, listenRTCMessages, rtcGateway }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(createStartedGame({ playState: PlayState.questionMasterSelection, players: [winner] })));

      listenRTCMessages();
      rtcGateway.triggerMessage({ type: 'AllPlayersAnswered', answers: [answer] });
    });

    await store.dispatch(selectWinner(answer));

    expect(store.gameGateway.winningAnswer).toEqual(answer);

    store.expectPartialState('game', {
      playState: PlayState.endOfTurn,
      answers: [
        {
          id: answer.id,
          choices: answer.choices,
          formatted: answer.formatted,
          player: winner,
        },
      ],
      winner,
    });
  });
});
