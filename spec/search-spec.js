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
      .get('/api/documents?date=2016-09-01')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
        done();
      });
  });

  it('Searches for documents by creation date when given a limit', (done) => {
    request
      .get('/api/documents?date=2016-09-01&limit=1')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        done();
      });
  });

  it('Returns an error message if documents are not found', (done) => {
    request
      .get('/api/documents?date=2015-09-01')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('No documents to retrieve.');
        done();
      });
  });

  it('Searches for documents by role', (done) => {
    request
      .get('/api/documents?role=The Doe-s&limit=1')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        done();
      });
  });

  it('Returns an error message if documents with given role are not found', (done) => {
    request
      .get('/api/documents?role=Random')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('No documents to retrieve.');
        done();
      });
  });

  it('Returns an error message if role does not exist', (done) => {
    request
      .get('/api/documents?role=Class 7')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Role Class 7 does not exist.');
        done();
      });
  });
});
