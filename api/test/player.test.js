const player = require('./player');
const noop = () => {};

describe('player', () => {

  describe('crud', () => {
    const { crud } = player;

    beforeEach(crud.beforeEach || noop);

    describe('list', () => {
      const { list } = crud;

      beforeEach(list.beforeEach || noop);
      it('should list all players 0', list.listPlayers0);
      it('should list all players 2', list.listPlayers2);
    });

    describe('retrieve', () => {
      const { retrieve } = crud;

      beforeEach(retrieve.beforeEach || noop);
      it('should retrieve an existing player', retrieve.retrievePlayer);
      it('should not retrieve a non-existing player', retrieve.retrievePlayerDontExist);
    });

    describe('fetch me', () => {
      const { me } = crud;

      beforeEach(me.beforeEach || noop);
      it('should not be able to fetch me when not logged in', me.fetchMeNotPlayer);
      it('should fetch a created player', me.fetchMeCreated);
      it('should fetch a logged in player', me.fetchMeLogin);
    });

    describe('create', () => {
      const { create } = crud;

      beforeEach(create.beforeEach || noop);
      it('should not create a new player when already logged in', create.createPlayerNotLogin);
      it('should create a new player', create.createPlayer);
      it('should not create a new player without a nick', create.createPlayerNoNick);
      it('should not create a new player with nick null', create.createPlayerNickNull);
      it('should not create a new player with nick a number', create.createPlayerNickNumber);
      it('should not create a new player with nick of length < 3', create.createPlayerNickInf3);
      it('should not create a new player with nick of length > 64', create.createPlayerNickSup64);
      it('should not create a new player with a reserved nick', create.createPlayerNickReserved);
      it('should not create a new player with an already existing nick', create.createPlayerNickExist);
      it('should not create a new player with an avatar', create.createPlayerWithAvatar);
    });

    describe('update', () => {
      const { update } = crud;

      beforeEach(update.beforeEach || noop);
      it('should not update a player when not logged in ', update.updatePlayerNotLogin);
      it('should not update another player ', update.updatePlayerNotMe);
      it('should update an existing player', update.updatePlayer);
      it('should not update an existing player\'s nick', update.updatePlayerNick);
    });

    describe('remove', () => {
      const { remove } = crud;

      beforeEach(remove.beforeEach || noop);
      it('should not remove a player when not logged in ', remove.removePlayerNotLogin);
      it('should not remove another player ', remove.removePlayerNotMe);
      it('should not remove a player in game', remove.removePlayerInGame);
      it('should remove an existing player', remove.removePlayer);
    });

  });

  describe('auth', () => {
    const { auth } = player;

    beforeEach(auth.beforeEach || noop);

    describe('login', () => {
      const { login } = auth;

      beforeEach(login.beforeEach || noop);
      it('should not login when already logged in', login.loginPlayerLogin);
      it('should login as an existing player', login.loginPlayer);
      it('should not login as a non-existing player', login.loginPlayerDontExist);
    });

    describe('log out', () => {
      const { logout } = auth;

      beforeEach(logout.beforeEach || noop);
      it('shoud not log a not logged in player', logout.logoutPlayerNotLogin);
      it('should log out a logged in player', logout.logoutPlayer);
      it('should not retrieve a player after he logged out', logout.logoutPlayerLogout);
    });

  });

});
