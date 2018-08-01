const game = require('./game');
const noop = () => {};

describe('game', () => {

  describe('crud', () => {

    const { crud } = game;

    beforeEach(crud.beforeEach);

    describe('list', () => {
      const { list } = crud;

      beforeEach(list.beforeEach || noop);
      it('should not list the games if not logged in', list.listGamesNotPlayer);
      it('should list all the games 0', list.listGames0);
      it('should list all the games 1', list.listGames1);
    });

    describe('retrieve', () => {
      const { retrieve } = crud;

      beforeEach(retrieve.beforeEach || noop);
      it('should not retrieve a non-existing game', retrieve.retrieveGameDontExist);
      it('should not retrieve a game when not logged in', retrieve.retrieveGameNotPlayer);
      it('should retrieve a game', retrieve.retrieveGame);
    });

    describe('create', () => {
      const { create } = crud;

      beforeEach(create.beforeEach || noop);
      it('should not create a game when not logged in', create.createGameNotPlayer);
      it('should not create a game when in game', create.createGameInGame);
      it('should not create a game with lang is missing', create.createGameMissingLang);
      it('should not create a game with a language of type number', create.createGameLangNotNumber);
      it('should not create a game with an invalid language', create.createGameInvalidLang);
      it('should not create a game with a state', create.createGameWithState);
      it('should create a game', create.createGame);
    });

    describe('update', () => {
      const { update } = crud;

      beforeEach(update.beforeEach || noop);
      it('should not update a game when not logged in', update.updateGameNotPlayer);
      it('should not update a non-existing game', update.updateGameDontExist);
      it('should not update a game not by its owner');
      it('should not update a game\'s language', update.updateGameLanguage);
      it('should update an existing game', update.updateGame);
    });

    describe('remove', () => {
      const { remove } = crud;

      beforeEach(remove.beforeEach || noop);
      it('should not remove a game when not logged in', remove.removeGameNotPlayer);
      it('should not remove a non-existing game', remove.removeGameDontExist);
      it('should not remove a running game', remove.removeRunningGame);
      it('should not remove a game not by its owner', remove.removeGameNotByOwner);
      it('should remove an existing game', remove.removeGame);
    });

  });

  describe('history', () => {
    const { history } = game;

    beforeEach(history.beforeEach || noop);
    it('should not fetch a non-existing game history', history.gameHistoryGameDontExist);
    it('should not fetch a game history when not logged in', history.gameHistoryNotPlayer);
    it('should not fetch a game history when not in game', history.gameHistoryNotInGame);
    it('should not fetch a game history when not in this game', history.gameHistoryNotInThisGame);
    it('should not fetch a game history when not started', history.gameHistoryGameNotStarted);
    it('should fetch an empty game history', history.gameHistoryEmpty);
    it('should fetch a game\'s history', history.gameHistory);
  });

  describe('players', () => {
    const { players } = game;

    beforeEach(players.beforeEach || noop);

    describe('join', () => {
      const { join } = players;

      beforeEach(join.beforeEach || noop);
      it('should not join a non-existing game', join.joinGameDontExist);
      it('should not join a game when not logged in', join.joinNotPlayer);
      it('should not join a game when already in game', join.joinPlayerInGame);
      it('should not join a game when started', join.joinGameStarted);
      it('should join a game', join.joinGame);
    });

    describe('leave', () => {
      const { leave } = players;

      beforeEach(leave.beforeEach || noop);
      it('should not leave a non-existing game', leave.leaveGameDontExist);
      it('should not leave a game when not logged in', leave.leaveNotPlayer);
      it('should not leave a game when not in game', leave.leaveNotInGame);
      it('should not leave a game when not in this game', leave.leaveNotInThisGame);
      it('should leave a game', leave.leaveGame);
    });

  });

  describe('loop', () => {
    const { loop } = game;

    beforeEach(loop.beforeEach || noop);

    describe('start', () => {
      const { start } = loop;

      beforeEach(start.beforeEach || noop);
      it('should not start a non-existing game', start.startGameDontExist);
      it('should not start a games when not logged in', start.startNotPlayer);
      it('should not start a games when not game owner', start.startNotGameOwner);
      it('should not start a games when already started', start.startGameStarted);
      it('should not start a games when not enough players', start.startGameNotEnoughPlayers);
      it('should start game', start.startGame);
    });

    describe('submit', () => {
      const { submit } = loop;

      beforeEach(submit.beforeEach || noop);
      it('should not submit an answer to a non-existing game', submit.submitGameDontExist);
      it('should not submit an answer when not logged in', submit.submitNotPlayer);
      it('should not submit an answer when player is not in game', submit.submitNotInGame);
      it('should not submit an answer when player is not in this game', submit.submitNotInThisGame);
      it('should not submit an answer when game is not started', submit.submitGameNotStarted);
      it('should not submit an answer when player is not game master', submit.submitNotGameMaster);
      it('should not submit an answer when game state is not players answer', submit.submitGameInvalidState);
      it('should not submit an answer when player already submitted', submit.submitAlreadySubmitted);
      it('should not submit an answer when choiceIds is missing', submit.submitMissingChoiceIds);
      it('should not submit an answer when choiceIds are not numbers', submit.submitChoiceIdsNotNumber);
      it('should not submit an answer when player dont have the cards', submit.submitPlayerDontHaveCards);
      it('should not submit an answer when choices number dont match', submit.submitChoicesNumberDontMatch);
      it('should submit an answer to a game', submit.submitGame);
    });

    describe('select', () => {
      const { select } = loop;

      beforeEach(select.beforeEach || noop);
      it('should not select an answer from a non-existing game', select.selectGameDontExist);
      it('should not select an answer when not logged in', select.selectNotPlayer);
      it('should not select an answer when player is not in game', select.selectNotInGame);
      it('should not select an answer when player is not in this game', select.selectNotInThisGame);
      it('should not select an answer when game is not started', select.selectGameNotStarted);
      it('should not select an answer when game state is not question master selection', select.selectGameInvalidState);
      it('should not select an answer when player is not question master', select.selectPlayerNotQuestionMaster);
      it('should not select an answer when answerId is missing', select.selectMissingAnswerId);
      it('should not select an answer when answerId is not a number', select.selectAnswerIdNotNumber);
      it('should not select an answer when choice is not within propositions', select.selectChoiceNotInPropositions);
      it('should select an answer', select.selectPlayer);
    });

    describe('next', () => {
      const { next } = loop;

      beforeEach(next.beforeEach || noop);
      it('should not go next on a non-existing game', next.nextGameDontExist);
      it('should not go next when not logged in', next.nextNotPlayer);
      it('should not go next when player is not in game', next.nextNotInGame);
      it('should not go next when player is not in this game', next.nextNotInThisGame);
      it('should not go next when game is not started', next.nextGameNotStarted);
      it('should not go next when game state is not end of turn', next.nextGameInvalidState);
      it('should not go next when player is not question master', next.nextPlayerNotQuestionMaster);
      it('should go next', next.next);
    });

  });

});
