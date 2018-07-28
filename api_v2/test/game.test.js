const request = require('supertest');
const expect = require('chai').expect;

const { createPlayer, createGame } = require('./utils');

describe('game', () => {

  describe('crud', () => {

    beforeEach(async function() {
      this.player = await createPlayer(this.models);
    });

    describe('list', () => {

      it('should list all the games 0', function() {
        return this.app
          .get('/api/game')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array').of.length(0);
          });
      });

      it('should list all the games 1', async function() {
        const game = await createGame(this.models, { owner: this.player });

        return this.app
          .get('/api/game')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array').of.length(1);
            expect(res.body[0]).to.have.property('id', game.id);
          });
      });

    });

    describe('retrieve', () => {

      it('should retrieve a game', async function() {
        const game = await createGame(this.models, { owner: this.player });

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
          .post('/api/player/login')
          .send({ nick: this.player.nick })
          .then(() => this.app
            .post('/api/game')
            .send({ lang: 'fr' })
            .expect(201)
          )
          .then(res => {
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('lang', 'fr');
            expect(res.body).to.have.property('owner', this.player.nick);
          });
      });

      it('should not create a game with a missing lang', function() {
        return this.app
          .post('/api/player/login')
          .send({ nick: this.player.nick })
          .then(() => this.app
            .post('/api/game')
            .send({})
            .expect(400)
          );
      });

      it('should not create a game with a language of type number', function() {
        return this.app
          .post('/api/player/login')
          .send({ nick: this.player.nick })
          .then(() => this.app
            .post('/api/game')
            .send({ lang: 1234 })
            .expect(400)
          );
      });

      it('should not create a game with an invalid language', function() {
        return this.app
          .post('/api/player/login')
          .send({ nick: this.player.nick })
          .then(() => this.app
            .post('/api/game')
            .send({ lang: 'ok' })
            .expect(400)
          );
      });

      it('should not create a game with a state', function() {
        return this.app
          .post('/api/player/login')
          .send({ nick: this.player.nick })
          .then(() => this.app
            .post('/api/game')
            .send({ lang: 'fr', state: 'started' })
            .expect(400)
          );
      });

    });

    describe('update', () => {

      beforeEach(async function() {
        this.game = await createGame(this.models, { owner: this.player });
        this.url = '/api/game/' + this.game.id;
      });

      it('should update an existing game', function() {
        return this.app
          .put(this.url)
          .send({})
          .expect(200)
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
        this.game = await createGame(this.models, { owner: this.player });
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
      this.game = await createGame(this.models);
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

});
