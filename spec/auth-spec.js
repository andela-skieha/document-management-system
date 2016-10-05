/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const app = require('../index');
const request = require('supertest')(app);

describe('User Authentication', () => {
  it('creates new users and gives them a token', (done) => {
    request
      .post('/api/users/signup')
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
        expect(res.body.token).toBeDefined();
        expect(res.body.user).toBeDefined();
        done();
      });
  });

  it('does not create duplicate user entries', (done) => {
    request
      .post('/api/users/signup')
      .send({
        username: 'maybesydney',
        firstname: 'Goldy',
        lastname: 'Locks',
        email: 'goldy@locksy.com',
        password: 'locksywocksy',
      })
      .end((err, res) => {
        expect(res.status).toBe(409);
        expect(res.body.message).toBe('Duplicate username.');
        done();
      });
  });

  describe('Error on missing params', () => {
    it('does not create users with missing username', (done) => {
      request
      .post('/api/users/signup')
      .send({
        firstname: 'Goldy',
        lastname: 'Locks',
        email: 'goldy@locksy.com',
        password: 'locksywocksy',
      })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Error creating user: Path `username` is required.');
        done();
      });
    });

    it('does not create users with missing email', (done) => {
      request
      .post('/api/users/signup')
      .send({
        firstname: 'Goldy',
        lastname: 'Locks',
        username: 'goldy@locksy.com',
        password: 'locksywocksy',
      })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Error creating user: Path `email` is required.');
        done();
      });
    });

    it('does not create users with missing password', (done) => {
      request
      .post('/api/users/signup')
      .send({
        firstname: 'Goldy',
        lastname: 'Locks',
        email: 'goldy@locksy.com',
        username: 'locksywocksy',
      })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Error creating user: Path `password` is required.');
        done();
      });
    });

    it('does not create users with missing firstname', (done) => {
      request
      .post('/api/users/signup')
      .send({
        username: 'Goldy',
        lastname: 'Locks',
        email: 'goldy@locksy.com',
        password: 'locksywocksy',
      })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Error creating user: Path `firstname` is required.');
        done();
      });
    });

    it('does not create users with missing lastname', (done) => {
      request
      .post('/api/users/signup')
      .send({
        firstname: 'Goldy',
        username: 'Locks',
        email: 'goldy@locksy.com',
        password: 'locksywocksy',
      })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Error creating user: Path `lastname` is required.');
        done();
      });
    });
  });

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
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('You are not authenticated.');
        done();
      });
  });

  it('throws errors on invalid token', (done) => {
    request
      .get('/api/users')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Failed to authenticate token.');
        done();
      });
  });
});
