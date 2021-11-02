const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

// Define a schema
const salepointSchema = new Schema({
  address: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 300,
  },
  // location: {
  //   type: {
  //     type: String,
  //     required: true,
  //     enum: ['Point']
  //   },
  //   name: {
  //     type: String,
  //     required: true,
  //     minlength: 3,
  //     maxlength: 30,
  //   },
  //   rating: {
  //     type: Number,
  //     min: 0,
  //     max: 10
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: true,
  //     validate: {
  //       validator: validateGeoJsonCoordinates,
  //       message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
  //     }
  //   }
  // },
  picture: {
    type: String,
    required: false
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'Cash', 'Twint']
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
  items: {
    type: [Schema.Types.ObjectId],
    ref: 'Item',
    default: null,
    required: false,
    strict: false,
    // Tries to validate non existent items
    validate: {
      // Validate that the itemsId is a valid ObjectId
      // and references an existing item
      validator: validateItem,
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
 * the "userId" property is invalidated.
 */
function validateUser(value) {
  if (!ObjectId.isValid(value)) {
    throw new Error('User not found');
  }
}

/**
 * Given a item ID, ensures that it references an existing item.
 *
 * If it's not the case or the ID is missing or not a valid object ID,
 * the "itemId" property is invalidated.
 */
function validateItem(value) {
  if (!ObjectId.isValid(value)) {
    throw new Error('Item not found');
  }
}

function validateGeoJsonCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}



// Export model
module.exports = mongoose.model('Salepoint', salepointSchema);