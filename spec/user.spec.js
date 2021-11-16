const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { cleanUpDatabase } = require('./utils');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');

function generateValidJwt(user) {
  // Generate a valid JWT which expires in 7 days.
  const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
  const claims = { sub: user._id.toString(), exp: exp };
  return new Promise((resolve, reject) => {
    jwt.sign(claims, config.secretKey, function(err, token) {
      if (err) {
        return reject(err);
      }

      resolve(token);
    });
  });
}


// clean la bd avant test
exports.cleanUpDatabase = async function() {
  await Promise.all([
    User.deleteMany()
  ]);
};

after(mongoose.disconnect);

beforeEach(cleanUpDatabase);

describe('POST /users', function() {
    it('should create a user', async function() {
         const res = await supertest(app)
        .post('/users')
        .send({
            username: 'User14',
            password: '123456789',
            admin:false
        })

        //check status and headers
        .expect(201)
        .expect('Content-Type', /json/);
        
        //checck respsonse
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body.admin).to.be.a('boolean');
        expect(res.body.registrationdate).to.be.a('string');
        expect(res.body.username).to.equal('User14');
        expect(res.body).to.have.all.keys('_id', 'username', 'admin','registrationdate', '__v' );
      
    
    });
  });
 
  describe('GET /users', function() {
    let user;
    beforeEach(async function() {
      // Create 2 users before retrieving the list.
      const users = await Promise.all([
        User.create({ username: 'laure dinateur', password: '123456789', admin :false}),
        User.create({ username: 'alain terieur', password: '123456789', admin:false})
      ]);
  
      // Retrieve a user to authenticate as.
      user = users[0];
    });
  
    it('should retrieve the list of users', async function() {
      
      const res = await supertest(app)
      .get('/users')

  
      // Check that the status and headers of the response are correct.
      .expect(200)
      .expect('Content-Type', /json/);

      expect(res.body.data).to.have.lengthOf(2);

      expect(res.body.data[0]).to.be.an('object');
      expect(res.body.data[0]._id).to.be.a('string');
      expect(res.body.data[0].username).to.equal('laure dinateur');
      expect(res.body.data[0].admin).to.be.a('boolean');
      expect(res.body.data[0].registrationdate).to.be.a('string');
      expect(res.body.data[0]).to.have.all.keys('_id', 'username', 'admin','registrationdate', '__v' );
      

      expect(res.body.data[1]).to.be.an('object');
      expect(res.body.data[1]._id).to.be.a('string');
      expect(res.body.data[1].username).to.equal('alain terieur');
      expect(res.body.data[1].admin).to.be.a('boolean');
      expect(res.body.data[1].registrationdate).to.be.a('string');
      expect(res.body.data[1]).to.have.all.keys('_id', 'username', 'admin','registrationdate', '__v' );

      });
    });

  describe('PATCH /users', function() {
    let user;
    beforeEach(async function() {
      // Create 1 users before retrieving the list.
      const users = await Promise.all([
        User.create({ username: 'Jhon doeuf', password: '123456789', admin :false}),
        User.create({ username: 'alain terieur', password: '123456789', admin:false})
      ]);
      // Retrieve a user to authenticate as.
      user = users[0];
    });

    it('should patch a user', async function() {
     
      const token = await generateValidJwt(user)
      const res = await supertest(app)
     
        .patch('/users/'+user.id)
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'test123'
      })
         //check status and headers
         .expect('Content-Type', /json/)
         .expect(200)

         expect(res.body).to.be.an('object');
         expect(res.body._id).to.be.a('string');
         expect(res.body.admin).to.be.a('boolean');
         expect(res.body.registrationdate).to.be.a('string');
         expect(res.body.username).to.equal('test123');
         expect(res.body).to.have.all.keys('_id', 'username', 'admin','registrationdate', '__v' );
       
   });

  });

  // check if user can delete him not admin but owner
  describe('DELLETE /users', function() {
    let user;
    beforeEach(async function() {
      // Create 1 users before retrieving the list.
      const users = await Promise.all([
        User.create({ username: 'Jhon doeuf', password: '123456789', admin :false}),
      ]);
      // Retrieve a user to authenticate as.
      user = users[0];
    });

    it('should delete a user', async function() {
      const token = await generateValidJwt(user)
      const res = await supertest(app)
     
      .delete('/users/'+user.id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

     
      expect(res.body.user).to.equal('Jhon doeuf');
      expect(res.body.statut).to.equal('deleted');
    });
  });



  after(mongoose.disconnect);

  