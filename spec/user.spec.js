const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { cleanUpDatabase } = require('./utils');
const User = require('../models/user');

// clean la bd avant test
//beforeEach(cleanUpDatabase);


after(mongoose.disconnect);

describe('POST /users', function() {
    it('should create a user', async function() {
         const res = await supertest(app)
        .post('/users')
        .send({
            username: 'testUser',
            password: '1234',
            admin:false
        })
        .expect(200)
        .expect('Content-Type', /json/);
        
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body.admin).to.be.a('boolean');
        expect(res.body.registrationdate).to.be.a('string');
        expect(res.body.username).to.equal('testUser');
      //  expect(res.body).to.have.all.keys('_id', 'username');

      });
  });


 

  describe('GET /users', function() {
    it('should retrieve the list of users', async function() {

        const res = await supertest(app)
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/);
  
    });
  });

  /*

  describe('GET /users', function() {
    let user;
    beforeEach(async function() {
      // Create 2 users before retrieving the list.
      const users = await Promise.all([
        User.create({ name: 'John Doe' }),
        User.create({ name: 'Jane Doe' })
      ]);
  
      // Retrieve a user to authenticate as.
      user = users[0];
    });
  
    it('should retrieve the list of users', async function() {
      // ...
    });
  });*/
  
