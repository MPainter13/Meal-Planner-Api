process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret'

require('dotenv').config();

process.env.TEST_DB_URL = process.env.TEST_DB_URL || 'postgresql://postgres@localhost/meal-planner-test';

const supertest = require('supertest');
const { expect } = require('chai');

global.supertest = supertest;
global.expect = expect;