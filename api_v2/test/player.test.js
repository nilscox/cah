const request = require('supertest');
const expect = require('chai').expect;

describe('player', () => {

  describe('crud', () => {

    describe('list', () => {

      it('should list all players 0', function() {
        return request(this.app)
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

        return request(this.app)
          .get('/api/player/list')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(2);
          });
      });

    });

  });

});
