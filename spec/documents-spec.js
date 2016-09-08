/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable no-underscore-dangle */

const app = require('../index');
const request = require('supertest')(app);

describe('Document routes', () => {
  let token;
  let documentId;

  beforeEach((done) => {
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

  it('Creates new documents', (done) => {
    request
    .post('/api/documents')
    .set('x-access-token', token)
    .send({
      title: 'Adele',
      content: 'Rumour has it',
    })
    .end((err, res) => {
      documentId = res.body.document._id;
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Document created successfully.');
      expect(res.body.document).toBeDefined();
      done();
    });
  });

  it('Does not create duplicate document entries', (done) => {
    request
    .post('/api/documents')
    .set('x-access-token', token)
    .send({
      title: 'Adele',
      content: 'Turning tables',
    })
    .end((err, res) => {
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Duplicate entry.');
      done();
    });
  });

  it('Does not create documents with missing params', (done) => {
    request
    .post('/api/documents')
    .set('x-access-token', token)
    .send({
      content: 'Turning tables',
    })
    .end((err, res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Error creating document.');
      done();
    });
  });

  it('Gets all documents', (done) => {
    request
    .get('/api/documents')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      done();
    });
  });

  it('Gets a document by id', (done) => {
    request
    .get(`/api/documents/${documentId}`)
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect((Object.keys(res.body)).length).toBeGreaterThan(0);
      done();
    });
  });

  it('Returns error message if document is not found', (done) => {
    request
    .get('/api/documents/9e799c0e692b79bdc83f082a')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Could not find document.');
      done();
    });
  });
});
