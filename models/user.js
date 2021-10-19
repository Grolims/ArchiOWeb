const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    unique: true,
    validate:
      // Manually validate uniqueness to send a "pretty" validation error
      // rather than a MongoDB duplicate key error
      [{
        validator: validateUserUniqueness,
        message: 'Person {VALUE} already exists'
      }],
  },
  admin: {
    type: Boolean,
    required: true,
  },
  registrationdate: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

userSchema.set('toJSON', {
  transform: transformJsonUser
});


/**
 * 
 * @param {*} doc 
 * @param {*} json 
 * @param {*} options 
 * @returns 
 */
function transformJsonUser(doc, json, options) {
  // Remove the hashed password from the generated JSON.
  delete json.password;
  return json;
}

/**
 * Given a name, calls the callback function with true if no person exists with that name
 * (or the only person that exists is the same as the person being validated).
 */
function validateUserUniqueness(value) {
  return this.constructor.findOne().where('username').equals(value).exec().then((existingPerson) => {
    return !existingPerson || existingPerson._id.equals(this._id);
  });
}

// Export model
module.exports = mongoose.model('User', userSchema)