/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable no-underscore-dangle */

const User = require('../server/models/user');
const Role = require('../server/models/role');
const Document = require('../server/models/document');
const app = require('../index');
const request = require('supertest')(app);
const sinon = require('sinon');

describe('User routes', () => {
  let token;
  let userId;
  let adminToken;

  beforeAll((done) => {
    request
      .post('/api/users/login')
      .send({
        username: 'janedoe',
        password: 'password1',
      })
      .end((err, res) => {
        token = res.body.token;
        userId = res.body.user_id;
        done();
      });
  });

  it('checks if new users are unique', (done) => {
    const username = User.schema.path('username');
    const email = User.schema.path('email');
    expect(username.options.unique).toBe(true);
    expect(email.options.unique).toBe(true);
    done();
  });

  it('checks if new users have first/lastname properties', (done) => {
    const firstname = User.schema.path('name.firstname');
    const lastname = User.schema.path('name.lastname');
    expect(firstname.options.required).toBe(true);
    expect(lastname.options.required).toBe(true);
    done();
  });

  it('checks if new users have roles defined', (done) => {
    const role = User.schema.path('role');
    expect(role.options.default).toBe('user');
    done();
  });

  it('Returns correct response if there is error getting users', (done) => {
    sinon.stub(User, 'find', (params, cb) => {
      cb({ error: 'error fetching users' });
    });
    request
      .post('/api/users/login')
      .send({
        username: 'njerry',
        password: 'password0',
      })
      .end((error, response) => {
        adminToken = response.body.token;
        request
          .get('/api/users')
          .set('x-access-token', adminToken)
          .end((err, res) => {
            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Could not fetch users.');
            done();
            User.find.restore();
          });
      });
  });

  it('Gets all users when requested by the admin', (done) => {
    request
        .post('/api/users/login')
        .send({
          username: 'njerry',
          password: 'password0',
        })
        .end((err, res) => {
          adminToken = res.body.token;
          request
            .get('/api/users')
            .set('x-access-token', adminToken)
            .end((error, response) => {
              expect(response.status).toBe(200);
              expect(response.body).toBeDefined();
              expect(Array.isArray(response.body)).toBe(true);
              done();
            });
        });
  });

  it('Cannot get users if user is not admin', (done) => {
    request
      .get('/api/users')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('You are not authorized to access this resource.');
        done();
      });
  });

  it('finds users by their ids', (done) => {
    request
      .get('/api/users/57c96a56cd9ca231483f0829')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect((Object.keys(res.body)).length).toBeGreaterThan(0);
        done();
      });
  });

  it('returns an error message if user is not found', (done) => {
    request
      .get('/api/users/57c96a56cd9ca231483f082')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User does not exist.');
        done();
      });
  });

  it('updates logged-in-user details', (done) => {
    request
      .put(`/api/users/${userId}`)
      .set('x-access-token', token)
      .send({
        firstname: 'Jennifer',
        lastname: 'Aniston',
      })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User updated successfully.');
        expect(res.body.user).toBeDefined();
        done();
      });
  });

  it('Rejects duplicate usernames and emails', (done) => {
    request
      .put(`/api/users/${userId}`)
      .set('x-access-token', token)
      .send({
        username: 'maybesydney',
        email: 'sydney@maybe.com',
        password: 'jhene',
      })
      .end((err, res) => {
        expect(res.status).toBe(409);
        expect(res.body.error).toBe('Duplicate entry.');
        done();
      });
  });

  it('Does not update users that do not exist', (done) => {
    request
      .put('/api/users/57c96a56cd9ca231483f082')
      .set('x-access-token', token)
      .send({
        username: 'Gold',
      })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User not found.');
        done();
      });
  });

  it('Does not update users if no data is provided', (done) => {
    request
      .put(`/api/users/${userId}`)
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Nothing to update.');
        done();
      });
  });

  it('Does not update other user\'s details', (done) => {
    request
      .put('/api/users/57c96a56cd9ca231483f0829')
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Cannot update another user\'s details');
        done();
      });
  });

  it('Returns correct response if there is an error deleting documents of deleted user', (done) => {
    sinon.stub(Document, 'remove', (params, cb) => {
      cb({ error: 'error deleting document' });
    });
    request
      .delete(`/api/users/${userId}`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Could not delete user.');
        Document.remove.restore();
        done();
      });
  });

  it('Returns correct response if there is an error deleting roles of deleted user', (done) => {
    sinon.stub(Role, 'remove', (params, cb) => {
      cb({ error: 'error deleting role' });
    });
    request
      .delete(`/api/users/${userId}`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Could not delete user.');
        Role.remove.restore();
        done();
      });
  });

  it('Deletes a user by id', (done) => {
    request
      .delete(`/api/users/${userId}`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User deleted successfully.');
        done();
      });
  });

  it('Does not delete non-existant users', (done) => {
    request
      .delete('/api/users/57c96a56cd9ca231483f082')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User not found.');
        done();
      });
  });

  it('Does not delete another user', (done) => {
    request
      .delete('/api/users/57c96a56cd9ca231483f0829')
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Cannot delete another user.');
        done();
      });
  });

  it('Returns correct response if there is error getting documents belonging to user', (done) => {
    sinon.stub(Document, 'find', (params, cb) => {
      cb({ error: 'error fetching document' });
    });
    request
      .get('/api/users/57c96a56cd9ca231483f082c/documents')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Could not fetch documents.');
        done();
        Document.find.restore();
      });
  });

  it('Gets documents belongong to a specific user', (done) => {
    request
      .get('/api/users/57c96a56cd9ca231483f082c/documents')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBe(true);
        done();
      });
  });

  it('Throws error for a non-existant user', (done) => {
    request
      .get(`/api/users/${userId}/documents`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User not found.');
        done();
      });
  });

  it('Returns "not found" for users with no documents', (done) => {
    request
      .get('/api/users/57c96a56cd9ca231483f0829/documents')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('No documents found.');
        done();
      });
  });

  it('Returns correct response if there is an error getting roles belonging to user', (done) => {
    sinon.stub(Role, 'find', (params, cb) => {
      cb({ error: 'error fetching role' });
    });
    request
      .get('/api/users/57c96a56cd9ca231483f082c/roles')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Could not fetch roles.');
        done();
        Role.find.restore();
      });
  });

  it('Gets roles belonging to a specific user', (done) => {
    request
      .get('/api/users/57c96a56cd9ca231483f082c/roles')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBe(true);
        done();
      });
  });

  it('Throws error for a non-existant user', (done) => {
    request
      .get(`/api/users/${userId}/roles`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User not found.');
        done();
      });
  });

  it('Returns "not found" for users with no roles', (done) => {
    request
      .get('/api/users/57c96a56cd9ca231483f0829/roles')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('No roles found.');
        done();
      });
  });
});
