import expect from 'expect';

import { createAnonymousAnswer, createFullPlayer, createPlayer, createStartedGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';
import { AnonymousAnswer } from '../../../entities/Answer';
import { PlayState } from '../../../entities/game';
import { Player } from '../../../entities/player';

import { selectWinner } from './selectWinner';

describe('selectWinner', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  const setup = (answer: AnonymousAnswer, winner: Player) => {
    store.setup(({ dispatch, listenRTCMessages, gameGateway, rtcGateway }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(createStartedGame({ playState: PlayState.questionMasterSelection, players: [winner] })));

      gameGateway.winner = winner;

      listenRTCMessages();
      rtcGateway.triggerMessage({ type: 'AllPlayersAnswered', answers: [answer] });
    });
  };

  it('selects the winning answer', async () => {
    const answer = createAnonymousAnswer();
    const winner = createPlayer({ nick: 'winnie' });

    setup(answer, winner);

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
