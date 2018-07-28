const request = require('supertest');
const expect = require('chai').expect;

describe('game', () => {

  describe('crud', () => {

    beforeEach(async function() {
      const { Player } = this.models;

      this.player = await new Player({ nick: 'nils' }).save();
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
        const { Game } = this.models;
        const game = await new Game({ lang: 'fr' }).save();
        await game.setOwner(this.player);

        return this.app
          .get('/api/game')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array').of.length(1);
          });
      });

    });

    describe('retrieve', () => {

      it('should retrieve a game', async function() {
        const { Game } = this.models;
        const game = await new Game({ lang: 'fr' }).save();
        await game.setOwner(this.player);

        return this.app
          .get('/api/game/' + game.id)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property('id', game.id);
          });
      });

      it('should not retrieve a non-existing game', async function() {
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
        const { Game } = this.models;

        this.game = await new Game({ lang: 'fr' }).save();
        this.url = '/api/game/' + this.game.id;
        await this.game.setOwner(this.player);
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

      it('should delete an existing game', async function() {
        const { Game } = this.models;
        const game = await new Game({ lang: 'fr' }).save();
        await game.setOwner(this.player);

        return this.app
          .delete('/api/game/' + game.id)
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
      const { Player, Game } = this.models;

      this.player = await new Player({ nick: 'nils' }).save();
      this.game = await new Game({ lang: 'fr' }).save();

      await this.game.setOwner(this.player);
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
