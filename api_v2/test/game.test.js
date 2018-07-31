const game = require('./game');
const noop = () => {};

describe('game', () => {

  describe('crud', () => {

    const { crud } = game;

    beforeEach(crud.beforeEach);

    describe('list', () => {
      const { list } = crud;

      beforeEach(list.beforeEach || noop);
      it('should not list the games if not logged in', list.listGamesNotLoggedIn);
      it('should list all the games 0', list.listGames0);
      it('should list all the games 1', list.listGames1);
    });

    describe('retrieve', () => {
      const { retrieve } = crud;

      beforeEach(retrieve.beforeEach || noop);
      it('should retrieve a game', retrieve.retrieveGame);
      it('should not retrieve a non-existing game', retrieve.retrieveGameDontExist);
    });

    describe('create', () => {
      const { create } = crud;

      beforeEach(create.beforeEach || noop);
      it('should create a game', create.createGame);
      it('should not create a game with a missing lang', create.createGameMissingLang);
      it('should not create a game with a language of type number', create.createGameLangNotNumber);
      it('should not create a game with an invalid language', create.createGameInvalidLang);
      it('should not create a game with a state', create.createGameWithState);
    });

    describe('update', () => {
      const { update } = crud;

      beforeEach(update.beforeEach || noop);
      it('should update an existing game', update.updateGame);
      it('should not update a non-existing game', update.updateGameDontExist);
      it('should not update a game\'s language', update.updateGameLanguage);
    });

    describe('remove', () => {
      const { remove } = crud;

      beforeEach(remove.beforeEach || noop);
      it('should remove an existing game', remove.removeGame);
      it('should not delete a non-existing game', remove.removeGameDontExist);
    });

  });

  describe('history', () => {
    const { history } = game;

    beforeEach(history.beforeEach || noop);
    it.skip('should fetch a game\'s history', history.gameHistory);
    it('should fetch an empty game history', history.gameHistoryEmpty);
  });

  describe('players', () => {
    const { players } = game;

    beforeEach(players.beforeEach || noop);

    describe('join', () => {
      const { join } = players;

      beforeEach(join.beforeEach || noop);
      it('a player should join a game', join.joinGame);
    });

  });

});
