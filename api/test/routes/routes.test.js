const player = require('./player');
const game = require('./game');

describe('routes', () => {

  describe('player', () => {

    describe('crud', () => {

      it('should not retrieve a non-existing player');

      it('should list all players 0');
      it('should list all players 2');
      it('should retrieve an existing player');
      it('should create a new player');
      it('should update an existing player');
      it('should remove an existing player');

      it('should fetch me after created');
      it('should fetch me after logged in');

    });

    describe('auth', () => {

      it('should not log in as a non-existing player');
      it('should log in');

      it('should log out');
      it('should not fetch me after logged out');

    });

  });

  describe('game', () => {

    describe('crud', () => {

      it('should not retrieve a non-existing game');

      it('should list all the games 0');
      it('should list all the games 1');
      it('should retrieve a game');
      it('should create a game');
      it('should update an existing game');
      it('should remove an existing game');

    });

    describe('history', () => {

      it('should fetch an empty game history');
      it('should fetch a game history');

    });

    describe('players', () => {

      it('should join a game');
      it('should leave a game');

    });

    describe('loop', () => {

      it('should start game');
      it('should submit an answer');
      it('should select an answer');
      it('should go next');

    });

  });

});
