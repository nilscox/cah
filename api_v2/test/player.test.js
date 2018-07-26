const request = require('supertest');
const expect = require('chai').expect;


describe('player', () => {

  describe('player crud', () => {

    it('should list all players', function() {
      return request(this.app)
        .get('/api/player/list')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(0);
        });
    });

  });

});
