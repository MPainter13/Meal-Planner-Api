// const { expect } = require('chai');
// const knex = require('knex');
// const app = require('../src/app');
// const supertest = require('supertest');


// describe('Meal endpoints', () => {
//   let db;

//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DB_URL,
//     });
//     app.set('db', db);
//   });

//   after('disconnect from db', () => db.destroy())

//   before('clean the table', () => db.raw('TRUNCATE users, meal'));

//   afterEach('cleanup', () => db.raw('TRUNCATE users, meal'));

//   context('Given there are meals in the database', () => {
//     const testUsers = 
//     const testMeals = 

//     beforeEach('insert meals', () => {
//       return db
//         .into('users')
//         .insert(testUsers)
//         .then(() => {
//           return db
//             .into('meal')
//             .insert(testMeals);
//         });
//     });

//     it('GET /meals responds with 200 and all of the meals', () => {
//       return supertest(app)
//         .get('/meals')
//         .expect(200, testMeals);
//     });

//   });
// });