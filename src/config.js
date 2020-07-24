module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DB_URL || 'postgresql://postgres@localhost/meal-planner-api',
  TEST_DATABASE_URL: process.env.TEST_DATABA_URL || 'postgresql://postgres@localhost/meal-planner-api_test',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: '7d'
};