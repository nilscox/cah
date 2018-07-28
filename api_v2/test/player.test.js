const request = require('supertest');
const expect = require('chai').expect;

describe('player', () => {

  describe('crud', () => {

    describe('list', () => {

      it('should list all players 0', function() {
        return this.app
          .get('/api/player/list')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(0);
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

    describe('fetch', () => {

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

    });

    describe('update', () => {

      it('should update an existing player', async function() {
        const { Player } = this.models;
        const player = await new Player({ nick: 'nils' }).save();

        return this.app
          .put('/api/player/' + player.nick)
          .expect(200)
          .then(res => {
            expect(res.body).to.deep.eql({
              nick: 'nils',
              avatar: null,
            });
          });
      });

    });

    describe('remove', () => {

      it('should remove an existing player', async function() {
        const { Player } = this.models;
        const player = await new Player({ nick: 'nils' }).save();

        return this.app
          .delete('/api/player/' + player.nick)
          .expect(204);
      });

    });

  });

});
