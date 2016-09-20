/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable no-underscore-dangle */

const app = require('../index');
const request = require('supertest')(app);

describe('Role routes', () => {
  let token;
  let roleId;

  beforeAll((done) => {
    request
    .post('/api/users/login')
    .send({
      username: 'maybesydney',
      password: 'password3',
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
      ],
    })
    .end((err, res) => {
      roleId = res.body.role._id;
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

  it('Finds a role by its id', (done) => {
    request
    .get(`/api/roles/${roleId}`)
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect((Object.keys(res.body)).length).toBeGreaterThan(0);
      done();
    });
  });

  it('returns an error message if role is not found', (done) => {
    request
    .get('/api/roles/57c96a56cd9ca231483f0')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Role not found.');
      done();
    });
  });

  describe('UpdateOne role route', () => {
    it('Updates role title', (done) => {
      request
      .put(`/api/roles/${roleId}`)
      .set('x-access-token', token)
      .send({
        title: 'Seeders 101',
      })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Role updated successfully.');
        done();
      });
    });

    it('adds to the list of members', (done) => {
      request
      .put(`/api/roles/${roleId}`)
      .set('x-access-token', token)
      .send({
        addMembers: [
          '57c96a56cd9ca231483f082c',
        ],
      })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Role updated successfully.');
        done();
      });
    });

    it('removes from the list of members', (done) => {
      request
      .put(`/api/roles/${roleId}`)
      .set('x-access-token', token)
      .send({
        removeMembers: [
          '57c96a56cd9ca231483f082c',
        ],
      })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Role updated successfully.');
        done();
      });
    });

    it('Rejects duplicate titles', (done) => {
      request
      .put(`/api/roles/${roleId}`)
      .set('x-access-token', token)
      .send({
        title: 'The Doe-s',
      })
      .end((err, res) => {
        expect(res.status).toBe(409);
        expect(res.body.error).toBe('Duplicate entry.');
        done();
      });
    });

    it('Rejects null updates', (done) => {
      request
      .put(`/api/roles/${roleId}`)
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Nothing to update.');
        done();
      });
    });

    it('returns an error message if role is not found', (done) => {
      request
      .put('/api/roles/57c96a56cd9ca231483f0')
      .set('x-access-token', token)
      .send({
        title: 'The Doe-s',
      })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Role not found.');
        done();
      });
    });

    it('does not update roles not owned by the logged in user', (done) => {
      request
      .put('/api/roles/57d9af115317052f7a16cad1')
      .set('x-access-token', token)
      .send({
        title: 'The Doe-s',
      })
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Cannot edit role you did not create.');
        done();
      });
    });
  });


  it('Deletes a role by id', (done) => {
    request
    .delete(`/api/roles/${roleId}`)
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Role deleted successfully.');
      done();
    });
  });

  it('Does not delete non-existant roles', (done) => {
    request
    .delete('/api/roles/sfr456jgih6hv39y5343')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Role not found.');
      done();
    });
  });

  it('Does not delete roles not owned by logged in user', (done) => {
    request
    .delete('/api/roles/57d9af115317052f7a16cad1')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Cannot delete role you did not create.');
      done();
    });
  });
});
