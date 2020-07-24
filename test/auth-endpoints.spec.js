const helpers = require('./test-helpers');
const supertest = require('supertest');
const knex = require('knex');
const app = require('../src/app');
const jwt = require('jsonwebtoken');



describe('Auth Endpoints', function () {
  let db;

  const { testUsers } = helpers.makeMealFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /auth/login', () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers
      )
    );

    const requiredFields = ['username', 'password'];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password
      };

      it(`responds with 400 required error when ${field} is missing`, () => {

        delete loginAttemptBody[field];

        return supertest(app)
          .post('/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing ${field} in request body`
          });
      });
    });

    it('responds 200 and JWT auth token using secret when valid credentials', () => {
      const userValidCreds = {
        username: testUser.username,
        password: testUser.password,
      };
      return supertest(app)
        .post('/auth/login')
        .send(userValidCreds)
        .then(response => {

          return jwt.verify(response.body.authToken, process.env.JWT_SECRET);
        })
        .then((decoded) => {
          expect(decoded.user_id).to.eql(testUser.id);
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});