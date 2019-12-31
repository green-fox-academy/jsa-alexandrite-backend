const request = require('supertest');
const app = require('../src/App');

describe('investments', () => {
  describe('GET /investments/user/2', () => {
    it('should return 200 when getting a investment', (done) => {
      request(app)
        .get('/investments/user/2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
