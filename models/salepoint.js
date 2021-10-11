const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define a schema
const salpointSchema= new Schema({
  address: {
    type:String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  location: {
    type: {
      type: String,
      required: true,
      enum: [ 'Point' ]
    },
    coordinates: {
      type: [ Number ],
      required: true,
      validate: {
        validator: validateGeoJsonCoordinates,
        message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
      }
    }
},
picture:String,
paymentMethod:{
    type:String,
    enum:['Card','Cash','Twint']
},

});

function validateGeoJsonCoordinates(value) {
    return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
  }

  

// Export model
module.exports = mongoose.model('Item', itemSchema)