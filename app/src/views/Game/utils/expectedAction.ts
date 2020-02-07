import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';

export const getExpectedAction = (game: GameDTO, player: PlayerDTO, endOfTurn: boolean) => {
  if (game.state === 'idle')
    return 'Waiting for all players to join the game...';

  if (game.state === 'finished')
    return 'The game is finished.';

  if (game.playState === 'players_answer') {
    if (endOfTurn)
      return 'This turn is finished. Go next when you are ready.';

    if (game.questionMaster === player.nick)
      return 'Wait for all players to answer...';
    else if (game.answered?.includes(player.nick))
      return 'Wait for other players to answer...';
    else
      return 'Submit an answer.';
  }

  if (game.questionMaster === player.nick)
    return 'Choose an answer';
  else
    return 'Wait for the question master to choose an answer';
};
