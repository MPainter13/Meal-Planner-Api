const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');


describe('Meal endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE users, meal'));

  afterEach('cleanup', () => db.raw('TRUNCATE users, meal'));

  context('Given there are meals in the database', () => {
    const testUsers = [
      {
        id: 1,
        username: 'Jason',
        email: 'jason@jason.com',
        password: 'hello'
      },
      {
        id: 2,
        username: 'Magda',
        email: 'magda@magda.pl',
        password: 'czesc'
      }
    ];
    const testMeals = [
      {
        id: 1,
        users_id: 2,
        title: 'chicken',
        description: 'chicken with Alfredo sos',
        link_url: 'https://www.google.com/search?q=chicken+with+broccoli&rlz=1C1CHBD_enUS888US888&oq=chick&aqs=chrome.1.69i57j69i59j46j0l4j46.3876j0j7&sourceid=chrome&ie=UTF-8',
        day: 'Monday',
        kind_of_meal: 'Dinner'
      },
      {
        id: 2,
        users_id: 1,
        title: 'smoothie',
        description: 'diffrent fruits',
        link_url: 'https://www.foodnetwork.com/recipes/food-network-kitchen/frozen-fruit-smoothies-recipe-1914927',
        day: 'Sunday',
        kind_of_meal: 'Breakfats'
      },
      {
        id: 3,
        users_id: 2,
        title: 'chips',
        description: '',
        link_url: 'https://www.allrecipes.com/recipe/73135/homestyle-potato-chips/',
        day: 'Saturday',
        kind_of_meal: 'Afternoon snack' 
      }
    ];

    beforeEach('insert meals', () => {
      return db
        .into('users')
        .insert(testUsers)
        .then(() => {
          return db
            .into('meal')
            .insert(testMeals);
        });
    });

    it('GET /meals responds with 200 and all of the meals', () => {
      return supertest(app)
        .get('/meals')
        .expect(200, testMeals);
    });

  });
});