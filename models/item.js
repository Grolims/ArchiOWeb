const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

/* 
  An item created by a user
*/
const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  type: {
    type: String,
    required: true,
    enum: ['Fruit', 'Viande', 'Légumes', 'Céréales', 'Boissons', 'Autre']
  },
  picture: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    require: false,
    maxlength: 300,
  },
  label: {
    type: String,
    enum: ['Bio', 'Vegan']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    required: true,
    validate: {
      // Validate that the directorId is a valid ObjectId
      // and references an existing user
      validator: validateUser,
      message: props => props.reason.message
    }
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

/**
 * Given a user ID, ensures that it references an existing user.
 *
 * If it's not the case or the ID is missing or not a valid object ID,
 * the "directorId" property is invalidated.
 */
function validateUser(value) {
  if (!ObjectId.isValid(value)) {
    throw new Error('User not found');
  }

  return mongoose.model('User').findOne({
    _id: ObjectId(value)
  }).exec().then(user => {
    if (!user) {
      throw new Error('User not found');
    }

    return true;
  });
}

// Export model
module.exports = mongoose.model('Item', itemSchema);