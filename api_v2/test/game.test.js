const request = require('supertest');
const expect = require('chai').expect;

describe('game', () => {

  describe('crud', () => {

    beforeEach(async function() {
      const { Player } = this.models;

      this.player = await new Player({ nick: 'nils' }).save();
    });

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
