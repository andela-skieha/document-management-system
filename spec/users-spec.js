/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const app = require('../index');
const request = require('supertest')(app);

describe('User routes', () => {
  let token;

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

  it('creates new users', (done) => {
    request
    .post('/api/users')
    .set('x-access-token', token)
    .send({
      username: 'goldilocks',
      firstname: 'Goldy',
      lastname: 'Locks',
      email: 'goldy@locks.com',
      password: 'locksywocksy',
    })
    .end((err, res) => {
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User created successfully.');
      done();
    });
  });

  it('does not create duplicate user entries', (done) => {
    request
    .post('/api/users')
    .set('x-access-token', token)
    .send({
      username: 'maybesydney',
      firstname: 'Goldy',
      lastname: 'Locks',
      email: 'goldy@locksy.com',
      password: 'locksywocksy',
    })
    .end((err, res) => {
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Duplicate user entry.');
      done();
    });
  });

  it('does not create users with missing params', (done) => {
    request
    .post('/api/users')
    .set('x-access-token', token)
    .send({
      firstname: 'Goldy',
      lastname: 'Locks',
    })
    .end((err, res) => {
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Error creating user.');
      done();
    });
  });

  it('gets all users when requested', (done) => {
    request
    .get('/api/users')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      done();
    });
  });

  it('finds users by their ids', (done) => {
    request
    .get('/api/users/57c96a56cd9ca231483f082c')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      done();
    });
  });

  it('returns an error message if user is not found', (done) => {
    request
    .get('/api/users/57c96a56cd9ca231483f082')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Could not fetch user.');
      done();
    });
  });
});
