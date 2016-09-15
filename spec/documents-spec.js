/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable no-underscore-dangle */

const app = require('../index');
const Document = require('../server/models/document');
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

  it('Checks if new documents have unique titles', (done) => {
    const title = Document.schema.paths.title;
    expect(title.options.unique).toBe(true);
    done();
  });

  it('Checks if new documents have owners', (done) => {
    request
    .post('/api/documents')
    .set('x-access-token', token)
    .send({
      title: 'Fugees',
      content: 'Killing me softly',
    })
    .end((err, res) => {
      expect(res.status).toBe(201);
      expect({}.hasOwnProperty.call(res.body.document, 'owner')).toBe(true);
      expect(res.body.document.owner).toBeDefined();
      done();
    });
  });

  it('Checks if new documents have dates of creation', (done) => {
    request
    .post('/api/documents')
    .set('x-access-token', token)
    .send({
      title: 'The Prostrate Years',
      content: 'Sue Townsend',
    })
    .end((err, res) => {
      expect(res.status).toBe(201);
      expect({}.hasOwnProperty.call(res.body.document, 'createdAt')).toBe(true);
      expect(res.body.document.createdAt).toBeDefined();
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

  it('Gets documents based on specified limit', (done) => {
    request
    .get('/api/documents?limit=4')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.length).not.toBeGreaterThan(4);
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

  it('Updates documents', (done) => {
    request
    .put(`/api/documents/${documentId}`)
    .set('x-access-token', token)
    .send({
      content: 'Hello',
    })
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Document updated successfully.');
      done();
    });
  });

  it('Rejects duplicate titles', (done) => {
    request
    .put(`/api/documents/${documentId}`)
    .set('x-access-token', token)
    .send({
      title: 'Lord of the Rings',
    })
    .end((err, res) => {
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Duplicate entry.');
      done();
    });
  });

  it('Does not update non-existant documents', (done) => {
    request
    .put('/api/documents/57cd551476d7f2790eb87c47')
    .set('x-access-token', token)
    .send({
      title: 'Lord of the Rings',
    })
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Document not found.');
      done();
    });
  });

  it('Does not update documents if no data is provided', (done) => {
    request
    .put(`/api/documents/${documentId}`)
    .set('x-access-token', token)
    .send({})
    .end((err, res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nothing to update.');
      done();
    });
  });

  it('Deletes a document by id', (done) => {
    request
    .delete(`/api/documents/${documentId}`)
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Document deleted successfully.');
      done();
    });
  });

  it('Does not delete non-existant documents', (done) => {
    request
    .delete('/api/documents/sfr456jgih6hv39y5343')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Document not found.');
      done();
    });
  });
});
