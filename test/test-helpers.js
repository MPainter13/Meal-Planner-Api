const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'Jason',
      email: 'jason@jason.com',
      password: 'password!123'
    },
    {
      id: 2,
      username: 'Magda',
      email: 'magda@magda.pl',
      password: 'password!123'
    },
    {
      id: 3,
      username: 'Joseps',
      email: 'joseph@joseph.pl',
      password: 'password!123'
    },
  ]
}

function makeMealArray(users) {
  return [
    {
      id: 1,
      users_id: 1,
      title: 'chicken',
      description: 'chicken with Alfredo sos',
      link_url: 'https://www.google.com/search?q=chicken+with+broccoli&rlz=1C1CHBD_enUS888US888&oq=chick&aqs=chrome.1.69i57j69i59j46j0l4j46.3876j0j7&sourceid=chrome&ie=UTF-8',
      day: 'Monday',
      kind_of_meal: 'Dinner'
    },
    {
      id: 2,
      users_id: 2,
      title: 'smoothie',
      description: 'diffrent fruits',
      link_url: 'https://www.foodnetwork.com/recipes/food-network-kitchen/frozen-fruit-smoothies-recipe-1914927',
      day: 'Sunday',
      kind_of_meal: 'Breakfats'
    },
    {
      id: 3,
      users_id: 3,
      title: 'chips',
      description: '',
      link_url: 'https://www.allrecipes.com/recipe/73135/homestyle-potato-chips/',
      day: 'Saturday',
      kind_of_meal: 'Afternoon snack'
    }
  ];
}


function makeMealFixtures() {
  const testUsers = makeUsersArray()
  const testMeals = makeMealArray(testUsers)
  return { testUsers, testMeals }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
      users,
      meal
      `
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE meal_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('meal_id_seq', 0)`),
        ])
      )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedMealTables(db, users, meal) {
  return db.transaction(async trx => {

    await seedUsers(trx, users)

    await trx.into('meal').insert(meal)

    await trx.raw(
      `SELECT setval('meal_id_seq', ?)`,
      [meal[meal.length - 1].id],
    )
    }
  )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ users_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}



module.exports = {
  makeUsersArray,
  makeMealArray,
  makeMealFixtures,
  cleanTables,
  seedUsers,
  seedMealTables,
  makeAuthHeader,
}