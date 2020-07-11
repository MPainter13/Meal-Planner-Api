const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');

const MealsService = require('./meal-service');

const mealsRouter = express.Router();
const jsonParser = express.json();

mealsRouter.use(requireAuth);

mealsRouter
  .route('/')
  .get((req, res, next) => {
    MealsService.getAllMeals(req.app.get('db'), req.user.id)
      .then(meals => {
        res.json(meals);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, description, link, day, kind_of_meal } = req.body;
    const newMeal = { title, description, link, day, kind_of_meal, users_id: req.user.id };
    for (const [key, value] of Object.entries(newMeal)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    MealsService.addMeal(
      req.app.get('db'),
      newMeal)
      .then(meal => {
        res
          .status(201)
          .location(`/meals/${meal.id}`)
          .json(meal);
      });
  });

mealsRouter
  .route('/:meal_id')
  .all((req, res, next) => {
    MealsService.getById(
      req.app.get('db'),
      req.params.meal_id
    )
      .then(meal => {
        if (!meal) {
          return res.status(404).json({
            error: 'meal not found' 
          })
        }
        res.meal = meal;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      id: res.meal.id,
      title: res.meal.title,
      description: res.meal.description,
      link: res.meal.link,
      day: res.meal.day,
      kind_of_meal: res.meal.kind_of_meal,
      users_id: res.meal.users_id
    });
  })
  .delete((req, res, next) => {
    MealsService.deleteMeal(
      req.app.get('db'),
      req.params.meal_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, description, link, day, kind_of_meal } = req.body;
    const mealToEdit = { title, description, link, day, kind_of_meal };
    MealsService.updateMeal(
      req.app.get('db'),
      req.params.meal_id,
      mealToEdit
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });



module.exports = mealsRouter;