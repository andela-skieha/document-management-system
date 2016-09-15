/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const app = require('../index');
const request = require('supertest')(app);

describe('Role routes', () => {
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

  it('Creates new roles with a unique title', (done) => {
    request
    .post('/api/roles')
    .set('x-access-token', token)
    .send({
      title: 'Seeders',
      members: [
        '57c96a56cd9ca231483f0829',
        '9e799c0e692b79bdc83f082a',
        '57c96a56cd9ca231483f082c',
      ],
    })
    .end((err, res) => {
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Role created successfully.');
      done();
    });
  });

  it('Does not create duplicate role entries', (done) => {
    request
    .post('/api/roles')
    .set('x-access-token', token)
    .send({
      title: 'The Doe-s',
      members: [
        '57c96a56cd9ca231483f0829',
        '9e799c0e692b79bdc83f082a',
        '57c96a56cd9ca231483f082c',
      ],
    })
    .end((err, res) => {
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Duplicate entry.');
      done();
    });
  });

  it('Cannot create role without title', (done) => {
    request
    .post('/api/roles')
    .set('x-access-token', token)
    .send({
      members: [
        '57c96a56cd9ca231483f0829',
        '9e799c0e692b79bdc83f082a',
        '57c96a56cd9ca231483f082c',
      ],
    })
    .end((err, res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Error creating role.');
      done();
    });
  });

  it('Gets all roles when requested', (done) => {
    request
    .get('/api/roles')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      done();
    });
  });
});
