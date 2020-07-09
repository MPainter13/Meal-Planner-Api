const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')
const { makeMealArray } = require('./test-helpers')


describe.only('Meal Endpoints', function () {
  let db

  const {
    testUsers,
    testMeals
  } = helpers.makeMealFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('GET /meal/:meal_id', () => {
    context('given meal exists', () => {
      beforeEach('insert meal', () => {
        return helpers.seedMealTables(
          db,
          testUsers,
          testMeals
        )
      })

      it('should respond with 200 and the meal', () => {
        const expectedMeal = testMeals[0]
        //Change Route => add .auth()
        return supertest(app)
          .get('/Meal/1')
          .expect(200, expectedMeal)
      })
    })

    context(`given the meal doesn't exist`, () => {
      it(`should resond with 404 'meal not found'`, () => {
        return supertest(app)
          .get('/meal/4')
          .expect(404, { error: 'meal not found' })
      })
    })
  })

  describe('POST /meal', () => {
    beforeEach('insert users', () => {
      return helpers.seedUsers(
        db,
        testUsers,
      )
    })

    it('creates a meal, responding with 201 and new meal', function () {
      this.retries(3)
      const testUser = testUsers[0]
      const newMeal = {
        title: 'Baked apple',
        description: 'Baked apple with honey',
        link: 'https://www.tasteofhome.com/recipes/old-fashioned-honey-baked-apples/',
        day: 'Saturday',
        kind_of_meal: 'Morning Snack',
        user_id: testUser.id
      }
      return supertest(app)
        .post('/meal')
        // .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newMeal)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.title).to.eql(newMeal.title)
          expect(res.body.description).to.eql(newMeal.description)
          expect(res.body.link).to.eql(newMeal.link)
          expect(res.body.day).to.eql(newMeal.day)
          expect(res.body.kind_of_meal).to.eql(newMeal.kind_of_meal)
          expect(res.headers.location).to.eql(`/users/1/meal/${res.body.id}`)
        })
        .expect(res => {
          db
            .from('Meal')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.title).to.eql(newMeal.title)
              expect(row.description).to.eql(newMeal.description)
              expect(row.link).to.eql(newMeal.link)
              expect(row.day).to.eql(newMeal.day)
              expect(row.kind_of_meal).to.eql(newMeal.kind_of_meal)
              expect(row.user_id).to.eql(newMeal.user_id)
            })
        })
    })


  })

  describe('PATCH /meal/:meal_id', () => {
    context('Given no meal', () => {
      it('responds with 404', () => {
        const mealId = 12345678
        return supertest(app)
          .patch(`/meal/${mealId}`)
          .expect(204, ' ') 
          // .expect(404, { error: { messlink: `meal doesn't exist` } })
      })
    })

    context('Given meal in DB', () => {
      const testMeals = makeMealArray()

      beforeEach('insert meal', () => {
        return helpers.seedMealTables(
          db,
          testUsers,
          testMeals
        )
      })

      it('responds with 204 and updates the meal', () => {
        const idToUpdate = 2
        const updateMeal = {
          title: 'Updated title',
          description: 'Updated description',
          kind_of_meal: 'Updated kind_of_MEAL',
          link: 'Updated link',
          day: 'Updated day',
        }
        const expectedMeal = {
          ...testMeals[idToUpdate - 1],
          ...updateMeal
        }

        return supertest(app)
          .patch(`/meal/${idToUpdate}`)
          .send(updateMeal)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/meal/${idToUpdate}`)
              .expect(expectedMeal)
          )
      })

    })

  })

})