import expect from 'expect';

import { GameDto } from '../../../../../../shared/dtos';
import { createId } from '../../../../tests/create-id';
import { createPlayer } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { GameState } from '../../../entities/game';

import { joinGame } from './joinGame';

describe('joinGame', () => {
  const player = createPlayer();
  const gameDto: GameDto = {
    id: createId(),
    code: 'OK42',
    creator: player.id,
    gameState: GameState.idle,
    players: [player],
  };

  const store = new TestBuilder().apply(TestBuilder.setPlayer(player)).getStore();

  beforeEach(() => {
    store.gameGateway.joinGame.mockResolvedValueOnce(gameDto);
  });

  it('joins a game', async () => {
    await store.dispatch(joinGame('OK42'));

    expect(store.game).toEqual({
      id: gameDto.id,
      creator: player.id,
      code: 'OK42',
      state: GameState.idle,
      players: [player],
      turns: [],
    });
  });

  it('redirects to the game view', async () => {
    await store.dispatch(joinGame('OK42'));

    expect(store.routerGateway.gamePathname).toEqual('/game/OK42/idle');
  });
});
