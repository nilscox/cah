import expect from 'expect';

import { GameDto } from '../../../../../../shared/dtos';
import { selectGame } from '../../../../store/slices/game/game.selectors';
import { createId } from '../../../../tests/create-id';
import { createPlayer } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { GameState } from '../../../entities/game';

import { createGame } from './createGame';

describe('createGame', () => {
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
    store.gameGateway.createGame.mockResolvedValueOnce(gameDto);
  });

  it('creates a game', async () => {
    await store.dispatch(createGame());

    expect(store.select(selectGame)).toEqual({
      id: gameDto.id,
      creator: player.id,
      code: 'OK42',
      state: GameState.idle,
      players: { [player.id]: player },
      turns: [],
    });
  });

  it('redirects to the game view', async () => {
    await store.dispatch(createGame());

    expect(store.routerGateway.gamePathname).toEqual('/game/OK42/idle');
  });
});
