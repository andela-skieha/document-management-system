/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const app = require('../index');
const request = require('supertest')(app);

describe('Search route', () => {
  let token;

  beforeAll((done) => {
    request
    .post('/api/users/login')
    .send({
      username: 'janedoe',
      password: 'password1',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
  });

  it('Searches for documents by creation date', (done) => {
    request
    .get('/api/search?date=2016-09-01')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      done();
    });
  });

  it('Returns an error message if documents are not found', (done) => {
    request
    .get('/api/search?date=2015-09-01')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('No documents created on 2015-09-01 were found.');
      done();
    });
  });

  it('Returns an error if no search term is provided', (done) => {
    request
    .get('/api/search')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('No search terms provided.');
      done();
    });
  });
});
