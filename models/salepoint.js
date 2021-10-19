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
  items: {
    type: [Schema.Types.ObjectId],
    ref: 'Item',
    default: null,
    required: false,
    validate: {
      // Validate that the itemsId is a valid ObjectId
      // and references an existing user
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

function validateItem(value) {
  if (!ObjectId.isValid(value)) {
    throw new Error('User not found');
  }
}

function validateGeoJsonCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}



// Export model
module.exports = mongoose.model('Salepoint', salepointSchema);