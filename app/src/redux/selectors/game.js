import { createSelector } from 'reselect';

const playerSelector = state => state.player;

export const gamesListSelector = state => state.games;

export const currentGameSelector = state => state.game;

export const gameStateSelector = createSelector(
  currentGameSelector,
  game => {
    if (game.state === 'idle')
      return 'GAME_IDLE';

    if (game.play_state === 'players_answer')
      return 'PLAYERS_ANSWER';

    if (game.play_state === 'question_master_selection')
      return 'QM_SELECTION';

    if (game.play_state === 'end_of_turn')
      return 'END_OF_TURN';

    throw new Error('Unknown play state: ' + game.play_state);
  },
);

export const gameOwnerSelector = createSelector(
  currentGameSelector,
  game => game.owner,
);

export const gamePlayersSelector = createSelector(
  currentGameSelector,
  game => game.players,
);

export const gamePlayerSelector = createSelector(
  currentGameSelector,
  game => player => game.players.find(p => p.nick === player.nick),
);

export const gameIsQuestionMasterSelector = createSelector(
  currentGameSelector,
  game => player => game.question_master === player.nick,
);

export const gameQuestionMasterSelector = createSelector(
  currentGameSelector,
  game => game.question_master,
);

export const gameQuestionSelector = createSelector(
  currentGameSelector,
  game => game.question,
);

export const gamePropositionsSelector = createSelector(
  currentGameSelector,
  game => game.propositions,
);

export const gameHistorySelector = createSelector(
  currentGameSelector,
  game => game.history
);

export const gameCanStartSelector = createSelector(
  playerSelector,
  gameOwnerSelector,
  (player, owner) => owner === player.nick,
);

export const gameCanSelectAnswerSelector = createSelector(
  playerSelector,
  currentGameSelector,
  (player, game) => game.question_master === player.nick,
);

export const gameLastTurnSelector = createSelector(
  gameHistorySelector,
  history => history && history.length > 0 ? history[history.length - 1] : null
);

export const gameLastTurnWinnerSelector = createSelector(
  gamePlayersSelector,
  gameLastTurnSelector,
  (players, turn) => turn ? players.find(p => p.nick === turn.winner) : null,
);
