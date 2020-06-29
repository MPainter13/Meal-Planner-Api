// const xss = require('xss')

const MealsService = {
  getAllMeals(db, user_id) {
    return db
      .from('meal')
      .select('*')
      .where('users_id', user_id)
  },

  addMeal(db, newMeal) {
    return db
      .insert(newMeal)
      .into('meal')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(db, id) {
    return db
      .from('meal')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteMeal(db, id) {
    return db('meal')
      .where({ id })
      .delete()
  },
  updateMeal(db, id, newMeal) {
    return db('meal')
      .where({ id })
      .update(newMeal)
  },
};

module.exports = MealsService;