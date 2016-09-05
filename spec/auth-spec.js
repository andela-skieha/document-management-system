/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const app = require('../index');
const request = require('supertest')(app);

describe('User Authentication', () => {
  it('logs in a user and provides them with a token', (done) => {
    request
    .post('/api/users/login')
    .send({
      username: 'johndoe',
      password: 'password2',
    })
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User logged in');
      expect(res.body.token).toBeDefined();
      done();
    });
  });

  it('does not log in a non-existent user', (done) => {
    request
    .post('/api/users/login')
    .send({
      username: 'njeri',
      password: 'secret',
    })
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found.');
      done();
    });
  });

  it('checks for wrong passwords', (done) => {
    request
    .post('/api/users/login')
    .send({
      username: 'johndoe',
      password: 'wrongpassword',
    })
    .end((err, res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Wrong password supplied');
      done();
    });
  });

  it('blocks access to resources without authentication', (done) => {
    request
    .get('/api/users')
    .end((err, res) => {
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('You are not authenticated.');
      done();
    });
  });

  it('throws errors on invalid token', (done) => {
    request
    .get('/api/users')
    .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    .end((err, res) => {
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Failed to authenticate token.');
      done();
    });
  });
});
