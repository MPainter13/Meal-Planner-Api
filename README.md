# Meal Planner API

## API Link
https://agile-garden-47208.herokuapp.com

## Link to published Live App
https://meal-planner-client.vercel.app/

## API Documentation
This express web server handles GET, POST, DELETE and PATCH HTTP requests.
- '/users': POST: registers/logs in users.
- '/auth': grants authorization to users so they can fetch their meals.
- '/meals' : GET: gets a user's meals. POST: adds a new meal linked to the user via user_id.
- /meals/:meals_id' : GET: gets a specific meal for the user. PATCH: updates a specific meal. DELETE: delete specific meal.
There is one database that has two tables in it ('users', 'meal'). There is a one-to-many relationship between 'users' and 'meal' tables.


## Technologies
Node, Express, PostgreSQL, with REST.

## App description
The app has a simple design with an easy to use interface. Once signed up, users are able to access previous meal plans, edit details, save changes, even add links to their favorite receipes. Meal plans are created by day of the week, time of day seperated into 5 categories (Breakfast, Morning Snack, Lunch, Afternoon Snack, and Dinner). Additional details can be entered in the Description section to give the user the flexibility in choosing what they want to eat, maybe based off items they already have to avoid having to go to the store.

## Running the tests
To run front-end or back-end tests, simply run npm test in the terminal.


