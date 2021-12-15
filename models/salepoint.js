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

  picture: {
    type: String,
    required: false
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'Cash', 'Twint']
  },
  geolocation: {
    location: {
      type: {
        type: String,
        required: true,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: validateGeoJsonCoordinates,
          message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
        }
      }
    }
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

// Create a geospatial index on the location property
salepointSchema.index({ location: '2dsphere'});

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
  if (Array.isArray(value)) {
    for (let item of value) {
      if (!ObjectId.isValid(item)) {
        throw new Error(`Item with id ${item} is invalid`)
      }
    }
  }
}


// Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
function validateGeoJsonCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}

function isLatitude(value) {
  return value >= -90 && value <= 90;
}

function isLongitude(value) {
  return value >= -180 && value <= 180;
}

// Export model
module.exports = mongoose.model('Salepoint', salepointSchema);