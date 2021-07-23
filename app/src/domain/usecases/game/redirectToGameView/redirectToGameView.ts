import { createThunk } from '../../../../store/createThunk';
import { Game, GameState, PlayState, StartedGame } from '../../../entities/Game';

export const redirectToGameView = createThunk(({ getState, gameRouterGateway }) => {
  const game = getState().game as Game;

  const redirect = (to: string) => {
    const pathname = `/game/${game.code}${to}`;

    if (gameRouterGateway.pathname !== pathname) {
      gameRouterGateway.push(pathname);
    }
  };

  if (game.state === GameState.idle) {
    redirect(`/idle`);
  }

  if (game.state === GameState.finished) {
    redirect(`/finished`);
  }

  if (game.state === GameState.started) {
    const { playState } = game as StartedGame;

    if (playState === PlayState.playersAnswer) {
      redirect(`/started/players-answer`);
    }

    if (playState === PlayState.questionMasterSelection) {
      redirect(`/started/question-master-selection`);
    }

    if (playState === PlayState.endOfTurn) {
      redirect(`/started/end-of-turn`);
    }
  }
});
