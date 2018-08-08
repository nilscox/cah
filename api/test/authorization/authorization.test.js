describe('authorization', () => {

  describe('players', () => {

    describe('crud', () => {

      it('should not be able to fetch me when not logged in');
      it('should not create a new player when already logged in');
      it('should not update a player when not logged in');
      it('should not update another player');
      it('should not remove a player when not logged in');
      it('should not remove another player');
      it('should not remove a player in game');

    });

    describe('auth', () => {

      it('should not login when already logged in');
      it('should not log out when not logged in');

    });

  });

  describe('game', () => {

    describe('crud', () => {

      it('should not create a game when not logged in');
      it('should not create a game when in game');

      it('should not update a game when not logged in');
      it('should not update a game not by its owner');

      it('should not remove a game when not logged in');
      it('should not remove a running game');
      it('should not remove a game not by its owner');

    });

    describe('history', () => {

      it('should not fetch a game history when not logged in');
      it('should not fetch a game history when not in game');
      it('should not fetch a game history when not started');

    });

    describe('players', () => {

      it('should not join a game when not logged in');
      it('should not join a game when already in game');
      it('should not join a game when started');

      it('should not leave a game when not logged in');
      it('should not leave a game when not in game');

    });

    describe('loop', () => {

      describe('start', () => {

        it('should not start a games when not logged in');
        it('should not start a games when not game owner');
        it('should not start a games when already started');
        it('should not start a games when not enough players');

      });

      describe('submit', () => {

        it('should not submit an answer when not logged in');
        it('should not submit an answer when player is not in game');
        it('should not submit an answer when game is not started');
        it('should not submit an answer when player is not game master');
        it('should not submit an answer when game state is not players answer');
        it('should not submit an answer when player already submitted');

      });

      describe('select', () => {

        it('should not select an answer when answerId is missing');
        it('should not select an answer when answerId is not a number');
        it('should not select an answer when choice is not within propositions');

      });

      describe('next', () => {

        it('should not go next when not logged in');
        it('should not go next when player is not in game');
        it('should not go next when game is not started');
        it('should not go next when game state is not end of turn');
        it('should not go next when player is not question master');

      });

    });

  });

});
