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
      it('should not update a game when not logged in');
      it('should not update a non-existing game', update.updateGameDontExist);
      it('should not update a game not by its owner');
      it('should not update a game\'s language', update.updateGameLanguage);
      it('should update an existing game', update.updateGame);
    });

    describe('remove', () => {
      const { remove } = crud;

      beforeEach(remove.beforeEach || noop);
      it('should not remove a game when not logged in');
      it('should not remove a non-existing game', remove.removeGameDontExist);
      it('should not remove a running game');
      it('should not remove a game not by its owner');
      it('should remove an existing game', remove.removeGame);
    });

  });

  describe('history', () => {
    const { history } = game;

    beforeEach(history.beforeEach || noop);
    it('should not fetch a non-existing game history');
    it('should not fetch a game history when not logged in');
    it('should not fetch a game history when not started');
    it('should fetch an empty game history', history.gameHistoryEmpty);
    it('should fetch a game\'s history');
  });

  describe('players', () => {
    const { players } = game;

    beforeEach(players.beforeEach || noop);

    describe('join', () => {
      const { join } = players;

      beforeEach(join.beforeEach || noop);
      it('should not join a non-existing game');
      it('should not join a game when not logged in');
      it('should not join a game when already in game');
      it('should not join a game when started');
      it('should join a game', join.joinGame);
    });

    describe('leave', () => {
      const { leave } = players;

      beforeEach(leave.beforeEach || noop);
      it('should not leave a non-existing game');
      it('should not leave a game when not logged in');
      it('should not leave a game when not in game');
      it('should not leave a game when not in this game');
      it('should leave a game');
    });

  });

  describe('loop', () => {
    const { loop } = game;

    beforeEach(loop.beforeEach || noop);

    describe('start', () => {
      const { start } = loop;

      beforeEach(start.beforeEach || noop);
      it('should not start a non-existing game');
      it('should not start a games when not logged in');
      it('should not start a games when not game owner');
      it('should not start a games when already started');
      it('should not start a games when not enough players');
      it('should start game');
    });

    describe('submit', () => {
      const { submit } = loop;

      beforeEach(submit.beforeEach || noop);
      it('should not submit an answer to a non-existing game');
      it('should not submit an answer when not logged in');
      it('should not submit an answer when player is not in game');
      it('should not submit an answer when player is not in this game');
      it('should not submit an answer when player is not game master');
      it('should not submit an answer when game is not started');
      it('should not submit an answer when game state is not players answer');
      it('should not submit an answer when player already submitted');
      it('should not submit an answer when choiceIds is missing');
      it('should not submit an answer when choiceIds are not numbers');
      it('should not submit an answer when player dont have the cards');
      it('should not submit an answer when choices number dont match');
      it('should submit an answer to a game');
    });

    describe('select', () => {
      const { select } = loop;

      beforeEach(select.beforeEach || noop);
      it('should not select an answer from a non-existing game');
      it('should not select an answer when not logged in');
      it('should not select an answer when player is not in game');
      it('should not select an answer when player is not in this game');
      it('should not select an answer when game is not started');
      it('should not select an answer when game state is not question master selection');
      it('should not select an answer when player is not question master');
      it('should not select an answer when answerId is missing');
      it('should not select an answer when answerId is not a number');
      it('should not select an answer when choice is not selectable');
      it('should select an answer player is not question master');
    });

    describe('next', () => {
      const { next } = loop;

      beforeEach(next.beforeEach || noop);
      it('should not select an answer from a non-existing game');
      it('should not select an answer when not logged in');
      it('should not select an answer when player is not in game');
      it('should not select an answer when player is not in this game');
      it('should not select an answer when game is not started');
      it('should not select an answer when game state is not end of turn');
      it('should not select an answer when player is not question master');
      it('should select an answer');
    });

  });

});
