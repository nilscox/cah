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

  });

});
