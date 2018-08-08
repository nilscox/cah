const player = require('./player');
const game = require('./game');

describe('routes', () => {

  describe('player', () => {

    describe('crud', () => {

      const { crud } = player;

      it('should not retrieve a non-existing player', crud.retrieveDontExist);

      it('should list all players 0', crud.list0);
      it('should list all players 2', crud.list2);
      it('should retrieve a player', crud.retrieve);
      it('should create a new player', crud.create);
      it('should update a player', crud.update);
      it('should remove a player', crud.remove);

      it('should fetch me after created', crud.fetchMeCreated);
      it('should fetch me after logged in', crud.fetchMeLogin);

    });

    describe('auth', () => {

      const { auth } = player;

      it('should not log in as a non-existing player', auth.loginDontExist);
      it('should log in', auth.login);

      it('should log out', auth.logout);
      it('should not fetch me after logged out', auth.logoutFetchMe);

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
