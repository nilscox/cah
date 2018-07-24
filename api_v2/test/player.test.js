const request = require('supertest');
const expect = require('chai').expect;

const app = require('../app');

(function() {
  console.log(this.dbName);
})();

describe('player', () => {

  describe('player crud', () => {

    it('should list all players', function() {
      return request(app)
        .get('/api/player/list')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(0);
        });
    });

  });

});
