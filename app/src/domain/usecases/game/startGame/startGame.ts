import { createThunk } from '../../../../store/createThunk';
import { Player } from '../../../entities/Player';

export const startGame = createThunk(
  async ({ getState, gameGateway, gameRouterGateway }, questionMaster: Player, turns: number) => {
    const { game } = getState();

    await gameGateway.startGame(questionMaster, turns);

    gameRouterGateway.push(`/game/${game?.code}/started`);
  },
);
