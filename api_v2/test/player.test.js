const request = require('supertest');
const expect = require('chai').expect;

const { createPlayer } = require('./utils');

describe('player', () => {

  describe('crud', () => {

    describe('list', () => {

      it('should list all players 0', function() {
        return this.app
          .get('/api/player/list')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array').of.length(0);
          });
      });

      it('should list all players 2', async function() {
        const { Player } = this.models;

        await new Player({ nick: 'nils' }).save();
        await new Player({ nick: 'tom' }).save();

        return this.app
          .get('/api/player/list')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(2);
          });
      });

    });

    describe('retrieve', () => {

      it('should retrieve an existing player', async function() {
        const player = await createPlayer(this.models);

        return this.app
          .get('/api/player/' + player.nick)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property('nick', player.nick);
          });
      });

      it('should not retrieve a non-existing player', function() {
        return this.app
          .get('/api/player/nils')
          .expect(404);
      });

    });

    describe('fetch me', () => {

      it('should fetch nothing when no player is logged in', function() {
        return this.app
          .get('/api/player')
          .expect(404);
      });

      it('should fetch a created player', function() {
        return this.app
          .post('/api/player')
          .send({ nick: 'nils' })
          .then(() => this.app
            .get('/api/player')
            .expect(200)
          )
          .then(res => {
            expect(res.body).to.deep.eql({
              nick: 'nils',
              avatar: null,
            });
          });
      });

      it('should fetch a logged in player', async function() {
        const { Player } = this.models;

        await new Player({ nick: 'nils' }).save();

        return this.app
          .post('/api/player/login')
          .send({ nick: 'nils' })
          .then(() => this.app
            .get('/api/player')
            .expect(200)
          )
          .then(res => {
            expect(res.body).to.deep.eql({
              nick: 'nils',
              avatar: null,
            });
          });
      });

    });

    describe('create', () => {

      it('should create a new player', function() {
        return this.app
          .post('/api/player')
          .send({ nick: 'nils' })
          .expect(201)
          .then(res => {
            expect(res.body).to.deep.eql({
              nick: 'nils',
              avatar: null,
            });
          });
      });

      it('should not create a new player without a nick', function() {
        return this.app
          .post('/api/player')
          .send({})
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('nick');
          });
      });

      it('should not create a new player with nick null', function() {
        return this.app
          .post('/api/player')
          .send({ nick: null })
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('nick');
          });
      });

      it('should not create a new player with nick a number', function() {
        return this.app
          .post('/api/player')
          .send({ nick: 1234 })
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('nick');
          });
      });

      it('should not create a new player with nick of length < 3', function() {
        return this.app
          .post('/api/player')
          .send({ nick: '<3' })
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('nick');
          });
      });

      it('should not create a new player with nick of length > 64', function() {
        return this.app
          .post('/api/player')
          .send({ nick: '>64'.repeat(22) })
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('nick');
          });
      });

      it('should not create a new player with a reserved nick', function() {
        const RESERVED_NICKS = [
          'list',
          'login',
          'logout',
          'avatar',
        ];

        return Promise.all(RESERVED_NICKS.map(nick => this.app
          .post('/api/player')
          .send({ nick })
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('nick');
          })
        ));
      });

      it('should not create a new player with an already existing nick', async function() {
        const player = await createPlayer(this.models);

        return this.app
          .post('/api/player')
          .send({ nick: 'nils' })
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('nick');
          });
      });

      it('should not create a new player with an avatar', function() {
        return this.app
          .post('/api/player')
          .send({ nick: 'nils', avatar: 'avatar' })
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('avatar');
          });
      });

    });

    describe('update', () => {

      beforeEach(async function() {
        this.player = await createPlayer(this.models);
      });

      it('should update an existing player', function() {
        return this.app
          .put('/api/player/' + this.player.nick)
          .expect(200)
          .then(res => {
            expect(res.body).to.deep.eql({
              nick: this.player.nick,
              avatar: this.player.avatar,
            });
          });
      });

      it('should not update an existing player\'s nick', function() {
        return this.app
          .put('/api/player/' + this.player.nick)
          .send({ nick: 'tom' })
          .expect(400)
          .then(res => {
            expect(res.body).to.have.property('nick');
          });
      });

    });

    describe('remove', () => {

      beforeEach(async function() {
        this.player = await createPlayer(this.models);
      });

      it('should remove an existing player', function() {
        return this.app
          .delete('/api/player/' + this.player.nick)
          .expect(204);
      });

    });

  });

  describe('auth', () => {

    describe('login', () => {

      it('should login an existing player', async function() {
        const player = await createPlayer(this.models);

        return this.app
          .post('/api/player/login')
          .send({ nick: player.nick })
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property('nick', player.nick);
          });
      });

      it('should not login a non-existing player', function() {
        return this.app
          .get('/api/player/login')
          .send({ nick: 'nils' })
          .expect(404);
      });

    });

    describe('log out', () => {

      it('should logout a logged in player', async function() {
        const player = await createPlayer(this.models);

        return this.app
          .post('/api/player/login')
          .send({ nick: player.nick })
          .then(() => this.app
            .post('/api/player/logout')
            .expect(204)
          );
      });

      it('should not retrieve a player after he logged out', async function() {
        const player = await createPlayer(this.models);

        return this.app
          .post('/api/player/login')
          .send({ nick: player.nick })
          .then(() => this.app
            .post('/api/player/logout')
          )
          .then(() => this.app
            .get('/api/player')
            .expect(404)
          );
      });

      it('should not logout a non-existing player', function() {
        return this.app
          .post('/api/player/logout')
          .expect(404);
      });

    });

  });

});
