const request = require('supertest');
const expect = require('chai').expect;

const game = require('./game');

describe('game', () => {

  describe('crud', () => {

    const { crud } = game;

    beforeEach(async function() {
      this.player = await this.createLoginPlayer();
    });

    describe('list', () => {
      const { list } = crud;

      it('should not list the games if not logged in', list.listGamesNotLoggedIn);
      it('should list all the games 0', list.listGames0);
      it('should list all the games 1', list.listGames1);
    });

    describe('retrieve', () => {

      it('should retrieve a game', async function() {
        const game = await this.createGame({ owner: this.player });

        return this.app
          .get('/api/game/' + game.id)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property('id', game.id);
          });
      });

      it('should not retrieve a non-existing game', function() {
        return this.app
          .get('/api/game/6')
          .expect(404);
      });

    });

    describe('create', () => {

      it('should create a game', function() {
        return this.app
          .post('/api/game')
          .send({ lang: 'fr' })
          .expect(201)
          .then(res => {
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('lang', 'fr');
            expect(res.body).to.have.property('owner', this.player.nick);
          });
      });

      it('should not create a game with a missing lang', function() {
        return this.app
          .post('/api/game')
          .send({})
          .expect(400);
      });

      it('should not create a game with a language of type number', function() {
        return this.app
          .post('/api/game')
          .send({ lang: 1234 })
          .expect(400);
      });

      it('should not create a game with an invalid language', function() {
        return this.app
          .post('/api/game')
          .send({ lang: 'ok' })
          .expect(400);
      });

      it('should not create a game with a state', function() {
        return this.app
          .post('/api/game')
          .send({ lang: 'fr', state: 'started' })
          .expect(400);
      });

    });

    describe('update', () => {

      beforeEach(async function() {
        this.game = await this.createGame({ owner: this.player });
        this.url = '/api/game/' + this.game.id;
      });

      it('should update an existing game', function() {
        return this.app
          .put(this.url)
          .send({})
          .expect(200)
          .on('error', e => console.log(e.response.body))
          .then(res => {
            expect(res.body).to.have.property('id', this.game.id);
          });
      });

      it('should not update a non-existing game', function() {
        return this.app
          .put('/api/game/6')
          .send({})
          .expect(404);
      });

      it('should not update a game\'s language', function() {
        return this.app
          .put(this.url)
          .send({ lang: 'en' })
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('lang');
          });
      });

    });

    describe('delete', () => {

      beforeEach(async function() {
        this.game = await this.createGame({ owner: this.player });
      });

      it('should delete an existing game', function() {
        return this.app
          .delete('/api/game/' + this.game.id)
          .expect(204);
      });

      it('should not delete a non-existing game', function() {
        return this.app
          .delete('/api/game/6')
          .expect(404);
      });

    });

  });

  describe('history', () => {

    beforeEach(async function() {
      this.game = await this.createGame();
    });

    it('should fetch an empty game history', function() {
      return this.app
        .get('/api/game/' + this.game.id + '/history')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array').of.length(0);
        });
    });

    it.skip('should fetch a game\'s history', function() {

    });

  });

  describe('players', () => {

    beforeEach(async function() {
      this.player = await this.createLoginPlayer();
      this.game = await this.createGame({ owner: this.player });
    })

    describe('join', () => {

      it('a player should join a game', async function() {
        const app = this.createSession();
        const player = await this.createLoginPlayer({ nick: 'toto' }, app);

        return app
          .post('/api/game/' + this.game.id + '/join')
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property('players').of.length(2);
          });
      });

    });

  });

});
