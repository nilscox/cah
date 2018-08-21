import { createSelector } from 'reselect';

const player = state => state.player;

export const gamesList = state => state.games;

export const currentGame = state => state.game;

export const gameState = createSelector(
  currentGame,
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

export const gameOwner = createSelector(
  currentGame,
  game => game.owner,
);

export const gamePlayers = createSelector(
  currentGame,
  game => game.players,
);

export const gamePlayer = createSelector(
  currentGame,
  game => player => game.players.find(p => p.nick === player.nick),
);

export const gameIsQuestionMaster = createSelector(
  currentGame,
  game => player => game.question_master === player.nick,
);

export const gameQuestionMaster = createSelector(
  currentGame,
  game => game.question_master,
);

export const gameQuestion = createSelector(
  currentGame,
  game => game.question,
);

export const gamePropositions = createSelector(
  currentGame,
  game => game.propositions,
);

export const gameHistory = createSelector(
  currentGame,
  game => game.history
);

export const gameCanStart = createSelector(
  player,
  gameOwner,
  (player, owner) => owner === player.nick,
);

export const gameCanSelectAnswer = createSelector(
  player,
  currentGame,
  (player, game) => game.question_master === player.nick,
);

export const gameLastTurn = createSelector(
  gameHistory,
  history => history && history.length > 0 ? history[history.length - 1] : null
);

export const gameLastTurnWinner = createSelector(
  gamePlayers,
  gameLastTurn,
  (players, turn) => turn ? players.find(p => p.nick === turn.winner) : null,
);
